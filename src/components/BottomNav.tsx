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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-chrome/90 backdrop-blur-2xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-6xl grid-cols-5 gap-1 px-2 py-2 sm:px-4">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className="group flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2 transition-all duration-300"
                style={{
                  borderColor: active ? "var(--color-primary)" : "transparent",
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
    </nav>
  );
}
