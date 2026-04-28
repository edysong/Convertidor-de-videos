import { useState } from "react";
import { Link } from "react-router-dom";
import UrlInput from "../components/UrlInput";
import FormatSelector from "../components/FormatSelector";
import ResultCard from "../components/ResultCard";
import Interstitial from "../components/Interstitial";

export default function Home() {
  const [url, setUrl] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interstitial, setInterstitial] = useState(null); // { jobId, filename }

  const handleUrlChange = (newUrl, valid) => {
    setUrl(newUrl);
    setUrlValid(valid);
    // Resetear resultados anteriores al cambiar la URL
    if (jobId) {
      setJobId(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlValid || !selectedOption) return;

    setLoading(true);
    setError(null);
    setJobId(null);

    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          format: selectedOption.format,
          quality: selectedOption.quality,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar la descarga.");
        return;
      }

      setJobId(data.jobId);
    } catch {
      setError("No se pudo conectar con el servidor. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleReadyToDownload = (jid, filename) => {
    setInterstitial({ jobId: jid, filename });
  };

  const handleInterstitialClose = () => {
    setInterstitial(null);
    setJobId(null);
    setUrl("");
    setUrlValid(false);
    setSelectedOption(null);
  };

  const canSubmit = urlValid && selectedOption && !loading;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabecera */}
      <header className="border-b border-white/5 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">VidSnap</span>
          </div>
          <span className="text-xs text-white/30">Gratis · Sin registro</span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          {/* Título */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Descarga videos de{" "}
              <span className="bg-clip-text text-transparent gradient-accent">YouTube</span>
            </h1>
            <p className="text-white/50 text-base">
              MP4 en alta calidad o MP3 con audio perfecto. Rápido y sin límites.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <UrlInput onUrlChange={handleUrlChange} />
            <FormatSelector selected={selectedOption} onChange={setSelectedOption} />

            {error && (
              <p className="text-sm text-danger/80 bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200
                ${canSubmit
                  ? "gradient-accent text-white hover:opacity-90 active:scale-95 glow-accent"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                "Procesar y descargar"
              )}
            </button>
          </form>

          {/* Tarjeta de resultado con polling */}
          {jobId && (
            <ResultCard jobId={jobId} onReadyToDownload={handleReadyToDownload} />
          )}

          {/* Información adicional */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: "⚡", label: "Rápido", desc: "Procesamiento en segundos" },
              { icon: "🎵", label: "MP3 HD", desc: "Audio a 320 kbps" },
              { icon: "📱", label: "Shorts", desc: "Compatible con YouTube Shorts" },
            ].map((item) => (
              <div key={item.label} className="text-center space-y-1">
                <div className="text-2xl">{item.icon}</div>
                <p className="text-sm font-medium text-white/80">{item.label}</p>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-white/20 space-x-4">
        <Link to="/privacidad" className="hover:text-white/50 transition-colors">
          Política de privacidad
        </Link>
        <Link to="/terminos" className="hover:text-white/50 transition-colors">
          Términos de uso
        </Link>
        <span>© 2024 VidSnap</span>
      </footer>

      {/* Overlay interstitial con anuncio + countdown */}
      {interstitial && (
        <Interstitial
          jobId={interstitial.jobId}
          filename={interstitial.filename}
          onClose={handleInterstitialClose}
        />
      )}
    </div>
  );
}
