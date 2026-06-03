// ═══════════════════════════════════════════════════════
//  書目資料 — 新增書籍：在此陣列末尾加一個物件即可。
// ═══════════════════════════════════════════════════════
const BOOKS = [
  {
    icon: "⚙️",
    title: "Binary Hacks 精讀筆記",
    desc: "AI 時代的底層觀念 — 格式、執行期、浮點數、Profiling、並行",
    tags: ["systems", "AI infra"],
    href: "book/hack100/html/index.html",
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
  },
  {
    icon: "🔬",
    title: "CoWoS 技術精讀筆記",
    desc: "從 TSV、矽中介板到 CoWoS-S/R/L，以及 HBM 整合與 AI 加速器應用",
    tags: ["advanced packaging", "AI hardware"],
    href: "book/cowos/html/index.html",
    accent: "#06b6d4",
    glow: "rgba(6,182,212,0.18)",
  },
  {
    icon: "🏭",
    title: "半導體職務完全指南",
    desc: "IC Design、製程、設備、封裝、FAE 等 20+ 職務的工作內容、薪資與職涯路徑",
    tags: ["career", "semiconductor"],
    href: "book/semi-jobs/html/index.html",
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.18)",
  },
  {
    icon: "🏭",
    title: "台積電全方位指南",
    desc: "從歷史沿革、技術製程、廠區版圖，到財務策略、地緣政治與職涯規劃的完整知識地圖",
    tags: ["TSMC", "semiconductor"],
    href: "book/tsmc/html/index.html",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.18)",
  },
  {
    icon: "🖥️",
    title: "GPU 完整學習指南",
    desc: "GPU 架構、CUDA 程式模型、記憶體層次與 AI 推論加速的完整知識地圖",
    tags: ["GPU", "CUDA", "AI infra"],
    href: "book/gpu/html/index.html",
    accent: "#10b981",
    glow: "rgba(16,185,129,0.18)",
  },
  {
    icon: "🟢",
    title: "NVIDIA 深度解析筆記",
    desc: "從 GPU 晶片、CUDA 生態、資料中心產品到 NVIDIA 商業策略與競爭態勢的深度解析",
    tags: ["NVIDIA", "semiconductor", "AI"],
    href: "book/nvidia/html/index.html",
    accent: "#76b900",
    glow: "rgba(118,185,0,0.18)",
  },
];

const TAG_COLOR = {
  "systems":            { tc: "#fbbf24", tb: "rgba(251,191,36,0.08)",  te: "rgba(251,191,36,0.2)" },
  "AI infra":           { tc: "#a78bfa", tb: "rgba(167,139,250,0.08)", te: "rgba(167,139,250,0.2)" },
  "AI hardware":        { tc: "#67e8f9", tb: "rgba(103,232,249,0.08)", te: "rgba(103,232,249,0.2)" },
  "advanced packaging": { tc: "#2dd4bf", tb: "rgba(45,212,191,0.08)",  te: "rgba(45,212,191,0.2)" },
  "career":             { tc: "#4ade80", tb: "rgba(74,222,128,0.08)",  te: "rgba(74,222,128,0.2)" },
  "semiconductor":      { tc: "#60a5fa", tb: "rgba(96,165,250,0.08)",  te: "rgba(96,165,250,0.2)" },
  "TSMC":               { tc: "#60a5fa", tb: "rgba(96,165,250,0.08)",  te: "rgba(96,165,250,0.2)" },
  "GPU":                { tc: "#34d399", tb: "rgba(52,211,153,0.08)",  te: "rgba(52,211,153,0.2)" },
  "CUDA":               { tc: "#fde047", tb: "rgba(253,224,71,0.08)",  te: "rgba(253,224,71,0.2)" },
  "NVIDIA":             { tc: "#86efac", tb: "rgba(134,239,172,0.08)", te: "rgba(134,239,172,0.2)" },
  "AI":                 { tc: "#c4b5fd", tb: "rgba(196,181,253,0.08)", te: "rgba(196,181,253,0.2)" },
};
const TAG_DEFAULT = { tc: "#a5b4fc", tb: "rgba(99,102,241,0.08)", te: "rgba(99,102,241,0.2)" };
