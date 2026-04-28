const OPTIONS = [
  {
    id: "mp3-best",
    format: "mp3",
    quality: "best",
    label: "MP3 Audio",
    sublabel: "320 kbps",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    selectedClass: "border-accent/70 bg-accent/10",
    dotClass: "bg-accent",
  },
  {
    id: "mp4-1080",
    format: "mp4",
    quality: "1080",
    label: "MP4 Full HD",
    sublabel: "1080p",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    selectedClass: "border-white/30 bg-white/5",
    dotClass: "bg-white",
  },
  {
    id: "mp4-480",
    format: "mp4",
    quality: "480",
    label: "MP4 SD",
    sublabel: "480p",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    selectedClass: "border-white/20 bg-white/5",
    dotClass: "bg-white/60",
  },
];

export default function FormatSelector({ selected, onChange, forcedFormat }) {
  const options = forcedFormat
    ? OPTIONS.filter((o) => o.format === forcedFormat)
    : OPTIONS;

  return (
    <div className={`grid grid-cols-1 gap-3 ${options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {options.map((opt) => {
        const isSelected = selected?.id === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left
              ${isSelected
                ? opt.selectedClass + " shadow-lg"
                : "border-white/10 bg-card hover:border-white/20 hover:bg-white/5"
              }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                ${isSelected ? "border-current" : "border-white/20"}`}
            >
              {isSelected && <div className={`w-2 h-2 rounded-full ${opt.dotClass}`} />}
            </div>
            <span className={isSelected ? "text-white" : "text-white/40"}>
              {opt.icon}
            </span>
            <div>
              <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-white/70"}`}>
                {opt.label}
              </p>
              <p className={`text-xs ${isSelected ? "text-white/70" : "text-white/30"}`}>
                {opt.sublabel}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
