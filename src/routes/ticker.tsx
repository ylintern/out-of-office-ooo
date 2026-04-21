import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import bart from "@/assets/bart.png";
import { isWorkHours, minutesUntil } from "@/lib/ooo";

export const Route = createFileRoute("/ticker")({
  head: () => ({
    meta: [
      { title: "$OOO Ticker · Lore Inkchain" },
      { name: "description", content: "Quanto menos trabalhas, mais sobe. Bart na inkchain." },
    ],
  }),
  component: TickerPage,
});

function TickerPage() {
  const [price, setPrice] = useState(0.069);
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 40 }, (_, i) => 0.04 + Math.sin(i / 3) * 0.012 + i * 0.0008)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => Math.max(0.001, p + (Math.random() - 0.42) * 0.004));
      setHistory((h) => [...h.slice(-39), price]);
    }, 1500);
    return () => clearInterval(id);
  }, [price]);

  const change = ((price - history[0]) / history[0]) * 100;
  const open = !isWorkHours();
  const minToOpen = minutesUntil(17, 0);

  return (
    <div>
      {/* Ticker tape */}
      <div className="border-b border-border bg-card overflow-hidden">
        <div className="ticker-tape whitespace-nowrap py-2 font-mono text-xs">
          {Array.from({ length: 2 }).map((_, idx) => (
            <span key={idx} className="inline-flex gap-6 px-3">
              {[
                ["$OOO", price.toFixed(4), change],
                ["$LUNCH", "1.337", 4.2],
                ["$WC", "0.420", 6.9],
                ["$GHOST", "0.069", -2.1],
                ["$BART", "100.00", 0],
                ["$NAP", "0.250", 12.3],
              ].map(([t, p, c], i) => (
                <span key={`${idx}-${i}`} className="inline-flex gap-2">
                  <span style={{ color: "var(--necro-glow)" }}>{t as string}</span>
                  <span>{p as string}</span>
                  <span style={{ color: (c as number) >= 0 ? "var(--terminal)" : "var(--candle)" }}>
                    {(c as number) >= 0 ? "▲" : "▼"} {Math.abs(c as number).toFixed(2)}%
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Price card */}
        <section className="rounded-2xl border border-necro bg-card p-5 shadow-necro relative overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-20" />
          <div className="relative">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  $OOO / USD
                </div>
                <div
                  className="font-mono text-5xl tabular-nums text-glow-necro"
                  style={{ color: "var(--necro-glow)" }}
                >
                  ${price.toFixed(4)}
                </div>
              </div>
              <div
                className="font-mono text-lg"
                style={{ color: change >= 0 ? "var(--terminal)" : "var(--candle)" }}
              >
                {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </div>
            </div>
            <Sparkline data={history} positive={change >= 0} />
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground italic">
              quanto menos trabalhas, mais sobe.
            </div>
          </div>
        </section>

        {/* Market open */}
        <section
          className="rounded-2xl border p-4 text-center"
          style={{
            borderColor: open ? "var(--terminal)" : "var(--candle)",
            background: open
              ? "color-mix(in oklab, var(--terminal) 10%, var(--card))"
              : "var(--card)",
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {open ? "🔔 MARKET OPEN" : "MARKET CLOSED"}
          </div>
          <div className="font-gothic text-xl mt-1">
            {open
              ? "O dia começou. Foste libertado."
              : `Sino bate em ${minToOpen >= 60 ? `${Math.floor(minToOpen / 60)}h${minToOpen % 60}m` : `${minToOpen}m`}.`}
          </div>
        </section>

        {/* Manifesto */}
        <section className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
          <img
            src={bart}
            alt=""
            className="absolute -right-6 -bottom-6 h-40 w-40 opacity-30 float"
            width={160}
            height={160}
          />
          <div className="relative">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Manifesto
            </div>
            <h2 className="font-gothic text-2xl mt-1" style={{ color: "var(--gold)" }}>
              Bart não é CEO.
            </h2>
            <p className="font-gothic text-lg mt-1">
              Bart é a personificação da eficiência preguiçosa.
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Há 100 anos que Bartholomew, lich de fato e gravata, ensina mortais a evitar
              trabalho com classe. Não combatemos o sistema. Recusamo-nos a participar nele
              com vigor. <span style={{ color: "var(--necro-glow)" }}>Descansar é resistência.</span>
            </p>
          </div>
        </section>

        {/* Whitepaper paródia */}
        <section className="rounded-2xl border border-gold bg-card p-5 shadow-gold">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Whitepaper v0.069 · 1 página
          </div>
          <h3 className="font-gothic text-xl mt-1 text-glow-gold" style={{ color: "var(--gold)" }}>
            $OOO: a primeira moeda lastreada em paz adquirida.
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>• <strong>Supply:</strong> 100,000,000,000 (um por neurónio queimado em 2024).</li>
            <li>• <strong>Mecanismo:</strong> deflacionário cada vez que entras em call.</li>
            <li>• <strong>Staking:</strong> faz nada, ganha mais.</li>
            <li>• <strong>Governance:</strong> Bart vota. Tu descansas.</li>
            <li>• <strong>Roadmap:</strong> não há. Roadmaps são uma ferramenta opressiva.</li>
          </ul>
        </section>

        {/* Mint card */}
        <button
          onClick={() => {
            if (typeof navigator !== "undefined" && navigator.share) {
              navigator
                .share({
                  title: "$OOO",
                  text: "Acabei de mintar o meu Out of Office Day. Bart abençoou. $OOO",
                  url: typeof location !== "undefined" ? location.origin : undefined,
                })
                .catch(() => undefined);
            }
          }}
          className="w-full rounded-2xl border-2 border-dashed border-gold py-5 font-gothic text-xl text-glow-gold"
          style={{ color: "var(--gold)" }}
        >
          ✦ Mint your $OOO Day ✦
        </button>

        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground pb-4">
          $OOO · paródia · não é conselho financeiro · é conselho mental
        </p>
      </div>
    </div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 320;
  const h = 60;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / Math.max(0.0001, max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = positive ? "var(--terminal)" : "var(--candle)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full h-16">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        points={pts}
        style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
      />
    </svg>
  );
}
