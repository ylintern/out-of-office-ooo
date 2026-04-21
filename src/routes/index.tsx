import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  loadStats,
  saveStats,
  fmtEuro,
  rankFor,
  isWorkHours,
  minutesUntil,
  MISSIONS,
  VIRAL_QUOTES,
} from "@/lib/ooo";
import bart from "@/assets/bart.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hoje · $OOO" },
      { name: "description", content: "O teu dia invertido: só o tempo livre conta." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const [stats, setStats] = useState(() => loadStats());
  const [tick, setTick] = useState(0);
  const [hourlyInput, setHourlyInput] = useState(stats.hourlyRate.toString());

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const work = isWorkHours(now);
  const earnedNow = work
    ? ((now.getHours() - 9) * 3600 + now.getMinutes() * 60 + now.getSeconds()) *
      (stats.hourlyRate / 3600)
    : 0;

  const minToLunch = minutesUntil(13, 0);
  const minToLiberation = minutesUntil(17, 0);
  const rank = rankFor(stats.lichPoints);
  const quote = VIRAL_QUOTES[tick % VIRAL_QUOTES.length];

  function updateRate(v: string) {
    setHourlyInput(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n > 0) {
      const next = { ...stats, hourlyRate: n };
      setStats(next);
      saveStats(next);
    }
  }

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Hero status */}
      <section
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-deep"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, color-mix(in oklab, var(--necro) 14%, transparent), transparent 60%)",
        }}
      >
        <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <img src={bart} alt="Bart" className="h-20 w-20 -mt-1 float" width={80} height={80} />
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {work ? "// modo: a fingir produtividade" : "// modo: liberdade"}
            </div>
            <h1 className="font-gothic text-2xl mt-0.5" style={{ color: "var(--necro-glow)" }}>
              {work ? "Aguenta. Falta pouco." : "Já podes existir em paz."}
            </h1>
            <p className="text-sm text-muted-foreground italic mt-1">"{quote}"</p>
          </div>
        </div>

        {work && (
          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <Stat label="Ganho hoje (a fingir)" value={fmtEuro(earnedNow)} accent="gold" />
            <Stat label="Até à libertação" value={`${minToLiberation}m`} accent="terminal" />
          </div>
        )}
      </section>

      {/* Lich rank card */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Ranking necromântico
            </div>
            <div className="font-gothic text-xl text-glow-gold" style={{ color: "var(--gold)" }}>
              {rank}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Lich Points
            </div>
            <div className="font-mono text-2xl text-glow-necro" style={{ color: "var(--necro-glow)" }}>
              {stats.lichPoints}
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Mini label="Missões" value={stats.completedMissions} />
          <Mini label="Lifetime €" value={fmtEuro(stats.lifetimeEuros)} />
          <Mini label="Lições" value={`${stats.unlockedLessons}/100`} />
        </div>
      </section>

      {/* Próximas missões sagradas */}
      <section>
        <h2 className="font-gothic text-xl mb-2">Próximas missões sagradas</h2>
        <div className="space-y-2">
          <SacredItem
            icon="🍝"
            title="Almoço Sagrado"
            sub={`em ${minToLunch >= 60 ? `${Math.floor(minToLunch / 60)}h${minToLunch % 60}m` : `${minToLunch}m`}`}
          />
          <SacredItem
            icon="⏰"
            title="Liberation às 17:00"
            sub={`em ${minToLiberation >= 60 ? `${Math.floor(minToLiberation / 60)}h${minToLiberation % 60}m` : `${minToLiberation}m`}`}
            accent
          />
          <SacredItem icon="🚽" title="WC Pago" sub="a qualquer momento, é teu direito" />
        </div>
        <Link
          to="/missions"
          className="mt-3 block w-full rounded-md border border-necro bg-primary/10 py-3 text-center font-mono text-xs uppercase tracking-widest text-glow-necro"
          style={{ color: "var(--necro-glow)" }}
        >
          Iniciar missão →
        </Link>
      </section>

      {/* Quick missions */}
      <section>
        <h2 className="font-gothic text-xl mb-2">Acesso rápido</h2>
        <div className="grid grid-cols-3 gap-2">
          {MISSIONS.slice(0, 6).map((m) => (
            <Link
              key={m.id}
              to="/missions"
              className="rounded-xl border border-border bg-card p-3 text-center hover:border-necro transition-colors"
            >
              <div className="text-2xl">{m.emoji}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hourly rate */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          O teu €/hora (para calcular paz adquirida)
        </label>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-xl text-glow-gold" style={{ color: "var(--gold)" }}>
            €
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            value={hourlyInput}
            onChange={(e) => updateRate(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-lg outline-none focus:border-necro"
          />
          <span className="font-mono text-xs text-muted-foreground">/h</span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground italic">
          Bart não julga. Bart calcula.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "gold" | "terminal" | "necro";
}) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-3">
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className="font-mono text-xl tabular-nums mt-1"
        style={{ color: `var(--${accent})` }}
      >
        {value}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border py-2">
      <div className="font-mono text-sm">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function SacredItem({
  icon,
  title,
  sub,
  accent,
}: {
  icon: string;
  title: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
      style={{
        borderColor: accent ? "var(--candle)" : "var(--border)",
        boxShadow: accent ? "0 0 18px -6px var(--candle)" : undefined,
      }}
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-gothic text-base">{title}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {sub}
        </div>
      </div>
      {accent && (
        <span
          className="font-mono text-[10px] uppercase tracking-widest blink"
          style={{ color: "var(--candle)" }}
        >
          ● iminente
        </span>
      )}
    </div>
  );
}
