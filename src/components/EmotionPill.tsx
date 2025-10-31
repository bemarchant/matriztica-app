type Props = { name: string; intensity?: number };

export function EmotionPill({ name, intensity }: Props) {
  const emoji = getEmoji(name);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow">
      <span aria-hidden>{emoji}</span>
      <span>{name}</span>
      {typeof intensity === "number" && (
        <span aria-label="intensidad" className="text-xs text-slate-500">
          {intensity}/5
        </span>
      )}
    </span>
  );
}

function getEmoji(name: string) {
  const key = name.toLowerCase();
  if (key.includes("alegr")) return "😊";
  if (key.includes("miedo")) return "😨";
  if (key.includes("rabia")) return "😠";
  if (key.includes("triste")) return "😔";
  if (key.includes("calma")) return "😌";
  return "🙂";
}


