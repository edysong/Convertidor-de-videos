const STEPS = [
  {
    num: "1",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Copia el enlace",
    desc: "Copia el enlace del video de YouTube o Short que quieras descargar.",
  },
  {
    num: "2",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    title: "Elige el formato",
    desc: "Selecciona MP3 para música o MP4 para guardar el video completo.",
  },
  {
    num: "3",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Descarga gratis",
    desc: "Descarga directo a tu celular o computadora, sin registro ni aplicaciones.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-14 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">
            ¿Cómo bajar música de YouTube gratis?
          </h2>
          <p className="text-white/40 text-sm">Tres pasos. Sin complicaciones.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="bg-card border border-white/10 rounded-2xl p-6 space-y-3 text-center hover:border-accent/30 transition-colors"
            >
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  {step.icon}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-accent/70 uppercase tracking-widest">
                  Paso {step.num}
                </span>
              </div>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Párrafo rico en keywords para posicionamiento orgánico */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 text-sm text-white/50 leading-relaxed">
          <p>
            <strong className="text-white/70">DylanMP3</strong> es la herramienta más rápida para{" "}
            <strong className="text-white/70">descargar videos de YouTube</strong> en Colombia y Latinoamérica.
            Compatible con videos normales, <strong className="text-white/70">YouTube Shorts</strong> y listas
            de reproducción. Convierte <strong className="text-white/70">YouTube a MP3</strong> en segundos
            con calidad de <strong className="text-white/70">320 kbps</strong>. Sin registro, sin aplicaciones,
            completamente gratis. Funciona desde el navegador en{" "}
            <strong className="text-white/70">celular Android, iPhone</strong> y computadora.
          </p>
        </div>
      </div>
    </section>
  );
}
