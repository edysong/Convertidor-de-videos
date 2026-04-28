const express = require("express");
const fs = require("fs");
const downloadQueue = require("../workers/downloader");

const router = express.Router();

const UUID_RE = /^[0-9a-f-]{36}$/;

function mapState(s) {
  return { waiting: "queued", active: "processing", completed: "done", failed: "error" }[s] || "queued";
}

router.get("/status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  if (!UUID_RE.test(jobId)) return res.status(400).json({ error: "jobId inválido." });

  try {
    const job = await downloadQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: "Trabajo no encontrado." });

    const state = await job.getState();
    res.json({
      status: mapState(state),
      progress: job._progress || 0,
      downloadUrl: state === "completed" ? `/api/download/${jobId}` : null,
      filename: job.returnvalue?.filename || null,
      error: job.failedReason || null,
    });
  } catch (err) {
    console.error("[status]", err.message);
    res.status(500).json({ error: "Error al consultar estado." });
  }
});

router.get("/download/:jobId", async (req, res) => {
  const { jobId } = req.params;
  if (!UUID_RE.test(jobId)) return res.status(400).json({ error: "jobId inválido." });

  try {
    const job = await downloadQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: "Trabajo no encontrado." });

    const state = await job.getState();
    if (state !== "completed") {
      return res.status(409).json({ error: "El archivo aún no está listo." });
    }

    const { filePath, filename } = job.returnvalue;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(410).json({ error: "El archivo expiró. Inicia una nueva descarga." });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("close", () => {
      fs.unlink(filePath, (err) => {
        if (err) console.warn(`[download] No se eliminó ${filename}:`, err.message);
      });
    });
  } catch (err) {
    console.error("[download]", err.message);
    res.status(500).json({ error: "Error al descargar el archivo." });
  }
});

module.exports = router;
