import { DataCard, KpiCard, SectionHeader, StatusPill } from "@/components/dashboard/DashboardPrimitives";
import { LESSONS, RANKS, loadStats, rankFor, saveStats, triggerHaptic } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy · $OOO" },
      { name: "description", content: "A progression system for learning the quotable art of strategic absence." },
    ],
  }),
  component: AcademyPage,
});

function AcademyPage() {
  const [stats, setStats] = useState(loadStats());

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
    <div className="app-stack px-0 pb-4">
      <DataCard className="p-4 sm:p-5">
        <SectionHeader
          eyebrow="Bart Academy"
          title="Doctrine, not content marketing."
          detail="Lessons should read like quotable policy for protecting time with a straight face and slightly dangerous calm."
          action={<StatusPill label={rank} tone="accent" />}
        />
        <div className="mt-4 mini-grid">
          <KpiCard label="Current rank" value={rank} hint="Your official standing in the school of composed disengagement." tone="accent" progress={Math.max(8, Math.min(100, progress))} />
          <KpiCard label="Unlocked lessons" value={`${stats.unlockedLessons}/100`} hint="More lines ready to be screenshotted in quiet agreement." tone="success" progress={stats.unlockedLessons} />
          <KpiCard label="Points to next" value={nextRank ? String(nextRank.min - stats.lichPoints) : "0"} hint="A few more rituals until the next title becomes legally yours." tone="default" />
          <KpiCard label="Unlock posture" value="Tap to study" hint="Small reward, quick motion, no bloated gamification theatre." tone="alert" />
        </div>
      </DataCard>

      <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
        <DataCard className="p-4 sm:p-5">
          <SectionHeader eyebrow="Standing" title="Progress with better gravity." detail="Rank should feel earned, readable, and slightly cultish in a premium way." action={<div className="icon-pill"><Sparkles className="h-4 w-4" /></div>} />
          <div className="mt-4 rounded-[1rem] border border-border bg-card/82 p-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              <span>Progress to next rank</span>
              <span>{nextRank ? `${nextRank.min - stats.lichPoints} LP left` : "Maxed"}</span>
            </div>
            <div className="metric-track mt-3">
              <div className="metric-bar" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
            </div>
          </div>
          <button onClick={unlockNext} disabled={stats.unlockedLessons >= 100} className="button-premium mt-5 w-full justify-center disabled:opacity-50">
            {stats.unlockedLessons >= 100 ? "Archive complete" : "Unlock next lesson"}
          </button>
        </DataCard>

        <DataCard className="p-4 sm:p-5">
          <SectionHeader eyebrow="Lesson archive" title="Useful doctrine" detail="Dry, quotable, and sharp enough to survive a screenshot." action={<div className="icon-pill"><BookOpenText className="h-4 w-4" /></div>} />
          <div className="mt-4 space-y-3">
            {LESSONS.slice(0, 18).map((lesson, index) => {
              const unlocked = index < unlockedLessons.length;
              return (
                <div key={index} className="rounded-[1rem] border border-border bg-card/82 p-4" style={{ opacity: unlocked ? 1 : 0.45 }}>
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] border border-border bg-secondary text-foreground">
                      {unlocked ? <span className="font-mono text-sm">{String(index + 1).padStart(2, "0")}</span> : <LockKeyhole className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Lesson {String(index + 1).padStart(2, "0")}</div>
                      <p className="mt-2 text-sm leading-6 text-foreground">{unlocked ? lesson : "Still sealed. You have not yet earned this particular flavour of detachment."}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
