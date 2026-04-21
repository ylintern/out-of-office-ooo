
# $OOO — Out of Office: a app do Bartholomew, o Lich Corporate

Uma PWA mobile-first que celebra o absurdo de evitar trabalho com classe. Calendário invertido, notificações sagradas, e a lore meme de $OOO na inkchain. Bartholomew, o lich de fato e gravata, ensina-te durante 100 anos as artimanhas corporate.

## Identidade visual
- **Estética híbrida "Lich Corporate × Degen"**: paleta verde-necromante + verde-terminal, dourado decadente, preto Outlook, vermelho candle. Tipografia: serif gótica para o Bart, mono tipo Bloomberg para o ticker, sans corporate para UI.
- Hora de trabalho (9h–17h): UI mais "Outlook fingido", cinzentos sérios.
- Pós-17h: vira degen — ticker pisca, candles, confetes, "MARKET OPEN".
- Mascote: Bartholomew — caveira de lich com gravata, café e um Outlook aberto.

## Estrutura de rotas (TanStack)
- `/` — **Hoje (Inverted Calendar)**: o teu dia, mas só os blocos de tempo livre é que contam. Mostra próximas "missões sagradas" (almoço, WC pago, 17h liberation), botão "Iniciar modo X", contador ao vivo de €€ ganhos a fingir.
- `/calendar` — **Calendário invertido semanal/mensal**: blocos a verde = livre celebrado, blocos a cinza = "tempo desperdiçado a trabalhar". Adicionas eventos como "Tarde livre", "Reunião fantasma", "Café estendido".
- `/missions` — **Missões diárias / Status Modes**: Almoço Sagrado, WC Pago, Café Estendido, Reunião Fantasma, Deep Focus Falso, Doctor's Note. Cada uma tem timer, mensagem épica de início e mensagem viral de fim.
- `/academy` — **Bart Academy ("Como ser mais Bart")**: 100 lições desbloqueáveis, uma por dia. Meias-verdades corporate ("Marca sempre um meeting às 16h45 para ninguém te marcar nada às 17h"). Sistema de XP "Lich Points".
- `/ticker` — **$OOO Lore + Inkchain**: página meme com o ticker $OOO falso, gráfico de "produtividade a cair = preço a subir", whitepaper paródia, lore do Bartholomew, manifesto, botão de partilha.
- `/share/[id]` — **Cards partilháveis** gerados das tuas conquistas ("Hoje o meu patrão pagou-me €4.27 de paz na casa de banho").

## Funcionalidades core (full absurdo)

### 1. Inverted Calendar
- Adicionas eventos com tipo: 🟢 Livre Celebrado / ⚫ Trabalho (cinza, esmagado, pequeno).
- Vista diária/semanal onde o tempo livre ocupa visualmente mais espaço que o trabalho.
- Templates rápidos: "Tarde livre estratégica", "Sexta-fantasma", "Reunião que cancelei na minha cabeça".

### 2. Status Modes (sagrados, fullscreen overlay)
Quando ativas um modo, a app entra em **fullscreen dramático** com som + vibração:
- 🍝 **Almoço Sagrado** (60min) — "ALMOÇO. NINGUÉM TE PODE INTERROMPER. ISTO É LEI." Bloqueia tudo. Final: "Voltaste mais forte. O patrão não percebeu."
- 🚽 **WC Pago** (5min default, ajustável) — Contador €€ ao vivo do "que o teu patrão acabou de pagar pela tua paz". Final: "Parabéns. €2.14 de paz adquiridos. O capitalismo perdeu."
- ☕ **Café Estendido** (15min) — "Estás tecnicamente disponível. Tecnicamente."
- 👻 **Reunião Fantasma** (30–90min) — bloqueia o calendário com uma reunião falsa partilhável.
- 🎯 **Deep Focus Falso** — status "a focar" enquanto vês memes.
- 🤧 **Doctor's Note** — gera screenshot de "atestado" paródia.

### 3. Notificações híbridas
- **In-app sempre**: overlay fullscreen + som + vibração para cada missão.
- **Push opcional (PWA)**: pede permissão, agenda notificações via `Notification API` quando a aba está em background.
  - 12:30 — "🍝 Almoço sagrado em 30min. Prepara a alma."
  - 15:00 — "💰 Hora do WC pago. Vai buscar o teu salário em paz."
  - **17:00 — "⏰ CHEGOU A HORA. O dia começa AGORA. Sai do trabalho e NÃO OLHES PARA TRÁS."**
  - Sextas 16h — "🎉 Pré-fim-de-semana. Já podes mentalmente sair."
- Avisos do Bart: 2x/dia uma "lição" pop-up.

### 4. Contador de Paz Adquirida (€€)
- Define salário/hora opcional → app calcula em tempo real quanto €€ "roubas-te ao patrão com classe" durante cada missão.
- Total diário, semanal, mensal, lifetime. Card partilhável.

### 5. Bart Academy (100 lições)
- Uma lição/dia desbloqueada. Meias-verdades absurdas:
  - "Lição #7: Responde a emails às 8h59 e às 17h01. Parecerás incansável."
  - "Lição #23: Marca sempre 'focus time' no calendário. Ninguém ousa quebrá-lo."
  - "Lição #41: 'Estou a sincronizar' não significa nada. Usa-o."
- Sistema de XP "Lich Points" → ranks: Estagiário → Office Drone → Senior Slacker → Bart Apprentice → **Lich CEO**.

### 6. Camada $OOO Meme/Inkchain
- Página `/ticker` com:
  - Ticker $OOO ao vivo (mock animado, candles inversas — quanto menos trabalhas, mais sobe).
  - Manifesto: "Bart não é CEO. Bart é a personificação da eficiência preguiçosa."
  - Lore do Lich Bartholomew (100 anos a ensinar).
  - Whitepaper paródia (1 página).
  - Botão "Mint your OOO day" → gera card NFT-style partilhável da tua melhor missão.
- Sino do "MARKET OPEN" às 17h00.

### 7. Share virais
- Qualquer missão concluída → botão "Share" → gera imagem (canvas) com Bart + frase + €€ ganho + ticker $OOO.
- Frases rotativas absurdas focadas em **saúde mental como rebeldia**: "Descansar é resistência.", "O burnout não é flex.", "Bart diz: respira. O Slack pode esperar."

## Mobile-first & PWA
- Layout mobile-first, bottom tab bar (Hoje · Calendário · Missões · Academy · $OOO).
- **Manifest simples** para "Add to Home Screen" com ícone do Bart-lich (sem service worker complexo, evita problemas de preview).
- Notificações push via API nativa do browser, com guard para não registar dentro de iframes de preview.
- Som + vibração nas missões (Web Audio + `navigator.vibrate`).

## Dados (Lovable Cloud)
- Sem login obrigatório no MVP — tudo guardado local (localStorage) para fricção zero e viralidade.
- Cloud opcional: leaderboard global de "€€ roubados ao patrão hoje", contagem total de almoços sagrados a decorrer agora no mundo ("Há 2.341 pessoas em almoço sagrado neste momento") — alimenta o lado meme/comunidade.
- Tabela `public_stats` para os contadores globais; cards partilhados gerados server-side opcional.

## Tom editorial (regra fundamental)
Todo o copy é **meias-verdades + meias-mentiras corporate** entregues com seriedade absoluta. Foco no absurdismo da saúde mental: rir do burnout sem o glorificar, celebrar o descanso como ato político-cómico. Bart é solene, nunca se ri de si próprio.
