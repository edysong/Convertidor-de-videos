import { useState, useEffect } from "react";

const YOUTUBE_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
  /^https?:\/\/youtu\.be\/[\w-]+/,
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/,
];

function detectPlatform(url) {
  if (/youtube\.com\/shorts\//.test(url)) return "YouTube Short";
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return "YouTube";
  return null;
}

export default function UrlInput({ onUrlChange }) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    if (!url.trim()) {
      setIsValid(null);
      setPlatform(null);
      onUrlChange("", false);
      return;
    }
    const valid = YOUTUBE_PATTERNS.some((re) => re.test(url.trim()));
    setIsValid(valid);
    setPlatform(valid ? detectPlatform(url) : null);
    onUrlChange(url.trim(), valid);
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // el usuario puede pegar manualmente
    }
  };

  const borderColor =
    isValid === null
      ? "border-white/10 focus-within:border-accent/50"
      : isValid
      ? "border-success/60 focus-within:border-success"
      : "border-accent/60 focus-within:border-accent";

  return (
    <div className="w-full">
      <div
        className={`flex items-center gap-2 bg-card border rounded-xl px-4 py-3 transition-colors duration-200 ${borderColor}`}
      >
        {/* Ícono YouTube */}
        <svg className="w-5 h-5 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>

        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega el enlace de YouTube aquí..."
          className="flex-1 bg-transparent outline-none text-fore placeholder-white/30 text-sm"
          autoComplete="off"
          spellCheck="false"
        />

        {platform && (
          <span className="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
            {platform}
          </span>
        )}

        {isValid === true && !platform && (
          <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isValid === false && (
          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}

        <button
          type="button"
          onClick={handlePaste}
          className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          Pegar
        </button>
      </div>
      {isValid === false && (
        <p className="mt-2 text-xs text-accent/80">
          URL inválida. Acepta: youtube.com/watch, youtu.be/ y youtube.com/shorts/
        </p>
      )}
    </div>
  );
}
