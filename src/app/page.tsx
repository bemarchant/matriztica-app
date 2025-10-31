"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EntryForm } from "@/components/EntryForm";
import { EntryPill } from "@/components/EntryPill";
import { ExperiencePalette, type ChipData } from "@/components/ExperiencePalette";

type Entry = {
  id: string;
  date: string;
  emotionPrimary: string;
  doingsText: string;
  reflectionText: string;
  context?: string | null;
};

export default function HomePage() {
  const [today] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [selectedChip, setSelectedChip] = useState<ChipData | null>(null);

  const refresh = async () => {
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const chipType = e.dataTransfer.getData("chipType");
    const chipValue = e.dataTransfer.getData("chipValue");
    const chipLabel = e.dataTransfer.getData("chipLabel");
    const chipEmoji = e.dataTransfer.getData("chipEmoji");
    const chipPrompt = e.dataTransfer.getData("chipPrompt");
    
    if (!chipType) return;
    
    const chip: ChipData = {
      type: chipType as ChipData["type"],
      label: chipLabel,
      value: chipValue,
      emoji: chipEmoji || undefined,
      prompt: chipPrompt || undefined,
    };
    
    setSelectedDate(today);
    setSelectedEntry(null);
    setSelectedChip(chip);
    setOpen(true);
  };

  const handleDayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleChipClick = (chip: ChipData) => {
    setSelectedDate(today);
    setSelectedEntry(null);
    setSelectedChip(chip);
    setOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Panel lateral con chips */}
      <ExperiencePalette
        onChipClick={handleChipClick}
        onChipDragStart={() => {}}
        onChipDragEnd={() => {}}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Encabezado del día */}
          <div className="flex items-center justify-between">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
                {format(today, "EEEE, d 'de' MMMM", { locale: es })}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {format(today, "yyyy")}
              </p>
            </div>
            <button
              className="rounded-lg bg-gradient-to-r from-brand to-pink-500 px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => {
                setSelectedDate(today);
                setSelectedEntry(null);
                setSelectedChip(null);
                setOpen(true);
              }}
            >
              Nueva experiencia 🌈
            </button>
          </div>

          {/* Área de drop del día */}
          <div
            onDrop={handleDayDrop}
            onDragOver={handleDayDragOver}
            className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
              selectedChip
                ? "border-brand bg-brand/5 shadow-lg"
                : "border-slate-300 bg-white/50 hover:border-purple-300"
            }`}
          >
            {selectedChip && (
              <div className="text-center text-brand font-medium mb-4 animate-pulse">
                Suelta el chip aquí para crear una experiencia
              </div>
            )}
            
            <div className="text-sm text-slate-600 mb-4">
              {entries.length === 0
                ? "Arrastra chips aquí o haz click en 'Nueva experiencia 🌈' para comenzar"
                : `${entries.length} experiencia${entries.length > 1 ? "s" : ""} hoy`}
            </div>

            {/* Experiencias del día */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {entries.map((entry) => (
                <EntryPill
                  key={entry.id}
                  {...entry}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    setSelectedEntry(entry);
                    setSelectedDate(new Date(entry.date));
                    setSelectedChip(null);
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
                {selectedEntry ? "Editar experiencia" : "Nueva experiencia 🌈"}
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
              defaultDate={selectedDate || today}
              defaultChip={selectedChip || undefined}
              onSaved={() => {
                setOpen(false);
                setSelectedChip(null);
                void refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
