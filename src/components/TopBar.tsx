import mascot from "@/assets/mascot.png";
import { isWorkHours } from "@/lib/ooo";
import { BellRing, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const workHours = useMemo(() => (now ? isWorkHours(now) : true), [now]);
  const timeLabel = now
    ? now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-chrome/82 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl" />
            <img src={mascot} alt="$OOO mascot" className="relative h-11 w-11 object-contain" width={44} height={44} />
          </div>
          <div className="leading-none">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-tight text-foreground">$OOO</span>
              <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Out of Office
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              The cult calendar for people who look busy and leave on time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card/88 px-3 py-2 shadow-soft">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border"
            style={{
              borderColor: workHours ? "var(--color-signal)" : "var(--color-primary)",
              color: workHours ? "var(--color-signal)" : "var(--color-primary)",
            }}
          >
            {workHours ? <Clock3 className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
          </div>
          <div className="text-right">
            <div className="font-mono text-sm tabular-nums text-foreground">{timeLabel}</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
              {workHours ? "Contained mode" : "Market open"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
