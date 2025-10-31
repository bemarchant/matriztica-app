"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { EntryForm } from "@/components/EntryForm";
import { EntryPill } from "@/components/EntryPill";
import { getEmojiForEmotion } from "@/lib/emoji-utils";
import { ExperiencePalette, type ChipData } from "@/components/ExperiencePalette";

type Entry = {
  id: string;
  date: string;
  emotionPrimary?: string | null;
  emotionIntensity?: number | null;
  csiText?: string | null;
  doingsText?: string | null;
  reflectionText?: string | null;
  context?: string | null;
  bienestar?: number;
};

export default function CalendarPage() {
  const [today] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(today);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChip, setSelectedChip] = useState<ChipData | null>(null);

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const res = await fetch(
      `/api/entries?from=${start.toISOString()}&to=${end.toISOString()}`
    );
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }, [currentMonth]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const dayEntries = (d: Date) => {
    const key = format(d, "yyyy-MM-dd");
    return entries.filter((e) => e.date.slice(0, 10) === key);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEntry(null);
    setOpen(true);
  };

  const handlePillClick = (entry: Entry, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    setSelectedDate(new Date(entry.date));
    setOpen(true);
  };

  const handleDayDrop = (e: React.DragEvent, date: Date) => {
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
    
    setSelectedDate(date);
    setSelectedEntry(null);
    setSelectedChip(chip);
    setOpen(true);
  };

  const handleDayDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isCurrentMonth = (date: Date) => {
    return format(date, "yyyy-MM") === format(currentMonth, "yyyy-MM");
  };

  const isToday = (date: Date) => {
    return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Panel lateral con chips */}
      <ExperiencePalette
        onChipClick={(chip) => {
          setSelectedDate(today);
          setSelectedEntry(null);
          setSelectedChip(chip);
          setOpen(true);
        }}
        onChipDragStart={() => {}}
        onChipDragEnd={() => {}}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="rounded-lg px-4 py-2 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-slate-700"
                aria-label="Mes anterior"
              >
                ‹
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </h1>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="rounded-lg px-4 py-2 hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95 font-medium text-slate-700"
                aria-label="Mes siguiente"
              >
                ›
              </button>
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

          {/* Encabezados de días */}
          <div className="grid grid-cols-7 gap-2">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-slate-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((d, index) => {
              const dayEntriesList = dayEntries(d);
              const isCurrent = isCurrentMonth(d);
              const isTodayDate = isToday(d);

              return (
                <div
                  key={d.toISOString()}
                  onClick={() => handleDayClick(d)}
                  onDrop={(e) => handleDayDrop(e, d)}
                  onDragOver={handleDayDragOver}
                  className={`min-h-[120px] rounded-lg border-2 p-2 shadow-sm transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${
                    isCurrentMonth(d)
                      ? selectedChip
                        ? "bg-brand/5 border-brand shadow-md"
                        : "bg-white border-slate-200 hover:border-brand hover:shadow-md"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  } ${
                    isTodayDate
                      ? "ring-2 ring-brand ring-offset-2 bg-brand/5 border-brand"
                      : ""
                  }`}
                  style={{
                    animationDelay: `${index * 10}ms`,
                  }}
                >
                  <div
                    className={`mb-1 text-xs font-medium transition-colors ${
                      isTodayDate
                        ? "text-brand font-bold bg-brand/10 rounded-full w-6 h-6 flex items-center justify-center"
                        : "text-slate-500"
                    }`}
                  >
                    {format(d, "d")}
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayEntriesList.slice(0, 6).map((e, idx) => {
                      const emoji = getEmojiForEmotion(e.emotionPrimary || "");
                      return (
                        <button
                          key={e.id}
                          onClick={(evt) => handlePillClick(e, evt)}
                          className="text-xl transition-all duration-200 hover:scale-110 active:scale-95"
                          title={e.emotionPrimary || "Experiencia"}
                          style={{
                            animationDelay: `${idx * 50}ms`,
                          }}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                    {dayEntriesList.length > 6 && (
                      <div className="text-xs text-slate-500 text-center py-1 font-medium">
                        +{dayEntriesList.length - 6} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal con animación */}
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

