import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "1. Información que recopilamos",
    content:
      "VidSnap no requiere registro ni almacena datos personales identificables. Las URLs de YouTube que introduces se procesan en nuestro servidor únicamente para generar el archivo descargable y se eliminan de nuestra memoria una vez completado el proceso. Los archivos generados se eliminan automáticamente de nuestros servidores a los 30 minutos.",
  },
  {
    title: "2. Cookies y publicidad",
    content:
      "Utilizamos Google AdSense para mostrar anuncios relevantes. AdSense puede utilizar cookies para personalizar los anuncios según tus intereses. Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador. Para más información sobre cómo Google utiliza tus datos, visita la Política de Privacidad de Google.",
  },
  {
    title: "3. Registros del servidor",
    content:
      "Nuestros servidores pueden registrar automáticamente información estándar como la dirección IP, el tipo de navegador, las páginas visitadas y la fecha/hora de acceso. Estos datos se usan exclusivamente para análisis técnicos y detección de abusos, y nunca se venden ni comparten con terceros.",
  },
  {
    title: "4. Uso aceptable",
    content:
      "VidSnap está diseñado para descargar contenido del que el usuario tiene derechos o que está disponible bajo licencias Creative Commons. No nos hacemos responsables del uso indebido del servicio para descargar contenido protegido por derechos de autor sin autorización.",
  },
  {
    title: "5. Cambios a esta política",
    content:
      "Podemos actualizar esta política de privacidad ocasionalmente. Te recomendamos revisarla periódicamente. El uso continuado del servicio tras cualquier cambio implica tu aceptación de la política actualizada.",
  },
  {
    title: "6. Contacto",
    content:
      "Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de nuestra página web.",
  },
];

export default function Privacidad() {
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
          <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-white/40 text-sm">Última actualización: enero 2025</p>
        </div>

        <p className="text-white/60 leading-relaxed">
          En VidSnap nos tomamos tu privacidad en serio. Esta política describe qué información
          recopilamos, cómo la usamos y qué derechos tienes sobre ella.
        </p>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-card border border-white/10 rounded-xl p-6 space-y-2">
              <h2 className="text-base font-semibold text-white">{section.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-white/20 space-x-4">
        <Link to="/" className="hover:text-white/50 transition-colors">Inicio</Link>
        <Link to="/terminos" className="hover:text-white/50 transition-colors">Términos de uso</Link>
      </footer>
    </div>
  );
}
