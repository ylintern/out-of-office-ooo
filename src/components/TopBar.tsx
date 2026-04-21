import bart from "@/assets/bart.png";
import { isWorkHours } from "@/lib/ooo";
import { useEffect, useState } from "react";

export function TopBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const work = isWorkHours(now);
  const time = now.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <img
            src={bart}
            alt="Bartholomew"
            className="h-9 w-9 -mb-1 pulse-necro"
            width={36}
            height={36}
          />
          <div className="leading-none">
            <div className="font-gothic text-lg text-glow-necro" style={{ color: "var(--necro-glow)" }}>
              $OOO
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Out of Office
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm" style={{ color: work ? "var(--candle)" : "var(--terminal)" }}>
            {time}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {work ? "● MARKET CLOSED" : "● MARKET OPEN"}
          </div>
        </div>
      </div>
    </header>
  );
}
