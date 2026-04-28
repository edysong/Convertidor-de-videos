const express = require("express");
const path = require("path");
const fs = require("fs");
const downloadQueue = require("../workers/downloader");

const router = express.Router();

/**
 * Convierte el estado interno de Bull a los estados que entiende el frontend.
 */
function mapState(bullState) {
  const map = { waiting: "queued", active: "processing", completed: "done", failed: "error" };
  return map[bullState] || "queued";
}

// GET /api/status/:jobId — consulta el estado actual de un trabajo
router.get("/status/:jobId", async (req, res) => {
  const { jobId } = req.params;

  // Validación: jobId solo puede ser UUID
  if (!/^[0-9a-f-]{36}$/.test(jobId)) {
    return res.status(400).json({ error: "jobId inválido." });
  }

  try {
    const job = await downloadQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Trabajo no encontrado." });
    }

    const state = await job.getState();
    const progress = job._progress || 0;
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({
      status: mapState(state),
      progress,
      downloadUrl: state === "completed" ? `/api/download/${jobId}` : null,
      filename: result?.filename || null,
      error: failedReason || null,
    });
  } catch (err) {
    console.error("[status] Error:", err.message);
    res.status(500).json({ error: "Error al consultar el estado del trabajo." });
  }
});

// GET /api/download/:jobId — stream del archivo y eliminación posterior
router.get("/download/:jobId", async (req, res) => {
  const { jobId } = req.params;

  if (!/^[0-9a-f-]{36}$/.test(jobId)) {
    return res.status(400).json({ error: "jobId inválido." });
  }

  try {
    const job = await downloadQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: "Trabajo no encontrado." });

    const state = await job.getState();
    if (state !== "completed") {
      return res.status(409).json({ error: "El archivo aún no está listo." });
    }

    const { filePath, filename } = job.returnvalue;

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(410).json({ error: "El archivo ya no está disponible (expiró)." });
    }

    // Cabeceras para forzar la descarga en el navegador
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    // Eliminar el archivo del disco después de enviarlo
    stream.on("close", () => {
      fs.unlink(filePath, (err) => {
        if (err) console.warn(`[download] No se pudo eliminar ${filename}:`, err.message);
      });
    });
  } catch (err) {
    console.error("[download] Error:", err.message);
    res.status(500).json({ error: "Error al descargar el archivo." });
  }
});

module.exports = router;
