const Bull = require("bull");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const YTDLP_PATH = process.env.YTDLP_PATH || "yt-dlp";
const DOWNLOADS_DIR = path.join(__dirname, "../../downloads");

// Patrones válidos de YouTube — se validan en el worker, no solo en la ruta
const YOUTUBE_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
  /^https?:\/\/youtu\.be\/[\w-]+/,
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
];

const downloadQueue = new Bull("dylanmp3-download", REDIS_URL);

function isValidYouTubeUrl(url) {
  return YOUTUBE_PATTERNS.some((re) => re.test(url));
}

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

  const height = quality === "best" ? "9999" : quality;
  return [
    "-f", `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
    "--merge-output-format", "mp4",
    "-o", outputTemplate,
    "--no-playlist",
    "--newline",
    url,
  ];
}

function runYtDlp(args, onProgress) {
  return new Promise((resolve, reject) => {
    let proc;
    try {
      proc = spawn(YTDLP_PATH, args, { stdio: ["ignore", "pipe", "pipe"] });
    } catch {
      reject(
        new Error("yt-dlp no está instalado. Instálalo con: pip install yt-dlp")
      );
      return;
    }

    let outputFile = null;
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();

      const pctMatch = text.match(/\[download\]\s+([\d.]+)%/);
      if (pctMatch) onProgress(Math.round(parseFloat(pctMatch[1])));

      const destMatch = text.match(/\[download\] Destination: (.+)/);
      if (destMatch) outputFile = destMatch[1].trim();

      const mergeMatch = text.match(/\[Merger\] Merging formats into "(.+)"/);
      if (mergeMatch) outputFile = mergeMatch[1].trim();

      const ffmpegMatch = text.match(/\[ffmpeg\] Destination: (.+)/);
      if (ffmpegMatch) outputFile = ffmpegMatch[1].trim();
    });

    proc.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(new Error("yt-dlp no encontrado. Instálalo con: pip install yt-dlp"));
      } else {
        reject(new Error(`Error al ejecutar yt-dlp: ${err.message}`));
      }
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        let msg = `yt-dlp terminó con código ${code}.`;
        if (stderr.includes("Video unavailable")) msg = "El video no está disponible o es privado.";
        else if (stderr.includes("age")) msg = "El video tiene restricción de edad.";
        else if (stderr.includes("Private video")) msg = "El video es privado.";
        reject(new Error(msg));
        return;
      }
      if (!outputFile) {
        reject(new Error("No se pudo determinar el archivo de salida."));
        return;
      }
      resolve(outputFile);
    });
  });
}

downloadQueue.process(async (job) => {
  const { url, format, quality } = job.data;

  if (!isValidYouTubeUrl(url)) {
    throw new Error("La URL no es de YouTube. Acepta: youtube.com/watch, youtu.be/ o youtube.com/shorts/");
  }

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }

  const outputTemplate = path.join(DOWNLOADS_DIR, "%(id)s.%(ext)s");
  const args = buildArgs(url, format, quality, outputTemplate);

  await job.progress(5);

  const filePath = await runYtDlp(args, async (pct) => {
    await job.progress(Math.min(5 + Math.round(pct * 0.9), 95));
  });

  await job.progress(100);
  return { filePath, filename: path.basename(filePath) };
});

downloadQueue.on("failed", (job, err) =>
  console.error(`[worker] Job ${job.id} falló: ${err.message}`)
);
downloadQueue.on("completed", (job) =>
  console.log(`[worker] Job ${job.id} completado: ${job.returnvalue?.filename}`)
);

module.exports = downloadQueue;
