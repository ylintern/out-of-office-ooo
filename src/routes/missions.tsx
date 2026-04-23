import { MissionOverlay } from "@/components/MissionOverlay";
import { DataCard, KpiCard, SectionHeader, StatusPill } from "@/components/dashboard/DashboardPrimitives";
import { MISSIONS, triggerHaptic, type Mission, type MissionIcon } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { Coins, Coffee, Cross, Focus, Ghost, Orbit, Sparkles, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions · $OOO" },
      { name: "description", content: "Launch rituals for lunch, coffee, bathroom breaks, ghost meetings, and other refined forms of resistance." },
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
    <div className="app-stack px-0 pb-4">
      <DataCard className="p-4 sm:p-5">
        <SectionHeader
          eyebrow="Mission control"
          title="Rituals for strategic absence."
          detail="Not a list of buttons — a launch surface for controlled disappearances with cleaner iconography, better pacing, and stronger tactile feedback."
          action={<StatusPill label="High ceremony" tone="accent" />}
        />
        <div className="mt-4 mini-grid">
          <KpiCard label="Available rituals" value={String(MISSIONS.length)} hint="The core actions that make Today actually useful." tone="accent" progress={100} />
          <KpiCard label="Launch style" value="Haptic" hint="Short pulse on start, richer pattern on completion." tone="success" />
          <KpiCard label="Icon language" value="No emojis" hint="Tone now lives in hierarchy, copy, and motion instead of sticker-tier decoration." tone="default" />
          <KpiCard label="Overlay posture" value="Fullscreen" hint="Each ritual opens like a system event, not a tooltip with ambitions." tone="alert" />
        </div>
      </DataCard>

      <div className="grid gap-3 xl:grid-cols-[1.04fr_0.96fr]">
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
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border"
                    style={{ borderColor: `var(--color-${mission.colorVar})`, color: `var(--color-${mission.colorVar})` }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{mission.kicker}</div>
                        <h2 className="mt-1 font-display text-2xl leading-none text-foreground">{mission.name}</h2>
                      </div>
                      <StatusPill label={mission.defaultMinutes ? `${mission.defaultMinutes} min` : "Manual flow"} tone="accent" />
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

        <div className="space-y-3">
          <DataCard className="p-4 sm:p-5">
            <SectionHeader eyebrow="Control room brief" title="Each mission should feel stateful." detail="Pressed states lift, overlays bloom, and timers behave like a real ritual instead of a novelty stopwatch." action={<div className="icon-pill"><Orbit className="h-4 w-4" /></div>} />
            <div className="mt-4 space-y-3">
              <InsightRow title="State-aware motion" copy="Press, release, and completion all carry different weight so the interaction feels intentional." />
              <InsightRow title="Browser-safe haptics" copy="Short confirmations on launch, richer completion patterns when the ritual lands properly." />
              <InsightRow title="Copy with doctrine" copy="Absurd, dry, and useful — like a legal memo written by someone already mentally outside the building." />
            </div>
          </DataCard>

          <DataCard className="p-4 sm:p-5">
            <SectionHeader eyebrow="Launch rail" title="Good defaults for bad calendars." detail="Lunch, coffee, and ghost meetings should be one-thumb decisions, not admin." action={<div className="icon-pill"><Sparkles className="h-4 w-4" /></div>} />
          </DataCard>
        </div>
      </div>

      {active ? <MissionOverlay mission={active} onClose={() => setActive(null)} /> : null}
    </div>
  );
}

function InsightRow({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1rem] border border-border bg-card/82 p-4">
      <div className="font-display text-xl leading-none text-foreground">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}
