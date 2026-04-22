import mascot from "@/assets/mascot.png";
import {
  MISSIONS,
  VIRAL_QUOTES,
  eurosFor,
  fmtClock,
  fmtEuro,
  loadStats,
  playBell,
  saveStats,
  triggerHaptic,
  type Mission,
  type MissionIcon,
} from "@/lib/ooo";
import { Coins, Coffee, Cross, Focus, Ghost, Share2, UtensilsCrossed, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const iconMap: Record<MissionIcon, typeof UtensilsCrossed> = {
  utensils: UtensilsCrossed,
  coins: Coins,
  coffee: Coffee,
  ghost: Ghost,
  focus: Focus,
  file: Cross,
};

type Props = {
  mission: Mission;
  onClose: () => void;
};

export function MissionOverlay({ mission, onClose }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(14);
  const [quoteIndex] = useState(() => MISSIONS.findIndex((item) => item.id === mission.id) % VIRAL_QUOTES.length);
  const startedAt = useRef<number | null>(null);
  const targetSeconds = mission.defaultMinutes * 60;
  const Icon = iconMap[mission.icon];

  useEffect(() => {
    setHourlyRate(loadStats().hourlyRate);
    startedAt.current = Date.now();
    triggerHaptic("launch");
    playBell(560, 0.6);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      if (!startedAt.current) return;
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setSeconds(elapsed);
      if (targetSeconds > 0 && elapsed >= targetSeconds) {
        setDone(true);
        playBell(860, 0.75);
        triggerHaptic("complete");
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [done, targetSeconds]);

  const euros = eurosFor(seconds, hourlyRate);
  const remaining = targetSeconds > 0 ? Math.max(0, targetSeconds - seconds) : seconds;
  const progress = targetSeconds > 0 ? Math.min(100, (seconds / targetSeconds) * 100) : 18;
  const quote = VIRAL_QUOTES[quoteIndex];
  const accent = `var(--color-${mission.colorVar})`;
  const summary = useMemo(
    () => `${mission.name} concluída. Paz adquirida: ${fmtEuro(euros)}. ${quote}`,
    [euros, mission.name, quote],
  );

  function finishMission() {
    const stats = loadStats();
    const next = {
      ...stats,
      lichPoints: stats.lichPoints + Math.max(8, Math.floor(seconds / 20)),
      lifetimeEuros: stats.lifetimeEuros + euros,
      lifetimeSeconds: stats.lifetimeSeconds + seconds,
      completedMissions: stats.completedMissions + 1,
    };
    saveStats(next);
    triggerHaptic("confirm");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/96 backdrop-blur-xl">
      <div className="absolute inset-0 bg-grid opacity-35" />
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute inset-x-0 top-0 h-64" style={{ background: `radial-gradient(circle at top, color-mix(in oklab, ${accent} 28%, transparent), transparent 72%)` }} />

      <div className="relative flex min-h-screen flex-col px-5 pb-8 pt-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-border bg-card/70 px-3 py-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: accent, color: accent }}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">{done ? "Protocol archived" : mission.kicker}</p>
              <h2 className="font-display text-lg text-foreground">{mission.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground transition-transform duration-300 hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto grid w-full max-w-3xl flex-1 items-center gap-8 py-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="surface-panel relative overflow-hidden p-6 sm:p-7">
            <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full blur-3xl" style={{ background: `color-mix(in oklab, ${accent} 26%, transparent)` }} />
            <div className="relative">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                {done ? "Completed with composure" : "Do not disturb the ritual"}
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl leading-none text-foreground sm:text-5xl">{done ? mission.endLine(fmtEuro(euros)) : mission.startLine}</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">{mission.ruleLine}</p>

              <div className="mt-8 flex items-end gap-4">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                    {targetSeconds > 0 ? "Remaining" : "Live counter"}
                  </div>
                  <div className="font-mono text-6xl tabular-nums tracking-tight text-foreground sm:text-7xl">
                    {fmtClock(targetSeconds > 0 ? remaining : seconds)}
                  </div>
                </div>
                <div className="mb-2 rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                  {mission.defaultMinutes > 0 ? `${mission.defaultMinutes} min protocol` : "No timer limit"}
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, color-mix(in oklab, ${accent} 45%, white))`, boxShadow: `0 0 28px ${accent}` }}
                />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card/88 p-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Peace acquired</div>
                  <div className="mt-2 font-mono text-3xl tabular-nums text-foreground">{fmtEuro(euros)}</div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Cada segundo fora do ruído conta como dividendo emocional.</p>
                </div>
                <div className="rounded-3xl border border-border bg-card/88 p-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Cultural impact</div>
                  <div className="mt-2 font-display text-2xl text-foreground">{done ? "Approved exit" : "Operational disappearance"}</div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Bart chama-lhe gestão de energia. RH chamaria outra coisa se tivesse imaginação.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-panel relative overflow-hidden p-6 sm:p-7">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/10 to-transparent" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">Witness</p>
                    <h3 className="mt-2 font-display text-2xl text-foreground">Bart approves strategic absence.</h3>
                  </div>
                  <img src={mascot} alt="Bart mascot" className="h-24 w-24 object-contain drop-shadow-[0_22px_44px_rgba(145,107,255,0.28)]" width={96} height={96} />
                </div>

                <blockquote className="mt-5 rounded-3xl border border-border bg-secondary/70 p-4 text-sm leading-6 text-foreground">
                  “{quote}”
                </blockquote>
              </div>

              <div className="space-y-3">
                {done ? (
                  <>
                    <button
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.share) {
                          navigator.share({ title: "$OOO", text: summary }).catch(() => undefined);
                        }
                      }}
                      className="button-premium w-full justify-center"
                    >
                      <Share2 className="h-4 w-4" />
                      Share the alibi
                    </button>
                    <button onClick={finishMission} className="button-ghost w-full justify-center">
                      Archive ritual
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setDone(true);
                        playBell(740, 0.45);
                        triggerHaptic("confirm");
                      }}
                      className="button-premium w-full justify-center"
                    >
                      Seal this protocol now
                    </button>
                    <button onClick={finishMission} className="button-ghost w-full justify-center">
                      Exit without ceremony
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
