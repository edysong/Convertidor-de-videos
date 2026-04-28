import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Información que recopilamos",
    content:
      "DylanMP3 no requiere registro ni almacena datos personales identificables. Las URLs de YouTube que introduces se procesan en nuestros servidores únicamente para generar el archivo descargable. Los archivos generados se eliminan automáticamente a los 30 minutos de su creación.",
  },
  {
    title: "2. Cookies y publicidad (Google AdSense)",
    content:
      "Utilizamos Google AdSense para mostrar publicidad relevante. AdSense puede usar cookies para personalizar los anuncios según tus intereses y hábitos de navegación. Tu ID de anunciante: ca-pub-9334050849399869. Puedes gestionar tus preferencias en myadcenter.google.com. Para más información, visita la Política de Privacidad de Google.",
  },
  {
    title: "3. Google Analytics",
    content:
      "Podemos usar Google Analytics para analizar el tráfico web de forma anónima. Los datos recopilados (páginas visitadas, tiempo en el sitio, país de origen) se usan para mejorar el servicio y no permiten identificar usuarios individuales.",
  },
  {
    title: "4. Registros del servidor",
    content:
      "Nuestros servidores registran automáticamente la dirección IP, tipo de navegador, páginas visitadas y fecha/hora de acceso. Estos datos se usan exclusivamente para seguridad y análisis técnico, y se eliminan periódicamente.",
  },
  {
    title: "5. Uso aceptable",
    content:
      "DylanMP3 está diseñado para contenido del que el usuario tiene derechos o disponible bajo licencias Creative Commons. No somos responsables del uso indebido del servicio para descargar contenido protegido por derechos de autor sin autorización.",
  },
  {
    title: "6. Contacto",
    content:
      "Si tienes preguntas sobre esta política, puedes contactarnos a través de la página principal del sitio.",
  },
];

export default function Privacidad() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad — DylanMP3</title>
        <meta name="description" content="Política de privacidad de DylanMP3. Información sobre cookies, AdSense y datos que recopilamos." />
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
            <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
            <p className="text-white/40 text-sm">Última actualización: enero 2025</p>
          </div>
          <p className="text-white/50 leading-relaxed text-sm">
            En DylanMP3 nos tomamos tu privacidad en serio. Esta política describe qué
            información recopilamos, cómo la usamos y los derechos que tienes sobre ella.
          </p>
          <div className="space-y-4">
            {SECTIONS.map((s) => (
              <div key={s.title} className="bg-card border border-white/10 rounded-xl p-5 space-y-2">
                <h2 className="text-sm font-semibold text-white">{s.title}</h2>
                <p className="text-white/40 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
