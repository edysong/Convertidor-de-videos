import { useState, useEffect } from "react";

const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;

function detectPlatform(url) {
  if (!url) return null;
  if (/youtube\.com\/shorts\//.test(url)) return "YouTube Short";
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return "YouTube";
  return null;
}

export default function UrlInput({ onUrlChange }) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(null); // null = sin validar
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (!url.trim()) {
      setIsValid(null);
      setPlatform(null);
      onUrlChange("", false);
      return;
    }

    const valid = YOUTUBE_REGEX.test(url.trim());
    setIsValid(valid);
    setPlatform(valid ? detectPlatform(url) : null);
    onUrlChange(url.trim(), valid);
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // El usuario puede pegar manualmente si el permiso es denegado
    }
  };

  const borderColor =
    isValid === null
      ? "border-white/10 focus-within:border-accent/60"
      : isValid
      ? "border-success/60 focus-within:border-success"
      : "border-danger/60 focus-within:border-danger";

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 bg-card border rounded-xl px-4 py-3 transition-colors duration-200 ${borderColor}`}
      >
        {/* Ícono de link */}
        <svg className="w-5 h-5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega la URL de YouTube aquí..."
          className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Badge de plataforma detectada */}
        {platform && (
          <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
            {platform}
          </span>
        )}

        {/* Indicador de validación */}
        {isValid === true && !platform && (
          <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isValid === false && (
          <svg className="w-5 h-5 text-danger flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}

        {/* Botón Pegar */}
        <button
          type="button"
          onClick={handlePaste}
          className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          Pegar
        </button>
      </div>

      {isValid === false && (
        <p className="mt-2 text-xs text-danger/80">
          URL inválida. Asegúrate de que sea un enlace de YouTube válido.
        </p>
      )}
    </div>
  );
}
