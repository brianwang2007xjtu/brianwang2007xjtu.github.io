/**
 * 论文在 Paper Graph 上的显示名。
 *
 * 配置里可以给一篇论文写 `label: "$\\pi^*_{0.6}$"`（LaTeX）。画布上画不了
 * KaTeX 的排版，所以这里把常见的 LaTeX 片段转成 Unicode（π*₀.₆），
 * 列表 / 悬浮卡片则直接用 KaTeX 渲染原文。
 */

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "=": "₌",
  "(": "₍",
  ")": "₎",
  a: "ₐ",
  e: "ₑ",
  i: "ᵢ",
  j: "ⱼ",
  k: "ₖ",
  l: "ₗ",
  m: "ₘ",
  n: "ₙ",
  o: "ₒ",
  p: "ₚ",
  r: "ᵣ",
  s: "ₛ",
  t: "ₜ",
  u: "ᵤ",
  v: "ᵥ",
  x: "ₓ",
};

const GREEK: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  theta: "θ",
  lambda: "λ",
  mu: "μ",
  pi: "π",
  rho: "ρ",
  sigma: "σ",
  tau: "τ",
  phi: "φ",
  omega: "ω",
  Delta: "Δ",
  Sigma: "Σ",
  Omega: "Ω",
};

const toSubscript = (text: string) =>
  [...text].map(ch => SUBSCRIPTS[ch] ?? ch).join("");

/** `$\pi^*_{0.6}$` → `π*₀.₆`；不是 LaTeX 的名字原样返回。 */
export function paperLabelToText(label: string): string {
  if (!label.includes("$") && !label.includes("\\")) return label;
  let out = label.replace(/\$/g, "");
  out = out.replace(
    /\\([A-Za-z]+)/g,
    (whole, name: string) => GREEK[name] ?? name
  );
  // 上标：\pi^* 或 ^{...} 都直接摊平（π*）
  out = out.replace(/\^\{([^}]*)\}/g, "$1").replace(/\^(\S)/g, "$1");
  // 下标：_{0.6} / _0
  out = out.replace(/_\{([^}]*)\}/g, (_, g: string) => toSubscript(g));
  out = out.replace(/_(\w)/g, (_, c: string) => toSubscript(c));
  out = out.replace(/[{}]/g, "");
  return out.trim();
}

/** 这个名字是不是 LaTeX（需要 KaTeX 渲染）。 */
export function isLatexLabel(label: string): boolean {
  return label.includes("$") || label.includes("\\");
}
