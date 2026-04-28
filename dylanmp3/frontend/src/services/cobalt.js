// Endpoint primario → fallback si falla por CORS o red
const ENDPOINTS = [
  "https://cobalt.tools/api/json",
  "https://api.cobalt.tools/",
];

const HEADERS = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

const FRIENDLY_ERRORS = {
  "error.content.video.unavailable": "El video no está disponible o fue eliminado.",
  "error.content.video.age": "El video tiene restricción de edad y no puede descargarse.",
  "error.content.video.private": "El video es privado.",
  "error.content.video.live": "No se pueden descargar transmisiones en vivo.",
  "error.link.invalid": "El enlace no es válido. Verifica que sea una URL de YouTube correcta.",
  "error.link.unsupported": "Este tipo de enlace no está soportado.",
  "error.rate_limit": "Demasiadas solicitudes. Espera un momento e intenta de nuevo.",
  "error.content.too_long": "El video es demasiado largo para procesar.",
  "error.youtube.decipher": "YouTube bloqueó la descarga temporalmente. Intenta en unos minutos.",
  "error.youtube.login": "Este video requiere iniciar sesión en YouTube para descargarse.",
  "error.youtube.age": "El video tiene restricción de edad en YouTube.",
};

/**
 * Intenta la petición contra cada endpoint en orden.
 * Pasa al siguiente si el anterior lanza un error de red/CORS (TypeError).
 */
async function fetchWithFallback(body) {
  let lastError;

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      // TypeError = error de red o CORS → probar el siguiente endpoint
      // Cualquier otro error (HTTP 4xx/5xx) también prueba el siguiente
      continue;
    }
  }

  throw lastError;
}

/**
 * Llama a la API de cobalt.tools para obtener la URL de descarga.
 * @param {Object} params
 * @param {string} params.url     - URL de YouTube
 * @param {"mp4"|"mp3"} params.format
 * @param {"1080"|"480"|"best"} params.quality
 * @returns {Promise<{ status: "stream"|"picker", url?: string, picker?: Array }>}
 */
export async function cobaltDownload({ url, format, quality }) {
  const isAudioOnly = format === "mp3";

  let data;
  try {
    data = await fetchWithFallback({
      url,
      vCodec: "h264",
      vQuality: isAudioOnly ? "720" : quality,
      aFormat: "mp3",
      isAudioOnly,
      isNoTTWatermark: true,
      filenamePattern: "classic",
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servicio de descarga. Verifica tu conexión e intenta de nuevo."
    );
  }

  if (data.status === "error") {
    const friendly =
      FRIENDLY_ERRORS[data.text] ??
      "No se pudo procesar el video. Verifica el enlace e intenta de nuevo.";
    throw new Error(friendly);
  }

  return data; // { status: "stream"|"picker", url?, picker? }
}
