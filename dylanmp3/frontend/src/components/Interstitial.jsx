import { useEffect, useRef, useState } from "react";

const TOTAL = 5;
const SKIP_AT = 3;
const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Overlay con countdown y espacio AdSense.
 * Props:
 *   downloadUrl — URL directa devuelta por cobalt (status "stream")
 *   onClose     — callback al terminar
 */
export default function Interstitial({ downloadUrl, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL);
  const [canSkip, setCanSkip] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), SKIP_AT * 1000);

    timer.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer.current);
          triggerDownload();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer.current);
      clearTimeout(skipTimer);
    };
  }, []);

  const triggerDownload = () => {
    if (done) return;
    setDone(true);
    // cobalt devuelve una URL directa — la abrimos en nueva pestaña
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    setTimeout(onClose, 800);
  };

  const handleSkip = () => {
    clearInterval(timer.current);
    triggerDownload();
  };

  const elapsed = TOTAL - secondsLeft;
  const dashOffset = CIRC - (elapsed / TOTAL) * CIRC;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
      <div className="bg-card border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 shadow-2xl">
        <p className="text-white/50 text-sm">Tu descarga comenzará en</p>

        {/* Anillo SVG animado */}
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r={RADIUS}
              fill="none"
              stroke="#ff0000"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute text-3xl font-bold text-white">{secondsLeft}</span>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            GOOGLE ADSENSE — REEMPLAZAR CUANDO TENGAS CUENTA APROBADA
            Publisher ID: ca-pub-9334050849399869
            Ad Slot ID:   reemplaza con tu Ad Slot ID real (panel AdSense)
            Tipo: Display 300x250
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-center rounded-xl overflow-hidden bg-white/5 border border-white/10"
          style={{ width: 300, height: 250 }}
        >
          {/*
          <ins className="adsbygoogle"
               style={{ display: "block", width: "300px", height: "250px" }}
               data-ad-client="ca-pub-9334050849399869"
               data-ad-slot="TU_AD_SLOT_ID" />
          */}
          <span className="text-white/20 text-xs text-center px-4">
            Espacio AdSense 300×250
            <br />
            ca-pub-9334050849399869
          </span>
        </div>

        {canSkip ? (
          <button
            onClick={handleSkip}
            className="text-sm text-white/60 hover:text-white underline transition-colors"
          >
            Saltar y descargar ahora
          </button>
        ) : (
          <p className="text-xs text-white/30">
            Puedes saltar en {Math.max(0, SKIP_AT - elapsed)} segundo{SKIP_AT - elapsed !== 1 ? "s" : ""}...
          </p>
        )}
      </div>
    </div>
  );
}
