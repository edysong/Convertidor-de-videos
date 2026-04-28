/**
 * Muestra las opciones de descarga cuando cobalt devuelve status "picker"
 * (múltiples streams disponibles, ej. video sin audio + audio separado).
 *
 * Props:
 *   items   — array de { url: string, type: string }
 *   onClose — callback para cerrar/resetear
 */
export default function PickerCard({ items, onClose }) {
  const typeLabel = (type) =>
    ({ video: "Video", audio: "Audio", photo: "Imagen" }[type] ?? type);

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5 mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/80">
          Hay varios streams disponibles. Elige cuál descargar:
        </p>
        <button onClick={onClose} className="text-white/30 hover:text-white text-xs underline">
          Cancelar
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all text-sm group"
          >
            <span className="text-white/70 group-hover:text-white transition-colors">
              {typeLabel(item.type)} #{i + 1}
            </span>
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
