"use client";
import { useEffect, useState } from "react";

export default function EntriesPage() {
  const [q, setQ] = useState("");
  const [emotion, setEmotion] = useState("");
  const [domain, setDomain] = useState("");
  const [tag, setTag] = useState("");
  const [items, setItems] = useState<any[]>([]);

  const refresh = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (emotion) params.set("emotion", emotion);
    if (domain) params.set("domain", domain);
    if (tag) params.set("tag", tag);
    const res = await fetch(`/api/entries?${params.toString()}`);
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => { void refresh(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Entradas</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <input aria-label="Buscar" placeholder="Buscar texto" className="rounded border px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} />
        <input aria-label="Emoción" placeholder="Emoción" className="rounded border px-3 py-2" value={emotion} onChange={(e) => setEmotion(e.target.value)} />
        <select aria-label="Dominio" className="rounded border px-3 py-2" value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="">Todos los dominios</option>
          <option value="tecnico">Técnico</option>
          <option value="emocional">Emocional</option>
          <option value="relacional">Relacional</option>
        </select>
        <input aria-label="Tag" placeholder="Tag" className="rounded border px-3 py-2" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
      <div>
        <button className="rounded border px-3 py-2" onClick={() => void refresh()}>Aplicar filtros</button>
      </div>
      <ul className="space-y-2">
        {items.map((e) => (
          <li key={e.id} className="rounded border bg-white p-3 shadow-sm">
            <div className="text-sm text-slate-500">{new Date(e.date).toLocaleDateString()}</div>
            <div className="font-medium">{e.emotionPrimary} ({e.emotionIntensity}/5)</div>
            <div className="text-sm">{e.context}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


