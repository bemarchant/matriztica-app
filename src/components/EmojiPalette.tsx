"use client";
import React, { useEffect, useState } from "react";

type Props = {
  onEmojiDragStart: (emoji: string) => void;
  onEmojiDragEnd: () => void;
};

// Emojis básicos
const BASIC_EMOJIS = [
  { emoji: "😊", name: "alegría", emotion: "alegría" },
  { emoji: "😨", name: "miedo", emotion: "miedo" },
  { emoji: "😠", name: "rabia", emotion: "rabia" },
  { emoji: "😔", name: "tristeza", emotion: "tristeza" },
  { emoji: "😌", name: "calma", emotion: "calma" },
  { emoji: "😰", name: "ansiedad", emotion: "ansiedad" },
  { emoji: "✨", name: "esperanza", emotion: "esperanza" },
  { emoji: "😴", name: "cansancio", emotion: "cansancio" },
  { emoji: "🤔", name: "reflexión", emotion: "reflexión" },
  { emoji: "💪", name: "fuerza", emotion: "fuerza" },
  { emoji: "❤️", name: "amor", emotion: "amor" },
  { emoji: "🙏", name: "gratitud", emotion: "gratitud" },
];

export function EmojiPalette({ onEmojiDragStart, onEmojiDragEnd }: Props) {
  const [mostUsed, setMostUsed] = useState<string[]>([]);

  useEffect(() => {
    // Obtener emojis más usados desde la API
    fetch("/api/entries")
      .then((res) => res.json())
      .then((entries: any[]) => {
        const counts = new Map<string, number>();
        entries.forEach((entry) => {
          const emoji = getEmojiForEmotion(entry.emotionPrimary);
          counts.set(emoji, (counts.get(emoji) || 0) + 1);
        });
        const sorted = Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([emoji]) => emoji);
        setMostUsed(sorted);
      })
      .catch(() => {});
  }, []);

  const handleDragStart = (e: React.DragEvent, emoji: string, emotion: string) => {
    e.dataTransfer.setData("emoji", emoji);
    e.dataTransfer.setData("emotion", emotion);
    e.dataTransfer.effectAllowed = "move";
    onEmojiDragStart(emoji);
  };

  const handleDragEnd = () => {
    onEmojiDragEnd();
  };

  const allEmojis = [
    ...mostUsed.map((emoji) => {
      const found = BASIC_EMOJIS.find((e) => e.emoji === emoji);
      return found || { emoji, name: "emoji", emotion: "emocional" };
    }),
    ...BASIC_EMOJIS.filter((e) => !mostUsed.includes(e.emoji)),
  ];

  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-purple-100 overflow-y-auto p-4">
      <h3 className="font-semibold text-sm text-slate-800 mb-3 sticky top-0 bg-white/90 backdrop-blur-sm pb-2 border-b border-purple-100">
        ✨ Emojis
      </h3>
      
      {mostUsed.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-2">Más usados</div>
          <div className="flex flex-wrap gap-2">
            {mostUsed.map((emoji) => {
              const info = BASIC_EMOJIS.find((e) => e.emoji === emoji);
              if (!info) return null;
              return (
                <button
                  key={emoji}
                  draggable
                  onDragStart={(e) => handleDragStart(e, emoji, info.emotion)}
                  onDragEnd={handleDragEnd}
                  className="text-2xl p-2 rounded-lg hover:bg-purple-50 transition-all duration-200 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing border border-transparent hover:border-purple-200"
                  title={info.name}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500 mb-2">Todos</div>
      <div className="flex flex-wrap gap-2">
        {allEmojis.map((item) => (
          <button
            key={`${item.emoji}-${item.name}`}
            draggable
            onDragStart={(e) => handleDragStart(e, item.emoji, item.emotion)}
            onDragEnd={handleDragEnd}
            className="text-2xl p-2 rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing"
            title={item.name}
          >
            {item.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function getEmojiForEmotion(emotion: string): string {
  const key = emotion.toLowerCase();
  if (key.includes("alegr")) return "😊";
  if (key.includes("miedo")) return "😨";
  if (key.includes("rabia")) return "😠";
  if (key.includes("triste")) return "😔";
  if (key.includes("calma")) return "😌";
  if (key.includes("ansiedad")) return "😰";
  if (key.includes("esperanza")) return "✨";
  return "🙂";
}

