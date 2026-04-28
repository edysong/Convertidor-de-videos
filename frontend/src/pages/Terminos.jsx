import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "1. Aceptación de los términos",
    content:
      "Al acceder y usar VidSnap, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguno de estos términos, no debes usar el servicio.",
  },
  {
    title: "2. Descripción del servicio",
    content:
      "VidSnap es una herramienta que permite a los usuarios descargar videos de YouTube en formatos MP4 y MP3 para uso personal. El servicio es gratuito y no requiere registro.",
  },
  {
    title: "3. Uso permitido",
    content:
      "Puedes usar VidSnap para descargar: (a) videos de tu propia autoría, (b) videos con licencia Creative Commons que permitan la descarga, (c) contenido para el que tienes permiso explícito del titular de los derechos. El servicio está destinado únicamente al uso personal y no comercial.",
  },
  {
    title: "4. Prohibiciones",
    content:
      "Está prohibido usar VidSnap para: descargar contenido protegido por derechos de autor sin autorización, redistribuir o vender el contenido descargado, usar el servicio de forma automatizada o masiva, intentar superar las limitaciones técnicas del servicio, o realizar cualquier actividad que infrinja las leyes aplicables.",
  },
  {
    title: "5. Propiedad intelectual y derechos de autor",
    content:
      "VidSnap no almacena ni distribuye el contenido de YouTube. Actuamos como intermediario técnico. El usuario es el único responsable de garantizar que tiene los derechos necesarios para descargar y usar el contenido. El uso de este servicio para infringir derechos de autor está estrictamente prohibido y podría resultar en responsabilidad legal para el usuario.",
  },
  {
    title: "6. Limitación de responsabilidad",
    content:
      "VidSnap se proporciona 'tal cual', sin garantías de ningún tipo. No somos responsables por: interrupciones del servicio, pérdida de datos, uso indebido del servicio por parte de los usuarios, o cualquier daño directo, indirecto o consecuente derivado del uso del servicio.",
  },
  {
    title: "7. Limitación de velocidad",
    content:
      "Para garantizar la disponibilidad del servicio para todos los usuarios, aplicamos un límite de 5 descargas por IP cada 15 minutos. Las solicitudes que excedan este límite serán rechazadas temporalmente.",
  },
  {
    title: "8. Modificaciones",
    content:
      "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigor inmediatamente tras su publicación. El uso continuado del servicio implica la aceptación de los términos actualizados.",
  },
  {
    title: "9. Ley aplicable",
    content:
      "Estos términos se rigen por las leyes aplicables en la jurisdicción del usuario. Cualquier disputa será resuelta en los tribunales competentes.",
  },
];

export default function Terminos() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">VidSnap</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Términos de Uso</h1>
          <p className="text-white/40 text-sm">Última actualización: enero 2025</p>
        </div>

        <p className="text-white/60 leading-relaxed">
          Por favor, lee estos Términos de Uso cuidadosamente antes de usar VidSnap. Al usar el
          servicio, confirmas que has leído, entendido y aceptado estos términos.
        </p>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-card border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-base font-semibold text-white">{section.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Aviso destacado */}
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-5">
          <p className="text-danger text-sm font-medium mb-1">Aviso importante</p>
          <p className="text-white/50 text-sm leading-relaxed">
            Descargar videos de YouTube sin autorización puede violar los Términos de Servicio de
            YouTube y las leyes de derechos de autor de tu país. Usa este servicio de manera
            responsable y solo para contenido que tengas derecho a descargar.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-white/20 space-x-4">
        <Link to="/" className="hover:text-white/50 transition-colors">Inicio</Link>
        <Link to="/privacidad" className="hover:text-white/50 transition-colors">Política de privacidad</Link>
      </footer>
    </div>
  );
}
