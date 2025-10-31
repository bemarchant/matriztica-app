"use client";
import React from "react";

// Tipos de chips disponibles
export type ChipType = "operacion" | "relacion" | "lugar" | "emocion";

export interface ChipData {
  type: ChipType;
  label: string;
  emoji?: string;
  value: string;
  prompt?: string; // Prompt pedagógico contextual
}

type Props = {
  onChipClick: (chip: ChipData) => void;
  onChipDragStart: (chip: ChipData) => void;
  onChipDragEnd: () => void;
};

// Datos de ejemplo para cada categoría
export const OPERACIONES: ChipData[] = [
  { type: "operacion", emoji: "🏃", label: "correr", value: "correr", prompt: "¿Qué coherencias reconozco entre sentir–hacer–decir al correr?" },
  { type: "operacion", emoji: "📝", label: "escribir", value: "escribir", prompt: "¿Desde qué emoción estoy escribiendo?" },
  { type: "operacion", emoji: "💬", label: "conversar", value: "conversar", prompt: "¿Qué conversación necesito abrir (y con quién)?" },
  { type: "operacion", emoji: "🧘", label: "meditar", value: "meditar", prompt: "¿Qué cuido de mí en este momento?" },
  { type: "operacion", emoji: "🎨", label: "crear", value: "crear", prompt: "¿Qué coherencias reconozco entre sentir–hacer–crear?" },
  { type: "operacion", emoji: "📚", label: "estudiar", value: "estudiar", prompt: "¿Qué gatilló esto en mí (sin culpar afuera)?" },
];

export const RELACIONES: ChipData[] = [
  { type: "relacion", emoji: "👤", label: "Yo mismo", value: "yo mismo", prompt: "Triple armonía: ¿qué cuido de mí?" },
  { type: "relacion", emoji: "👥", label: "Familia", value: "familia", prompt: "Triple armonía: ¿qué cuido de otros?" },
  { type: "relacion", emoji: "👫", label: "Pareja", value: "pareja", prompt: "¿Qué conversación necesito abrir?" },
  { type: "relacion", emoji: "👨‍💼", label: "Trabajo", value: "trabajo", prompt: "¿Qué coherencias reconozco entre sentir–hacer–decir?" },
  { type: "relacion", emoji: "👨‍🎓", label: "Estudio", value: "estudio", prompt: "Determinismo estructural: ¿qué gatilló esto?" },
  { type: "relacion", emoji: "🌍", label: "Entorno", value: "entorno", prompt: "Triple armonía: ¿qué cuido del entorno?" },
];

export const LUGARES: ChipData[] = [
  { type: "lugar", emoji: "📍", label: "Casa", value: "casa", prompt: "¿Qué coherencias reconozco en este lugar?" },
  { type: "lugar", emoji: "🏢", label: "Oficina", value: "oficina", prompt: "Determinismo estructural: ¿qué gatilló esto aquí?" },
  { type: "lugar", emoji: "🌳", label: "Parque", value: "parque", prompt: "Triple armonía: ¿qué cuido del entorno?" },
  { type: "lugar", emoji: "🏠", label: "Otro lugar", value: "otro lugar", prompt: "¿Qué coherencias reconozco entre sentir–hacer–decir?" },
];

export const EMOCIONES: ChipData[] = [
  { type: "emocion", emoji: "😊", label: "alegría", value: "alegría", prompt: "¿Desde qué emoción estoy hablando/actuando hoy?" },
  { type: "emocion", emoji: "😨", label: "miedo", value: "miedo", prompt: "Determinismo estructural: ¿qué gatilló esto en mí?" },
  { type: "emocion", emoji: "😠", label: "rabia", value: "rabia", prompt: "¿Qué conversación necesito abrir (y con quién)?" },
  { type: "emocion", emoji: "😔", label: "tristeza", value: "tristeza", prompt: "Triple armonía: ¿qué cuido de mí?" },
  { type: "emocion", emoji: "😌", label: "calma", value: "calma", prompt: "¿Qué coherencias reconozco entre sentir–hacer–decir?" },
  { type: "emocion", emoji: "😰", label: "ansiedad", value: "ansiedad", prompt: "Determinismo estructural: ¿qué gatilló esto?" },
  { type: "emocion", emoji: "✨", label: "esperanza", value: "esperanza", prompt: "¿Qué conservo y qué transformo?" },
  { type: "emocion", emoji: "😴", label: "cansancio", value: "cansancio", prompt: "Triple armonía: ¿qué cuido de mí?" },
  { type: "emocion", emoji: "🤔", label: "reflexión", value: "reflexión", prompt: "¿Qué coherencias reconozco?" },
  { type: "emocion", emoji: "💪", label: "fuerza", value: "fuerza", prompt: "¿Qué conservo y qué transformo?" },
  { type: "emocion", emoji: "❤️", label: "amor", value: "amor", prompt: "Triple armonía: ¿qué cuido de otros?" },
  { type: "emocion", emoji: "🙏", label: "gratitud", value: "gratitud", prompt: "¿Qué coherencias reconozco?" },
];

export function ExperiencePalette({ onChipClick, onChipDragStart, onChipDragEnd }: Props) {
  const handleDragStart = (e: React.DragEvent, chip: ChipData) => {
    e.dataTransfer.setData("chipType", chip.type);
    e.dataTransfer.setData("chipValue", chip.value);
    e.dataTransfer.setData("chipLabel", chip.label);
    e.dataTransfer.setData("chipEmoji", chip.emoji || "");
    e.dataTransfer.setData("chipPrompt", chip.prompt || "");
    e.dataTransfer.effectAllowed = "move";
    onChipDragStart(chip);
  };

  const handleDragEnd = () => {
    onChipDragEnd();
  };

  const handleClick = (chip: ChipData) => {
    onChipClick(chip);
  };

  const renderChip = (chip: ChipData) => {
    const isAvatar = chip.type === "relacion";
    const chipContent = (
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, chip)}
        onDragEnd={handleDragEnd}
        onClick={() => handleClick(chip)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing ${
          isAvatar
            ? "bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300"
            : "bg-white border-slate-200 hover:bg-slate-50 hover:border-brand hover:shadow-md"
        }`}
        title={chip.prompt || chip.label}
      >
        {chip.emoji && (
          <span className={`${isAvatar ? "text-lg" : "text-base"}`}>{chip.emoji}</span>
        )}
        <span className="text-sm font-medium text-slate-800">{chip.label}</span>
      </button>
    );
    return chipContent;
  };

  const renderSection = (title: string, chips: ChipData[], icon?: string) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, idx) => (
          <div key={`${chip.type}-${idx}`}>{renderChip(chip)}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-72 bg-white/90 backdrop-blur-sm border-r border-purple-100 h-screen flex flex-col">
      <h2 className="font-bold text-sm text-slate-800 px-4 pt-4 pb-3 border-b border-purple-100 bg-white/90 backdrop-blur-sm flex-shrink-0">
        🎨 Paleta de Experiencias
      </h2>
      <div className="flex-1 overflow-y-auto p-4">
        {renderSection("Operación", OPERACIONES, "⚙️")}
        {renderSection("Relación", RELACIONES, "👥")}
        {renderSection("Lugar", LUGARES, "📍")}
        {renderSection("Emoción", EMOCIONES, "😊")}
      </div>
    </div>
  );
}

