const rateLimit = require("express-rate-limit");

const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_IP || "5", 10);
const WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "15", 10);

const rateLimiter = rateLimit({
  windowMs: WINDOW_MINUTES * 60 * 1000,
  max: MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: `Demasiadas solicitudes. Máximo ${MAX_REQUESTS} descargas cada ${WINDOW_MINUTES} minutos por IP.`,
  },
  // Usar IP real cuando esté detrás de un proxy/nginx
  keyGenerator: (req) => req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
});

module.exports = rateLimiter;
