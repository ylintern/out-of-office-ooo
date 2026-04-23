import mascot from "@/assets/mascot.png";
import { getWorkStatus, loadPrefs } from "@/lib/ooo";
import { BellRing, MoonStar, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [prefs] = useState(() => loadPrefs());

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  const workStatus = useMemo(() => (now ? getWorkStatus(now, prefs) : { inWorkday: true, untilEndMinutes: 0 }), [now, prefs]);
  const timeLabel = now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-chrome/88 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl" />
            <img src={mascot} alt="$OOO mascot" className="relative h-11 w-11 rounded-full object-cover object-center" width={44} height={44} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-tight text-foreground">$OOO</span>
              <span className="status-pill status-pill-accent">Today</span>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {workStatus.inWorkday ? "Professional captivity remains active." : "The office has lost jurisdiction."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="data-card flex items-center gap-2 px-3 py-2">
            <div className="icon-pill !h-8 !w-8 !rounded-full">
              {workStatus.inWorkday ? <BellRing className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </div>
            <div className="text-right">
              <div className="font-mono text-sm tabular-nums text-foreground">{timeLabel}</div>
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                {workStatus.inWorkday ? `${workStatus.untilEndMinutes}m to freedom` : "After hours"}
              </div>
            </div>
          </div>
          <button className="pressable hidden h-11 items-center gap-2 rounded-full border border-border bg-secondary px-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
            <Sparkles className="h-4 w-4 text-primary" />
            Bart memo
          </button>
        </div>
      </div>
    </header>
  );
}
