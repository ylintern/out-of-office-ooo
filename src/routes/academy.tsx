import { LESSONS, RANKS, loadStats, rankFor, saveStats, triggerHaptic } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy · $OOO" },
      { name: "description", content: "A sharper progression system for learning the darkly funny art of being more Bart." },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  const [stats, setStats] = useState({ hourlyRate: 14, lichPoints: 0, lifetimeEuros: 0, lifetimeSeconds: 0, unlockedLessons: 4, completedMissions: 0, installDate: "2026-04-22T00:00:00.000Z" });

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const rank = rankFor(stats.lichPoints);
  const nextRank = RANKS.find((item) => item.min > stats.lichPoints);
  const currentFloor = RANKS.find((item) => item.name === rank)?.min ?? 0;
  const progress = nextRank ? ((stats.lichPoints - currentFloor) / (nextRank.min - currentFloor)) * 100 : 100;
  const unlockedLessons = useMemo(() => LESSONS.slice(0, stats.unlockedLessons), [stats.unlockedLessons]);

  function unlockNext() {
    if (stats.unlockedLessons >= 100) return;
    const next = { ...stats, unlockedLessons: stats.unlockedLessons + 1, lichPoints: stats.lichPoints + 5 };
    setStats(next);
    saveStats(next);
    triggerHaptic("confirm");
  }

  return (
    <div className="space-y-4 px-3 pb-6 sm:px-0">
      <section className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Bart Academy</p>
            <h1 className="mt-2 font-display text-4xl text-foreground">A progression system, not a joke list.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Lessons now feel collectible, quotable, and slightly dangerous in the way good workplace advice often does. Dry delivery. Precise absurdity. Better hierarchy.
            </p>
          </div>
          <div className="rounded-full border border-border bg-secondary p-4 text-primary">
            <BookOpenText className="h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Current standing</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">{rank}</h2>
            </div>
            <div className="rounded-full border border-border bg-secondary p-3 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-border bg-card/82 p-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              <span>Progress to next rank</span>
              <span>{nextRank ? `${nextRank.min - stats.lichPoints} LP left` : "Maxed"}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-secondary">
              <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, progress))}%`, background: "linear-gradient(90deg, var(--color-primary), color-mix(in oklab, var(--color-pearl) 40%, var(--color-primary)))", boxShadow: "var(--shadow-glow)" }} />
            </div>
          </div>
          <button onClick={unlockNext} disabled={stats.unlockedLessons >= 100} className="button-premium mt-5 w-full justify-center disabled:opacity-50">
            {stats.unlockedLessons >= 100 ? "Archive complete" : "Unlock next lesson"}
          </button>
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Lesson archive</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">Unlocked doctrine</h2>
            </div>
            <div className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              {stats.unlockedLessons}/100
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {LESSONS.slice(0, 18).map((lesson, index) => {
              const unlocked = index < unlockedLessons.length;
              return (
                <div key={index} className="rounded-[1.5rem] border border-border bg-card/82 p-4" style={{ opacity: unlocked ? 1 : 0.45 }}>
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground">
                      {unlocked ? <span className="font-mono text-sm">{String(index + 1).padStart(2, "0")}</span> : <LockKeyhole className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Lesson {String(index + 1).padStart(2, "0")}</div>
                      <p className="mt-2 text-sm leading-6 text-foreground">{unlocked ? lesson : "Still sealed in the archive. You have not yet earned this flavour of detachment."}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
