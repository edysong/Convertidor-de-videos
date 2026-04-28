const COBALT_API = "https://co.wuk.sh/api/json";

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
 * Llama a la API de cobalt.tools para obtener la URL de descarga.
 * @param {Object} params
 * @param {string} params.url - URL de YouTube
 * @param {"mp4"|"mp3"} params.format
 * @param {"1080"|"480"|"best"} params.quality
 * @returns {Promise<{ status: "stream"|"picker", url?: string, picker?: Array }>}
 */
export async function cobaltDownload({ url, format, quality }) {
  const isAudioOnly = format === "mp3";

  const res = await fetch(COBALT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      url,
      vCodec: "h264",
      vQuality: isAudioOnly ? "720" : quality,
      aFormat: "mp3",
      isAudioOnly,
      isNoTTWatermark: true,
      filenamePattern: "classic",
    }),
  });

  if (!res.ok) {
    throw new Error(`Error del servidor (${res.status}). Intenta de nuevo en unos segundos.`);
  }

  const data = await res.json();

  if (data.status === "error") {
    const friendly = FRIENDLY_ERRORS[data.text]
      ?? "No se pudo procesar el video. Verifica el enlace e intenta de nuevo.";
    throw new Error(friendly);
  }

  return data; // { status: "stream"|"picker", url?, picker? }
}
