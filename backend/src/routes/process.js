const express = require("express");
const { v4: uuidv4 } = require("uuid");
const rateLimiter = require("../middleware/rateLimit");
const downloadQueue = require("../workers/downloader");

const router = express.Router();

const VALID_FORMATS = ["mp4", "mp3"];
const VALID_QUALITIES = ["1080", "720", "480", "360", "best"];

router.post("/process", rateLimiter, async (req, res) => {
  const { url, format, quality } = req.body;

  // Validaciones básicas de entrada
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Se requiere una URL válida." });
  }
  if (!VALID_FORMATS.includes(format)) {
    return res.status(400).json({ error: "Formato inválido. Usa 'mp4' o 'mp3'." });
  }
  if (!VALID_QUALITIES.includes(quality)) {
    return res.status(400).json({ error: "Calidad inválida." });
  }

  // Sanitizar la URL: solo aceptar https de YouTube
  const trimmedUrl = url.trim();
  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(trimmedUrl)) {
    return res.status(400).json({ error: "La URL debe ser de YouTube (youtube.com o youtu.be)." });
  }

  try {
    const job = await downloadQueue.add(
      { url: trimmedUrl, format, quality },
      {
        jobId: uuidv4(),
        attempts: 2,
        backoff: { type: "fixed", delay: 3000 },
        removeOnComplete: false, // necesitamos leer el resultado después
        removeOnFail: false,
      }
    );

    res.json({ jobId: job.id, status: "queued" });
  } catch (err) {
    console.error("[process] Error al encolar job:", err.message);
    res.status(500).json({ error: "Error interno al iniciar la descarga." });
  }
});

module.exports = router;
