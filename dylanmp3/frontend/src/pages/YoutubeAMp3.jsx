import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import UrlInput from "../components/UrlInput";
import FormatSelector from "../components/FormatSelector";
import ResultCard from "../components/ResultCard";
import Interstitial from "../components/Interstitial";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL || "";

// Preset MP3 ya seleccionado
const MP3_OPTION = { id: "mp3-best", format: "mp3", quality: "best" };

export default function YoutubeAMp3() {
  const [url, setUrl] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState(MP3_OPTION);
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
    if (!urlValid) return;
    setLoading(true);
    setError(null);
    setJobId(null);
    try {
      const res = await fetch(`${API_BASE}/api/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format: "mp3", quality: "best" }),
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
        <title>Convertidor YouTube a MP3 Gratis — DylanMP3</title>
        <meta name="description"
          content="Convierte YouTube a MP3 gratis en segundos. Calidad 320 kbps, sin registro, funciona en celular y PC. El mejor convertidor de YouTube a MP3 para Colombia." />
        <meta name="keywords"
          content="convertidor youtube mp3, youtube a mp3, descargar mp3 de youtube, bajar musica youtube gratis, youtube mp3 online" />
        <link rel="canonical" href="https://dylanmp3.vercel.app/youtube-a-mp3" />
        <meta property="og:title" content="Convertidor YouTube a MP3 Gratis — DylanMP3" />
        <meta property="og:url" content="https://dylanmp3.vercel.app/youtube-a-mp3" />
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
            {/* H1 + introducción */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Convertidor de{" "}
                <span className="text-transparent bg-clip-text gradient-red">YouTube a MP3</span>{" "}
                Gratis
              </h1>
              <p className="text-white/50 leading-relaxed">
                Convierte cualquier video de YouTube a MP3 en segundos. Calidad de 320 kbps,
                sin registro, sin instalaciones. Funciona en Android, iPhone y PC.
              </p>
            </div>

            {/* Formulario — sólo MP3 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <UrlInput onUrlChange={handleUrlChange} />
              <FormatSelector
                selected={selectedOption}
                onChange={setSelectedOption}
                forcedFormat="mp3"
              />
              {error && (
                <p className="text-sm text-accent/80 bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!urlValid || loading}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200
                  ${urlValid && !loading
                    ? "gradient-red text-white hover:opacity-90 active:scale-95 glow-red"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                  }`}
              >
                {loading ? "Procesando..." : "Convertir a MP3 gratis"}
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
              <h2 className="text-xl font-bold">¿Cómo convertir YouTube a MP3?</h2>
              <ol className="space-y-4">
                {[
                  { n: "1", t: "Copia el enlace del video de YouTube", d: "En la app o navegador, toca «Compartir» → «Copiar enlace»." },
                  { n: "2", t: "Pega el enlace en DylanMP3", d: "Toca el botón «Pegar» o pega manualmente en el campo de arriba." },
                  { n: "3", t: "Haz clic en «Convertir a MP3 gratis»", d: "El audio se extrae en 320 kbps directamente del video." },
                  { n: "4", t: "Descarga el archivo MP3", d: "Al terminar aparece el botón de descarga. El archivo se guarda en tu dispositivo." },
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
            onClose={() => { setInterstitial(null); setJobId(null); setUrl(""); setUrlValid(false); }}
          />
        )}
      </div>
    </>
  );
}
