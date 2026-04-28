const rateLimit = require("express-rate-limit");

const MAX = parseInt(process.env.MAX_REQUESTS_PER_IP || "5", 10);
const WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "15", 10);

const rateLimiter = rateLimit({
  windowMs: WINDOW * 60 * 1000,
  max: MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: `Límite alcanzado. Máximo ${MAX} descargas cada ${WINDOW} minutos por IP.`,
  },
  keyGenerator: (req) =>
    req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip,
});

module.exports = rateLimiter;
