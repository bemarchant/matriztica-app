import { getEmojiForEmotion, getEmotionNameWithoutEmoji } from "@/lib/emoji-utils";

type Props = {
  id: string;
  date: string;
  emotionPrimary: string;
  doingsText: string;
  reflectionText: string;
  context?: string | null;
  onClick?: (e: React.MouseEvent) => void;
  compact?: boolean; // Para mostrar solo emoji (usado en calendario)
};

export function EntryPill({
  id,
  date,
  emotionPrimary,
  doingsText,
  reflectionText,
  context,
  onClick,
  compact = false,
}: Props) {
  // Extraer emoji del campo sentir (puede ser "😊 alegría", solo "😊", o solo "alegría")
  const emoji = getEmojiForEmotion(emotionPrimary);
  const sentirText = getEmotionNameWithoutEmoji(emotionPrimary);

  // Versión compacta: solo emoji (para calendario)
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="text-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label={`Experiencia: ${sentirText}`}
        title={sentirText}
      >
        {emoji}
      </button>
    );
  }

  // Versión completa: card con todos los detalles (para vista diaria)
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex flex-col gap-2 rounded-lg border-2 p-4 text-left shadow-sm transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 bg-white border-slate-200 hover:border-brand hover:shadow-md"
      aria-label={`Experiencia: ${sentirText}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
          <span className="font-medium text-sm text-slate-800">{sentirText}</span>
        </div>
      </div>

      {context && (
        <div className="text-xs text-slate-600">
          <span className="font-medium">Lugar:</span> {context}
        </div>
      )}

      {reflectionText && (
        <div className="text-xs text-slate-600">
          <span className="font-medium">Relación:</span> {reflectionText}
        </div>
      )}

      {doingsText && (
        <div className="text-xs text-slate-600 line-clamp-2">
          <span className="font-medium">Actividad:</span> {doingsText}
        </div>
      )}

      {/* Tooltip con más detalles */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64 p-3 bg-slate-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-purple-500/20">
        <div className="font-semibold mb-2 flex items-center gap-2">
          <span>{emoji}</span>
          <span>{sentirText}</span>
        </div>
        {context && (
          <div className="mb-1">
            <span className="text-slate-400">Lugar:</span> {context}
          </div>
        )}
        {reflectionText && (
          <div className="mb-1">
            <span className="text-slate-400">Relación:</span> {reflectionText}
          </div>
        )}
        {doingsText && (
          <div className="mb-1">
            <span className="text-slate-400">Actividad:</span> {doingsText}
          </div>
        )}
        <div className="text-slate-400 text-xs border-t border-slate-700 pt-2 mt-2">
          Click para editar
        </div>
      </div>
    </button>
  );
}
