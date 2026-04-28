import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 5;
const SKIP_AFTER_SECONDS = 3;

// Radio del anillo SVG animado
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Interstitial({ jobId, filename, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [canSkip, setCanSkip] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          triggerDownload();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    const skipTimer = setTimeout(() => setCanSkip(true), SKIP_AFTER_SECONDS * 1000);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(skipTimer);
    };
  }, []);

  const triggerDownload = () => {
    if (downloaded) return;
    setDownloaded(true);

    // Crear un enlace temporal para iniciar la descarga del archivo
    const link = document.createElement("a");
    link.href = `/api/download/${jobId}`;
    link.download = filename || "descarga";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cerrar el interstitial después de iniciar la descarga
    setTimeout(onClose, 1500);
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    triggerDownload();
  };

  // Progreso del anillo SVG: va de 0 a CIRCUMFERENCE en sentido inverso
  const strokeDashoffset =
    CIRCUMFERENCE - ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * CIRCUMFERENCE;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-card border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 shadow-2xl">
        <p className="text-white/60 text-sm text-center">Tu descarga comenzará en</p>

        {/* Anillo de cuenta regresiva SVG */}
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" className="rotate-[-90deg]">
            {/* Pista del anillo */}
            <circle
              cx="50" cy="50" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
            />
            {/* Arco animado */}
            <circle
              cx="50" cy="50" r={RADIUS}
              fill="none"
              stroke="#7b2fff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute text-3xl font-bold text-white">
            {secondsLeft}
          </span>
        </div>

        {/* =====================================================
            ADSENSE: Espacio para anuncio 300x250
            Reemplaza los valores con tu Ad Slot ID real.
            ===================================================== */}
        <div className="w-[300px] h-[250px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/20 text-xs text-center px-4">
          {/* <ins className="adsbygoogle"
               style={{ display: "block" }}
               data-ad-client="ca-pub-XXXXXXXXXX"
               data-ad-slot="YYYYYYYYYY"
               data-ad-format="auto"
               data-full-width-responsive="true" />
          */}
          <span>Espacio para anuncio AdSense 300×250</span>
        </div>

        {/* Botón Saltar (aparece a los 3 segundos) */}
        {canSkip ? (
          <button
            onClick={handleSkip}
            className="text-sm text-white/70 hover:text-white underline transition-colors"
          >
            Saltar y descargar ahora
          </button>
        ) : (
          <p className="text-xs text-white/30">
            Puedes saltar en {SKIP_AFTER_SECONDS - (COUNTDOWN_SECONDS - secondsLeft)} segundo
            {SKIP_AFTER_SECONDS - (COUNTDOWN_SECONDS - secondsLeft) !== 1 ? "s" : ""}...
          </p>
        )}
      </div>
    </div>
  );
}
