import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LESSONS, RANKS, loadStats, rankFor, saveStats } from "@/lib/ooo";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Bart Academy · $OOO" },
      { name: "description", content: "100 lições corporate. Meias-verdades. Eficiência preguiçosa." },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  const [stats, setStats] = useState(() => loadStats());

  function unlockNext() {
    if (stats.unlockedLessons >= 100) return;
    const next = {
      ...stats,
      unlockedLessons: stats.unlockedLessons + 1,
      lichPoints: stats.lichPoints + 5,
    };
    setStats(next);
    saveStats(next);
  }

  const rank = rankFor(stats.lichPoints);
  const nextRank = RANKS.find((r) => r.min > stats.lichPoints);

  return (
    <div className="px-4 pt-4 space-y-4">
      <div>
        <h1 className="font-gothic text-2xl">Bart Academy</h1>
        <p className="text-sm text-muted-foreground">
          100 lições. Uma por dia. Bart vai estar cá durante 100 anos. Tens tempo.
        </p>
      </div>

      {/* Rank progress */}
      <div className="rounded-2xl border border-gold bg-card p-4 shadow-gold">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Atual
            </div>
            <div className="font-gothic text-xl text-glow-gold" style={{ color: "var(--gold)" }}>
              {rank}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Próximo
            </div>
            <div className="font-gothic text-base text-muted-foreground">
              {nextRank ? nextRank.name : "Lich Eterno ✦"}
            </div>
          </div>
        </div>
        {nextRank && (
          <>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, ((stats.lichPoints - (RANKS.find((r) => r.name === rank)?.min ?? 0)) /
                    (nextRank.min - (RANKS.find((r) => r.name === rank)?.min ?? 0))) * 100)}%`,
                  background: "var(--gradient-gold)",
                }}
              />
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {nextRank.min - stats.lichPoints} Lich Points para subir
            </div>
          </>
        )}
      </div>

      <button
        onClick={unlockNext}
        disabled={stats.unlockedLessons >= 100}
        className="w-full rounded-md border border-necro bg-primary/10 py-3 font-mono text-xs uppercase tracking-widest text-glow-necro disabled:opacity-40"
        style={{ color: "var(--necro-glow)" }}
      >
        {stats.unlockedLessons >= 100
          ? "✦ Ascendeste. És Bart agora."
          : `Desbloquear lição diária (+5 LP)`}
      </button>

      <div className="space-y-2">
        {LESSONS.map((text, i) => {
          const n = i + 1;
          const unlocked = n <= stats.unlockedLessons;
          return (
            <div
              key={i}
              className="rounded-xl border bg-card p-3 flex gap-3"
              style={{
                borderColor: unlocked ? "var(--border)" : "color-mix(in oklab, var(--border) 50%, transparent)",
                opacity: unlocked ? 1 : 0.45,
              }}
            >
              <div
                className="font-gothic text-2xl w-10 text-center shrink-0"
                style={{ color: unlocked ? "var(--gold)" : "var(--muted-foreground)" }}
              >
                {String(n).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Lição #{n}
                </div>
                <p className="text-sm mt-0.5">{unlocked ? text : "🔒 ainda na cripta…"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
