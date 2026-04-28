const express = require("express");
const { v4: uuidv4 } = require("uuid");
const rateLimiter = require("../middleware/rateLimit");
const downloadQueue = require("../workers/downloader");

const router = express.Router();

const VALID_FORMATS = ["mp4", "mp3"];
const VALID_QUALITIES = ["1080", "720", "480", "360", "best"];

// Validación inicial de URL — la validación profunda ocurre en el worker
const YT_PREFIX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;

router.post("/process", rateLimiter, async (req, res) => {
  const { url, format, quality } = req.body;

  if (!url || typeof url !== "string" || !url.trim()) {
    return res.status(400).json({ error: "Se requiere una URL de YouTube." });
  }
  if (!VALID_FORMATS.includes(format)) {
    return res.status(400).json({ error: "Formato inválido. Usa mp4 o mp3." });
  }
  if (!VALID_QUALITIES.includes(quality)) {
    return res.status(400).json({ error: "Calidad inválida." });
  }

  const trimmedUrl = url.trim();
  if (!YT_PREFIX.test(trimmedUrl)) {
    return res.status(400).json({ error: "La URL debe ser de YouTube." });
  }

  try {
    const job = await downloadQueue.add(
      { url: trimmedUrl, format, quality },
      {
        jobId: uuidv4(),
        attempts: 2,
        backoff: { type: "fixed", delay: 3000 },
        removeOnComplete: false,
        removeOnFail: false,
      }
    );
    res.json({ jobId: job.id, status: "queued" });
  } catch (err) {
    console.error("[process] Error al encolar:", err.message);
    res.status(500).json({ error: "Error interno al procesar la solicitud." });
  }
});

module.exports = router;
