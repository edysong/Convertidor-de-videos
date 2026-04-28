import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import UrlInput from "../components/UrlInput";
import FormatSelector from "../components/FormatSelector";
import PickerCard from "../components/ResultCard";
import Interstitial from "../components/Interstitial";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { cobaltDownload } from "../services/cobalt";

export default function Home() {
  const [url, setUrl] = useState("");
  const [urlValid, setUrlValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interstitial, setInterstitial] = useState(null); // { downloadUrl }
  const [pickerItems, setPickerItems] = useState(null);   // array de streams

  const reset = () => {
    setError(null);
    setInterstitial(null);
    setPickerItems(null);
  };

  const handleUrlChange = (newUrl, valid) => {
    setUrl(newUrl);
    setUrlValid(valid);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlValid || !selectedOption) return;

    setLoading(true);
    reset();

    try {
      const data = await cobaltDownload({
        url,
        format: selectedOption.format,
        quality: selectedOption.quality,
      });

      if (data.status === "stream") {
        setInterstitial({ downloadUrl: data.url });
      } else if (data.status === "picker") {
        setPickerItems(data.picker);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInterstitial(null);
    setPickerItems(null);
    setUrl("");
    setUrlValid(false);
    setSelectedOption(null);
  };

  return (
    <>
      <Helmet>
        <title>DylanMP3 — Descargar YouTube a MP3 y MP4 Gratis</title>
        <meta name="description"
          content="Descarga videos de YouTube, Shorts y convierte a MP3 gratis. Rápido, sin registro, sin límites. La mejor herramienta para bajar música de YouTube en Colombia." />
        <link rel="canonical" href="https://dylanmp3.vercel.app/" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <header className="border-b border-white/5 py-4 px-6 sticky top-0 bg-bg/95 backdrop-blur z-40">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.35a8.16 8.16 0 004.77 1.52V7.43a4.85 4.85 0 01-1-.74z" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-fore">DylanMP3</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-xs text-white/30">
              <Link to="/youtube-a-mp3" className="hover:text-white/60 transition-colors">YouTube a MP3</Link>
              <Link to="/descargar-shorts-youtube" className="hover:text-white/60 transition-colors">Shorts</Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="px-4 py-14">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-xs text-accent font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Gratis · Sin registro · Sin límites
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                  Descarga{" "}
                  <span className="text-transparent bg-clip-text gradient-red-text">YouTube</span>{" "}
                  a MP3 y MP4
                </h1>
                <p className="text-white/50 text-base max-w-md mx-auto">
                  Descarga videos, Shorts y convierte a MP3. Rápido, gratuito y desde el navegador.
                </p>
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
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : "Descargar gratis"}
                </button>
              </form>

              {/* Picker: cobalt devolvió múltiples streams */}
              {pickerItems && (
                <PickerCard items={pickerItems} onClose={() => setPickerItems(null)} />
              )}

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  to="/youtube-a-mp3"
                  className="text-xs px-4 py-2 rounded-full bg-card border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  Convertidor YouTube a MP3 →
                </Link>
                <Link
                  to="/descargar-shorts-youtube"
                  className="text-xs px-4 py-2 rounded-full bg-card border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                >
                  Descargar Shorts de YouTube →
                </Link>
              </div>
            </div>
          </section>

          <HowItWorks />
          <FAQ />
        </main>

        <Footer />

        {interstitial && (
          <Interstitial
            downloadUrl={interstitial.downloadUrl}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  );
}
