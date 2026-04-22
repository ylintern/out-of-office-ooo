import { CALENDAR_TEMPLATES } from "@/lib/ooo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightLeft, CalendarClock, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar · $OOO" },
      { name: "description", content: "The inverted calendar where free time gets the prime real estate and work is compressed into a footnote." },
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
  type: "free" | "work";
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 11 }, (_, index) => 8 + index);

const SEED: Block[] = [
  { id: "1", day: 0, start: 9, end: 12.5, label: "Inbox theatre", type: "work" },
  { id: "2", day: 0, start: 12.5, end: 14, label: "Sacred lunch", type: "free" },
  { id: "3", day: 0, start: 15, end: 15.25, label: "Paid bathroom ritual", type: "free" },
  { id: "4", day: 1, start: 9, end: 11, label: "Visible diligence", type: "work" },
  { id: "5", day: 1, start: 11, end: 12.5, label: "Coffee recovery arc", type: "free" },
  { id: "6", day: 2, start: 13, end: 17, label: "Strategic free afternoon", type: "free" },
  { id: "7", day: 3, start: 9, end: 10.5, label: "Deep focus fiction", type: "free" },
  { id: "8", day: 3, start: 10.5, end: 12.5, label: "Unavoidable admin", type: "work" },
  { id: "9", day: 4, start: 10, end: 16.5, label: "Friday ghost protocol", type: "free" },
];

function CalendarPage() {
  const [blocks, setBlocks] = useState<Block[]>(SEED);
  const [day, setDay] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const dayBlocks = useMemo(() => blocks.filter((block) => block.day === day), [blocks, day]);
  const freeHours = dayBlocks.filter((block) => block.type === "free").reduce((sum, block) => sum + (block.end - block.start), 0);
  const workHours = dayBlocks.filter((block) => block.type === "work").reduce((sum, block) => sum + (block.end - block.start), 0);

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
    <div className="space-y-4 px-3 pb-6 sm:px-0">
      <section className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">Calendar engine</p>
            <h1 className="mt-2 font-display text-4xl text-foreground">The inverted week.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Free time gets the larger blocks, the better gradients, and the real sense of ceremony. Work still exists, but it is compressed into something closer to an annotation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryCard label="Celebrated today" value={`${freeHours.toFixed(1)}h`} tone="primary" />
            <SummaryCard label="Administrative drag" value={`${workHours.toFixed(1)}h`} tone="muted" />
          </div>
        </div>
      </section>

      <section className="surface-panel p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Day switcher</p>
            <h2 className="mt-2 font-display text-2xl text-foreground">Choose the narrative.</h2>
          </div>
          <div className="rounded-full border border-border bg-secondary p-3 text-primary">
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
                className="rounded-2xl border px-3 py-3 text-left transition-all duration-300"
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
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-panel overflow-hidden p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Inverted schedule</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">{DAYS[day]}</h2>
            </div>
            <div className="rounded-full border border-border bg-secondary p-3 text-primary">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {HOURS.map((hour) => {
              const block = dayBlocks.find((entry) => hour >= Math.floor(entry.start) && hour < entry.end);
              const selectedState = block?.id === selected;
              const scaleHeight = block ? (block.type === "free" ? 88 : 22) : 34;
              return (
                <div key={hour} className="group flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1 transition-colors duration-300 hover:border-border/70">
                  <div className="w-14 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  <div className="flex-1">
                    {block ? (
                      <button
                        onClick={() => setSelected(block.id)}
                        className="flex w-full items-center rounded-[1.5rem] border px-4 text-left transition-all duration-300"
                        style={{
                          minHeight: scaleHeight,
                          borderColor: block.type === "free" ? "color-mix(in oklab, var(--color-primary) 28%, var(--color-border))" : "var(--color-border)",
                          background:
                            block.type === "free"
                              ? "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 20%, var(--color-card)), color-mix(in oklab, var(--color-pearl) 18%, var(--color-card)))"
                              : "linear-gradient(180deg, color-mix(in oklab, var(--color-secondary) 88%, var(--color-card)), var(--color-card))",
                          boxShadow: selectedState ? "var(--shadow-glow)" : "none",
                          transform: selectedState ? "translateX(4px)" : "translateX(0)",
                        }}
                      >
                        <div className="flex-1 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-display text-lg text-foreground">{block.label}</div>
                            <span className="rounded-full border border-border bg-card/80 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                              {block.type === "free" ? "Protected" : "Compressed"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {block.type === "free"
                              ? "This block expands because your nervous system deserves visible respect."
                              : "Work still appears, just no longer as the dominant visual ideology."}
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
        </div>

        <div className="space-y-4">
          <section className="surface-panel p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Templates</p>
                <h2 className="mt-2 font-display text-2xl text-foreground">Insert better priorities</h2>
              </div>
              <div className="rounded-full border border-border bg-secondary p-3 text-primary">
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
                        {template.type === "free" ? "Adds a protected freedom block with celebratory scale." : "Adds a compact work slab so the absurdity remains balanced."}
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-secondary px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                      {template.duration}h
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="surface-panel p-5 sm:p-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Selection brief</p>
            <h2 className="mt-2 font-display text-2xl text-foreground">{selected ? "Current block" : "No block selected"}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {selected
                ? "Microinteractions matter. A calendar should confirm choices with movement, depth, and calm authority instead of behaving like a spreadsheet wearing shoes."
                : "Tap any block to inspect it. The calendar should feel alive, not resigned."}
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "primary" | "muted" }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card/82 p-4 shadow-soft">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl" style={{ color: tone === "primary" ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
        {value}
      </div>
    </div>
  );
}
