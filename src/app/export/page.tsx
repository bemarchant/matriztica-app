"use client";
import { addDays, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

export default function ExportPage() {
  const [md, setMd] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const buildMarkdown = (items: any[]) => {
    const lines: string[] = [
      "# Semana",
      "",
      ...items.map((i) => `- ${new Date(i.date).toLocaleDateString()} — ${i.emotionPrimary} (${i.emotionIntensity}/5)`),
      "",
      "## Conservo",
      ...items.filter((i) => i.conserve).map((i) => `- ${i.conserve}`),
      "",
      "## Transformo",
      ...items.filter((i) => i.transform).map((i) => `- ${i.transform}`),
    ];
    return lines.join("\n");
  };

  const load = async () => {
    setLoading(true);
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const to = addDays(start, 7).toISOString();
    const res = await fetch(`/api/entries?from=${start.toISOString()}&to=${to}`);
    if (res.ok) {
      const items = await res.json();
      setMd(buildMarkdown(items));
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const download = async () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "semana.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Exportar</h1>
      <div className="flex gap-2">
        <button className="rounded border px-3 py-2" onClick={() => void load()} disabled={loading}>Actualizar</button>
        <button className="rounded bg-brand px-3 py-2 text-white" onClick={() => void download()} disabled={!md}>Descargar Markdown</button>
        {/* TODO: Generar PDF en server usando @react-pdf/renderer */}
      </div>
      <pre className="whitespace-pre-wrap rounded border bg-white p-3 shadow-sm">{md || "(Sin contenido)"}</pre>
    </div>
  );
}


