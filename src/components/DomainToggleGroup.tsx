type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};

const DOMAINS = [
  { key: "tecnico", label: "Técnico" },
  { key: "emocional", label: "Emocional" },
  { key: "relacional", label: "Relacional" },
];

export function DomainToggleGroup({ value, onChange }: Props) {
  const toggle = (key: string) => {
    if (value.includes(key)) onChange(value.filter((v) => v !== key));
    else onChange([...value, key]);
  };
  return (
    <div role="group" aria-label="Dominios" className="flex flex-wrap gap-2">
      {DOMAINS.map((d) => (
        <button
          key={d.key}
          type="button"
          aria-pressed={value.includes(d.key)}
          onClick={() => toggle(d.key)}
          className={
            "rounded border px-3 py-1 text-sm " +
            (value.includes(d.key)
              ? "border-brand bg-brand text-white"
              : "border-slate-300 bg-white")
          }
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}


