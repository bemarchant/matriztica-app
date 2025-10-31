type Props = {
  id: string;
  emotionPrimary: string;
  emotionIntensity: number;
  csiText: string;
  doingsText: string;
  reflectionText: string;
  domains: { domain: string }[];
  context?: string | null;
  onClick?: (e: React.MouseEvent) => void;
};

type EmotionColor = {
  bg: string;
  border: string;
  text: string;
  hover: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
};

const emotionColors: Record<string, EmotionColor> = {
  alegría: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-800",
    hover: "hover:border-yellow-400 hover:bg-yellow-100",
    bgHex: "#fefce8",
    borderHex: "#fde047",
    textHex: "#854d0e",
  },
  miedo: {
    bg: "bg-purple-50",
    border: "border-purple-300",
    text: "text-purple-800",
    hover: "hover:border-purple-400 hover:bg-purple-100",
    bgHex: "#faf5ff",
    borderHex: "#c084fc",
    textHex: "#7c3aed",
  },
  rabia: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-800",
    hover: "hover:border-red-400 hover:bg-red-100",
    bgHex: "#fef2f2",
    borderHex: "#fca5a5",
    textHex: "#991b1b",
  },
  tristeza: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-800",
    hover: "hover:border-blue-400 hover:bg-blue-100",
    bgHex: "#eff6ff",
    borderHex: "#93c5fd",
    textHex: "#1e40af",
  },
  calma: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-800",
    hover: "hover:border-green-400 hover:bg-green-100",
    bgHex: "#f0fdf4",
    borderHex: "#86efac",
    textHex: "#166534",
  },
  ansiedad: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    text: "text-orange-800",
    hover: "hover:border-orange-400 hover:bg-orange-100",
    bgHex: "#fff7ed",
    borderHex: "#fdba74",
    textHex: "#9a3412",
  },
  esperanza: {
    bg: "bg-indigo-50",
    border: "border-indigo-300",
    text: "text-indigo-800",
    hover: "hover:border-indigo-400 hover:bg-indigo-100",
    bgHex: "#eef2ff",
    borderHex: "#a5b4fc",
    textHex: "#4338ca",
  },
};

function getEmotionColor(emotion: string): EmotionColor {
  const key = emotion.toLowerCase();
  for (const [emotionName, color] of Object.entries(emotionColors)) {
    if (key.includes(emotionName)) {
      return color;
    }
  }
  return {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-800",
    hover: "hover:border-slate-400 hover:bg-slate-100",
    bgHex: "#f8fafc",
    borderHex: "#cbd5e1",
    textHex: "#1e293b",
  };
}

export function EntryPill({
  id,
  emotionPrimary,
  emotionIntensity,
  csiText,
  doingsText,
  reflectionText,
  domains,
  context,
  onClick,
}: Props) {
  const emoji = getEmoji(emotionPrimary);
  const colors = getEmotionColor(emotionPrimary);
  const domainLabels: Record<string, string> = {
    tecnico: "Técnico",
    emocional: "Emocional",
    relacional: "Relacional",
  };

  // Intensidad afecta la opacidad y el tamaño del borde
  const intensityOpacity = 0.6 + (emotionIntensity / 5) * 0.4;
  const intensityBorder = emotionIntensity >= 4 ? "border-2" : "border";

  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex flex-col gap-1 rounded-lg ${intensityBorder} p-2 text-left shadow-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 ${colors.border} ${colors.hover}`}
      style={{ 
        opacity: intensityOpacity,
        backgroundColor: colors.bgHex,
        borderColor: colors.borderHex,
        color: colors.textHex,
      }}
      aria-label={`Entrada: ${emotionPrimary} (${emotionIntensity}/5)`}
    >
      <div className="flex items-center gap-2" style={{ color: colors.textHex }}>
        <span className="text-lg transition-transform duration-200 group-hover:scale-110" aria-hidden>
          {emoji}
        </span>
        <span className="font-medium text-sm">{emotionPrimary}</span>
        <span className="text-xs opacity-70">{emotionIntensity}/5</span>
      </div>

      {context && (
        <div className="text-xs opacity-80 line-clamp-1" style={{ color: colors.textHex }}>
          {context}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-1">
        {domains.map((d) => (
          <span
            key={d.domain}
            className="text-xs px-1.5 py-0.5 rounded bg-white/60 backdrop-blur-sm text-slate-700 border border-white/50"
          >
            {domainLabels[d.domain] || d.domain}
          </span>
        ))}
      </div>

      {/* Tooltip mejorado con animación */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64 p-3 bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-purple-500/20">
        <div className="font-semibold mb-2 flex items-center gap-2">
          <span>{emoji}</span>
          <span>{emotionPrimary}</span>
        </div>
        <div className="space-y-1 mb-2">
          <div>
            <span className="text-slate-400">Sentir:</span>{" "}
            <span className="line-clamp-2">{csiText}</span>
          </div>
          <div>
            <span className="text-slate-400">Hacer:</span>{" "}
            <span className="line-clamp-2">{doingsText}</span>
          </div>
          <div>
            <span className="text-slate-400">Emocionar:</span>{" "}
            <span className="line-clamp-2">{reflectionText}</span>
          </div>
        </div>
        <div className="text-slate-400 text-xs border-t border-slate-700 pt-2 mt-2">
          Click para editar
        </div>
      </div>
    </button>
  );
}

function getEmoji(name: string) {
  const key = name.toLowerCase();
  if (key.includes("alegr")) return "😊";
  if (key.includes("miedo")) return "😨";
  if (key.includes("rabia")) return "😠";
  if (key.includes("triste")) return "😔";
  if (key.includes("calma")) return "😌";
  if (key.includes("ansiedad")) return "😰";
  if (key.includes("esperanza")) return "✨";
  return "🙂";
}
