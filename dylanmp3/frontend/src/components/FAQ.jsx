import { useState } from "react";
import { Helmet } from "react-helmet-async";

const FAQS = [
  {
    q: "¿Cómo bajar un video de YouTube a MP4?",
    a: "Copia el enlace del video de YouTube, pégalo en DylanMP3, selecciona el formato MP4 Full HD (1080p) o SD (480p) y haz clic en «Procesar y descargar». El archivo se guardará directo en tu dispositivo.",
  },
  {
    q: "¿Cómo descargar un Short de YouTube al celular?",
    a: "Abre el Short en YouTube, toca «Compartir» y copia el enlace. Luego pégalo en DylanMP3. Detectamos automáticamente que es un Short y lo descargas en MP4 o MP3 sin instalar ninguna app.",
  },
  {
    q: "¿Es gratis descargar YouTube a MP3?",
    a: "Sí, DylanMP3 es 100% gratuito. No necesitas crear una cuenta ni pagar nada. El servicio se mantiene con publicidad no intrusiva.",
  },
  {
    q: "¿Funciona en iPhone y Android?",
    a: "Sí. DylanMP3 funciona desde el navegador en cualquier dispositivo: iPhone (Safari), Android (Chrome), tablets y computadoras Windows o Mac. No requiere ninguna instalación.",
  },
  {
    q: "¿Cuál es la mejor calidad para descargar MP3 de YouTube?",
    a: "DylanMP3 extrae el audio en la máxima calidad disponible y lo convierte a MP3 a 320 kbps, que es la calidad más alta estándar para MP3. El resultado es prácticamente indistinguible del audio original.",
  },
  {
    q: "¿Puedo descargar listas de reproducción de YouTube?",
    a: "Actualmente DylanMP3 descarga un video a la vez para garantizar la velocidad. Para listas de reproducción, te recomendamos descargar cada video individualmente o usar la versión de escritorio con yt-dlp.",
  },
];

// Schema.org FAQPage para Google
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-14 px-4 border-t border-white/5">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Preguntas frecuentes</h2>
          <p className="text-white/40 text-sm">Todo lo que necesitas saber sobre DylanMP3</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-card border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="text-sm font-medium text-white/90">{faq.q}</span>
                <span
                  className={`flex-shrink-0 w-5 h-5 text-accent transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>

              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
