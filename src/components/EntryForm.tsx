"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entryCreateSchema, type EntryCreateInput } from "@/lib/validation";
import { DomainToggleGroup } from "@/components/DomainToggleGroup";
import { format } from "date-fns";

type Props = {
  entryId?: string;
  defaultDate?: Date;
  defaultEmotion?: string;
  onSaved?: () => void;
};

export function EntryForm({ entryId, defaultDate, defaultEmotion, onSaved }: Props) {
  const [domains, setDomains] = useState<string[]>(["emocional"]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<EntryCreateInput>({
    resolver: zodResolver(entryCreateSchema),
    defaultValues: {
      date: (defaultDate ?? new Date()).toISOString().slice(0, 10),
      time: format(defaultDate ?? new Date(), "HH:mm"),
      emotionPrimary: defaultEmotion || "",
      emotionIntensity: 3,
      tags: [],
      domains: ["emocional"],
    } as any,
  });

  // Cargar datos de entrada existente si hay entryId
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
        form.setValue("emotionPrimary", data.emotionPrimary);
        form.setValue("emotionIntensity", data.emotionIntensity);
        form.setValue("context", data.context || "");
        form.setValue("csiText", data.csiText);
        form.setValue("doingsText", data.doingsText);
        form.setValue("reflectionText", data.reflectionText);
        form.setValue("conversationText", data.conversationText || "");
        form.setValue("conserve", data.conserve || "");
        form.setValue("transform", data.transform || "");
        if (data.domains) {
          const domainList = data.domains.map((d: { domain: string }) => d.domain);
          setDomains(domainList);
        }
        if (data.tags) {
          const tagList = data.tags.map((t: { tag: { name: string } }) => t.tag.name);
          form.setValue("tags", tagList as any);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [entryId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      // Combinar fecha y hora
      const dateStr = values.date as string;
      const timeStr = (values as any).time || "12:00";
      const [hours, minutes] = timeStr.split(":").map(Number);
      const dateTime = new Date(dateStr);
      dateTime.setHours(hours, minutes, 0, 0);

      const payload = {
        ...values,
        date: dateTime.toISOString(),
        domains,
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

  if (loading) {
    return <div className="py-8 text-center text-slate-500">Cargando...</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Fecha</span>
          <input
            aria-label="Fecha"
            type="date"
            className="rounded border px-3 py-2"
            {...form.register("date" as any)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Hora</span>
          <input
            aria-label="Hora"
            type="time"
            className="rounded border px-3 py-2"
            defaultValue={format(defaultDate ?? new Date(), "HH:mm")}
            {...form.register("time" as any)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Contexto (lugar/situación)</span>
          <input
            aria-label="Contexto"
            className="rounded border px-3 py-2"
            {...form.register("context")}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Emoción primaria</span>
          <input
            aria-label="Emoción"
            className="rounded border px-3 py-2"
            placeholder="alegría, miedo, rabia..."
            {...form.register("emotionPrimary")}
          />
          {form.formState.errors.emotionPrimary && (
            <span className="text-sm text-red-600">Requerido</span>
          )}
          <span className="text-xs text-slate-500">
            ¿Desde qué emoción estoy hablando/actuando hoy?
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Intensidad (1–5)</span>
          <input
            aria-label="Intensidad"
            type="number"
            min={1}
            max={5}
            className="rounded border px-3 py-2"
            {...form.register("emotionIntensity", { valueAsNumber: true })}
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Dominios</span>
        <DomainToggleGroup value={domains} onChange={setDomains} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Configuración de Sentires Íntimos</span>
        <textarea
          aria-label="CSI"
          className="rounded border px-3 py-2"
          rows={3}
          {...form.register("csiText")}
        />
        <span className="text-xs text-slate-500">
          ¿Qué coherencias reconozco entre sentir–hacer–decir?
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Haceres del día</span>
        <textarea
          aria-label="Haceres"
          className="rounded border px-3 py-2"
          rows={3}
          {...form.register("doingsText")}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Reflexión (cómo hago lo que hago)</span>
        <textarea
          aria-label="Reflexión"
          className="rounded border px-3 py-2"
          rows={3}
          {...form.register("reflectionText")}
        />
        <span className="text-xs text-slate-500">
          Determinismo estructural: ¿qué gatilló esto en mí (sin culpar afuera)?
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Conversación a abrir</span>
        <input
          aria-label="Conversación"
          className="rounded border px-3 py-2"
          placeholder="¿con quién?"
          {...form.register("conversationText")}
        />
        <span className="text-xs text-slate-500">
          Lenguajear: ¿qué conversación necesito abrir (y con quién)?
        </span>
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Conservo</span>
          <input
            aria-label="Conservo"
            className="rounded border px-3 py-2"
            {...form.register("conserve")}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Transformo</span>
          <input
            aria-label="Transformo"
            className="rounded border px-3 py-2"
            {...form.register("transform")}
          />
        </label>
        <span className="text-xs text-slate-500">
          Triple armonía: conmigo, otros, entorno.
        </span>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Tags (separados por coma)</span>
        <input
          aria-label="Tags"
          className="rounded border px-3 py-2"
          placeholder="trabajo, personal, familia"
          {...form.register("tags" as any)}
        />
        <span className="text-xs text-slate-500">Para buscar luego por temas.</span>
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Guardando..." : entryId ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
