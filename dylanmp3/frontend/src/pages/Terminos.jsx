import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Aceptación",
    content:
      "Al usar DylanMP3, aceptas estos Términos de Uso. Si no estás de acuerdo, no uses el servicio.",
  },
  {
    title: "2. Descripción del servicio",
    content:
      "DylanMP3 es una herramienta gratuita que permite descargar videos de YouTube en MP4 y extraer audio en MP3. No requiere registro y está orientada a usuarios de Colombia y Latinoamérica.",
  },
  {
    title: "3. Uso permitido",
    content:
      "Puedes usar DylanMP3 para: (a) videos de tu propia autoría, (b) contenido bajo licencias Creative Commons que permitan descarga, (c) contenido para el que tienes permiso del titular. Solo para uso personal y no comercial.",
  },
  {
    title: "4. Prohibiciones",
    content:
      "Está prohibido: descargar contenido protegido por derechos de autor sin autorización, redistribuir o vender el contenido descargado, usar el servicio de forma automatizada o masiva, intentar superar las limitaciones técnicas del servicio.",
  },
  {
    title: "5. Derechos de autor",
    content:
      "DylanMP3 no almacena ni distribuye contenido de YouTube. Actuamos como intermediario técnico. El usuario es el único responsable de garantizar que tiene los derechos necesarios para descargar el contenido.",
  },
  {
    title: "6. Límite de velocidad",
    content:
      "Para garantizar la disponibilidad del servicio, aplicamos un límite de 5 descargas por IP cada 15 minutos.",
  },
  {
    title: "7. Limitación de responsabilidad",
    content:
      "DylanMP3 se proporciona 'tal cual'. No somos responsables por interrupciones del servicio, pérdida de datos ni uso indebido del servicio por parte de los usuarios.",
  },
  {
    title: "8. Modificaciones",
    content:
      "Podemos modificar estos términos en cualquier momento. Las modificaciones son efectivas al publicarse. El uso continuado implica aceptación.",
  },
];

export default function Terminos() {
  return (
    <>
      <Helmet>
        <title>Términos de Uso — DylanMP3</title>
        <meta name="description" content="Términos de uso de DylanMP3. Condiciones para usar el servicio de descarga de YouTube." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <header className="border-b border-white/5 py-4 px-6">
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

        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Términos de Uso</h1>
            <p className="text-white/40 text-sm">Última actualización: enero 2025</p>
          </div>
          <p className="text-white/50 leading-relaxed text-sm">
            Lee estos Términos de Uso antes de utilizar DylanMP3. Al usar el servicio,
            confirmas que los has leído y aceptado.
          </p>
          <div className="space-y-4">
            {SECTIONS.map((s) => (
              <div key={s.title} className="bg-card border border-white/10 rounded-xl p-5 space-y-2">
                <h2 className="text-sm font-semibold text-white">{s.title}</h2>
                <p className="text-white/40 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-xl p-5">
            <p className="text-accent text-sm font-medium mb-1">Aviso importante</p>
            <p className="text-white/40 text-sm leading-relaxed">
              Descargar videos de YouTube puede violar los Términos de Servicio de YouTube
              y las leyes de derechos de autor de tu país. Usa DylanMP3 responsablemente,
              solo con contenido que tengas derecho a descargar.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
