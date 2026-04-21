import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MISSIONS, type Mission } from "@/lib/ooo";
import { MissionOverlay } from "@/components/MissionOverlay";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missões Sagradas · $OOO" },
      { name: "description", content: "Almoço, WC pago, café estendido. Tudo direitos constitucionais." },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  const [active, setActive] = useState<Mission | null>(null);

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="font-gothic text-2xl">Missões Sagradas</h1>
        <p className="text-sm text-muted-foreground">
          Cada missão é constitucional. Bart aprovou.
        </p>
      </div>

      <div className="space-y-3">
        {MISSIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m)}
            className="w-full text-left rounded-2xl border border-border bg-card p-4 hover:border-necro transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform">{m.emoji}</div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="font-gothic text-lg" style={{ color: `var(--${m.colorVar})` }}>
                    {m.name}
                  </div>
                  {m.defaultMinutes > 0 && (
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {m.defaultMinutes}min
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 italic">"{m.ruleLine}"</p>
                <div
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: `var(--${m.colorVar})` }}
                >
                  ▸ Iniciar
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center">
        <p className="font-gothic text-sm text-muted-foreground">
          "Uma missão por dia mantém o burnout longe."
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest mt-1 text-muted-foreground">
          — Bartholomew, M.D.
        </p>
      </div>

      {active && <MissionOverlay mission={active} onClose={() => setActive(null)} />}
    </div>
  );
}
