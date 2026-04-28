import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 2000;

export default function ResultCard({ jobId, onReadyToDownload }) {
  const [status, setStatus] = useState("queued");
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/status/${jobId}`);
        const data = await res.json();

        setStatus(data.status);
        setProgress(data.progress || 0);
        setFilename(data.filename || null);

        if (data.status === "done") {
          clearInterval(pollRef.current);
        }

        if (data.status === "error") {
          setErrorMsg(data.error || "Ocurrió un error durante la descarga.");
          clearInterval(pollRef.current);
        }
      } catch {
        setErrorMsg("No se pudo conectar con el servidor.");
        clearInterval(pollRef.current);
      }
    };

    poll(); // primera llamada inmediata
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => clearInterval(pollRef.current);
  }, [jobId]);

  const statusLabel = {
    queued: "En cola...",
    processing: `Procesando — ${progress}%`,
    done: "¡Listo para descargar!",
    error: "Error",
  }[status];

  const statusColor = {
    queued: "text-white/50",
    processing: "text-accent",
    done: "text-success",
    error: "text-danger",
  }[status];

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5 mt-6 space-y-4">
      {/* Cabecera de estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === "processing" && (
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          )}
          {status === "queued" && (
            <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
          )}
          {status === "done" && (
            <span className="w-2 h-2 rounded-full bg-success" />
          )}
          {status === "error" && (
            <span className="w-2 h-2 rounded-full bg-danger" />
          )}
          <span className={`text-sm font-medium ${statusColor}`}>{statusLabel}</span>
        </div>

        {filename && (
          <span className="text-xs text-white/30 truncate max-w-[180px]" title={filename}>
            {filename}
          </span>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === "done"
              ? "bg-success glow-success"
              : status === "error"
              ? "bg-danger"
              : "gradient-accent"
          }`}
          style={{ width: `${status === "done" ? 100 : progress}%` }}
        />
      </div>

      {/* Mensaje de error */}
      {errorMsg && (
        <p className="text-sm text-danger/80 bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      {/* Botón de descarga */}
      {status === "done" && (
        <button
          onClick={() => onReadyToDownload(jobId, filename)}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white gradient-accent hover:opacity-90 active:scale-95 transition-all duration-150 glow-accent"
        >
          Descargar {filename}
        </button>
      )}
    </div>
  );
}
