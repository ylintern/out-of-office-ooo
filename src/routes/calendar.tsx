import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendário Invertido · $OOO" },
      { name: "description", content: "O calendário do Bart: só celebra o tempo livre." },
    ],
  }),
  component: CalendarPage,
});

type Block = { id: string; day: number; start: number; end: number; label: string; type: "free" | "work" };

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8 → 18

const SEED: Block[] = [
  { id: "1", day: 0, start: 9, end: 13, label: "A fingir", type: "work" },
  { id: "2", day: 0, start: 13, end: 14.5, label: "Almoço Sagrado", type: "free" },
  { id: "3", day: 0, start: 15, end: 15.25, label: "WC Pago", type: "free" },
  { id: "4", day: 0, start: 16, end: 17, label: "Reunião Fantasma", type: "free" },
  { id: "5", day: 1, start: 9, end: 11, label: "Email theater", type: "work" },
  { id: "6", day: 1, start: 11, end: 12, label: "Café Estendido", type: "free" },
  { id: "7", day: 1, start: 13, end: 14.5, label: "Almoço Sagrado", type: "free" },
  { id: "8", day: 2, start: 14, end: 17, label: "Tarde Livre Estratégica", type: "free" },
  { id: "9", day: 3, start: 9, end: 12, label: "Deep Focus Falso", type: "free" },
  { id: "10", day: 3, start: 13, end: 14.5, label: "Almoço Sagrado", type: "free" },
  { id: "11", day: 4, start: 9, end: 16, label: "Sexta-fantasma", type: "free" },
];

const TEMPLATES = [
  { label: "Tarde livre estratégica", duration: 3, start: 14 },
  { label: "Sexta-fantasma", duration: 7, start: 10 },
  { label: "Reunião que cancelei na minha cabeça", duration: 1, start: 15 },
  { label: "WC Pago", duration: 0.25, start: 11 },
];

export default function CalendarPage() {
  const [blocks, setBlocks] = useState<Block[]>(SEED);
  const [day, setDay] = useState(0);

  function addTemplate(t: (typeof TEMPLATES)[number]) {
    setBlocks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day,
        start: t.start,
        end: t.start + t.duration,
        label: t.label,
        type: "free",
      },
    ]);
  }

  const totalFree = blocks
    .filter((b) => b.type === "free")
    .reduce((acc, b) => acc + (b.end - b.start), 0);
  const totalWork = blocks
    .filter((b) => b.type === "work")
    .reduce((acc, b) => acc + (b.end - b.start), 0);

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="font-gothic text-2xl">Calendário Invertido</h1>
        <p className="text-sm text-muted-foreground">
          O tempo livre ocupa o palco. O trabalho fica esmagado lá em baixo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Metric label="Tempo livre celebrado" value={`${totalFree.toFixed(1)}h`} accent="necro" />
        <Metric label="Tempo desperdiçado" value={`${totalWork.toFixed(1)}h`} accent="muted" />
      </div>

      {/* Day picker */}
      <div className="flex gap-1">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setDay(i)}
            className="flex-1 rounded-md border py-2 font-mono text-xs uppercase tracking-widest"
            style={{
              borderColor: day === i ? "var(--necro)" : "var(--border)",
              background: day === i ? "color-mix(in oklab, var(--necro) 18%, transparent)" : "transparent",
              color: day === i ? "var(--necro-glow)" : "var(--muted-foreground)",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Inverted timeline: free blocks tall, work blocks tiny */}
      <div className="rounded-2xl border border-border bg-card p-3">
        <div className="relative">
          {HOURS.map((h) => {
            const block = blocks.find((b) => b.day === day && h >= Math.floor(b.start) && h < b.end);
            const isFree = block?.type === "free";
            const isWork = block?.type === "work";
            const height = isFree ? 72 : isWork ? 16 : 28;
            return (
              <div
                key={h}
                className="flex items-center gap-3 border-b border-border/40 last:border-b-0"
                style={{ height }}
              >
                <div className="w-10 font-mono text-[10px] text-muted-foreground tabular-nums">
                  {String(h).padStart(2, "0")}:00
                </div>
                {block ? (
                  isFree ? (
                    <div
                      className="flex-1 h-full rounded-md flex items-center px-3 text-sm font-gothic shadow-necro"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklab, var(--necro) 35%, var(--card)), color-mix(in oklab, var(--terminal) 25%, var(--card)))",
                        color: "var(--background)",
                      }}
                    >
                      🟢 {block.label}
                    </div>
                  ) : (
                    <div
                      className="flex-1 h-full rounded-sm flex items-center px-2 font-mono text-[10px] uppercase tracking-widest"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      ⚫ {block.label}
                    </div>
                  )
                ) : (
                  <div className="flex-1 h-px" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick templates */}
      <div>
        <h2 className="font-gothic text-lg mb-2">Adicionar tempo livre ({DAYS[day]})</h2>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => addTemplate(t)}
              className="rounded-xl border border-border bg-card p-3 text-left hover:border-necro transition-colors"
            >
              <div className="font-gothic text-sm">{t.label}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                +{t.duration}h às {t.start}:00
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "necro" | "muted";
}) {
  return (
    <div
      className="rounded-xl border bg-card p-3"
      style={{ borderColor: accent === "necro" ? "var(--necro)" : "var(--border)" }}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className="font-mono text-2xl mt-0.5"
        style={{ color: accent === "necro" ? "var(--necro-glow)" : "var(--muted-foreground)" }}
      >
        {value}
      </div>
    </div>
  );
}
