import { DataCard, KpiCard, SectionHeader, StatusPill } from "@/components/dashboard/DashboardPrimitives";
import { CALENDAR_TEMPLATES, fmtCompactMinutes, getSacredReminders, loadPrefs } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightLeft, CalendarClock, Plus, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · $OOO" },
      { name: "description", content: "Protected lunch, work conflicts, and the inverted calendar that gives free time the better real estate." },
    ],
  }),
  component: CalendarPage,
});

type Block = {
  id: string;
  day: number;
  start: number;
  end: number;
  label: string;
  type: "free" | "work" | "conflict";
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 11 }, (_, index) => 8 + index);

const SEED: Block[] = [
  { id: "1", day: 0, start: 9, end: 12.5, label: "Inbox theatre", type: "work" },
  { id: "2", day: 0, start: 12.5, end: 14, label: "Protected lunch", type: "free" },
  { id: "3", day: 0, start: 12.75, end: 13.25, label: "Meeting attempting lunch theft", type: "conflict" },
  { id: "4", day: 1, start: 9, end: 11, label: "Visible diligence", type: "work" },
  { id: "5", day: 1, start: 11, end: 12.5, label: "Coffee recovery arc", type: "free" },
  { id: "6", day: 2, start: 13, end: 17, label: "Strategic free afternoon", type: "free" },
  { id: "7", day: 3, start: 9, end: 10.5, label: "Deep focus fiction", type: "free" },
  { id: "8", day: 3, start: 10.5, end: 12.5, label: "Unavoidable admin slab", type: "work" },
  { id: "9", day: 4, start: 10, end: 16.5, label: "Ghost Friday", type: "free" },
];

function CalendarPage() {
  const [blocks, setBlocks] = useState<Block[]>(SEED);
  const [day, setDay] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const prefs = loadPrefs();
  const reminders = getSacredReminders(new Date(), prefs);

  const dayBlocks = useMemo(() => blocks.filter((block) => block.day === day), [blocks, day]);
  const freeHours = dayBlocks.filter((block) => block.type === "free").reduce((sum, block) => sum + (block.end - block.start), 0);
  const workHours = dayBlocks.filter((block) => block.type === "work").reduce((sum, block) => sum + (block.end - block.start), 0);
  const conflictCount = dayBlocks.filter((block) => block.type === "conflict").length;

  function addTemplate(index: number) {
    const template = CALENDAR_TEMPLATES[index];
    const id = `${template.label}-${day}-${blocks.length + 1}`;
    setBlocks((current) => [
      ...current,
      {
        id,
        day,
        start: template.start,
        end: template.start + template.duration,
        label: template.label,
        type: template.type,
      },
    ]);
    setSelected(id);
  }

  return (
    <div className="app-stack px-0 pb-4">
      <DataCard className="p-4 sm:p-5">
        <SectionHeader
          eyebrow="Calendar intelligence"
          title="A week arranged in the correct moral order."
          detail="Free time receives scale, protection, and visual authority; work remains present but visibly demoted."
          action={<StatusPill label={conflictCount ? `${conflictCount} conflict${conflictCount > 1 ? "s" : ""}` : "No active theft"} tone={conflictCount ? "alert" : "success"} />}
        />
        <div className="mt-4 mini-grid">
          <KpiCard label="Protected today" value={`${freeHours.toFixed(1)}h`} hint="Time that still belongs to a functioning nervous system." tone="success" progress={Math.min(100, (freeHours / 8) * 100)} />
          <KpiCard label="Work compression" value={`${workHours.toFixed(1)}h`} hint="Administrative matter kept in proportion." tone="default" progress={Math.min(100, (workHours / 8) * 100)} />
          <KpiCard label="Lunch doctrine" value={`${prefs.lunchStart}`} hint={`Protected for ${prefs.lunchDurationMinutes} minutes.`} tone="accent" />
          <KpiCard label="Inverse reminders" value={String(reminders.length)} hint="Sarcastic warnings triggered by bad calendar behaviour." tone="alert" />
        </div>
      </DataCard>

      <div className="grid gap-3 xl:grid-cols-[1.08fr_0.92fr]">
        <DataCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader eyebrow="Day switcher" title="Choose today’s damage." detail="Switch days fast and keep the physical feel of a real calendar surface." />
            <div className="icon-pill">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {DAYS.map((label, index) => {
              const active = day === index;
              return (
                <button
                  key={label}
                  onClick={() => setDay(index)}
                  className="rounded-[1rem] border px-3 py-3 text-left transition-all duration-300"
                  style={{
                    borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                    background: active ? "var(--gradient-panel)" : "var(--color-card)",
                    boxShadow: active ? "var(--shadow-glow)" : "none",
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">Day {index + 1}</div>
                  <div className="mt-1 font-display text-lg text-foreground">{label}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            {HOURS.map((hour) => {
              const block = dayBlocks.find((entry) => hour >= Math.floor(entry.start) && hour < entry.end);
              const selectedState = block?.id === selected;
              const scaleHeight = block ? (block.type === "free" ? 88 : block.type === "conflict" ? 64 : 28) : 32;
              const label = block?.type === "free" ? "Protected" : block?.type === "conflict" ? "Conflict" : "Work";
              return (
                <div key={hour} className="group flex items-center gap-3 rounded-[1rem] border border-transparent px-1 py-1 transition-colors duration-300 hover:border-border/70">
                  <div className="w-14 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  <div className="flex-1">
                    {block ? (
                      <button
                        onClick={() => setSelected(block.id)}
                        className="flex w-full items-center rounded-[1rem] border px-4 text-left transition-all duration-300"
                        style={{
                          minHeight: scaleHeight,
                          borderColor:
                            block.type === "free"
                              ? "color-mix(in oklab, var(--color-primary) 28%, var(--color-border))"
                              : block.type === "conflict"
                                ? "color-mix(in oklab, var(--color-signal) 38%, var(--color-border))"
                                : "var(--color-border)",
                          background:
                            block.type === "free"
                              ? "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 20%, var(--color-card)), color-mix(in oklab, var(--color-pearl) 18%, var(--color-card)))"
                              : block.type === "conflict"
                                ? "linear-gradient(135deg, color-mix(in oklab, var(--color-signal) 18%, var(--color-card)), color-mix(in oklab, var(--color-primary) 10%, var(--color-card)))"
                                : "linear-gradient(180deg, color-mix(in oklab, var(--color-secondary) 88%, var(--color-card)), var(--color-card))",
                          boxShadow: selectedState ? "var(--shadow-glow)" : "none",
                          transform: selectedState ? "translateX(4px)" : "translateX(0)",
                        }}
                      >
                        <div className="flex-1 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-display text-lg text-foreground">{block.label}</div>
                            <StatusPill label={label} tone={block.type === "free" ? "success" : block.type === "conflict" ? "alert" : "default"} />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {block.type === "free"
                              ? "Protected blocks physically expand because time off should not look like an afterthought."
                              : block.type === "conflict"
                                ? "This event is attempting to eat lunch. The app is judging it correctly."
                                : "Work still appears, just no longer as the dominant design ideology."}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="h-8 rounded-full border border-dashed border-border/65 bg-secondary/45" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DataCard>

        <div className="space-y-3">
          <DataCard className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHeader eyebrow="Conflict feed" title="Why the warnings trigger" detail="Every alert should explain itself instead of flashing like a guilty productivity app." />
              <div className="icon-pill">
                <ShieldAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="calendar-lane">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg text-foreground">{reminder.title}</h3>
                    <StatusPill label={reminder.timeLabel} tone={reminder.tone} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{reminder.body}</p>
                </div>
              ))}
            </div>
          </DataCard>

          <DataCard className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHeader eyebrow="Templates" title="Insert better priorities" detail="One tap to protect time with cleaner defaults and better names." />
              <div className="icon-pill">
                <Plus className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {CALENDAR_TEMPLATES.map((template, index) => (
                <button key={template.label} onClick={() => addTemplate(index)} className="mission-tile w-full text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-display text-lg text-foreground">{template.label}</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {template.type === "free"
                          ? "Expands protected time and gives it the visual authority it deserves."
                          : "Adds a compact administrative slab without letting it annex the day."}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary">{fmtCompactMinutes(template.duration * 60)}</span>
                  </div>
                </button>
              ))}
            </div>
          </DataCard>

          <DataCard className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <SectionHeader eyebrow="Selection" title={selected ? "Current block" : "Nothing selected"} detail={selected ? "Pressed states, movement, and clearer labels make the calendar feel like a product, not a spreadsheet in costume." : "Select any block to inspect it."} />
              <div className="icon-pill">
                <CalendarClock className="h-4 w-4" />
              </div>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
}
