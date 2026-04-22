import mascot from "@/assets/mascot.png";
import { BART_TIPS, MISSIONS, fmtCompactMinutes, fmtEuro, fmtClock, isWorkHours, loadStats, minutesUntil, rankFor, saveStats, triggerHaptic } from "@/lib/ooo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, CalendarRange, Coins, Orbit, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today · $OOO" },
      { name: "description", content: "A control room for sacred breaks, strategic absence, and the 17:00 liberation bell." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [stats, setStats] = useState({ hourlyRate: 14, lichPoints: 0, lifetimeEuros: 0, lifetimeSeconds: 0, unlockedLessons: 4, completedMissions: 0, installDate: "2026-04-22T00:00:00.000Z" });
  const [now, setNow] = useState<Date | null>(null);
  const [hourlyInput, setHourlyInput] = useState("14");

  useEffect(() => {
    setStats(loadStats());
    setHourlyInput(String(loadStats().hourlyRate));
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const workMode = now ? isWorkHours(now) : true;
  const liberationMinutes = now ? minutesUntil(17, 0, now) : 0;
  const lunchMinutes = now ? minutesUntil(13, 0, now) : 0;
  const ritualMinutes = now ? minutesUntil(15, 0, now) : 0;
  const todayRevenue = now && workMode ? (((now.getHours() - 9) * 3600) + now.getMinutes() * 60 + now.getSeconds()) * (stats.hourlyRate / 3600) : 0;
  const quote = useMemo(() => BART_TIPS[stats.completedMissions % BART_TIPS.length], [stats.completedMissions]);
  const rank = rankFor(stats.lichPoints);
  const freedomCountdown = now ? fmtClock(liberationMinutes * 60) : "--:--";

  function updateRate(value: string) {
    setHourlyInput(value);
    const numeric = Number.parseFloat(value);
    if (!Number.isNaN(numeric) && numeric > 0) {
      const next = { ...stats, hourlyRate: numeric };
      setStats(next);
      saveStats(next);
      triggerHaptic("confirm");
    }
  }

  const schedule = [
    { label: "Sacred lunch", time: lunchMinutes, icon: Bell, tone: "pearl" as const, copy: "No pings. No clarifications. Only lunch." },
    { label: "Paid bathroom ritual", time: ritualMinutes, icon: Coins, tone: "success" as const, copy: "Small disappearance. Excellent return on time." },
    { label: "17:00 liberation", time: liberationMinutes, icon: Sparkles, tone: "signal" as const, copy: "Leave without a final tragic email." },
  ];

  return (
    <div className="space-y-4 px-3 pb-6 sm:px-0">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="hero-shell overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="badge-row">
                <span className="badge-chip">Absurdist calendar OS</span>
                <span className="badge-chip">Haptics-ready rituals</span>
              </div>
              <h1 className="mt-4 max-w-2xl font-display text-4xl leading-none text-foreground sm:text-5xl lg:text-6xl">
                The calendar app everyone wanted after their fifth meaningless invite.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                $OOO turns free time into the main character. Lunch is sacred, ghost meetings are elegant, and 17:00 is treated like a market opening bell for the rest of your life.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Today earned in peace" value={fmtEuro(todayRevenue)} tone="pearl" />
                <MetricCard label="Countdown to exit" value={freedomCountdown} tone="signal" />
                <MetricCard label="Current rank" value={rank} tone="ink" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/missions" className="button-premium">
                  Launch a ritual
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/calendar" className="button-ghost">
                  <CalendarRange className="h-4 w-4" />
                  Open inverted calendar
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full bg-primary/18 blur-3xl sm:h-72 sm:w-72" />
              <div className="relative flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-border bg-card/82 p-5 text-center shadow-soft backdrop-blur-xl">
                <img src={mascot} alt="$OOO mascot" className="h-44 w-44 object-contain drop-shadow-[0_30px_60px_rgba(145,107,255,0.25)] sm:h-52 sm:w-52" width={208} height={208} />
                <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                  {workMode ? "Contained mode" : "Freedom mode"}
                </div>
                <div className="mt-2 font-display text-2xl text-foreground">
                  {workMode ? "Bart recommends tactical disappearance." : "Bart confirms your evening has officially started."}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{quote}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Daily brief</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Next sacred moments</h2>
            </div>
            <div className="rounded-full border border-border bg-secondary p-3 text-primary">
              <Orbit className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {schedule.map((item) => (
              <TimelineRow key={item.label} {...item} />
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-border bg-secondary/70 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Hourly rate input</div>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3">
              <span className="font-mono text-lg text-foreground">€</span>
              <input
                type="number"
                inputMode="decimal"
                min={1}
                value={hourlyInput}
                onChange={(event) => updateRate(event.target.value)}
                className="w-full bg-transparent font-mono text-2xl text-foreground outline-none"
              />
              <span className="text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">/h</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Not judgement. Just a cleaner way to price your beautifully managed absence.</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Mission launcher</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Pick an alibi</h2>
            </div>
            <Link to="/missions" className="text-xs font-mono uppercase tracking-[0.24em] text-primary">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MISSIONS.map((mission) => (
              <Link key={mission.id} to="/missions" className="mission-tile">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border bg-secondary px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                    {mission.kicker}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">{mission.defaultMinutes ? `${mission.defaultMinutes}m` : "Manual"}</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-foreground">{mission.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{mission.ruleLine}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Dashboard</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Peace-earned analytics</h2>
            </div>
            <div className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
              Local only
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Mission count" value={stats.completedMissions.toString()} />
            <MiniStat label="Lifetime peace" value={fmtEuro(stats.lifetimeEuros)} />
            <MiniStat label="Lessons open" value={`${stats.unlockedLessons}/100`} />
          </div>
          <div className="mt-5 rounded-[1.75rem] border border-border bg-secondary/70 p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Bart memo</p>
            <p className="mt-3 font-display text-2xl text-foreground">Your calendar should look like it respects you.</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              If free time only appears as leftover crumbs between obligations, the system is not organised. It is merely confident.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link to="/academy" className="panel-link">
              Learn the art of being more Bart
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/ticker" className="panel-link">
              Open the $OOO market board
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "ink" | "pearl" | "signal" }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/82 p-4 shadow-soft">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-foreground" style={{ color: `var(--color-${tone})` }}>
        {value}
      </div>
    </div>
  );
}

function TimelineRow({ label, time, icon: Icon, tone, copy }: { label: string; time: number; icon: typeof Bell; tone: "pearl" | "success" | "signal"; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/80 p-4 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: `var(--color-${tone})`, color: `var(--color-${tone})` }}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg text-foreground">{label}</h3>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">in {fmtCompactMinutes(Math.max(0, time))}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-border bg-card/80 p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl text-foreground">{value}</div>
    </div>
  );
}
