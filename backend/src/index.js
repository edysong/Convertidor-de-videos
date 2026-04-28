require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const processRoute = require("./routes/process");
const statusRoute = require("./routes/status");

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS — solo permite el origen del frontend
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:80"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Rutas de la API
app.use("/api", processRoute);
app.use("/api", statusRoute);

// Ruta de salud para Docker healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`VidSnap backend corriendo en http://localhost:${PORT}`);
});
