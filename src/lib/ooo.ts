export type MissionId = "lunch" | "wc" | "coffee" | "ghost" | "focus" | "doctor";

export type MissionIcon = "utensils" | "coins" | "coffee" | "ghost" | "focus" | "file";

export type MissionAccent = "ink" | "pearl" | "signal" | "success";

export type Mission = {
  id: MissionId;
  icon: MissionIcon;
  name: string;
  kicker: string;
  ruleLine: string;
  defaultMinutes: number;
  startLine: string;
  endLine: (euros: string) => string;
  colorVar: MissionAccent;
};

export const MISSIONS: Mission[] = [
  {
    id: "lunch",
    icon: "utensils",
    name: "Sacred Lunch",
    kicker: "Protected block",
    ruleLine: "Calendar law: lunch is a border, not a suggestion.",
    defaultMinutes: 60,
    startLine: "Lunch is now under protection. Any meeting arriving here is acting with intent.",
    endLine: (euros) => `You returned nourished and morally correct. The company financed ${euros} of tactical digestion.`,
    colorVar: "pearl",
  },
  {
    id: "wc",
    icon: "coins",
    name: "Paid Bathroom Ritual",
    kicker: "Revenue ritual",
    ruleLine: "A private pause with public payroll implications.",
    defaultMinutes: 7,
    startLine: "You are temporarily unavailable to capitalism. A refined choice.",
    endLine: (euros) => `${euros} secured in elegant silence. Your manager funded premium stillness.`,
    colorVar: "success",
  },
  {
    id: "coffee",
    icon: "coffee",
    name: "Extended Coffee",
    kicker: "Soft escape",
    ruleLine: "Technically reachable. Spiritually offshore.",
    defaultMinutes: 15,
    startLine: "Coffee is aligning expectations. You are simply breathing again.",
    endLine: (euros) => `Pause concluded. ${euros} invoiced through posture, aroma, and plausible deniability.`,
    colorVar: "ink",
  },
  {
    id: "ghost",
    icon: "ghost",
    name: "Ghost Meeting",
    kicker: "Calendar camouflage",
    ruleLine: "Block the time. The meeting does not need to exist for the authority to work.",
    defaultMinutes: 45,
    startLine: "You are now visibly occupied by something unverifiable. Perfect.",
    endLine: (euros) => `The meeting dissolved on contact. ${euros} converted into performative presence.`,
    colorVar: "signal",
  },
  {
    id: "focus",
    icon: "focus",
    name: "Deep Focus Fiction",
    kicker: "Silent theatre",
    ruleLine: "Status: focused. Reality: protected from nonsense.",
    defaultMinutes: 25,
    startLine: "Deep focus has begun. Definitions are being kept deliberately vague.",
    endLine: (euros) => `Session closed. ${euros} earned while appearing devastatingly intent.`,
    colorVar: "ink",
  },
  {
    id: "doctor",
    icon: "file",
    name: "Doctor's Note",
    kicker: "Official excuse",
    ruleLine: "A solemn document for symptoms corporate culture keeps trying to rename.",
    defaultMinutes: 0,
    startLine: "You are now medically exempt from performative enthusiasm.",
    endLine: () => "Certificate issued. Recover from productivity like someone leaving a tasteful cult.",
    colorVar: "signal",
  },
];

export type Rank = "Intern" | "Office Drone" | "Senior Slacker" | "Bart Operative" | "OOO Oracle";

export const RANKS: { name: Rank; min: number }[] = [
  { name: "Intern", min: 0 },
  { name: "Office Drone", min: 50 },
  { name: "Senior Slacker", min: 200 },
  { name: "Bart Operative", min: 500 },
  { name: "OOO Oracle", min: 1500 },
];

export function rankFor(points: number): Rank {
  return RANKS.reduce<Rank>((acc, rank) => (points >= rank.min ? rank.name : acc), "Intern");
}

export type Stats = {
  hourlyRate: number;
  lichPoints: number;
  lifetimeEuros: number;
  lifetimeSeconds: number;
  unlockedLessons: number;
  completedMissions: number;
  installDate: string;
};

export type OnboardingPrefs = {
  workdayStart: string;
  workdayEnd: string;
  lunchStart: string;
  lunchDurationMinutes: number;
  hourlyRate: number;
  completed: boolean;
};

export type Reminder = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  tone: "default" | "alert" | "success" | "accent";
};

const STATS_KEY = "ooo.stats.v2";
const PREFS_KEY = "ooo.prefs.v1";

function defaultStats(): Stats {
  return {
    hourlyRate: 14,
    lichPoints: 0,
    lifetimeEuros: 0,
    lifetimeSeconds: 0,
    unlockedLessons: 4,
    completedMissions: 0,
    installDate: "2026-04-22T00:00:00.000Z",
  };
}

function defaultPrefs(): OnboardingPrefs {
  return {
    workdayStart: "09:00",
    workdayEnd: "17:00",
    lunchStart: "13:00",
    lunchDurationMinutes: 60,
    hourlyRate: 14,
    completed: false,
  };
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadPrefs(): OnboardingPrefs {
  if (typeof window === "undefined") return defaultPrefs();
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...defaultPrefs(), hourlyRate: loadStats().hourlyRate };
    return { ...defaultPrefs(), ...JSON.parse(raw) };
  } catch {
    return defaultPrefs();
  }
}

export function savePrefs(prefs: OnboardingPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  const stats = loadStats();
  saveStats({ ...stats, hourlyRate: prefs.hourlyRate });
}

export function hasCompletedOnboarding() {
  return loadPrefs().completed;
}

export function eurosFor(seconds: number, hourlyRate: number): number {
  return (seconds / 3600) * hourlyRate;
}

export function fmtEuro(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function fmtClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function fmtCompactMinutes(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes ? `${minutes}m` : ""}`;
  }
  return `${totalMinutes}m`;
}

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map((part) => Number(part));
  return hours * 60 + minutes;
}

export function formatShortTime(value: string): string {
  return value;
}

export function getWorkStatus(date = new Date(), prefs = loadPrefs()) {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return { inWorkday: false, untilEndMinutes: 0, minutesSinceStart: 0 };
  }

  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  const start = timeToMinutes(prefs.workdayStart);
  const end = timeToMinutes(prefs.workdayEnd);
  const inWorkday = nowMinutes >= start && nowMinutes < end;

  return {
    inWorkday,
    untilEndMinutes: inWorkday ? Math.max(0, end - nowMinutes) : 0,
    minutesSinceStart: inWorkday ? Math.max(0, nowMinutes - start) : 0,
  };
}

export function calculateLiveEarnings(date = new Date(), prefs = loadPrefs()) {
  const { inWorkday, minutesSinceStart } = getWorkStatus(date, prefs);
  if (!inWorkday) return 0;
  const seconds = minutesSinceStart * 60 + date.getSeconds();
  return eurosFor(seconds, prefs.hourlyRate);
}

export function getProtectedMinutesLeft(date = new Date(), prefs = loadPrefs()) {
  const nowMinutes = date.getHours() * 60 + date.getMinutes();
  const lunchStart = timeToMinutes(prefs.lunchStart);
  const lunchEnd = lunchStart + prefs.lunchDurationMinutes;

  if (nowMinutes < lunchStart) return lunchStart - nowMinutes;
  if (nowMinutes < lunchEnd) return lunchEnd - nowMinutes;
  return 0;
}

export function getSacredReminders(date = new Date(), prefs = loadPrefs()): Reminder[] {
  const { inWorkday, untilEndMinutes } = getWorkStatus(date, prefs);
  const lunchLeft = getProtectedMinutesLeft(date, prefs);
  const beforeLunch = Math.max(0, timeToMinutes(prefs.lunchStart) - (date.getHours() * 60 + date.getMinutes()));

  return [
    {
      id: "lunch-conflict",
      title: "Lunch defence protocol",
      body: "A 12:45 meeting is attempting to occupy territory that clearly belongs to lunch. This is now a boundary issue.",
      timeLabel: beforeLunch > 0 ? `in ${fmtCompactMinutes(beforeLunch)}` : "active now",
      tone: "alert",
    },
    {
      id: "lunch-start",
      title: "Nutrition has escalated",
      body: lunchLeft > 0
        ? "Please stop working immediately. Your calendar is now expected to respect food."
        : "Lunch has passed. Review the damage and restore order tomorrow.",
      timeLabel: lunchLeft > 0 ? `${fmtCompactMinutes(lunchLeft)} left` : formatShortTime(prefs.lunchStart),
      tone: lunchLeft > 0 ? "success" : "default",
    },
    {
      id: "liberation",
      title: "17:00 liberation window",
      body: inWorkday
        ? "Do not start anything tragic. The day is already trying to end with dignity."
        : "The office has lost jurisdiction. Leave the narrative there.",
      timeLabel: inWorkday ? `in ${fmtCompactMinutes(untilEndMinutes)}` : "after hours",
      tone: "accent",
    },
  ];
}

export const LESSONS: string[] = [
  "Reply at 08:59 and again at 17:01. You will look diligent without developing a close relationship with the problem.",
  "'Let me align with the team' means you would rather not answer anyone yet.",
  "Block 16:45 with something vague. Administrative fear usually finishes the job.",
  "If your status says focus, most people withdraw out of respect, superstition, or both.",
  "Any call without an agenda is simply absence trying to dress business casual.",
  "'I am reviewing priorities' is corporate for 'absolutely not today'.",
  "Who controls the calendar controls the narrative and, by extension, the blood pressure.",
  "Some emails deserve a response. Others deserve coffee first. Usually long coffee.",
  "Friday at 16:00 is a spiritual condition, not a time.",
  "Every time you say 'let's keep this async', a meeting dies quietly somewhere.",
  "Your availability should remain a rumour. Do not confirm it too fast.",
  "If it sounds strategic, even rest begins to resemble leadership.",
  "A short pause at the right moment is worth more than forty minutes of decorative concentration.",
  "Never say 'I didn't do it'. Say 'it would have been irresponsible to move without context'.",
  "A perfect schedule contains empty space. The rest is oppression with softer colours.",
  "Responding quickly creates expectation. Responding well creates professional distance.",
  "A calendar block called review gets more respect than one called sanity. Act accordingly.",
  "Lunch is not negotiable. It is merely under-defended in many organisations.",
  "When someone says 'quick question', prepare for a hostage situation with softer branding.",
];

while (LESSONS.length < 100) {
  LESSONS.push(`Lesson #${LESSONS.length + 1}: protect your time the way finance hides bad news inside a deck.`);
}

export const VIRAL_QUOTES = [
  "Rest is a discreet form of insubordination.",
  "Burnout was never proof of character. Only of context.",
  "Bart recommends composure. The system prefers theatre.",
  "If everything is urgent, nothing deserves your pulse.",
  "The calendar should serve you, not stalk you.",
  "Some days surviving corporate life already counts as exemplary output.",
];

export const BART_TIPS = [
  "Name free time like governance and no one will challenge it with enough confidence.",
  "The best moment to appear unavailable is five minutes before someone remembers you exist.",
  "If a task drains your soul, divide it into blocks and disappear between them.",
  "Your energy is not an infinite resource, despite several managers holding mining fantasies.",
  "There is a noble difference between collaborating and being permanently reachable. Learn it and defend it.",
];

export const CALENDAR_TEMPLATES = [
  { label: "Strategic free afternoon", duration: 3, start: 14, type: "free" as const },
  { label: "Ghost Friday", duration: 6, start: 11, type: "free" as const },
  { label: "Meeting that lost the will to exist", duration: 1, start: 15, type: "free" as const },
  { label: "Damage-control slab", duration: 2, start: 9, type: "work" as const },
];

export function safeVibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    return;
  }
}

export function triggerHaptic(kind: "launch" | "confirm" | "complete" | "liberation") {
  const patterns = {
    launch: [12, 18, 12],
    confirm: 24,
    complete: [20, 24, 20, 46, 40],
    liberation: [30, 24, 30, 24, 68],
  } as const;
  safeVibrate(patterns[kind]);
}

export function playBell(frequency = 440, duration = 0.6) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();

    osc.type = "triangle";
    osc.frequency.value = frequency;
    overtone.type = "sine";
    overtone.frequency.value = frequency * 1.5;

    gain.gain.value = 0.0001;
    osc.connect(gain);
    overtone.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.04);
    overtone.stop(now + duration + 0.04);
  } catch {
    return;
  }
}

export function isWorkHours(date = new Date()): boolean {
  return getWorkStatus(date).inWorkday;
}

export function minutesUntil(hour: number, minute = 0, now = new Date()): number {
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return Math.floor((target.getTime() - now.getTime()) / 60000);
}
