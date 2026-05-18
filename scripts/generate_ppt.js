const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Shrishti Singh";
pres.title = "Katha — Smart Cultural Storyteller";

const C = {
  earth:    "1A1410",
  earthMid: "261C15",
  earthCard:"2E1F15",
  saffron:  "EC6D13",
  amber:    "F9B233",
  sand:     "F5EFE0",
  white:    "FFFFFF",
  muted:    "9A8A7A",
  mutedBright:"B8A898",
  darkLine: "3A2A1A",
  green:    "22C55E",
  blue:     "60A5FA",
  purple:   "A78BFA",
  pink:     "EC4899",
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

const bgDark = s => { s.background = { color: C.earth }; };

const topBar = (s, color = C.saffron) =>
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:13.3, h:0.07, fill:{color}, line:{color} });

const botBar = (s, color = C.saffron) =>
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:7.43, w:13.3, h:0.07, fill:{color}, line:{color} });

const pill = (s, text, x, y, color = C.saffron, w = null) => {
  const bw = w || Math.max(1.2, text.length * 0.105 + 0.4);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w:bw, h:0.27, fill:{color, transparency:82}, line:{color, width:0.75} });
  s.addText(text, { x, y, w:bw, h:0.27, fontSize:8.5, bold:true, color, align:"center", valign:"middle", margin:0 });
};

const hline = (s, x, y, w, color = C.darkLine) =>
  s.addShape(pres.shapes.LINE, { x, y, w, h:0, line:{color, width:0.75} });

const vline = (s, x, y, h, color = C.darkLine) =>
  s.addShape(pres.shapes.LINE, { x, y, w:0, h, line:{color, width:0.75} });

const card = (s, x, y, w, h, color = C.earthCard) =>
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill:{color},
    line:{color:C.darkLine, width:0.75},
    shadow:{type:"outer", color:"000000", opacity:0.28, blur:6, offset:2, angle:135}
  });

const leftAccent = (s, x, y, h, color = C.saffron) =>
  s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.05, h, fill:{color, transparency:35}, line:{color, transparency:35} });

const slideNum = (s, n, total=15) =>
  s.addText(`${n} / ${total}`, { x:12.7, y:7.22, w:0.55, h:0.2, fontSize:9, color:C.muted, align:"right", margin:0 });

const heading = (s, text, sub, x=0.5, y=0.5) => {
  s.addText(text, { x, y, w:12.3, h:0.7, fontSize:34, bold:true, color:C.sand, margin:0 });
  if (sub) s.addText(sub, { x, y:y+0.68, w:12.3, h:0.32, fontSize:14, color:C.muted, italic:true, margin:0 });
};

const dot = (s, x, y, color = C.saffron) =>
  s.addShape(pres.shapes.OVAL, { x, y, w:0.11, h:0.11, fill:{color}, line:{color} });

const arrow = (s, x, y, w=0, h=0, color=C.muted) =>
  s.addShape(pres.shapes.LINE, { x, y, w, h, line:{color, width:1.2} });

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 01 — TITLE
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);

  // OM watermark
  s.addText("ॐ", { x:6.5, y:0.2, w:6.8, h:7.1, fontSize:390, color:C.earthMid, align:"center", valign:"middle", margin:0 });

  leftAccent(s, 0.88, 1.1, 5.2);

  s.addText("KATHA", { x:1.1, y:1.1, w:9, h:1.7, fontSize:96, bold:true, color:C.saffron, align:"left", valign:"middle", charSpacing:14, margin:0 });
  s.addText("Smart Cultural Storyteller", { x:1.1, y:2.75, w:9, h:0.65, fontSize:27, color:C.sand, italic:true, align:"left", margin:0 });

  hline(s, 1.1, 3.52, 8.0, C.saffron);

  s.addText("Bringing Ancient Indian Epics to Life\nfor the Gen Z Digital Native Generation", {
    x:1.1, y:3.65, w:9, h:0.95, fontSize:16, color:C.muted, align:"left", margin:0
  });

  // Tech pills row
  [["React 18 + TypeScript", 1.1], ["FastAPI + Python 3.11", 3.55], ["ElevenLabs AI Audio", 6.0],
   ["Pollinations Flux", 8.45], ["Docker + Render + Vercel", 10.3]].forEach(([t, x]) => pill(s, t, x, 5.0));

  s.addText("Shrishti Singh  ·  B.Tech CSE (AI/ML), 3rd Year  ·  CSMU Panvel, Navi Mumbai  ·  AI Minor @ IIT Ropar", {
    x:1.1, y:5.62, w:11, h:0.3, fontSize:11.5, color:C.sand, bold:true, margin:0
  });
  s.addText("shrishtis089@gmail.com  ·  github.com/shru089/katha-smart-storyteller  ·  May 2026", {
    x:1.1, y:5.93, w:11, h:0.28, fontSize:10.5, color:C.muted, margin:0
  });

  // Badges row bottom
  [["Jan 2026 — Initial Release", C.blue], ["May 2026 — v1.1.0-beta", C.green], ["14 Commits  ·  5 Sprints", C.saffron]].forEach(([t,c],i) => {
    pill(s, t, 1.1 + i*4.1, 6.65, c, 3.7);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 02 — PROBLEM STATEMENT
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "01  THE PROBLEM", 0.5, 0.18);
  heading(s, "Gen Z is Disconnected from Cultural Heritage", "Ancient Indian epics exist. Engagement doesn't.");

  // Left — problem cards
  const probs = [
    ["📖", "Language Barriers",    "Archaic Sanskrit & classical translations limit comprehension for modern readers"],
    ["😴", "Passive Consumption",  "Static text cannot compete with Netflix, YouTube, TikTok — Gen Z's baseline expectation"],
    ["🎮", "No Gamification",      "Zero XP, streaks, or rewards — no motivational scaffolding for continued engagement"],
    ["🌍", "Cultural Disconnect",  "Without context, Ramayana & Mahabharata feel irrelevant to contemporary daily life"],
    ["🔇", "No Personalization",   "One-size-fits-all presentation fails to establish personal emotional resonance"],
  ];
  probs.forEach(([em, title, desc], i) => {
    card(s, 0.5, 1.68 + i*1.06, 7.8, 0.95);
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.68+i*1.06, w:0.05, h:0.95, fill:{color:C.saffron}, line:{color:C.saffron} });
    s.addText(em, { x:0.65, y:1.68+i*1.06, w:0.55, h:0.95, fontSize:24, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:1.3, y:1.75+i*1.06, w:6.8, h:0.3, fontSize:13.5, bold:true, color:C.sand, margin:0 });
    s.addText(desc,  { x:1.3, y:2.03+i*1.06, w:6.8, h:0.42, fontSize:10.5, color:C.muted, margin:0 });
  });

  // Right — big stats
  card(s, 8.65, 1.68, 4.2, 2.1);
  s.addText("8s", { x:8.65, y:1.75, w:4.2, h:1.3, fontSize:105, bold:true, color:C.saffron, align:"center", margin:0 });
  s.addText("Gen Z avg. attention span\nbefore disengaging", { x:8.65, y:2.95, w:4.2, h:0.68, fontSize:12, color:C.muted, align:"center", margin:0 });

  card(s, 8.65, 3.88, 4.2, 1.8);
  s.addText("73%", { x:8.65, y:3.94, w:4.2, h:1.1, fontSize:72, bold:true, color:C.amber, align:"center", margin:0 });
  s.addText("youth report feeling culturally\ndisconnected from epics", { x:8.65, y:4.96, w:4.2, h:0.6, fontSize:11.5, color:C.muted, align:"center", margin:0 });

  card(s, 8.65, 5.78, 4.2, 1.1);
  s.addText("Traditional formats\nhave failed for decades.", { x:8.65, y:5.85, w:4.2, h:0.95, fontSize:14, bold:true, color:C.sand, align:"center", valign:"middle", margin:0 });

  slideNum(s, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 03 — THE SOLUTION
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "02  THE SOLUTION", 0.5, 0.18);
  heading(s, "Katha: Duolingo × Netflix × AI Storytelling", "One platform. Ancient wisdom. Digital-native delivery.");

  hline(s, 0.5, 1.4, 12.3, C.saffron);

  // Three pillars
  const pillars = [
    { color:C.blue,   em:"📚", title:"Reimagined Content",  items:["Epics reframed in Gen Z vocabulary","Bhagavad Gita = 'tournament burnout scenario'","Dark aesthetic — glassmorphism UI","Bilingual Hindi + English UI throughout"] },
    { color:"22C55E", em:"🎮", title:"RPG Gamification",    items:["4 Archetypes: Warrior/Sage/Seeker/Guardian","XP system + daily reading streaks","20+ dynamic badges with unlock conditions","Personality quiz onboarding flow"] },
    { color:C.saffron,em:"🤖", title:"Multi-Modal AI",      items:["ElevenLabs v2 emotion-aware narration","9 Rasa mood-to-audio mappings","Pollinations Flux image generation","Edge-TTS zero-cost fallback + Pydub"] },
  ];

  pillars.forEach((p, i) => {
    const x = 0.5 + i*4.28;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.52, w:4.1, h:0.52, fill:{color:p.color}, line:{color:p.color} });
    s.addText(p.em + "  " + p.title, { x:x+0.15, y:1.52, w:3.8, h:0.52, fontSize:14.5, bold:true, color:C.white, valign:"middle", margin:0 });
    card(s, x, 2.04, 4.1, 3.25);
    p.items.forEach((item, ii) => {
      dot(s, x+0.2, 2.22+ii*0.76, p.color);
      s.addText(item, { x:x+0.42, y:2.16+ii*0.76, w:3.53, h:0.65, fontSize:11.5, color:C.mutedBright, valign:"middle", margin:0 });
    });
  });

  // Additional feature strip
  hline(s, 0.5, 5.42, 12.3, C.darkLine);
  s.addText("Also includes:", { x:0.5, y:5.52, w:1.5, h:0.28, fontSize:11, bold:true, color:C.saffron, margin:0 });
  [["🗺️ Interactive Sacred Map","Leaflet — Ayodhya, Lanka, Kurukshetra"],
   ["📖 Novel + Webtoon Reader","Drop-cap serif + full-bleed AI visuals"],
   ["🤖 Rishi AI Oracle","In-scene cultural Q&A chatbot"],
   ["🔐 JWT Auth + Profiles","Full user management + progress sync"]].forEach(([t,d],i) => {
    card(s, 0.5+i*3.2, 5.82, 3.06, 0.98);
    s.addText(t, { x:0.65+i*3.2, y:5.9,  w:2.76, h:0.3, fontSize:12, bold:true, color:C.sand, margin:0 });
    s.addText(d, { x:0.65+i*3.2, y:6.19, w:2.76, h:0.5, fontSize:10, color:C.muted, margin:0 });
  });

  slideNum(s, 3);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 04 — TECH STACK
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "03  TECHNOLOGY STACK", 0.5, 0.18);
  heading(s, "Full-Stack Architecture", "React 18 · FastAPI · SQLModel · Docker · ElevenLabs · Pollinations");

  const layers = [
    { color:C.blue,   label:"FRONTEND — React 18 + TypeScript + Vite",    tech:"TailwindCSS  ·  Framer Motion  ·  React Router v6  ·  Axios + JWT interceptors  ·  Leaflet  ·  React-Hot-Toast  ·  Lucide React" },
    { color:"22C55E", label:"BACKEND — FastAPI (Python 3.11) + Uvicorn",   tech:"SQLModel + SQLAlchemy  ·  Pydantic v2  ·  python-jose (JWT)  ·  bcrypt  ·  httpx  ·  Uvicorn ASGI" },
    { color:C.amber,  label:"DATABASE — SQLite → PostgreSQL (production)",  tech:"8 entities: User, Story, Chapter, Scene, Badge, UserBadge, UserSceneProgress, Location  ·  Full FK relationships" },
    { color:C.saffron,label:"AI SERVICES — Multi-modal generation pipeline",tech:"ElevenLabs v2 Multilingual TTS  ·  Edge-TTS fallback  ·  Pollinations Flux Realism (images)  ·  Pydub + FFmpeg (audio processing)" },
    { color:C.muted,  label:"DEPLOYMENT — Docker + Render + Vercel",       tech:"Multi-stage Dockerfile with apt-get ffmpeg install  ·  render.yaml blueprint  ·  Vercel CDN (SPA rewrites)  ·  Nginx reverse proxy" },
  ];

  layers.forEach((l, i) => {
    const y = 1.55 + i*1.13;
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y, w:0.06, h:0.88, fill:{color:l.color}, line:{color:l.color} });
    card(s, 0.68, y, 7.65, 0.88);
    s.addText(l.label, { x:0.82, y:y+0.1, w:7.38, h:0.3,  fontSize:11.5, bold:true, color:C.sand, margin:0 });
    s.addText(l.tech,  { x:0.82, y:y+0.42, w:7.38, h:0.36, fontSize:10,  color:C.muted, margin:0 });
  });

  // Right stats grid
  s.addText("By the Numbers", { x:8.65, y:1.5, w:4.3, h:0.38, fontSize:15, bold:true, color:C.saffron, align:"center", margin:0 });
  const stats = [["8",   "DB Entities",       C.amber],
                 ["6",   "API Routers",        C.blue],
                 ["9",   "AI Rasa Moods",      C.saffron],
                 ["30+", "React Components",   "22C55E"],
                 ["14",  "npm Packages",       C.purple],
                 ["5",   "Agile Sprints",      C.pink]];
  stats.forEach(([n, l, c], i) => {
    const sx = 8.65 + (i%2)*2.2, sy = 1.95 + Math.floor(i/2)*1.5;
    card(s, sx, sy, 2.05, 1.35);
    s.addText(n, { x:sx+0.08, y:sy+0.1, w:1.9, h:0.82, fontSize:42, bold:true, color:c, align:"center", margin:0 });
    s.addText(l, { x:sx+0.08, y:sy+0.88, w:1.9, h:0.36, fontSize:10, color:C.muted, align:"center", margin:0 });
  });

  // Commit strip
  card(s, 0.5, 7.1, 12.3, 0.28);
  s.addText("📅  Jan 16 — Initial commit  ›  Jan 17 — MVP + Docker + Render deploy  ›  May 17, 2026 — v1.1.0-beta: ElevenLabs emotion audio + Gen Z storytelling upgrade  ›  14 total commits", {
    x:0.65, y:7.12, w:12.0, h:0.24, fontSize:9.5, color:C.muted, valign:"middle", margin:0
  });

  slideNum(s, 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 05 — SOFTWARE ENGINEERING MODEL
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "04  SOFTWARE ENGINEERING MODEL", 0.5, 0.18);
  heading(s, "Agile Iterative Development", "Solo developer · Discovery-driven · Demo-ready each sprint");

  hline(s, 0.5, 1.42, 12.3, C.saffron);

  // WHY AGILE panel left
  s.addText("Why Agile?", { x:0.5, y:1.55, w:5.8, h:0.35, fontSize:14, bold:true, color:C.saffron, margin:0 });
  const why = [
    "AI API capabilities must be discovered iteratively — impossible to plan upfront",
    "UI/UX polish requires rapid visual feedback loops every 1–2 days",
    "ElevenLabs rate limits & costs required early hands-on experimentation",
    "Solo developer → lightweight overhead is essential, not optional",
    "Every sprint produces a demo-ready build with portfolio value",
  ];
  why.forEach((w, i) => {
    dot(s, 0.55, 2.08+i*0.63, C.saffron);
    s.addText(w, { x:0.78, y:2.02+i*0.63, w:5.55, h:0.56, fontSize:11, color:C.muted, valign:"middle", margin:0 });
  });

  // VS comparison
  const vsData = [["Requirements","Evolving — discovered via AI testing","Fixed upfront"],
                  ["Feedback Loop","Continuous self-testing each session","End-phase only"],
                  ["Risk mitigation","Per-sprint — AI API costs caught early","Deferred to end"],
                  ["Deliverables","Working software every sprint","Full system at end"]];
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:5.22, w:2.2, h:0.32, fill:{color:C.saffron}, line:{color:C.saffron} });
  s.addText("Factor", { x:0.5, y:5.22, w:2.2, h:0.32, fontSize:10, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:2.72, y:5.22, w:3.3, h:0.32, fill:{color:C.saffron}, line:{color:C.saffron} });
  s.addText("Agile ✅", { x:2.72, y:5.22, w:3.3, h:0.32, fontSize:10, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
  s.addShape(pres.shapes.RECTANGLE, { x:6.04, y:5.22, w:0.65, h:0.32, fill:{color:"6B7280"}, line:{color:"6B7280"} });
  s.addText("Waterfall ❌", { x:6.04, y:5.22, w:0.65, h:0.32 });
  // simpler table
  vsData.forEach(([factor, agile, wf], i) => {
    const ry = 5.54 + i*0.44, bg = i%2===0 ? C.earthCard : C.earthMid;
    card(s, 0.5, ry, 2.2, 0.4, bg);
    s.addText(factor, { x:0.6, y:ry+0.05, w:2.0, h:0.3, fontSize:10, bold:true, color:C.sand, margin:0 });
    card(s, 2.72, ry, 3.28, 0.4, bg);
    s.addText(agile, { x:2.82, y:ry+0.05, w:3.08, h:0.3, fontSize:9.5, color:C.green, margin:0 });
    card(s, 6.02, ry, 0.66, 0.4, bg);
    s.addText("❌", { x:6.02, y:ry+0.05, w:0.66, h:0.3, fontSize:14, align:"center", margin:0 });
  });

  // SPRINT timeline right panel
  vline(s, 7.1, 1.5, 5.95);
  s.addText("5-Sprint Timeline (Jan – May 2026)", { x:7.3, y:1.55, w:5.7, h:0.35, fontSize:14, bold:true, color:C.saffron, margin:0 });

  const sprints = [
    { n:"S1", date:"Jan 16–17", focus:"Foundation & Core API",    sub:"FastAPI + SQLModel + JWT + React scaffold",   color:C.blue },
    { n:"S2", date:"Jan – Feb", focus:"AI Audio Pipeline",        sub:"ElevenLabs + Edge-TTS + Pydub + Parser",      color:"22C55E" },
    { n:"S3", date:"Feb – Mar", focus:"Visual & Map Systems",     sub:"Pollinations Flux + Leaflet + 9:16 reels",    color:C.amber },
    { n:"S4", date:"Mar – Apr", focus:"Gamification & UX",        sub:"Archetype quiz + XP/Badge + Framer Motion",   color:C.saffron },
    { n:"S5", date:"May 2026",  focus:"Polish & Deploy",          sub:"Docker + Render + Vercel + Gen Z rewriting",  color:C.pink },
  ];

  sprints.forEach((sp, i) => {
    const sy = 2.03 + i*1.06;
    s.addShape(pres.shapes.OVAL, { x:7.3, y:sy, w:0.52, h:0.52, fill:{color:sp.color}, line:{color:sp.color} });
    s.addText(sp.n, { x:7.3, y:sy, w:0.52, h:0.52, fontSize:13, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
    if (i<4) arrow(s, 7.56, sy+0.52, 0, 0.54, C.darkLine);
    card(s, 7.96, sy, 5.04, 0.88);
    s.addText(sp.focus, { x:8.1, y:sy+0.06, w:3.5, h:0.32, fontSize:13, bold:true, color:C.sand, margin:0 });
    s.addText(sp.date,  { x:11.5, y:sy+0.06, w:1.4, h:0.32, fontSize:11, color:sp.color, align:"right", margin:0 });
    s.addText(sp.sub,   { x:8.1, y:sy+0.38, w:4.8, h:0.38, fontSize:10, color:C.muted, margin:0 });
  });

  slideNum(s, 5);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 06 — GANTT CHART
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "05  GANTT CHART", 0.5, 0.18);
  heading(s, "Project Timeline — Jan 16 to May 17, 2026", "14 commits  ·  5 sprints  ·  4 months active development");

  const COL_X  = [5.05, 6.42, 7.79, 9.16, 10.53, 11.9];
  const COL_W  = 1.32;
  const MONTHS = ["Jan W1","Jan W2","Feb","Mar","Apr","May"];
  const HDR_Y  = 1.42;
  const ROW_H  = 0.41;

  // Header
  card(s, 0.5, HDR_Y, 4.48, ROW_H, C.saffron);
  s.addText("Task / Phase", { x:0.6, y:HDR_Y+0.05, w:4.28, h:ROW_H-0.1, fontSize:10.5, bold:true, color:C.white, valign:"middle", margin:0 });
  MONTHS.forEach((m, i) => {
    card(s, COL_X[i], HDR_Y, COL_W, ROW_H, C.saffron);
    s.addText(m, { x:COL_X[i], y:HDR_Y+0.05, w:COL_W, h:ROW_H-0.1, fontSize:9.5, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
  });

  const tasks = [
    // [label, [jan_w1, jan_w2, feb, mar, apr, may], sprint_color]
    ["Project Setup & Architecture",         [1,1,0,0,0,0], C.blue],
    ["Database Schema Design",               [1,1,0,0,0,0], C.blue],
    ["FastAPI Backend + JWT Auth",           [0,1,1,0,0,0], C.blue],
    ["ElevenLabs AI Audio Pipeline",         [0,0,1,1,0,0], "22C55E"],
    ["Edge-TTS Fallback + Dialogue Parser",  [0,0,1,0,0,0], "22C55E"],
    ["Pollinations Image Generation",        [0,0,0,1,1,0], C.amber],
    ["Leaflet Sacred Map",                   [0,0,0,1,0,0], C.amber],
    ["Archetype Quiz & XP/Badge Engine",     [0,0,0,0,1,0], C.saffron],
    ["Chapter Reader (Novel + Webtoon UI)",  [0,0,0,1,1,0], C.saffron],
    ["Profile & Achievements Pages",         [0,0,0,0,1,0], C.saffron],
    ["Docker + Render + Vercel Deploy",      [0,0,0,0,0,1], C.pink],
    ["Gen Z Content + Bug Fixes (v1.1)",     [0,0,0,0,0,1], C.pink],
  ];

  tasks.forEach(([label, cols, barColor], ri) => {
    const ry = HDR_Y + ROW_H + ri * ROW_H;
    const bg = ri%2===0 ? C.earthCard : C.earth;
    card(s, 0.5, ry, 4.48, ROW_H, bg);
    s.addText(label, { x:0.62, y:ry+0.04, w:4.25, h:ROW_H-0.08, fontSize:9.5, color:C.sand, valign:"middle", margin:0 });
    cols.forEach((active, ci) => {
      card(s, COL_X[ci], ry, COL_W, ROW_H, bg);
      if (active) {
        s.addShape(pres.shapes.RECTANGLE, {
          x:COL_X[ci]+0.08, y:ry+0.08, w:COL_W-0.16, h:ROW_H-0.16,
          fill:{color:barColor}, line:{color:barColor},
          shadow:{type:"outer",color:"000000",opacity:0.3,blur:3,offset:1,angle:135}
        });
      }
    });
  });

  // Legend + summary row
  const legendY = HDR_Y + ROW_H + tasks.length * ROW_H + 0.12;
  [["Sprint 1–2: Foundation + AI Audio", C.blue],
   ["Sprint 3: Visual + Map", C.amber],
   ["Sprint 4: Gamification", C.saffron],
   ["Sprint 5: Deploy", C.pink]].forEach(([t, c], i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5+i*3.18, y:legendY+0.04, w:0.22, h:0.16, fill:{color:c}, line:{color:c} });
    s.addText(t, { x:0.78+i*3.18, y:legendY+0.02, w:2.9, h:0.22, fontSize:9.5, color:C.muted, margin:0 });
  });

  slideNum(s, 6);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 07 — SYSTEM ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "06  ARCHITECTURE", 0.5, 0.18);
  heading(s, "System Architecture & Data Flow", "3-Tier client-server + AI services layer + Docker-containerized deployment");

  // ── TIER BOXES ──

  // TIER 1 — Frontend (Vercel CDN)
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.42, w:12.3, h:1.18, fill:{color:"0F1A2A"}, line:{color:C.blue, width:1.5} });
  pill(s, "TIER 1 — FRONTEND · Vercel CDN", 0.62, 1.48, C.blue, 3.6);
  const pages = ["Home","ChapterReader","ReelsPage","MapPage","SceneViewer","ArchetypeQuiz","ProfilePage","ExplorePage"];
  pages.forEach((p, i) => {
    card(s, 0.72+i*1.52, 1.78, 1.42, 0.68);
    s.addText(p, { x:0.72+i*1.52, y:1.78, w:1.42, h:0.68, fontSize:9, color:C.blue, align:"center", valign:"middle", margin:0 });
  });

  // Arrow down centre
  arrow(s, 6.65, 2.6, 0, 0.35, C.muted);
  s.addText("REST API + JWT Bearer", { x:5.6, y:2.64, w:2.2, h:0.22, fontSize:9, color:C.muted, align:"center", margin:0 });

  // TIER 2 — Backend (Render + Docker)
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:2.95, w:12.3, h:1.32, fill:{color:"0F1F12"}, line:{color:"22C55E", width:1.5} });
  pill(s, "TIER 2 — FASTAPI BACKEND · Render.com + Docker (ffmpeg included)", 0.62, 3.0, "22C55E", 5.8);
  const routers = ["users.py\nAuth","stories.py\nCRUD","chapters.py\nScenes","audio.py\nNarration","scenes.py\nAI Gen","debug.py\nSeed Data"];
  routers.forEach((r, i) => {
    card(s, 0.72+i*2.02, 3.3, 1.92, 0.85);
    s.addText(r, { x:0.72+i*2.02, y:3.3, w:1.92, h:0.85, fontSize:9.5, color:"22C55E", align:"center", valign:"middle", margin:0 });
  });

  // Arrows to tier 3 + AI
  arrow(s, 3.3, 4.27, 0, 0.35, C.muted);
  arrow(s, 6.65, 4.27, 0, 0.35, C.muted);
  arrow(s, 10.0, 4.27, 0, 0.35, C.muted);

  // TIER 3 — DB
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:4.62, w:5.65, h:1.22, fill:{color:"0F0F1F"}, line:{color:C.amber, width:1.5} });
  pill(s, "TIER 3 — DATABASE · SQLite → PostgreSQL", 0.62, 4.67, C.amber, 4.2);
  ["USER","STORY","CHAPTER","SCENE","BADGE","LOCATION"].forEach((e, i) => {
    card(s, 0.65+i*0.88, 4.97, 0.8, 0.72);
    s.addText(e, { x:0.65+i*0.88, y:4.97, w:0.8, h:0.72, fontSize:8, color:C.amber, align:"center", valign:"middle", margin:0 });
  });

  vline(s, 6.28, 4.62, 1.22, C.darkLine);

  // AI SERVICES
  s.addShape(pres.shapes.RECTANGLE, { x:6.38, y:4.62, w:6.42, h:1.22, fill:{color:"1F100F"}, line:{color:C.saffron, width:1.5} });
  pill(s, "AI SERVICES LAYER", 6.5, 4.67, C.saffron, 2.2);
  [["ElevenLabs v2\nTTS","Primary narration"],["Edge-TTS\nFallback","Zero-cost local"],["Pollinations\nFlux AI","Image gen"],["Pydub\n+ FFmpeg","Audio concat"]].forEach(([svc,sub],i) => {
    card(s, 6.52+i*1.56, 4.97, 1.46, 0.72);
    s.addText(svc, { x:6.52+i*1.56, y:4.97, w:1.46, h:0.46, fontSize:9, color:C.saffron, align:"center", valign:"middle", margin:0 });
    s.addText(sub, { x:6.52+i*1.56, y:5.41, w:1.46, h:0.24, fontSize:8, color:C.muted, align:"center", margin:0 });
  });

  // DEPLOY strip
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:5.95, w:12.3, h:0.38, fill:{color:C.earthMid}, line:{color:C.darkLine} });
  s.addText("🐳  Docker (apt-get ffmpeg)  ·  apt-get gcc  ·  Multi-stage build  →  ☁️  Render.com Web Service (Docker runtime)  →  ▲  Vercel CDN (SPA rewrites)  ·  Nginx reverse proxy  ·  CORS middleware", {
    x:0.65, y:5.97, w:12.0, h:0.32, fontSize:9.5, color:C.muted, valign:"middle", margin:0
  });

  // WHY DOCKER callout
  card(s, 0.5, 6.42, 12.3, 0.95);
  s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:6.42, w:0.05, h:0.95, fill:{color:"22C55E"}, line:{color:"22C55E"} });
  s.addText("🐳  Why Docker is Non-Negotiable:", { x:0.65, y:6.5, w:3.5, h:0.28, fontSize:11.5, bold:true, color:"22C55E", margin:0 });
  s.addText("Standard Render Python buildpacks do NOT include ffmpeg. Our Dockerfile explicitly runs apt-get install ffmpeg — without this, all AI audio generation crashes. Docker also guarantees identical dev/prod environments and one-command local stack launch (docker-compose up --build).", {
    x:0.65, y:6.77, w:12.0, h:0.48, fontSize:10, color:C.muted, margin:0
  });

  slideNum(s, 7);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 08 — AI PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "07  AI PIPELINE", 0.5, 0.18);
  heading(s, "Multi-Modal AI Content Generation", "ElevenLabs  ·  Edge-TTS  ·  Pollinations Flux  ·  9 Rasa Emotion Moods");

  // LEFT — Audio pipeline
  s.addText("🎙️  Audio Generation Pipeline", { x:0.5, y:1.42, w:6.3, h:0.36, fontSize:14, bold:true, color:C.saffron, margin:0 });

  const audioSteps = [
    { n:"1",  label:"Raw scene text",          detail:"raw_text from SCENE table in SQLite",          color:C.blue },
    { n:"2",  label:"Dialogue parser",          detail:"Regex: 'Speaker: text', quoted speech, natural lang", color:C.blue },
    { n:"3a", label:"ElevenLabs v2 (primary)",  detail:"Rasa emotion → stability/clarity settings per character", color:C.saffron },
    { n:"3b", label:"Edge-TTS (fallback)",       detail:"Local synthesis — zero API cost, <200ms latency", color:C.amber },
    { n:"4",  label:"Pydub + FFmpeg concat",    detail:"Segment stitching, decibel normalisation, MP3 export", color:"22C55E" },
    { n:"5",  label:"static/audio/{id}.mp3",    detail:"Scene.ai_audio_url updated in DB, served via FastAPI", color:C.muted },
  ];

  audioSteps.forEach((step, i) => {
    const y = 1.88 + i * 0.87;
    s.addShape(pres.shapes.OVAL, { x:0.5, y:y+0.07, w:0.44, h:0.44, fill:{color:step.color}, line:{color:step.color} });
    s.addText(step.n, { x:0.5, y:y+0.07, w:0.44, h:0.44, fontSize:11, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
    if (i < audioSteps.length-1 && step.n !== "3a") arrow(s, 0.72, y+0.51, 0, 0.41, C.darkLine);
    card(s, 1.08, y, 5.5, 0.76);
    s.addText(step.label, { x:1.22, y:y+0.07, w:5.22, h:0.28, fontSize:12.5, bold:true, color:C.sand, margin:0 });
    s.addText(step.detail, { x:1.22, y:y+0.36, w:5.22, h:0.3,  fontSize:10, color:C.muted, margin:0 });
  });

  vline(s, 6.93, 1.38, 6.0);

  // RIGHT — Rasa moods + Image pipeline
  s.addText("🎨  9 Rasa Emotion Moods", { x:7.1, y:1.42, w:5.9, h:0.36, fontSize:14, bold:true, color:C.saffron, margin:0 });

  const rasas = [
    ["Shringara","Love",     C.pink],
    ["Hasya",    "Humor",    "22C55E"],
    ["Karuna",   "Sorrow",   C.blue],
    ["Raudra",   "Fury",     "EF4444"],
    ["Veera",    "Heroism",  C.amber],
    ["Bhayanaka","Fear",     C.purple],
    ["Adbhuta",  "Wonder",   "EC4899"],
    ["Shanta",   "Peace",    "10B981"],
    ["Bibhatsa", "Disgust",  "9CA3AF"],
  ];
  rasas.forEach((r, i) => {
    const col = i%3, row = Math.floor(i/3);
    const rx = 7.1+col*2.0, ry = 1.88+row*0.68;
    card(s, rx, ry, 1.9, 0.58);
    s.addShape(pres.shapes.RECTANGLE, { x:rx, y:ry, w:0.05, h:0.58, fill:{color:r[2]}, line:{color:r[2]} });
    s.addText(r[0], { x:rx+0.13, y:ry+0.04, w:1.7, h:0.28, fontSize:11.5, bold:true, color:C.sand, margin:0 });
    s.addText(r[1], { x:rx+0.13, y:ry+0.31, w:1.7, h:0.22, fontSize:9.5,  color:C.muted, margin:0 });
  });

  hline(s, 7.1, 4.97, 5.9, C.darkLine);
  s.addText("🖼️  Image Pipeline", { x:7.1, y:5.05, w:5.9, h:0.3, fontSize:13, bold:true, color:C.saffron, margin:0 });
  const imgSteps = ["Scene\nreel_script","+ Rasa\nmodifier","+ Cultural\nkeywords","Pollinations\nFlux API","Save 9:16\nJPEG","DB\nupdate"];
  imgSteps.forEach((step, i) => {
    card(s, 7.1+i*1.03, 5.42, 0.95, 0.78);
    s.addText(step, { x:7.1+i*1.03, y:5.42, w:0.95, h:0.78, fontSize:8.5, color:C.sand, align:"center", valign:"middle", margin:0 });
    if (i<5) { arrow(s, 8.05+i*1.03, 5.81, 0.08, 0, C.saffron); }
  });

  // Safety note
  card(s, 7.1, 6.32, 5.9, 0.55);
  s.addText("🛡️  Content Safety: Keyword validation rejects anachronistic or disrespectful prompts. Cultural context keywords required in every generation request.", {
    x:7.25, y:6.37, w:5.6, h:0.43, fontSize:9.5, color:C.muted, valign:"middle", margin:0
  });

  slideNum(s, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 09 — DATABASE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "08  DATABASE DESIGN", 0.5, 0.18);
  heading(s, "Entity-Relationship Schema", "SQLModel ORM  ·  8 entities  ·  Full FK relationships  ·  SQLite → PostgreSQL migration path");

  // Entity boxes — 4 across top row, 4 across bottom
  const entities = [
    { name:"USER",               x:0.5,  y:1.42, fields:["🔑 id PK","name","email UNIQUE","password_hash","total_xp","streak_days","archetype"], color:C.blue },
    { name:"STORY",              x:3.82, y:1.42, fields:["🔑 id PK","title","slug UNIQUE","category","cover_image_url","total_chapters"],            color:"22C55E" },
    { name:"CHAPTER",            x:7.14, y:1.42, fields:["🔑 id PK","🔗 story_id FK","index","title","short_summary","cover_image_url"],             color:C.amber },
    { name:"SCENE",              x:10.46,y:1.42, fields:["🔑 id PK","🔗 chapter_id FK","raw_text","ai_emotion","ai_audio_url","ai_video_url"],       color:C.saffron },
    { name:"USER_SCENE_PROGRESS",x:0.5,  y:4.72, fields:["🔑 id PK","🔗 user_id FK","🔗 scene_id FK","completed","xp_earned","completed_at"],       color:C.blue },
    { name:"BADGE",              x:3.82, y:4.72, fields:["🔑 id PK","code UNIQUE","name","description","icon_url","unlock_condition"],                color:"22C55E" },
    { name:"USER_BADGE",         x:7.14, y:4.72, fields:["🔑 id PK","🔗 user_id FK","🔗 badge_id FK","earned_at"],                                   color:C.amber },
    { name:"LOCATION",           x:10.46,y:4.72, fields:["🔑 id PK","name","description","lat","lon","epoch","era"],                                  color:C.saffron },
  ];

  entities.forEach(e => {
    const bh = 0.36 + e.fields.length * 0.34;
    s.addShape(pres.shapes.RECTANGLE, { x:e.x, y:e.y, w:3.1, h:0.36, fill:{color:e.color}, line:{color:e.color} });
    s.addText(e.name, { x:e.x, y:e.y, w:3.1, h:0.36, fontSize:10.5, bold:true, color:C.white, align:"center", valign:"middle", margin:0 });
    card(s, e.x, e.y+0.36, 3.1, bh-0.36, C.earthCard);
    e.fields.forEach((f, fi) => {
      const isPK = f.includes("PK"), isFK = f.includes("FK");
      s.addText(f, {
        x:e.x+0.1, y:e.y+0.42+fi*0.33, w:2.9, h:0.3,
        fontSize:9.5, color: isPK ? C.amber : isFK ? C.blue : C.muted, margin:0
      });
    });
  });

  // Relationship indicators (simplified)
  hline(s, 3.6, 2.7, 0.22, C.saffron);
  s.addText("1:N", { x:3.5, y:2.55, w:0.4, h:0.2, fontSize:8, color:C.saffron, align:"center", margin:0 });
  hline(s, 6.92, 2.7, 0.22, C.saffron);
  hline(s, 3.6, 6.0, 0.22, C.saffron);
  hline(s, 6.92, 6.0, 0.22, C.saffron);

  // Relationships text
  hline(s, 0.5, 7.12, 12.3, C.darkLine);
  s.addText("🔑 PK · 🔗 FK   Relationships: USER →(1:N) USER_SCENE_PROGRESS ←(N:1) SCENE · USER →(1:N) USER_BADGE ←(N:1) BADGE · STORY →(1:N) CHAPTER →(1:N) SCENE   |   Migration path: SQLite → PostgreSQL via DATABASE_URL env var", {
    x:0.5, y:7.17, w:12.3, h:0.28, fontSize:9, color:C.muted, align:"center", margin:0
  });

  slideNum(s, 9);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 10 — UI/UX DESIGN
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "09  UI/UX DESIGN", 0.5, 0.18);
  heading(s, "Design Language & Philosophy", "Mobile-first · Glassmorphism · Saffron palette · Novel + Webtoon hybrid reader");

  // COLOR PALETTE
  s.addText("Colour Palette", { x:0.5, y:1.42, w:5.0, h:0.32, fontSize:13, bold:true, color:C.saffron, margin:0 });
  [["EC6D13","Saffron","Primary action"],["1A1410","Dark Earth","Background"],["F9B233","Amber","Secondary accent"],["F5EFE0","Sand","Text/Content"],["261C15","Earth Mid","Cards/Surfaces"]].forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5+i*1.52, y:1.8, w:1.42, h:0.72, fill:{color:p[0]}, line:{color:C.darkLine} });
    s.addText(`#${p[0]}`, { x:0.5+i*1.52, y:2.55, w:1.42, h:0.2,  fontSize:8,  color:C.muted, align:"center", margin:0 });
    s.addText(p[1],       { x:0.5+i*1.52, y:2.73, w:1.42, h:0.22, fontSize:10, bold:true, color:C.sand, align:"center", margin:0 });
    s.addText(p[2],       { x:0.5+i*1.52, y:2.93, w:1.42, h:0.2,  fontSize:8.5,color:C.muted, align:"center", margin:0 });
  });

  hline(s, 0.5, 3.22, 12.3, C.darkLine);

  // TYPOGRAPHY
  s.addText("Typography", { x:0.5, y:3.32, w:3.5, h:0.3, fontSize:13, bold:true, color:C.saffron, margin:0 });
  [["Newsreader (Serif)","Display / Chapter headers — editorial gravitas, cultural heritage feel"],
   ["Noto Sans",          "Body / UI text — pan-language support including Devanagari script"]].forEach((t, i) => {
    card(s, 0.5+i*4.0, 3.68, 3.76, 0.68);
    s.addText(t[0], { x:0.65+i*4.0, y:3.74, w:3.46, h:0.3,  fontSize:13, bold:true, color:C.sand, margin:0 });
    s.addText(t[1], { x:0.65+i*4.0, y:4.02, w:3.46, h:0.26, fontSize:9.5, color:C.muted, margin:0 });
  });

  vline(s, 8.6, 1.38, 5.95);

  // UX PRINCIPLES right panel
  s.addText("Core UX Principles", { x:8.8, y:1.42, w:4.3, h:0.32, fontSize:13, bold:true, color:C.saffron, margin:0 });
  const ux = [
    ["📱","Mobile-First","320px min · safe-area insets · 44px tap targets"],
    ["🎬","Novel + Webtoon","Drop-caps · full-bleed AI images · vertical scroll"],
    ["⚡","Framer Motion","Spring physics · shared layoutId · enter/exit"],
    ["🌙","Glassmorphism","bg-white/5 + backdrop-blur · ambient glow blobs"],
    ["🌐","Bilingual UI","Hindi + English throughout · cultural authenticity"],
  ];
  ux.forEach(([em, title, desc], i) => {
    card(s, 8.8, 1.82+i*1.01, 4.3, 0.9);
    s.addText(em, { x:8.9, y:1.87+i*1.01, w:0.48, h:0.78, fontSize:22, align:"center", valign:"middle", margin:0 });
    s.addText(title, { x:9.48, y:1.92+i*1.01, w:3.5, h:0.3,  fontSize:13, bold:true, color:C.sand, margin:0 });
    s.addText(desc,  { x:9.48, y:2.21+i*1.01, w:3.5, h:0.38, fontSize:10, color:C.muted, margin:0 });
  });

  // Animation details
  s.addText("Key Animation Techniques", { x:0.5, y:4.45, w:7.8, h:0.3, fontSize:13, bold:true, color:C.saffron, margin:0 });
  const anims = [
    ["Page entry","opacity 0→1  y: 20→0  duration 0.8s ease-out"],
    ["Bottom nav active","shared layoutId pill  spring stiffness:500 damping:35"],
    ["Badge reveal","scale 0.8→1.1→1.0 with bounce spring physics"],
    ["Scroll progress","useScroll + useSpring  chapter reading indicator"],
  ];
  anims.forEach(([name, desc], i) => {
    const col = i%2, row = Math.floor(i/2);
    card(s, 0.5+col*4.0, 4.82+row*0.98, 3.76, 0.88);
    s.addText(name, { x:0.65+col*4.0, y:4.89+row*0.98, w:3.46, h:0.3,  fontSize:12, bold:true, color:C.sand, margin:0 });
    s.addText(desc, { x:0.65+col*4.0, y:5.17+row*0.98, w:3.46, h:0.42, fontSize:10, color:C.muted, margin:0 });
  });

  slideNum(s, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 11 — FEATURES SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "10  PLATFORM FEATURES", 0.5, 0.18);
  heading(s, "What Katha Can Do", "Complete feature matrix across gamification, AI, UX, and cultural preservation");

  const features = [
    { em:"🎮", title:"RPG Gamification",     color:C.saffron, items:["4 Archetypes via personality quiz (Warrior/Sage/Seeker/Guardian)","XP system per scene + daily streak tracking","20+ dynamic badges with unlock conditions","Achievement celebration modal with spring animation"] },
    { em:"🎙️", title:"AI Audio Pipeline",   color:C.blue,   items:["ElevenLabs v2 Multilingual TTS — primary","9 Rasa emotion → audio parameter mappings","Dialogue character voice parsing (3 regex modes)","Edge-TTS fallback + Pydub concat + FFmpeg normalise"] },
    { em:"🎬", title:"Visual AI Reels",      color:C.amber,  items:["Pollinations Flux Realism — 9:16 mobile format","Emotion-enriched prompt engineering per Rasa","VideoModal: auto-detects image vs video format","Full-screen immersive view with play controls"] },
    { em:"🗺️", title:"Sacred Map",           color:"22C55E", items:["Leaflet.js interactive dark CartoCD tile map","Real coordinates: Ayodhya, Kurukshetra, Lanka, Dwarka","Custom animated bounce marker icons","Historical epoch + era metadata per location"] },
    { em:"📖", title:"Chapter Reader",        color:C.pink,   items:["Novel + Webtoon hybrid scroll format","Drop-cap serif typography (Newsreader font)","Floating audio control dock with seek bar","Framer Motion useScroll progress indicator"] },
    { em:"🤖", title:"Rishi AI Oracle",       color:C.purple, items:["In-scene AI cultural companion chatbot","Symbolism & philosophy Q&A context-aware","RasaPanel mood selector integration","SwipeHandler navigation between scenes"] },
  ];

  features.forEach((f, i) => {
    const col = i%3, row = Math.floor(i/3);
    const fx = 0.5+col*4.28, fy = 1.42+row*2.98;
    s.addShape(pres.shapes.RECTANGLE, { x:fx, y:fy, w:4.1, h:0.46, fill:{color:f.color}, line:{color:f.color} });
    s.addText(f.em + "  " + f.title, { x:fx+0.14, y:fy, w:3.82, h:0.46, fontSize:14, bold:true, color:C.white, valign:"middle", margin:0 });
    card(s, fx, fy+0.46, 4.1, 2.38);
    f.items.forEach((item, ii) => {
      dot(s, fx+0.2, fy+0.65+ii*0.55, f.color);
      s.addText(item, { x:fx+0.4, y:fy+0.59+ii*0.55, w:3.55, h:0.5, fontSize:10.5, color:C.mutedBright, valign:"middle", margin:0 });
    });
  });

  slideNum(s, 11);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 12 — DEPLOYMENT (from actual DEPLOY.md)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "11  DEPLOYMENT ARCHITECTURE", 0.5, 0.18);
  heading(s, "Production Deployment Pipeline", "Docker (ffmpeg)  ·  Render.com Blueprint  ·  Vercel CDN  ·  SQLite → PostgreSQL");

  // Top — service flow diagram
  const services = [
    { label:"👤  End User",           sub:"Browser / Mobile",       color:C.blue,   x:0.5  },
    { label:"▲  Vercel CDN",          sub:"React + Vite SPA\nSPA rewrites in vercel.json", color:"22C55E", x:3.35 },
    { label:"🐳  Render.com",         sub:"Docker Web Service\napt-get ffmpeg ✅",  color:C.saffron, x:6.2  },
    { label:"🗄️  Database",          sub:"SQLite (dev)\nPostgreSQL (prod)",       color:C.amber,  x:9.05 },
  ];

  services.forEach((svc, i) => {
    card(s, svc.x, 1.42, 2.65, 1.12, C.earthCard);
    s.addShape(pres.shapes.RECTANGLE, { x:svc.x, y:1.42, w:2.65, h:0.06, fill:{color:svc.color}, line:{color:svc.color} });
    s.addText(svc.label, { x:svc.x+0.1, y:1.52, w:2.45, h:0.38, fontSize:12.5, bold:true, color:C.sand, align:"center", margin:0 });
    s.addText(svc.sub,   { x:svc.x+0.1, y:1.89, w:2.45, h:0.52, fontSize:9.5, color:C.muted, align:"center", margin:0 });
    if (i<3) {
      arrow(s, svc.x+2.65, 1.98, 0.7, 0, svc.color);
      s.addText(["HTTPS","REST API","SQL queries"][i], { x:svc.x+2.7, y:1.82, w:0.62, h:0.2, fontSize:7.5, color:C.muted, align:"center", margin:0 });
    }
  });

  // Also show AI services
  arrow(s, 8.85, 1.98, 0, 0.75, C.muted);
  card(s, 6.2, 2.85, 2.65, 0.9, C.earthCard);
  s.addShape(pres.shapes.RECTANGLE, { x:6.2, y:2.85, w:2.65, h:0.06, fill:{color:C.pink}, line:{color:C.pink} });
  s.addText("🤖  AI Services", { x:6.3, y:2.95, w:2.45, h:0.3, fontSize:12, bold:true, color:C.sand, align:"center", margin:0 });
  s.addText("ElevenLabs  ·  Pollinations\nEdge-TTS  ·  FFmpeg (Docker)", { x:6.3, y:3.23, w:2.45, h:0.42, fontSize:9, color:C.muted, align:"center", margin:0 });

  hline(s, 0.5, 3.92, 12.3, C.darkLine);

  // Two-column deploy steps
  s.addText("🚀  Render Backend Setup", { x:0.5, y:4.02, w:5.9, h:0.32, fontSize:13, bold:true, color:C.saffron, margin:0 });
  const renderSteps = [
    "1.  Push code to GitHub",
    "2.  Render Blueprint → connect repo → auto-detects render.yaml",
    "3.  Render builds Docker image (includes apt-get ffmpeg)",
    "4.  Set env vars: GEMINI_API_KEY, CORS_ORIGINS",
    "5.  Health check: /health → {status:'healthy', database:'connected'}",
    "6.  API docs live at: https://your-backend.onrender.com/docs",
  ];
  renderSteps.forEach((step, i) => {
    dot(s, 0.55, 4.48+i*0.47, C.saffron);
    s.addText(step, { x:0.78, y:4.42+i*0.47, w:5.55, h:0.42, fontSize:10.5, color:C.muted, valign:"middle", margin:0 });
  });

  vline(s, 6.7, 4.02, 3.42);
  s.addText("▲  Vercel Frontend Setup", { x:6.9, y:4.02, w:5.9, h:0.32, fontSize:13, bold:true, color:"22C55E", margin:0 });
  const vercelSteps = [
    "1.  Vercel → Add New Project → import GitHub repo",
    "2.  Root Directory → set to frontend/",
    "3.  Framework preset → Vite (auto-detected)",
    "4.  Set VITE_API_BASE_URL = https://your-backend.onrender.com",
    "5.  Deploy → copy live URL → update Render CORS_ORIGINS",
    "6.  SPA rewrites: /* → /index.html (in vercel.json)",
  ];
  vercelSteps.forEach((step, i) => {
    dot(s, 6.95, 4.48+i*0.47, "22C55E");
    s.addText(step, { x:7.18, y:4.42+i*0.47, w:5.55, h:0.42, fontSize:10.5, color:C.muted, valign:"middle", margin:0 });
  });

  // DB strategy strip
  hline(s, 0.5, 7.05, 12.3, C.darkLine);
  s.addText("🗄️  DB Strategy:", { x:0.5, y:7.12, w:1.6, h:0.26, fontSize:10.5, bold:true, color:C.amber, margin:0 });
  s.addText("SQLite default (ephemeral on Render free tier)  ·  Add Render Persistent Disk for SQLite persistence  OR  provision Render PostgreSQL → set DATABASE_URL → auto-migrates via SQLModel  ·  Demo credentials: demo@katha.com / demo123", {
    x:2.2, y:7.12, w:10.6, h:0.26, fontSize:9.5, color:C.muted, valign:"middle", margin:0
  });

  slideNum(s, 12);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 13 — RESULTS & SCORECARD
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "12  RESULTS & EVALUATION", 0.5, 0.18);
  heading(s, "Performance & Scorecard", "All target metrics met  ·  Investor/hackathon scorecard  ·  Feature completion");

  // Left — metrics
  s.addText("Performance Metrics", { x:0.5, y:1.42, w:6.0, h:0.32, fontSize:13.5, bold:true, color:C.saffron, margin:0 });
  const metrics = [
    ["API Response (non-AI)", "< 150ms avg", C.green],
    ["ElevenLabs Audio Gen",  "2.5–4.5s / segment", C.green],
    ["Pollinations Image Gen", "3–6s / image", C.green],
    ["Frontend Load (Vercel)", "< 1.2s (CDN cached)", C.green],
    ["Mobile Responsive",     "375px – 1440px ✅", C.green],
    ["JWT Auth Validation",   "< 10ms ✅", C.green],
  ];
  metrics.forEach(([label, val, c], i) => {
    card(s, 0.5, 1.82+i*0.88, 6.0, 0.78);
    s.addShape(pres.shapes.RECTANGLE, { x:0.5, y:1.82+i*0.88, w:0.05, h:0.78, fill:{color:c}, line:{color:c} });
    s.addText("✅", { x:0.62, y:1.87+i*0.88, w:0.45, h:0.65, fontSize:20, align:"center", valign:"middle", margin:0 });
    s.addText(label, { x:1.17, y:1.9+i*0.88, w:3.5,  h:0.3,  fontSize:12.5, bold:true, color:C.sand, margin:0 });
    s.addText(val,   { x:1.17, y:2.18+i*0.88, w:5.1, h:0.28, fontSize:11, color:C.muted, margin:0 });
    // Full green bar
    s.addShape(pres.shapes.RECTANGLE, { x:4.85, y:2.07+i*0.88, w:1.45, h:0.22, fill:{color:C.darkLine}, line:{color:C.darkLine} });
    s.addShape(pres.shapes.RECTANGLE, { x:4.85, y:2.07+i*0.88, w:1.45, h:0.22, fill:{color:c}, line:{color:c} });
  });

  vline(s, 6.85, 1.38, 5.95);

  // Right — Hackathon scorecard
  s.addText("Hackathon / Investor Scorecard", { x:7.05, y:1.42, w:5.9, h:0.32, fontSize:13.5, bold:true, color:C.saffron, margin:0 });
  const scores = [
    ["Originality",        9.0],
    ["Technical Depth",    8.5],
    ["Design Thinking",    9.0],
    ["Demo Potential",     9.5],
    ["Market Potential",   8.0],
    ["Portfolio Value",    9.0],
  ];
  scores.forEach(([label, score], i) => {
    card(s, 7.05, 1.82+i*0.88, 5.9, 0.78);
    s.addText(label, { x:7.2, y:1.9+i*0.88, w:3.0, h:0.3, fontSize:12.5, bold:true, color:C.sand, margin:0 });
    s.addText(`${score}/10`, { x:7.2, y:2.18+i*0.88, w:1.0, h:0.3, fontSize:18, bold:true, color:C.saffron, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:9.3, y:2.07+i*0.88, w:3.4, h:0.22, fill:{color:C.darkLine}, line:{color:C.darkLine} });
    s.addShape(pres.shapes.RECTANGLE, { x:9.3, y:2.07+i*0.88, w:3.4*(score/10), h:0.22, fill:{color:C.saffron}, line:{color:C.saffron} });
  });

  // Feature completion
  hline(s, 0.5, 7.05, 12.3, C.darkLine);
  s.addText("Feature Status:", { x:0.5, y:7.12, w:1.8, h:0.26, fontSize:10.5, bold:true, color:C.sand, margin:0 });
  [["✅ Auth + JWT",""], ["✅ Story CRUD",""], ["✅ AI Audio",""], ["✅ AI Images",""],
   ["✅ Sacred Map",""], ["✅ Gamification",""], ["✅ Docker Deploy",""], ["🔄 Rishi AI","partial"], ["📋 SVD Videos","planned"]].forEach(([c, _], i) => {
    const col = c.startsWith("✅") ? C.green : c.startsWith("🔄") ? C.amber : C.muted;
    s.addText(c, { x:2.5+i*1.19, y:7.12, w:1.15, h:0.26, fontSize:9.5, color:col, margin:0 });
  });

  slideNum(s, 13);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 14 — FUTURE ROADMAP
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);
  pill(s, "13  FUTURE ROADMAP", 0.5, 0.18);
  heading(s, "Product Evolution — 3 Phases", "MVP → Advanced AI → Platform Scale → Venture");

  const phases = [
    { p:"Phase 2", time:"3–6 months", label:"Advanced AI", color:C.blue, items:[
      "Stable Video Diffusion — cinematic 4–6s scene clips",
      "Celery + Redis async task queue (non-blocking AI)",
      "AWS S3 / Cloudflare R2 — cloud media storage",
      "Hindi/Sanskrit neural translation + regional voices",
      "React Native iOS + Android apps",
      "PostgreSQL full migration + Redis caching",
    ]},
    { p:"Phase 3", time:"6–12 months", label:"Platform Scale", color:"22C55E", items:[
      "Full Rishi AI Oracle — LLM cultural Q&A (context-aware)",
      "Multiplayer cooperative reading quest lines",
      "Creator marketplace — community storytellers submit",
      "Teacher dashboard with classroom mode + analytics",
      "Offline PWA with service workers + IndexedDB",
    ]},
    { p:"Phase 4", time:"12+ months", label:"Venture Scale", color:C.saffron, items:[
      "WebXR / VR immersive mythology experiences",
      "UNESCO cultural preservation formal partnership",
      "Expand: Puranas, Panchatantra, regional folklore — 50+ texts",
      "AI-powered adaptive personalized narrative paths",
      "Content licensing + premium publisher partnerships",
    ]},
  ];

  phases.forEach((ph, i) => {
    const x = 0.5 + i*4.28;
    s.addShape(pres.shapes.RECTANGLE, { x, y:1.42, w:4.1, h:0.58, fill:{color:ph.color}, line:{color:ph.color} });
    s.addText(ph.p + "  ·  " + ph.time, { x:x+0.1, y:1.42, w:3.9, h:0.28, fontSize:11.5, bold:true, color:C.white, valign:"middle", margin:0 });
    s.addText(ph.label, { x:x+0.1, y:1.68, w:3.9, h:0.28, fontSize:13, color:C.white, margin:0 });
    card(s, x, 2.0, 4.1, 4.42);
    ph.items.forEach((item, ii) => {
      dot(s, x+0.2, 2.2+ii*0.72, ph.color);
      s.addText(item, { x:x+0.42, y:2.14+ii*0.72, w:3.55, h:0.62, fontSize:11, color:C.mutedBright, valign:"middle", margin:0 });
    });
  });

  // Future evolution
  hline(s, 0.5, 6.55, 12.3, C.darkLine);
  s.addText("Startup Evolution:", { x:0.5, y:6.65, w:2.0, h:0.3, fontSize:11.5, bold:true, color:C.sand, margin:0 });
  [["Hackathon MVP ✅", C.green], ["→  Real Product", C.muted], ["→  Consumer Platform", C.muted], ["→  Venture Scale", C.muted]].forEach(([t,c],i) => {
    s.addText(t, { x:2.8+i*2.6, y:6.65, w:2.45, h:0.3, fontSize:12, color:c, bold:i===0, margin:0 });
  });

  // Resume bullets
  hline(s, 0.5, 7.05, 12.3, C.darkLine);
  s.addText("📄  Resume-ready: Built an AI-powered gamified cultural storytelling platform (React 18 + FastAPI + Docker) with ElevenLabs emotion narration, Pollinations Flux image gen, and a full RPG progression system deployed on Render + Vercel.", {
    x:0.5, y:7.1, w:12.3, h:0.28, fontSize:9.5, color:C.muted, valign:"middle", margin:0
  });

  slideNum(s, 14);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 15 — THANK YOU
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  bgDark(s);
  topBar(s); botBar(s);

  // OM watermark
  s.addText("ॐ", { x:6.0, y:0.2, w:7.3, h:7.1, fontSize:400, color:C.earthMid, align:"center", valign:"middle", margin:0 });

  leftAccent(s, 0.88, 1.0, 5.6);

  s.addText("Katha is More\nThan a Platform.", { x:1.1, y:1.05, w:10, h:2.35, fontSize:58, bold:true, color:C.sand, align:"left", margin:0 });
  hline(s, 1.1, 3.5, 8.0, C.saffron);
  s.addText("It is a bridge between ancient wisdom\nand the digital generation.", { x:1.1, y:3.62, w:10, h:0.9, fontSize:19, color:C.muted, italic:true, margin:0 });

  const highs = [
    "🏆  Originality 9/10 · Demo Potential 9.5/10 · Portfolio Value 9/10",
    "🤖  End-to-end AI pipeline: ElevenLabs + Pollinations + Rasa moods",
    "🐳  Production-ready: Docker (ffmpeg) + Render Blueprint + Vercel CDN",
    "📱  Mobile-first PWA: 30+ components · 8 API routers · 5 Agile sprints",
  ];
  highs.forEach((h, i) => {
    s.addText(h, { x:1.1, y:4.65+i*0.56, w:10.5, h:0.48, fontSize:12.5, color:C.sand, margin:0 });
  });

  // Author contact card
  card(s, 1.1, 7.0, 10.5, 0.36);
  s.addText("Shrishti Singh  ·  shrishtis089@gmail.com  ·  github.com/shru089  ·  linkedin.com/in/shrishti-singh-455566348  ·  CSMU, Navi Mumbai", {
    x:1.25, y:7.04, w:10.2, h:0.28, fontSize:10.5, color:C.muted, valign:"middle", margin:0
  });

  // Verse
  s.addText('"Na jayate mriyate va kadacit"  —  It is never born, nor does it ever die.  —  Bhagavad Gita 2.20', {
    x:1.1, y:7.38, w:10.5, h:0.2, fontSize:9, color:C.muted, italic:true, margin:0
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE FILE
// ─────────────────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: path.join(__dirname, "../Katha_Presentation.pptx") })
  .then(() => console.log("✅ Katha_Presentation.pptx — 15 slides done"))
  .catch(e => { console.error("❌", e); process.exit(1); });
