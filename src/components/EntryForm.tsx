"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entryCreateSchema, type EntryCreateInput } from "@/lib/validation";
import { format } from "date-fns";
import type { ChipData } from "@/components/ExperiencePalette";
import { OPERACIONES, RELACIONES, LUGARES, EMOCIONES } from "@/components/ExperiencePalette";

type Props = {
  entryId?: string;
  defaultDate?: Date;
  defaultChip?: ChipData;
  onSaved?: () => void;
};

export function EntryForm({ entryId, defaultDate, defaultChip, onSaved }: Props) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contextualPrompt, setContextualPrompt] = useState<string>("");
  const [selectedOperacion, setSelectedOperacion] = useState<ChipData | null>(null);
  const [selectedRelacion, setSelectedRelacion] = useState<ChipData | null>(null);
  const [selectedLugar, setSelectedLugar] = useState<ChipData | null>(null);
  const [selectedEmocion, setSelectedEmocion] = useState<ChipData | null>(null);

  const form = useForm<EntryCreateInput>({
    resolver: zodResolver(entryCreateSchema),
    defaultValues: {
      date: (defaultDate ?? new Date()).toISOString().slice(0, 10),
      time: format(defaultDate ?? new Date(), "HH:mm"),
      bienestar: 3, // Valor por defecto
      lugar: undefined,
      relacion: undefined,
      operacion: undefined,
      emocion: undefined,
      csi: undefined,
    },
  });

  // Inicializar con datos del chip si existe
  useEffect(() => {
    if (defaultChip) {
      setContextualPrompt(defaultChip.prompt || "");
      
      switch (defaultChip.type) {
        case "operacion":
          setSelectedOperacion(defaultChip);
          form.setValue("operacion", defaultChip.value);
          break;
        case "relacion":
          setSelectedRelacion(defaultChip);
          form.setValue("relacion", defaultChip.value);
          break;
        case "lugar":
          setSelectedLugar(defaultChip);
          form.setValue("lugar", defaultChip.value);
          break;
        case "emocion":
          setSelectedEmocion(defaultChip);
          form.setValue("emocion", defaultChip.emoji ? `${defaultChip.emoji} ${defaultChip.value}` : defaultChip.value);
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChip]);

  // Cargar datos de experiencia existente si hay entryId
  useEffect(() => {
    if (!entryId) return;
    setLoading(true);
    fetch(`/api/entries/${entryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.date) {
          const date = new Date(data.date);
          form.setValue("date", date.toISOString().slice(0, 10) as any);
          form.setValue("time", format(date, "HH:mm") as any);
        }
        // Mapear campos antiguos a nuevos
        form.setValue("bienestar", data.bienestar || data.emotionIntensity || 3);
        form.setValue("lugar", data.context || undefined);
        form.setValue("relacion", data.conversationText || data.reflectionText || undefined);
        form.setValue("operacion", data.doingsText || undefined);
        form.setValue("emocion", data.emotionPrimary || undefined);
        form.setValue("csi", data.csiText || undefined);
        
        // Restaurar chips seleccionados
        const lugarValue = data.context;
        if (lugarValue) {
          const lugarChip = LUGARES.find((c) => c.value === lugarValue);
          if (lugarChip) setSelectedLugar(lugarChip);
        }
        
        const relacionValue = data.conversationText || data.reflectionText;
        if (relacionValue) {
          const relacionChip = RELACIONES.find((c) => c.value === relacionValue);
          if (relacionChip) setSelectedRelacion(relacionChip);
        }
        
        const operacionValue = data.doingsText;
        if (operacionValue) {
          const operacionChip = OPERACIONES.find((c) => c.value === operacionValue);
          if (operacionChip) setSelectedOperacion(operacionChip);
        }
        
        const emocionValue = data.emotionPrimary;
        if (emocionValue) {
          const emocionMatch = emocionValue.match(/^[\u{1F300}-\u{1F9FF}]/u);
          if (emocionMatch) {
            const emocionChip = EMOCIONES.find((c) => c.emoji === emocionMatch[0]);
            if (emocionChip) setSelectedEmocion(emocionChip);
          }
        }
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [entryId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const dateStr = values.date as string;
      const timeStr = values.time || "12:00";
      const [hours, minutes] = timeStr.split(":").map(Number);
      const dateTime = new Date(dateStr);
      dateTime.setHours(hours, minutes, 0, 0);

      const payload = {
        ...values,
        date: dateTime.toISOString(),
      };

      const url = entryId ? `/api/entries/${entryId}` : "/api/entries";
      const method = entryId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSaved?.();
      }
    } finally {
      setSaving(false);
    }
  });

  const renderChipSelector = (
    title: string,
    chips: ChipData[],
    selected: ChipData | null,
    onSelect: (chip: ChipData) => void,
    fieldName: "operacion" | "relacion" | "lugar" | "emocion"
  ) => (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">{title}</span>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => {
              onSelect(chip);
              form.setValue(fieldName, chip.value);
              if (chip.type === "emocion" && chip.emoji) {
                form.setValue("emocion", `${chip.emoji} ${chip.value}`);
              }
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
              selected?.value === chip.value
                ? "border-brand bg-brand/10"
                : "border-slate-200 hover:border-purple-200 hover:bg-purple-50"
            }`}
          >
            {chip.emoji && <span>{chip.emoji}</span>}
            <span className="text-sm">{chip.label}</span>
          </button>
        ))}
      </div>
      {/* Input oculto para el valor */}
      <input type="hidden" {...form.register(fieldName)} />
    </label>
  );

  if (loading) {
    return <div className="py-8 text-center text-slate-500">Cargando...</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Prompt contextual si existe */}
      {contextualPrompt && (
        <div className="bg-purple-50 border-l-4 border-brand p-4 rounded-r-lg">
          <p className="text-sm text-slate-700 italic">{contextualPrompt}</p>
        </div>
      )}

      {/* Campos principales: Fecha, Hora, Bienestar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha <span className="text-red-500">*</span></span>
          <input
            aria-label="Fecha"
            type="date"
            className="rounded border px-3 py-2"
            {...form.register("date" as any)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Hora</span>
          <input
            aria-label="Hora"
            type="time"
            className="rounded border px-3 py-2"
            {...form.register("time")}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Bienestar <span className="text-red-500">*</span></span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => form.setValue("bienestar", num)}
                className={`flex-1 py-2 rounded-lg border-2 transition-all font-medium ${
                  form.watch("bienestar") === num
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 hover:border-purple-200 hover:bg-purple-50"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <input type="hidden" {...form.register("bienestar", { valueAsNumber: true })} />
          {form.formState.errors.bienestar && (
            <span className="text-sm text-red-600">{form.formState.errors.bienestar.message}</span>
          )}
        </label>
      </div>

      {/* Selectores de chips */}
      {renderChipSelector("Operación", OPERACIONES, selectedOperacion, setSelectedOperacion, "operacion")}
      {renderChipSelector("Relación", RELACIONES, selectedRelacion, setSelectedRelacion, "relacion")}
      {renderChipSelector("Lugar", LUGARES, selectedLugar, setSelectedLugar, "lugar")}
      {renderChipSelector("Emoción", EMOCIONES, selectedEmocion, setSelectedEmocion, "emocion")}

      {/* CSI al final */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">CSI (Configuración de Sentires Íntimos)</span>
        <textarea
          aria-label="CSI"
          className="rounded border px-3 py-2"
          rows={4}
          placeholder="¿Qué coherencias reconozco entre sentir–hacer–decir?"
          {...form.register("csi")}
        />
        {form.formState.errors.csi && (
          <span className="text-sm text-red-600">{form.formState.errors.csi.message}</span>
        )}
      </label>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="submit"
          className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Guardando..." : entryId ? "Actualizar experiencia" : "Guardar experiencia"}
        </button>
      </div>
    </form>
  );
}
