import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import UrlInput from "../components/UrlInput";
import FormatSelector from "../components/FormatSelector";
import ResultCard from "../components/ResultCard";
import Interstitial from "../components/Interstitial";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function DescargaShortsYoutube() {
  const [url, setUrl] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interstitial, setInterstitial] = useState(null);

  const handleUrlChange = (newUrl, valid) => {
    setUrl(newUrl);
    setUrlValid(valid);
    if (jobId) { setJobId(null); setError(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlValid || !selectedOption) return;
    setLoading(true);
    setError(null);
    setJobId(null);
    try {
      const res = await fetch(`${API_BASE}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: selectedOption.format, quality: selectedOption.quality }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al iniciar la descarga."); return; }
      setJobId(data.jobId);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Descargar Shorts de YouTube Gratis — DylanMP3</title>
        <meta name="description"
          content="Descarga Shorts de YouTube gratis en MP4 o MP3. Sin instalar apps, sin registro. Funciona en iPhone y Android. La forma más fácil de guardar Shorts de YouTube." />
        <meta name="keywords"
          content="descargar short de youtube, bajar shorts de youtube, descargar shorts youtube celular, youtube shorts mp4, descargar reels youtube" />
        <link rel="canonical" href="https://dylanmp3.vercel.app/descargar-shorts-youtube" />
        <meta property="og:title" content="Descargar Shorts de YouTube Gratis — DylanMP3" />
        <meta property="og:url" content="https://dylanmp3.vercel.app/descargar-shorts-youtube" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <header className="border-b border-white/5 py-4 px-6 sticky top-0 bg-bg/95 backdrop-blur z-40">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.35a8.16 8.16 0 004.77 1.52V7.43a4.85 4.85 0 01-1-.74z" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight">DylanMP3</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-14">
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-xs text-accent font-medium">
                Compatible con youtube.com/shorts/
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Descargar{" "}
                <span className="text-transparent bg-clip-text gradient-red">Shorts de YouTube</span>{" "}
                Gratis
              </h1>
              <p className="text-white/50 leading-relaxed">
                Guarda cualquier YouTube Short en tu celular o PC en formato MP4 o extrae el
                audio como MP3. Sin apps, sin registro, completamente gratis.
              </p>
            </div>

            {/* Info sobre URLs de Shorts */}
            <div className="bg-card border border-white/10 rounded-xl px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-white/50">
                <p className="font-medium text-white/80 mb-1">¿Cómo obtener el enlace de un Short?</p>
                <p>En la app de YouTube, abre el Short → toca los tres puntos (⋮) → «Compartir» → «Copiar enlace».</p>
                <p className="mt-1 font-mono text-xs text-white/30">Ejemplo: youtube.com/shorts/aBcDeF12345</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <UrlInput onUrlChange={handleUrlChange} />
              <FormatSelector selected={selectedOption} onChange={setSelectedOption} />
              {error && (
                <p className="text-sm text-accent/80 bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!urlValid || !selectedOption || loading}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200
                  ${urlValid && selectedOption && !loading
                    ? "gradient-red text-white hover:opacity-90 active:scale-95 glow-red"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
              >
                {loading ? "Procesando..." : "Descargar Short gratis"}
              </button>
            </form>

            {jobId && (
              <ResultCard
                jobId={jobId}
                onReadyToDownload={(jid, fname) => setInterstitial({ jobId: jid, filename: fname })}
              />
            )}

            {/* H2 + pasos SEO */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <h2 className="text-xl font-bold">¿Cómo descargar un Short de YouTube?</h2>
              <ol className="space-y-4">
                {[
                  { n: "1", t: "Abre el Short en la app de YouTube", d: "Busca el Short que quieres guardar." },
                  { n: "2", t: "Copia el enlace del Short", d: "Toca ⋮ → Compartir → Copiar enlace. La URL tendrá youtube.com/shorts/..." },
                  { n: "3", t: "Pega el enlace en DylanMP3", d: "DylanMP3 detecta automáticamente que es un Short." },
                  { n: "4", t: "Elige MP4 o MP3 y descarga", d: "El Short se guardará directamente en tu galería o carpeta de descargas." },
                ].map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full gradient-red flex items-center justify-center text-xs font-bold text-white">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-white/90">{step.t}</p>
                      <p className="text-xs text-white/40 mt-0.5">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </main>

        <Footer />

        {interstitial && (
          <Interstitial
            jobId={interstitial.jobId}
            filename={interstitial.filename}
            onClose={() => { setInterstitial(null); setJobId(null); setUrl(""); setUrlValid(false); setSelectedOption(null); }}
          />
        )}
      </div>
    </>
  );
}
