import mascot from "@/assets/mascot.png";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BellRing, CandlestickChart, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/ticker")({
  head: () => ({
    meta: [
      { title: "$OOO · Ticker" },
      { name: "description", content: "A sharper fake market board where reduced productivity becomes bullish momentum." },
    ],
  }),
  component: TickerPage,
});

function TickerPage() {
  const [price, setPrice] = useState(0.0691);
  const [history, setHistory] = useState<number[]>(Array.from({ length: 32 }, (_, i) => 0.05 + Math.sin(i / 3) * 0.008 + i * 0.0007));

  useEffect(() => {
    const id = window.setInterval(() => {
      setPrice((current) => {
        const next = Math.max(0.001, current + (Math.random() - 0.43) * 0.003);
        setHistory((prev) => [...prev.slice(-31), next]);
        return next;
      });
    }, 1600);
    return () => window.clearInterval(id);
  }, []);

  const change = useMemo(() => ((price - history[0]) / history[0]) * 100, [history, price]);

  return (
    <div className="space-y-4 px-3 pb-6 sm:px-0">
      <section className="surface-panel overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Inkchain desk</p>
            <h1 className="mt-2 font-display text-4xl text-foreground">$OOO trades on reduced enthusiasm.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The aesthetic is now closer to a polished pseudo-terminal for degenerates with immaculate calendars: stronger hierarchy, cleaner data cards, and better satire density.
            </p>
          </div>
          <div className="rounded-full border border-border bg-secondary p-4 text-primary">
            <CandlestickChart className="h-5 w-5" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">$OOO / USD</div>
              <div className="mt-2 font-mono text-5xl tabular-nums text-foreground">${price.toFixed(4)}</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {change >= 0 ? "+" : ""}{change.toFixed(2)}%
              </div>
            </div>
            <img src={mascot} alt="$OOO mascot" className="h-24 w-24 object-contain" width={96} height={96} />
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-border bg-card/82 p-4">
            <Sparkline data={history} positive={change >= 0} />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Thesis: every ignored notification slightly improves the chart. Every cancelled meeting adds structural strength.
          </p>
        </div>

        <div className="space-y-4">
          <section className="surface-panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Manifesto</p>
                <h2 className="mt-2 font-display text-3xl text-foreground">Bart is not a CEO.</h2>
              </div>
              <div className="rounded-full border border-border bg-secondary p-3 text-primary">
                <BellRing className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Bart is the personification of lazy efficiency: polished, dry, impossible to rush, and permanently unimpressed by productivity theatre. The goal is not collapse. The goal is composure.
            </p>
          </section>

          <section className="surface-panel p-5 sm:p-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Whitepaper excerpt</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground">
              <li><strong>Asset class:</strong> emotionally backed calendar satire.</li>
              <li><strong>Consensus:</strong> if the meeting could have been a memo, holders vote with absence.</li>
              <li><strong>Yield:</strong> denominated in peace, composure, and stolen minutes.</li>
              <li><strong>Governance:</strong> Bart reviews proposals in principle, never in a rush.</li>
            </ul>
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: "$OOO", text: "Minted my $OOO day. The chart approved my absence." }).catch(() => undefined);
                }
              }}
              className="button-premium mt-5 w-full justify-center"
            >
              <Share2 className="h-4 w-4" />
              Share the market fiction
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const width = 320;
  const height = 72;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / Math.max(0.0001, max - min)) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full">
      <polyline fill="none" stroke={positive ? "var(--color-success)" : "var(--color-signal)"} strokeWidth={3} points={points} style={{ filter: `drop-shadow(0 0 10px ${positive ? "var(--color-success)" : "var(--color-signal)"})` }} />
    </svg>
  );
}
