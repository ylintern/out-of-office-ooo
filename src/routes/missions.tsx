import { MissionOverlay } from "@/components/MissionOverlay";
import { MISSIONS, triggerHaptic, type Mission, type MissionIcon } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { Coins, Coffee, Cross, Focus, Ghost, Orbit, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions · $OOO" },
      { name: "description", content: "Launch cinematic rituals for lunch, bathroom breaks, ghost meetings, and other forms of polished resistance." },
    ],
  }),
  component: MissionsPage,
});

const iconMap: Record<MissionIcon, typeof UtensilsCrossed> = {
  utensils: UtensilsCrossed,
  coins: Coins,
  coffee: Coffee,
  ghost: Ghost,
  focus: Focus,
  file: Cross,
};

function MissionsPage() {
  const [active, setActive] = useState<Mission | null>(null);

  return (
    <div className="space-y-4 px-3 pb-6 sm:px-0">
      <section className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Mission control</p>
            <h1 className="mt-2 font-display text-4xl text-foreground">Rituals for strategic absence.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Every mission now behaves like a premium system event: stronger visual identity, clean iconography, better pacing, and enough ceremony to make a basic pause feel like a justified executive decision.
            </p>
          </div>
          <div className="rounded-full border border-border bg-secondary p-4 text-primary">
            <Orbit className="h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-3">
          {MISSIONS.map((mission) => {
            const Icon = iconMap[mission.icon];
            return (
              <button
                key={mission.id}
                onClick={() => {
                  triggerHaptic("launch");
                  setActive(mission);
                }}
                className="mission-tile w-full text-left"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                    style={{ borderColor: `var(--color-${mission.colorVar})`, color: `var(--color-${mission.colorVar})` }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{mission.kicker}</div>
                        <h2 className="mt-1 font-display text-2xl text-foreground">{mission.name}</h2>
                      </div>
                      <span className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                        {mission.defaultMinutes ? `${mission.defaultMinutes} min` : "Manual flow"}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{mission.ruleLine}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-primary">
                      Launch protocol
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">UX posture</p>
          <h2 className="mt-2 font-display text-3xl text-foreground">Not a list of buttons. A control room.</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Missions now read like purposeful states: haptic launch, dramatic overlay, progress choreography, and copy sharp enough to sound like corporate policy written by someone who has emotionally resigned but kept the benefits.
          </p>
          <div className="mt-5 grid gap-3">
            <InsightRow title="State-aware motion" copy="Pressed states lift, overlays bloom, and timers feel precise instead of decorative." />
            <InsightRow title="Browser-safe haptics" copy="Short confirmation pulses on launch, richer completion patterns when the ritual lands." />
            <InsightRow title="Icon-first system" copy="No emoji scaffolding. Tone now lives in the language, hierarchy, and motion." />
          </div>
        </div>
      </section>

      {active ? <MissionOverlay mission={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}

function InsightRow({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/82 p-4">
      <div className="font-display text-xl text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}
