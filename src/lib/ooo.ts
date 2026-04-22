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
    name: "Almoço Sagrado",
    kicker: "Protected block",
    ruleLine: "É agenda blindada. Se insistirem, insistem contra a civilização.",
    defaultMinutes: 60,
    startLine: "Almoço em curso. A tua alma saiu do Slack e foi sentar-se ao sol.",
    endLine: (euros) => `Regressaste composto. A empresa financiou ${euros} de digestão estratégica.`,
    colorVar: "pearl",
  },
  {
    id: "wc",
    icon: "coins",
    name: "WC Pago",
    kicker: "Revenue ritual",
    ruleLine: "A pausa é íntima. O salário continua público.",
    defaultMinutes: 7,
    startLine: "Estás temporariamente indisponível para o capitalismo. Excelente decisão.",
    endLine: (euros) => `${euros} de paz adquirida. O teu manager patrocinou silêncio premium.`,
    colorVar: "success",
  },
  {
    id: "coffee",
    icon: "coffee",
    name: "Café Estendido",
    kicker: "Soft escape",
    ruleLine: "Tecnicamente disponível. Tecnicamente é uma palavra generosa.",
    defaultMinutes: 15,
    startLine: "O café está a alinhar expectativas. Tu estás só a respirar melhor.",
    endLine: (euros) => `Pausa concluída. ${euros} faturados com postura impecável e cafeína.`,
    colorVar: "ink",
  },
  {
    id: "ghost",
    icon: "ghost",
    name: "Reunião Fantasma",
    kicker: "Calendar camouflage",
    ruleLine: "Bloqueias o tempo. A reunião não existe. A autoridade sim.",
    defaultMinutes: 45,
    startLine: "Estás bloqueado em calendário. É a forma mais elegante de desaparecer.",
    endLine: (euros) => `A reunião evaporou-se. ${euros} convertidos em presença performativa.`,
    colorVar: "signal",
  },
  {
    id: "focus",
    icon: "focus",
    name: "Deep Focus Falso",
    kicker: "Silent theatre",
    ruleLine: "Status: concentrado. Realidade: indisponível para absurdos alheios.",
    defaultMinutes: 25,
    startLine: "Entraste em foco profundo. O que isso significa não é do interesse de ninguém.",
    endLine: (euros) => `Sessão encerrada. ${euros} ganhos a parecer intensamente ocupado.`,
    colorVar: "ink",
  },
  {
    id: "doctor",
    icon: "file",
    name: "Doctor's Note",
    kicker: "Official excuse",
    ruleLine: "Documento solene para sintomas que a cultura corporate finge não ver.",
    defaultMinutes: 0,
    startLine: "Ficas oficialmente dispensado de entusiasmo performativo por ordem médica satírica.",
    endLine: () => "Atestado emitido. Recupera da produtividade como quem sai de um culto.",
    colorVar: "signal",
  },
];

export type Rank = "Estagiário" | "Office Drone" | "Senior Slacker" | "Bart Operative" | "OOO Oracle";

export const RANKS: { name: Rank; min: number }[] = [
  { name: "Estagiário", min: 0 },
  { name: "Office Drone", min: 50 },
  { name: "Senior Slacker", min: 200 },
  { name: "Bart Operative", min: 500 },
  { name: "OOO Oracle", min: 1500 },
];

export function rankFor(points: number): Rank {
  return RANKS.reduce<Rank>((acc, rank) => (points >= rank.min ? rank.name : acc), "Estagiário");
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

const STATS_KEY = "ooo.stats.v2";

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

export const LESSONS: string[] = [
  "Responde a emails às 8h59 e às 17h01. Parecerás dedicado sem conviver muito com o problema.",
  "'Vou alinhar com a equipa' significa apenas que ainda não queres responder a ninguém.",
  "Marca um bloqueio às 16h45. O medo administrativo faz o resto.",
  "Se o status disser focus, 70% das pessoas desistem por respeito ou superstição.",
  "Toda a call com agenda vazia é um pedido elegante para estares ausente em espírito.",
  "'Estou a rever prioridades' é português corporate para 'não hoje'.",
  "Quem controla o calendário controla a narrativa e, por arrasto, a paz.",
  "Há emails que merecem resposta. Há outros que merecem um café primeiro. Normalmente, um café longo.",
  "Sexta às 16h é um estado de consciência, não uma hora.",
  "Sempre que disseres 'vamos deixar assíncrono', uma reunião morre em silêncio.",
  "A tua disponibilidade é um rumor. Não o confirmes com pressa.",
  "Se parecer estratégico, até o descanso passa por liderança.",
  "Uma pausa curta no momento certo vale mais do que 40 minutos a fingir concentração.",
  "Nunca digas 'não fiz'. Diz 'não fazia sentido avançar sem contexto'.",
  "Há um tipo de produtividade que só existe porque alguém decidiu medir sofrimento.",
  "A agenda perfeita tem espaço. O resto é opressão com cores suaves.",
  "Responder depressa cria expectativa. Responder bem cria distância profissional.",
  "Toda a empresa respeita mais um bloco chamado review do que um bloco chamado sanidade.",
  "O teu almoço não é negociável. É só mal defendido em muitas organizações.",
  "Quando disserem 'rápido', prepara-te para um abuso de calendário em traje casual.",
];

while (LESSONS.length < 100) {
  LESSONS.push(`Lição #${LESSONS.length + 1}: protege o teu tempo como quem esconde ouro num documento partilhado.`);
}

export const VIRAL_QUOTES = [
  "Descansar é uma forma discreta de insubordinação.",
  "O burnout nunca foi prova de carácter. Só de contexto tóxico.",
  "Bart recomenda calma. O sistema prefere espetáculo.",
  "Se tudo é urgente, nada merece a tua pulsação.",
  "A agenda existe para te servir, não para te perseguir.",
  "Há dias em que sobreviver ao corporate já conta como performance sólida.",
];

export const BART_TIPS = [
  "Marca tempo livre como se fosse governance. Ninguém questiona a palavra certa com convicção suficiente.",
  "O melhor momento para parecer indisponível é cinco minutos antes de alguém precisar de ti.",
  "Se uma tarefa te drena a alma, parte-a em blocos e desaparece entre eles.",
  "A tua energia não é um recurso infinito, embora alguns managers tenham fantasia de mineração.",
  "Há uma diferença nobre entre colaborar e estar permanentemente acessível. Aprende-a e protege-a.",
];

export const CALENDAR_TEMPLATES = [
  { label: "Tarde livre estratégica", duration: 3, start: 14, type: "free" as const },
  { label: "Sexta-fantasma", duration: 6, start: 11, type: "free" as const },
  { label: "Reunião que já desistiu de existir", duration: 1, start: 15, type: "free" as const },
  { label: "Faixa de damage control", duration: 2, start: 9, type: "work" as const },
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
    launch: [20, 30, 20],
    confirm: 28,
    complete: [35, 50, 35, 80, 60],
    liberation: [50, 40, 50, 40, 120],
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
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  const hour = date.getHours();
  return hour >= 9 && hour < 17;
}

export function minutesUntil(hour: number, minute = 0, now = new Date()): number {
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
  return Math.floor((target.getTime() - now.getTime()) / 60000);
}
