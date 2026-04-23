import mascot from "@/assets/mascot.png";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { DataCard, KpiCard, QuickActionCard, SectionHeader, StatusPill } from "@/components/dashboard/DashboardPrimitives";
import {
  BART_TIPS,
  MISSIONS,
  calculateLiveEarnings,
  fmtCompactMinutes,
  fmtEuro,
  getProtectedMinutesLeft,
  getSacredReminders,
  getWorkStatus,
  loadPrefs,
  loadStats,
  rankFor,
  savePrefs,
  saveStats,
  triggerHaptic,
  type Reminder,
} from "@/lib/ooo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, BookOpenText, CalendarRange, Coins, Orbit, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today · $OOO" },
      { name: "description", content: "Today is the command dashboard for sacred breaks, defended lunch, and profitable absence." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [stats, setStats] = useState(loadStats());
  const [prefs, setPrefs] = useState(loadPrefs());
  const [now, setNow] = useState<Date | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    setStats(loadStats());
    setPrefs(loadPrefs());
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const workStatus = useMemo(() => (now ? getWorkStatus(now, prefs) : { inWorkday: true, untilEndMinutes: 0, minutesSinceStart: 0 }), [now, prefs]);
  const liveValue = now ? calculateLiveEarnings(now, prefs) : 0;
  const lunchLeft = now ? getProtectedMinutesLeft(now, prefs) : 0;
  const rank = rankFor(stats.lichPoints);
  const reminders = useMemo<Reminder[]>(() => (now ? getSacredReminders(now, prefs) : []), [now, prefs]);
  const tip = useMemo(() => BART_TIPS[stats.completedMissions % BART_TIPS.length], [stats.completedMissions]);
  const completionProgress = Math.min(100, (stats.completedMissions / 12) * 100);
  const lessonProgress = Math.min(100, (stats.unlockedLessons / 12) * 100);

  function updateRate(delta: number) {
    const nextRate = Math.max(1, Number((prefs.hourlyRate + delta).toFixed(2)));
    const nextPrefs = { ...prefs, hourlyRate: nextRate };
    setPrefs(nextPrefs);
    savePrefs(nextPrefs);
    const nextStats = { ...stats, hourlyRate: nextRate };
    setStats(nextStats);
    saveStats(nextStats);
    triggerHaptic("confirm");
  }

  return (
    <div className="app-stack px-0 pb-4">
      <DataCard className="overflow-hidden p-4 sm:p-5">
        <SectionHeader
          eyebrow="Today"
          title="Dashboard for defended time."
          detail="Missions, reminders, protected lunch, and the amount of money earned while briefly refusing to be available."
          action={<StatusPill label={workStatus.inWorkday ? "Workday live" : "Freedom mode"} tone={workStatus.inWorkday ? "alert" : "success"} />}
        />

        <div className="mt-4 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="mini-grid">
              <KpiCard label="Earned while absent" value={fmtEuro(liveValue)} hint="Live counter based on your declared hourly rate." tone="accent" progress={Math.min(100, (liveValue / Math.max(1, prefs.hourlyRate)) * 100)} />
              <KpiCard label="Lunch shield" value={lunchLeft > 0 ? fmtCompactMinutes(lunchLeft) : "armed"} hint="Sacred lunch remains a protected jurisdiction." tone="success" progress={Math.min(100, (lunchLeft / Math.max(1, prefs.lunchDurationMinutes)) * 100)} />
              <KpiCard label="Current rank" value={rank} hint="Progress in the Academy of composed disengagement." tone="default" progress={lessonProgress} />
              <KpiCard label="Rituals completed" value={String(stats.completedMissions)} hint="Each one a small refusal to become your inbox." tone="alert" progress={completionProgress} />
            </div>

            <div className="quick-rail">
              <QuickActionCard
                title="Launch a mission"
                detail="Lunch, coffee, bathroom ritual, ghost meeting — all available with better choreography."
                icon={<Orbit className="h-4 w-4" />}
                tone="accent"
                action={
                  <Link to="/missions" className="button-premium !px-4 !py-3">
                    Open
                  </Link>
                }
              />
              <QuickActionCard
                title="Open the calendar brain"
                detail="See what work has stolen, what lunch protects, and where the next conflict should be mocked."
                icon={<CalendarRange className="h-4 w-4" />}
                action={
                  <Link to="/calendar" className="button-ghost !px-4 !py-3">
                    View
                  </Link>
                }
              />
            </div>

            <div className="rounded-[1rem] border border-border bg-secondary/65 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Hourly rate</p>
                  <div className="mt-2 font-mono text-[2rem] leading-none tabular-nums text-foreground">{fmtEuro(prefs.hourlyRate)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateRate(-0.5)} className="button-ghost !h-10 !w-10 !rounded-full !p-0">−</button>
                  <button onClick={() => updateRate(0.5)} className="button-premium !h-10 !w-10 !rounded-full !p-0">+</button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Not a moral judgement. Just better accounting for the economics of being briefly unavailable.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="data-card overflow-hidden p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Bart doctrine</p>
                  <h3 className="mt-2 font-display text-2xl leading-none text-foreground">
                    {workStatus.inWorkday ? "Remain useful-looking, not available-looking." : "The evening is legally yours again."}
                  </h3>
                </div>
                <img src={mascot} alt="Bart mascot" className="h-20 w-20 rounded-[1rem] object-cover object-center" width={80} height={80} />
              </div>
              <blockquote className="mt-4 rounded-[1rem] border border-border bg-secondary/70 p-4 text-sm leading-6 text-foreground">
                “{tip}”
              </blockquote>
            </div>

            {!prefs.completed ? (
              <div className="data-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Quick start</p>
                    <h3 className="mt-2 font-display text-2xl leading-none text-foreground">Teach the app your captivity window.</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Add work hours, lunch time, and hourly pay so Today stops guessing and starts keeping receipts.
                    </p>
                  </div>
                  <Coins className="mt-1 h-5 w-5 text-primary" />
                </div>
                <button onClick={() => setWizardOpen(true)} className="button-premium mt-4 w-full">
                  Start quick setup
                </button>
              </div>
            ) : (
              <div className="data-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Profile doctrine</p>
                    <h3 className="mt-2 font-display text-xl leading-none text-foreground">{prefs.workdayStart} → {prefs.workdayEnd}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Lunch begins at {prefs.lunchStart} for {prefs.lunchDurationMinutes} minutes. The app can now judge meetings with evidence.
                    </p>
                  </div>
                  <button onClick={() => setWizardOpen(true)} className="button-ghost !px-4 !py-3">
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DataCard>

      <div className="grid gap-3 xl:grid-cols-[0.94fr_1.06fr]">
        <DataCard className="p-4 sm:p-5">
          <SectionHeader
            eyebrow="Sacred reminders"
            title="Conflicts worth mocking"
            detail="Inverse reminders are where the app becomes useful, sarcastic, and slightly protective."
            action={<Bell className="h-4 w-4 text-primary" />}
          />
          <div className="mt-4 space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="action-card">
                <div className="icon-pill">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg leading-none text-foreground">{reminder.title}</h3>
                    <StatusPill label={reminder.timeLabel} tone={reminder.tone} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{reminder.body}</p>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        <DataCard className="p-4 sm:p-5">
          <SectionHeader
            eyebrow="Mission rail"
            title="Pick your alibi"
            detail="The core rituals now live where they should: on Today, one thumb away from execution."
            action={
              <Link to="/missions" className="button-ghost !px-4 !py-3">
                All missions
              </Link>
            }
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {MISSIONS.slice(0, 4).map((mission) => (
              <Link key={mission.id} to="/missions" className="mission-tile">
                <div className="flex items-center justify-between gap-3">
                  <StatusPill label={mission.kicker} tone="default" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary">
                    {mission.defaultMinutes ? `${mission.defaultMinutes}m` : "Manual"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl leading-none text-foreground">{mission.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{mission.ruleLine}</p>
              </Link>
            ))}
          </div>
        </DataCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DataCard className="p-4 sm:p-5">
          <SectionHeader eyebrow="Protected numbers" title="The dashboard should count like a device, not a brochure." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="kpi-card kpi-card-success">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Lifetime peace</p>
              <div className="mt-3 font-mono text-[1.9rem] leading-none tabular-nums text-foreground">{fmtEuro(stats.lifetimeEuros)}</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Accumulated through tactical pauses and believable absence.</p>
            </div>
            <div className="kpi-card kpi-card-accent">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Unlocked lessons</p>
              <div className="mt-3 font-mono text-[1.9rem] leading-none tabular-nums text-foreground">{stats.unlockedLessons}/100</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Sharpening the doctrine one quotable truth at a time.</p>
            </div>
          </div>
        </DataCard>

        <DataCard className="p-4 sm:p-5">
          <SectionHeader eyebrow="Base features" title="Four systems. One absurdist control layer." />
          <div className="mt-4 space-y-3">
            <QuickActionCard title="Calendar" detail="Protected lunch, meeting conflicts, and work compressed into its correct scale." icon={<CalendarRange className="h-4 w-4" />} action={<Link to="/calendar" className="panel-link !w-auto !px-4 !py-3">Open <ArrowRight className="h-4 w-4" /></Link>} />
            <QuickActionCard title="Wisdom notifications" detail="Dry alerts for lunch defence, liberation hour, and calendar crimes committed in daylight." icon={<Bell className="h-4 w-4" />} tone="alert" />
            <QuickActionCard title="Missions" detail="Fast-launch rituals with haptics, stronger motion, and cleaner consequence tracking." icon={<Orbit className="h-4 w-4" />} tone="accent" />
            <QuickActionCard title="Academy" detail="A progression system for people who want their boundaries explained like policy." icon={<BookOpenText className="h-4 w-4" />} tone="success" action={<Link to="/academy" className="panel-link !w-auto !px-4 !py-3">Study <Sparkles className="h-4 w-4" /></Link>} />
          </div>
        </DataCard>
      </div>

      <OnboardingWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onSaved={(nextPrefs) => {
          setPrefs(nextPrefs);
          setStats(loadStats());
        }}
      />
    </div>
  );
}
