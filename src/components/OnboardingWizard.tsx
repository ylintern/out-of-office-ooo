import { loadPrefs, savePrefs, triggerHaptic, type OnboardingPrefs } from "@/lib/ooo";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STEPS = [
  {
    id: "hours",
    eyebrow: "Workday window",
    title: "When does the theatre open?",
    detail: "We need the official opening and closing hours of your professional captivity.",
  },
  {
    id: "lunch",
    eyebrow: "Sacred lunch",
    title: "When is nourishment non-negotiable?",
    detail: "Lunch deserves protection, not apologies.",
  },
  {
    id: "money",
    eyebrow: "Rate",
    title: "How much does an hour of pretending cost?",
    detail: "Used for the earned-while-absent counter and mission math.",
  },
  {
    id: "confirm",
    eyebrow: "Doctrine",
    title: "You are ready to monetise strategic disappearance.",
    detail: "Review the basics. They can be edited later from the dashboard.",
  },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (prefs: OnboardingPrefs) => void;
};

export function OnboardingWizard({ open, onOpenChange, onSaved }: Props) {
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<OnboardingPrefs>(() => loadPrefs());

  useEffect(() => {
    if (!open) return;
    setPrefs(loadPrefs());
    setStep(0);
  }, [open]);

  const completion = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  if (!open) return null;

  function update<K extends keyof OnboardingPrefs>(key: K, value: OnboardingPrefs[K]) {
    setPrefs((current) => ({ ...current, [key]: value }));
  }

  function close() {
    onOpenChange(false);
  }

  function skip() {
    const next = { ...prefs, completed: true };
    savePrefs(next);
    triggerHaptic("confirm");
    onSaved?.(next);
    close();
  }

  function saveAndClose() {
    const next = { ...prefs, completed: true };
    savePrefs(next);
    triggerHaptic("complete");
    onSaved?.(next);
    close();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/72 p-3 backdrop-blur-xl sm:items-center">
      <div className="data-card w-full max-w-lg overflow-hidden p-0">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-muted-foreground">Quick start</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Configure the civilised version of your workday.</h2>
            </div>
            <button
              onClick={close}
              aria-label="Close onboarding"
              className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="metric-track mt-4">
            <div className="metric-bar" style={{ width: `${completion}%` }} />
          </div>
        </div>

        <div className="px-5 py-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-muted-foreground">{STEPS[step].eyebrow}</p>
          <h3 className="mt-2 font-display text-2xl leading-none text-foreground">{STEPS[step].title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{STEPS[step].detail}</p>

          {step === 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="field-card">
                <span className="field-label">Start</span>
                <input
                  className="field-input"
                  type="time"
                  value={prefs.workdayStart}
                  onChange={(event) => update("workdayStart", event.target.value)}
                />
              </label>
              <label className="field-card">
                <span className="field-label">End</span>
                <input
                  className="field-input"
                  type="time"
                  value={prefs.workdayEnd}
                  onChange={(event) => update("workdayEnd", event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="field-card">
                <span className="field-label">Lunch starts</span>
                <input
                  className="field-input"
                  type="time"
                  value={prefs.lunchStart}
                  onChange={(event) => update("lunchStart", event.target.value)}
                />
              </label>
              <label className="field-card">
                <span className="field-label">Duration in minutes</span>
                <input
                  className="field-input"
                  type="number"
                  min={15}
                  max={180}
                  value={prefs.lunchDurationMinutes}
                  onChange={(event) => update("lunchDurationMinutes", Number(event.target.value) || 60)}
                />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-5 grid gap-3">
              <label className="field-card">
                <span className="field-label">Hourly rate</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg text-muted-foreground">€</span>
                  <input
                    className="field-input !px-0"
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step="0.5"
                    value={prefs.hourlyRate}
                    onChange={(event) => update("hourlyRate", Number(event.target.value) || 0)}
                  />
                </div>
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-5 grid gap-3">
              <div className="field-card">
                <span className="field-label">Workday doctrine</span>
                <div className="mt-2 space-y-2 text-sm leading-6 text-foreground">
                  <p>{prefs.workdayStart} → {prefs.workdayEnd}</p>
                  <p>Lunch: {prefs.lunchStart} for {prefs.lunchDurationMinutes} minutes</p>
                  <p>Rate: €{prefs.hourlyRate.toFixed(2)} / hour</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
          <button onClick={skip} className="button-ghost !px-4 !py-3">
            Skip ceremony
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="button-ghost !px-4 !py-3 disabled:opacity-40"
            >
              Back
            </button>
            {step === STEPS.length - 1 ? (
              <button onClick={saveAndClose} className="button-premium !px-4 !py-3">
                Save doctrine
              </button>
            ) : (
              <button onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))} className="button-premium !px-4 !py-3">
                Next step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
