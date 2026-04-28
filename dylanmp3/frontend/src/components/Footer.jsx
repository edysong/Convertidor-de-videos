import { Link } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/youtube-a-mp3", label: "YouTube a MP3" },
  { to: "/descargar-shorts-youtube", label: "Descargar Shorts" },
  { to: "/privacidad", label: "Privacidad" },
  { to: "/terminos", label: "Términos" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        {/* Navegación */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-white/30 hover:text-white/70 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright con keywords */}
        <p className="text-xs text-white/20 text-center">
          © 2025 DylanMP3 — Descarga YouTube a MP3 y MP4 gratis en Colombia
        </p>

        <p className="text-xs text-white/15 text-center max-w-md">
          DylanMP3 no almacena videos ni audios. Los archivos se eliminan automáticamente
          tras la descarga. Úsalo solo con contenido que tengas derecho a descargar.
        </p>
      </div>
    </footer>
  );
}
