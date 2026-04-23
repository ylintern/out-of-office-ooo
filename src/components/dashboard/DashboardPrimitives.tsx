import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  detail,
  action,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-2 font-display text-[1.65rem] leading-none text-foreground">{title}</h2>
        {detail ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DataCard({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("data-card", className)}>{children}</section>;
}

export function StatusPill({ label, tone = "default" }: { label: string; tone?: "default" | "alert" | "success" | "accent" }) {
  return <span className={cn("status-pill", `status-pill-${tone}`)}>{label}</span>;
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  progress,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "alert" | "success" | "accent";
  progress?: number;
}) {
  return (
    <div className={cn("kpi-card", `kpi-card-${tone}`)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
        <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
      </div>
      <div className="mt-3 font-mono text-[1.9rem] leading-none tabular-nums text-foreground">{value}</div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>
      {typeof progress === "number" ? (
        <div className="metric-track mt-4">
          <div className="metric-bar" style={{ width: `${Math.max(6, Math.min(100, progress))}%` }} />
        </div>
      ) : null}
    </div>
  );
}

export function QuickActionCard({
  title,
  detail,
  icon,
  tone = "default",
  action,
}: {
  title: string;
  detail: string;
  icon: ReactNode;
  tone?: "default" | "alert" | "success" | "accent";
  action?: ReactNode;
}) {
  return (
    <div className={cn("action-card", `action-card-${tone}`)}>
      <div className="icon-pill">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg leading-none text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
