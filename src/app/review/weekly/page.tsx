"use client";
import { addDays, startOfWeek } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export default function WeeklyReviewPage() {
  const [start] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [items, setItems] = useState<any[]>([]);

  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(start, i)), [start]);

  const refresh = async () => {
    const to = addDays(start, 7).toISOString();
    const res = await fetch(`/api/entries?from=${start.toISOString()}&to=${to}`);
    if (res.ok) setItems(await res.json());
  };
  useEffect(() => { void refresh(); }, [start]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Revisión semanal</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <section className="rounded border bg-white p-3 shadow-sm">
          <h2 className="mb-2 font-medium">Conservo</h2>
          <ul className="list-disc pl-5">
            {items.filter((i) => i.conserve).map((i) => (<li key={i.id}>{i.conserve}</li>))}
          </ul>
        </section>
        <section className="rounded border bg-white p-3 shadow-sm">
          <h2 className="mb-2 font-medium">Transformo</h2>
          <ul className="list-disc pl-5">
            {items.filter((i) => i.transform).map((i) => (<li key={i.id}>{i.transform}</li>))}
          </ul>
        </section>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {days.map((d) => (
          <div key={d.toISOString()} className="rounded border bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm text-slate-500">{d.toLocaleDateString()}</div>
            <ul className="space-y-1">
              {items.filter((i) => i.date.slice(0,10) === d.toISOString().slice(0,10)).map((i) => (
                <li key={i.id}>
                  <div className="font-medium">{i.emotionPrimary} ({i.emotionIntensity}/5)</div>
                  <div className="text-sm text-slate-600">{i.csiText}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}


