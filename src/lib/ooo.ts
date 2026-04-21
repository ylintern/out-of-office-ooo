// $OOO core utilities — client-only, localStorage-based.

export type MissionId =
  | "lunch"
  | "wc"
  | "coffee"
  | "ghost"
  | "focus"
  | "doctor";

export type Mission = {
  id: MissionId;
  emoji: string;
  name: string;
  ruleLine: string;
  defaultMinutes: number;
  startLine: string;
  endLine: (euros: string) => string;
  colorVar: "necro" | "gold" | "candle" | "terminal";
};

export const MISSIONS: Mission[] = [
  {
    id: "lunch",
    emoji: "🍝",
    name: "Almoço Sagrado",
    ruleLine: "É lei. Ninguém te interrompe. Nem o CEO.",
    defaultMinutes: 60,
    startLine: "ALMOÇO. ISTO É SAGRADO. NÃO RESPONDAS.",
    endLine: (e) => `Voltaste mais forte. O patrão pagou ${e} pela tua digestão.`,
    colorVar: "gold",
  },
  {
    id: "wc",
    emoji: "🚽",
    name: "WC Pago",
    ruleLine: "O patrão paga. Tu respiras. O capitalismo perde.",
    defaultMinutes: 7,
    startLine: "ESTÁS A SER PAGO PARA EXISTIR EM PAZ.",
    endLine: (e) => `Parabéns. ${e} de paz adquiridos. Lich Points +10.`,
    colorVar: "necro",
  },
  {
    id: "coffee",
    emoji: "☕",
    name: "Café Estendido",
    ruleLine: "Tecnicamente disponível. Tecnicamente.",
    defaultMinutes: 15,
    startLine: "O café é uma reunião contigo próprio.",
    endLine: (e) => `Café concluído. ${e} faturados em silêncio.`,
    colorVar: "terminal",
  },
  {
    id: "ghost",
    emoji: "👻",
    name: "Reunião Fantasma",
    ruleLine: "Bloqueia o calendário. A reunião não existe. Tu também não.",
    defaultMinutes: 45,
    startLine: "ESTÁS NUMA REUNIÃO. (Não estás.)",
    endLine: (e) => `Reunião 'produtiva'. ${e} de aparências bem investidos.`,
    colorVar: "necro",
  },
  {
    id: "focus",
    emoji: "🎯",
    name: "Deep Focus Falso",
    ruleLine: "Status: a focar. Atividade: a respirar.",
    defaultMinutes: 25,
    startLine: "FOCO PROFUNDO. NÃO PERTURBAR. (A ver memes.)",
    endLine: (e) => `Sessão de foco completa. ${e} ganhos a contemplar.`,
    colorVar: "terminal",
  },
  {
    id: "doctor",
    emoji: "🤧",
    name: "Doctor's Note",
    ruleLine: "Atestado de Bartholomew, M.D. (Master of Disengagement).",
    defaultMinutes: 0,
    startLine: "Estás oficialmente indisposto. Por decreto necromântico.",
    endLine: () => "Atestado emitido. Recupera. Lich Points +25.",
    colorVar: "candle",
  },
];

export type Rank =
  | "Estagiário"
  | "Office Drone"
  | "Senior Slacker"
  | "Bart Apprentice"
  | "Lich CEO";

export const RANKS: { name: Rank; min: number }[] = [
  { name: "Estagiário", min: 0 },
  { name: "Office Drone", min: 50 },
  { name: "Senior Slacker", min: 200 },
  { name: "Bart Apprentice", min: 500 },
  { name: "Lich CEO", min: 1500 },
];

export function rankFor(points: number): Rank {
  return RANKS.reduce<Rank>(
    (acc, r) => (points >= r.min ? r.name : acc),
    "Estagiário"
  );
}

export type Stats = {
  hourlyRate: number;          // €/h
  lichPoints: number;
  lifetimeEuros: number;
  lifetimeSeconds: number;
  unlockedLessons: number;
  completedMissions: number;
  installDate: string;
};

const STATS_KEY = "ooo.stats.v1";

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

export function saveStats(s: Stats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

function defaultStats(): Stats {
  return {
    hourlyRate: 12,
    lichPoints: 0,
    lifetimeEuros: 0,
    lifetimeSeconds: 0,
    unlockedLessons: 1,
    completedMissions: 0,
    installDate: new Date().toISOString(),
  };
}

export function eurosFor(seconds: number, hourlyRate: number): number {
  return (seconds / 3600) * hourlyRate;
}

export function fmtEuro(n: number): string {
  return `€${n.toFixed(2).replace(".", ",")}`;
}

export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

// 100 lessons of corporate half-truths
export const LESSONS: string[] = [
  "Responde a emails às 8h59 e às 17h01. Parecerás incansável.",
  "“Vou alinhar com a equipa” = vou pensar nisto na casa de banho.",
  "Marca um meeting às 16h45 para ninguém te marcar nada às 17h.",
  "Mantém sempre o Slack em ‘a escrever…’ por 3 segundos. Ninguém ousa interromper.",
  "Cota oficial de cafés: ilimitada quando o gestor está em férias.",
  "Reencaminhar > responder. O autor original carrega a culpa.",
  "Diz “estou a sincronizar” pelo menos uma vez por dia. Não significa nada.",
  "Se a reunião pode ser um email, marca-a na mesma. Aparenta gravidade.",
  "Quinta-feira à tarde é sexta emocional. Age em conformidade.",
  "‘Focus time’ no calendário é território soberano. Defende-o.",
  "Toda a sexta tem uma ‘call urgente’ às 16h45. Sai antes de começar.",
  "Estar online no Teams é mais importante do que estar lá.",
  "Quando alguém te marcar uma call, propõe ‘assíncrono’. 80% desistem.",
  "Diz “let me circle back” em inglês. Ninguém pede prazos.",
  "“Estou em deslocação” cobre 45–90 minutos sem perguntas.",
  "Bater na mesa do gestor com energia constrói uma reputação de iniciativa.",
  "Manda 1 email às 22h por semana. Lendas nascem assim.",
  "Tens direito a 5 minutos de luto por cada novo OKR.",
  "Toda a apresentação melhora com um gráfico que não explicas.",
  "Se alguém pergunta o status, responde “em fase final de validação”.",
  "Janela do browser sempre com Excel aberto. É a tua armadura.",
  "Almoço de 60 min é constitucional. 75 é uma negociação justa.",
  "Reúne-te contigo próprio no calendário. Ninguém te pode tirar de lá.",
  "Não chames ‘erro’. Chama ‘oportunidade de aprendizagem partilhada’.",
  "Toda a thread > 5 mensagens deve terminar com “proponho call”.",
  "‘Estou no comboio’ pausa qualquer urgência por 47 minutos.",
  "Compra uns auscultadores caros. Estás “em call” quando precisares.",
  "Nunca sejas o primeiro a entrar nem o último a sair. Sê fumo.",
  "Toda a segunda-feira começa com 25 min de ‘alinhamento’ contigo.",
  "Quando te elogiam, retribui. Quando te criticam, agradece. Continua igual.",
];
while (LESSONS.length < 100) {
  LESSONS.push(`Lição #${LESSONS.length + 1}: o segredo está no silêncio estratégico.`);
}

export const VIRAL_QUOTES = [
  "Descansar é resistência.",
  "O burnout não é flex.",
  "Bart diz: respira. O Slack pode esperar.",
  "O calendário existe para te proteger, não para te trair.",
  "Reuniões cancelam-se mentalmente primeiro.",
  "Ninguém morreu por ignorar um email às 17h02.",
];

export function safeVibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined") return;
  if ("vibrate" in navigator) {
    try { (navigator as Navigator).vibrate(pattern); } catch { /* noop */ }
  }
}

export function playBell(freq = 440, duration = 0.6) {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = 0.001;
    o.connect(g).connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.start(now);
    o.stop(now + duration + 0.05);
  } catch { /* noop */ }
}

export function isWorkHours(d = new Date()): boolean {
  const day = d.getDay();
  if (day === 0 || day === 6) return false;
  const h = d.getHours();
  return h >= 9 && h < 17;
}

export function minutesUntil(hour: number, minute = 0): number {
  const now = new Date();
  const t = new Date();
  t.setHours(hour, minute, 0, 0);
  if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1);
  return Math.floor((t.getTime() - now.getTime()) / 60000);
}
