require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
const fs = require("fs");

const processRoute = require("./routes/process");
const statusRoute = require("./routes/status");

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const DOWNLOADS_DIR = path.join(__dirname, "../downloads");
const TTL_MINUTES = parseInt(process.env.DOWNLOAD_TTL_MINUTES || "30", 10);

app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use("/api", processRoute);
app.use("/api", statusRoute);

app.get("/health", (_req, res) => res.json({ ok: true, service: "DylanMP3" }));

// Limpieza automática con node-cron cada 5 minutos
cron.schedule("*/5 * * * *", () => {
  if (!fs.existsSync(DOWNLOADS_DIR)) return;
  const now = Date.now();
  const limit = TTL_MINUTES * 60 * 1000;

  fs.readdirSync(DOWNLOADS_DIR).forEach((file) => {
    const filePath = path.join(DOWNLOADS_DIR, file);
    try {
      const { mtimeMs } = fs.statSync(filePath);
      if (now - mtimeMs > limit) {
        fs.unlinkSync(filePath);
        console.log(`[cron] Eliminado: ${file}`);
      }
    } catch {
      // el archivo ya fue eliminado por otra ruta
    }
  });
});

app.listen(PORT, () => {
  console.log(`DylanMP3 backend corriendo en http://localhost:${PORT}`);
});
