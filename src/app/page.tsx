"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EntryForm } from "@/components/EntryForm";
import { EntryPill } from "@/components/EntryPill";
import { EmojiPalette } from "@/components/EmojiPalette";

type Entry = {
  id: string;
  date: string;
  emotionPrimary: string;
  emotionIntensity: number;
  csiText: string;
  doingsText: string;
  reflectionText: string;
  domains: { domain: string }[];
  context?: string | null;
};

export default function HomePage() {
  const [today] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(today);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [draggedEmoji, setDraggedEmoji] = useState<string | null>(null);

  const refresh = async () => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(currentDate);
    end.setHours(23, 59, 59, 999);
    
    const res = await fetch(
      `/api/entries?from=${start.toISOString()}&to=${end.toISOString()}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setEntries(data);
  };

  useEffect(() => {
    void refresh();
  }, [currentDate]);

  const handleDayDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData("emoji");
    const emotion = e.dataTransfer.getData("emotion");
    
    if (!emoji) return;
    
    // Abrir formulario con emoción pre-seleccionada
    setSelectedDate(targetDate);
    setSelectedEntry(null);
    setDraggedEmoji(emoji);
    setOpen(true);
  };

  const handleDayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Panel lateral con emojis */}
      <EmojiPalette
        onEmojiDragStart={(emoji) => setDraggedEmoji(emoji)}
        onEmojiDragEnd={() => setDraggedEmoji(null)}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Navegación del día */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate(-1)}
                className="rounded-lg px-4 py-2 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-slate-700"
                aria-label="Día anterior"
              >
                ‹
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
                  {format(currentDate, "EEEE, d 'de' MMMM", { locale: es })}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {format(currentDate, "yyyy")}
                </p>
              </div>
              <button
                onClick={() => navigateDate(1)}
                className="rounded-lg px-4 py-2 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-slate-700"
                aria-label="Día siguiente"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentDate(today)}
                className="rounded-lg px-3 py-1 text-sm bg-brand text-white hover:bg-brand/90 transition-all"
              >
                Hoy
              </button>
            </div>
            <button
              className="rounded-lg bg-gradient-to-r from-brand to-pink-500 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => {
                setSelectedDate(currentDate);
                setSelectedEntry(null);
                setOpen(true);
              }}
            >
              Nueva entrada
            </button>
          </div>

          {/* Área de drop del día */}
          <div
            onDrop={(e) => handleDayDrop(e, currentDate)}
            onDragOver={handleDayDragOver}
            className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
              draggedEmoji
                ? "border-brand bg-brand/5 shadow-lg"
                : "border-slate-300 bg-white/50 hover:border-purple-300"
            }`}
          >
            {draggedEmoji && (
              <div className="text-center text-brand font-medium mb-4 animate-pulse">
                Suelta el emoji aquí para crear una entrada
              </div>
            )}
            
            <div className="text-sm text-slate-600 mb-4">
              {entries.length === 0
                ? "Arrastra emojis aquí o haz click en 'Nueva entrada' para comenzar"
                : `${entries.length} entrada${entries.length > 1 ? "s" : ""} este día`}
            </div>

            {/* Entradas del día */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries.map((entry) => (
                <EntryPill
                  key={entry.id}
                  {...entry}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    setSelectedEntry(entry);
                    setSelectedDate(new Date(entry.date));
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "zoomIn 0.2s ease-out" }}
          >
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
                {selectedEntry ? "Editar entrada" : "Nueva entrada"}
              </h2>
              <button
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95 text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <EntryForm
              entryId={selectedEntry?.id}
              defaultDate={selectedDate || currentDate}
              defaultEmotion={draggedEmoji ? getEmotionFromEmoji(draggedEmoji) : undefined}
              onSaved={() => {
                setOpen(false);
                setDraggedEmoji(null);
                void refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getEmotionFromEmoji(emoji: string): string {
  const emojiToEmotion: Record<string, string> = {
    "😊": "alegría",
    "😨": "miedo",
    "😠": "rabia",
    "😔": "tristeza",
    "😌": "calma",
    "😰": "ansiedad",
    "✨": "esperanza",
    "😴": "cansancio",
    "🤔": "reflexión",
    "💪": "fuerza",
    "❤️": "amor",
    "🙏": "gratitud",
  };
  return emojiToEmotion[emoji] || "emocional";
}
