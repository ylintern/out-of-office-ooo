import { Link, useLocation } from "@tanstack/react-router";
import { CalendarRange, CandlestickChart, GraduationCap, House, Orbit } from "lucide-react";

const tabs = [
  { to: "/", label: "Today", icon: House },
  { to: "/calendar", label: "Calendar", icon: CalendarRange },
  { to: "/missions", label: "Missions", icon: Orbit },
  { to: "/academy", label: "Academy", icon: GraduationCap },
  { to: "/ticker", label: "$OOO", icon: CandlestickChart },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto max-w-3xl rounded-[1.4rem] border border-border bg-chrome/94 p-1.5 shadow-2xl backdrop-blur-2xl">
        <ul className="grid grid-cols-5 gap-1">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-[1rem] border px-2 py-2 transition-all duration-300"
                  style={{
                    borderColor: active ? "color-mix(in oklab, var(--color-primary) 28%, transparent)" : "transparent",
                    background: active ? "var(--gradient-panel)" : "transparent",
                    color: active ? "var(--color-foreground)" : "var(--color-muted-foreground)",
                    boxShadow: active ? "var(--shadow-glow)" : "none",
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300"
                    style={{
                      borderColor: active ? "color-mix(in oklab, var(--color-primary) 35%, transparent)" : "var(--color-border)",
                      background: active ? "color-mix(in oklab, var(--color-primary) 16%, transparent)" : "var(--color-card)",
                    }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={active ? 2.3 : 1.9} />
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
