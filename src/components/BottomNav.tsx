import { Link, useLocation } from "@tanstack/react-router";
import { Calendar, Home, Target, GraduationCap, TrendingUp } from "lucide-react";

const tabs = [
  { to: "/", label: "Hoje", icon: Home },
  { to: "/calendar", label: "Calendário", icon: Calendar },
  { to: "/missions", label: "Missões", icon: Target },
  { to: "/academy", label: "Academy", icon: GraduationCap },
  { to: "/ticker", label: "$OOO", icon: TrendingUp },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/85 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-colors"
                style={{
                  color: active
                    ? "var(--necro-glow)"
                    : "var(--muted-foreground)",
                }}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.4 : 1.6}
                  style={{
                    filter: active
                      ? "drop-shadow(0 0 8px var(--necro))"
                      : "none",
                  }}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
