const Bull = require("bull");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
const DOWNLOADS_DIR = path.join(__dirname, "../../downloads");
const TTL_MINUTES = parseInt(process.env.DOWNLOAD_TTL_MINUTES || "30", 10);

// Cola de Bull conectada a Redis
const downloadQueue = new Bull("download", REDIS_URL);

// Expresiones regulares para validar URLs de YouTube
const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;

/**
 * Valida que la URL pertenezca a YouTube y tenga un formato reconocido.
 */
function isValidYouTubeUrl(url) {
  return YOUTUBE_REGEX.test(url);
}

/**
 * Construye los argumentos para yt-dlp según el formato y calidad solicitados.
 * Usa spawn con array de argumentos para evitar inyección de comandos.
 */
function buildArgs(url, format, quality, outputTemplate) {
  if (format === "mp3") {
    return [
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", "0",
      "-o", outputTemplate,
      "--no-playlist",
      "--newline",
      url,
    ];
  }

  // Para MP4: seleccionar la mejor calidad que no supere la solicitada
  const heightLimit = quality === "best" ? "9999" : quality;
  const formatStr = `bestvideo[height<=${heightLimit}]+bestaudio/best[height<=${heightLimit}]`;

  return [
    "-f", formatStr,
    "--merge-output-format", "mp4",
    "-o", outputTemplate,
    "--no-playlist",
    "--newline",
    url,
  ];
}

/**
 * Ejecuta yt-dlp como proceso hijo y parsea el progreso en tiempo real.
 * Devuelve una Promise que resuelve con la ruta del archivo descargado.
 */
function runYtDlp(args, onProgress) {
  return new Promise((resolve, reject) => {
    let proc;
    try {
      proc = spawn(YTDLP_PATH, args, { stdio: ["ignore", "pipe", "pipe"] });
    } catch (err) {
      // yt-dlp no encontrado en el sistema
      reject(
        new Error(
          "yt-dlp no está instalado. Ejecuta: pip install yt-dlp  o  winget install yt-dlp"
        )
      );
      return;
    }

    let outputFile = null;
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();

      // Parsear líneas de progreso: "[download]  45.3% of ..."
      const progressMatch = text.match(/\[download\]\s+([\d.]+)%/);
      if (progressMatch) {
        const pct = Math.round(parseFloat(progressMatch[1]));
        onProgress(pct);
      }

      // Detectar la ruta del archivo de destino
      const destMatch = text.match(/\[download\] Destination: (.+)/);
      if (destMatch) outputFile = destMatch[1].trim();

      // Detectar archivo ya procesado (merge/ffmpeg)
      const mergeMatch = text.match(/\[Merger\] Merging formats into "(.+)"/);
      if (mergeMatch) outputFile = mergeMatch[1].trim();

      const ffmpegMatch = text.match(/\[ffmpeg\] Destination: (.+)/);
      if (ffmpegMatch) outputFile = ffmpegMatch[1].trim();
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            "yt-dlp no está instalado. Ejecuta: pip install yt-dlp  o  winget install yt-dlp"
          )
        );
      } else {
        reject(new Error(`Error al iniciar yt-dlp: ${err.message}`));
      }
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        const msg = stderr.includes("Video unavailable")
          ? "El video no está disponible o es privado."
          : stderr.includes("age")
          ? "El video tiene restricción de edad y no puede descargarse."
          : `yt-dlp falló (código ${code}). Verifica que la URL sea válida.`;
        reject(new Error(msg));
        return;
      }

      if (!outputFile) {
        reject(new Error("No se pudo determinar el archivo de salida de yt-dlp."));
        return;
      }

      resolve(outputFile);
    });
  });
}

/**
 * Limpieza automática: elimina archivos de la carpeta downloads
 * que tengan más de TTL_MINUTES minutos de antigüedad.
 */
function cleanOldFiles() {
  if (!fs.existsSync(DOWNLOADS_DIR)) return;

  const now = Date.now();
  const limit = TTL_MINUTES * 60 * 1000;

  fs.readdirSync(DOWNLOADS_DIR).forEach((file) => {
    const filePath = path.join(DOWNLOADS_DIR, file);
    try {
      const { mtimeMs } = fs.statSync(filePath);
      if (now - mtimeMs > limit) {
        fs.unlinkSync(filePath);
        console.log(`[cleanup] Eliminado: ${file}`);
      }
    } catch {
      // Ignorar si el archivo ya fue borrado por otra ruta
    }
  });
}

// Ejecutar limpieza cada 5 minutos
setInterval(cleanOldFiles, 5 * 60 * 1000);

// Procesador de trabajos de la cola
downloadQueue.process(async (job) => {
  const { url, format, quality } = job.data;

  // Validar URL antes de ejecutar cualquier proceso
  if (!isValidYouTubeUrl(url)) {
    throw new Error("La URL no corresponde a un video de YouTube válido.");
  }

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }

  const outputTemplate = path.join(DOWNLOADS_DIR, "%(id)s.%(ext)s");
  const args = buildArgs(url, format, quality, outputTemplate);

  await job.progress(5);

  const filePath = await runYtDlp(args, async (pct) => {
    // Reservar el 5% inicial y el último 5% para overhead
    await job.progress(Math.min(5 + Math.round(pct * 0.9), 95));
  });

  await job.progress(100);
  return { filePath, filename: path.basename(filePath) };
});

downloadQueue.on("failed", (job, err) => {
  console.error(`[worker] Job ${job.id} falló: ${err.message}`);
});

downloadQueue.on("completed", (job) => {
  console.log(`[worker] Job ${job.id} completado: ${job.returnvalue?.filename}`);
});

module.exports = downloadQueue;
