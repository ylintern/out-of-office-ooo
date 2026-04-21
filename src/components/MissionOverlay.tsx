import { useEffect, useRef, useState } from "react";
import {
  MISSIONS,
  type Mission,
  loadStats,
  saveStats,
  eurosFor,
  fmtEuro,
  fmtClock,
  safeVibrate,
  playBell,
  VIRAL_QUOTES,
} from "@/lib/ooo";
import bart from "@/assets/bart.png";

type Props = {
  mission: Mission;
  onClose: () => void;
};

export function MissionOverlay({ mission, onClose }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [rate] = useState(() => loadStats().hourlyRate);
  const target = mission.defaultMinutes * 60;
  const startedAt = useRef(Date.now());

  useEffect(() => {
    safeVibrate([60, 40, 60]);
    playBell(560, 0.5);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setSeconds(elapsed);
      if (target > 0 && elapsed >= target) {
        setDone(true);
        playBell(880, 0.7);
        safeVibrate([120, 60, 120, 60, 200]);
      }
    }, 250);
    return () => clearInterval(id);
  }, [done, target]);

  const remaining = target > 0 ? Math.max(0, target - seconds) : seconds;
  const euros = eurosFor(seconds, rate);
  const progress = target > 0 ? Math.min(100, (seconds / target) * 100) : 0;

  function finish() {
    const s = loadStats();
    s.lichPoints += Math.max(5, Math.floor(seconds / 30));
    s.lifetimeEuros += euros;
    s.lifetimeSeconds += seconds;
    s.completedMissions += 1;
    saveStats(s);
    onClose();
  }

  const quote = VIRAL_QUOTES[Math.floor(Math.random() * VIRAL_QUOTES.length)];
  const colorVar = `var(--${mission.colorVar})`;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background bg-scanlines"
      style={{
        background: `radial-gradient(ellipse at top, color-mix(in oklab, ${colorVar} 18%, var(--background)) 0%, var(--background) 70%)`,
      }}
    >
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
          {done ? "// MISSION COMPLETE" : "// MISSION IN PROGRESS"}
        </div>

        <div className="text-6xl mb-2 float">{mission.emoji}</div>
        <h1
          className="font-gothic text-3xl sm:text-4xl text-glow-necro mb-2"
          style={{ color: colorVar }}
        >
          {mission.name}
        </h1>

        {!done ? (
          <>
            <p className="font-gothic text-lg text-foreground/90 max-w-sm mb-8">
              {mission.startLine}
            </p>

            <div
              className="font-mono text-7xl sm:text-8xl tabular-nums text-glow-necro mb-2"
              style={{ color: colorVar }}
            >
              {fmtClock(target > 0 ? remaining : seconds)}
            </div>

            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
              {target > 0 ? "tempo restante" : "a contar para sempre"}
            </div>

            {target > 0 && (
              <div className="w-full max-w-sm h-1.5 bg-muted rounded-full overflow-hidden mb-6">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: colorVar, boxShadow: `0 0 12px ${colorVar}` }}
                />
              </div>
            )}

            <div className="rounded-lg border border-border bg-card/60 px-5 py-3 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                paz adquirida ao patrão
              </div>
              <div
                className="font-mono text-3xl tabular-nums text-glow-gold"
                style={{ color: "var(--gold)" }}
              >
                {fmtEuro(euros)}
              </div>
            </div>

            <button
              onClick={finish}
              className="mt-8 font-mono text-xs uppercase tracking-widest text-muted-foreground underline"
            >
              terminar mais cedo (cobarde)
            </button>
          </>
        ) : (
          <>
            <p className="font-gothic text-2xl text-foreground mb-2 max-w-md">
              {mission.endLine(fmtEuro(euros))}
            </p>
            <p className="font-mono text-xs italic text-muted-foreground mb-8">
              "{quote}" — Bartholomew
            </p>

            <div className="flex flex-col items-center gap-4">
              <img src={bart} alt="" className="h-32 w-32 pulse-necro" width={128} height={128} />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.share) {
                      navigator
                        .share({
                          title: "$OOO",
                          text: `${mission.emoji} ${mission.name} concluída. Paz adquirida: ${fmtEuro(euros)}. ${quote} — $OOO`,
                        })
                        .catch(() => undefined);
                    }
                  }}
                  className="rounded-md border border-gold px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-glow-gold"
                  style={{ color: "var(--gold)" }}
                >
                  Partilhar vitória
                </button>
                <button
                  onClick={finish}
                  className="rounded-md px-5 py-2.5 font-mono text-xs uppercase tracking-widest"
                  style={{ background: colorVar, color: "var(--primary-foreground)" }}
                >
                  Reclamar Lich Points
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 font-mono text-xs text-muted-foreground"
      >
        [ esc ]
      </button>
    </div>
  );
}
