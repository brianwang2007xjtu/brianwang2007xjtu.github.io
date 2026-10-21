/**
 * Paper Graph 的手动配置 —— 改这一个文件就够了。
 *
 * 每篇论文的键是 arXiv 编号，可以设置：
 *   importance: 1–5          节点圆的大小，越大越重要（默认 1；1 ≈ 12px，5 ≈ 22px）
 *   branch:     "Embodied/JEPA"  论文在树上的位置：
 *              AI → 一级（CV / Generative / Embodied …） → 二级（JEPA / VLA / WAM …）
 *              写新的路径就会自动多出对应的分类节点
 *   venue:      "CVPR 2024" 之类；留空 = 显示 preprint
 *   year:       发表年份；不填则按 arXiv 编号（YYMM）自动推断
 *   hidden:     true 表示不显示在图上
 *
 * 只有「有专门版块的论文」（写了 <PaperNote> 的）才会进图，列表里一带而过的不会。
 */

export interface PaperMeta {
  /** 1–5，节点半径按它缩放（越大越重要）。 */
  importance?: 1 | 2 | 3 | 4 | 5;
  /** 树上的位置，例如 "Embodied/JEPA"。 */
  branch?: string;
  /** 发表年份，不填则从 arXiv 编号推断。 */
  year?: number;
  /** 图上的显示名，可以写 LaTeX，例如 "$\\pi^*_{0.6}$"。默认用论文名。 */
  label?: string;
  /** 期刊 / 会议名；留空则显示 preprint。 */
  venue?: string;
  /** 设为 true 则不出现在图上。 */
  hidden?: boolean;
}

export const DEFAULT_IMPORTANCE = 1;
/** 没写 branch 的论文放这里。 */
export const DEFAULT_BRANCH = "Others/Uncategorised";
/** 树的根节点名字。 */
export const GRAPH_ROOT = "AI";

export const paperMeta: Record<string, PaperMeta> = {
  /* ---------- 2026 ---------- */
  // Recent Work 系列（按文章里的出场顺序：2,4,1,2,4,2,4）
  "2610.10528": { importance: 2, branch: "Embodied/WAM" },  // Long-WAM
  "2608.24882": { importance: 4, branch: "Embodied/WAM" },  // LAWA
  "2608.10780": { importance: 1, branch: "Embodied/WAM" },  // StageWAM
  "2610.07922": { importance: 2, branch: "Embodied/WAM" },  // OpenWAM
  "2610.10515": { importance: 4, branch: "Embodied/JEPA" },  // RoboJEPA
  "2604.02097": { importance: 4, branch: "CV/Backbone" },  // LatentUM
  "2602.11389": { importance: 1, branch: "Embodied/JEPA" },  // C-JEPA
  "2609.32779": { importance: 2, branch: "Embodied/WAM" },  // Copper-Policy
  "2602.15922": { importance: 5, branch: "Embodied/WAM" },  // DreamZero
  "2603.16666": { importance: 3, branch: "Embodied/WAM" },  // Fast-WAM
  "2608.07619": { importance: 3, branch: "Embodied/VLA" },  // GWMVLA
  "2602.11832": { importance: 1, branch: "Embodied/VLA" },  // JEPA-VLA
  "2608.09381": { importance: 3, branch: "Embodied/WAM" },  // JEPA-WAM
  "2606.15768": { importance: 3, branch: "Embodied/WAM" },  // LaWAM
  "2603.19312": { importance: 4, branch: "Embodied/WAM" },  // LeWorldModel
  "2609.27455": { importance: 3, branch: "Embodied/WAM" },  // LeWAM
  "2603.22281": { importance: 2, branch: "Embodied/JEPA" },  // ThinkJEPA
  "2603.14482": { importance: 2, branch: "Embodied/JEPA" },  // V-JEPA-2.1
  "2605.15195": { importance: 3, branch: "CV/3D Vision" },  // VGGT-Ω
  "2602.10098": { importance: 3, branch: "Embodied/VLA" },  // VLA-JEPA

  /* ---------- 2025 ---------- */
  "2510.10642": { importance: 2, branch: "Embodied/VLA" },  // UniJEPA
  "2511.14759": { importance: 3, branch: "Embodied/VLA", label: "$\\pi^*_{0.6}$" },  // pi*0.6
  "2604.15483": { importance: 4, branch: "Embodied/VLA", label: "$\\pi_{0.7}$" },  // pi0.7
  "2609.12081": { importance: 2, branch: "Embodied/VLA" },  // MoPA
  "2501.14622": { importance: 3, branch: "Embodied/JEPA" },  // ACT-JEPA
  "2507.04447": { importance: 2, branch: "Embodied/VLA" },  // DreamVLA
  "2511.08544": { importance: 4, branch: "Embodied/JEPA" },  // LeJEPA
  "2504.16054": { importance: 3, branch: "Embodied/VLA", label: "$\\pi_{0.5}$" },  // pi_0.5
  "2506.09985": { importance: 5, branch: "Embodied/JEPA" },  // V-JEPA-2
  "2503.11651": { importance: 5, branch: "CV/3D Vision", venue: "CVPR 2025 (Best Paper)", year: 2025 },  // VGGT
  "2512.10942": { importance: 2, branch: "Embodied/JEPA" },  // VL-JEPA

  /* ---------- 2024 ---------- */
  "2410.11758": { importance: 4, branch: "Embodied/VLA", venue: "ICLR 2025", year: 2025 },  // LAPA
  "2410.24164": { importance: 3, branch: "Embodied/VLA", venue: "RSS 2025", year: 2025, label: "$\\pi_0$" },  // pi_0
  "2404.08471": { importance: 3, branch: "Embodied/JEPA", venue: "CVPR 2024", year: 2024 },  // V-JEPA

  /* ---------- 2023 ---------- */
  "2303.04137": { importance: 2, branch: "Embodied/VLA", venue: "RSS 2023", year: 2023 },  // Diffusion-policy
  "2301.08243": { importance: 3, branch: "Embodied/JEPA", venue: "CVPR 2023", year: 2023 },  // I-JEPA
  "2307.15818": { importance: 4, branch: "Embodied/VLA", venue: "CoRL 2023", year: 2023 },  // RT-2
  "2302.00111": { importance: 3, branch: "Embodied/VLA", venue: "ICLR 2023", year: 2023 },  // Unipi

  /* ---------- 2022 ---------- */
  "2204.06125": { importance: 3, branch: "Generative/Diffusion" },  // DALLE2
  "2212.09748": { importance: 5, branch: "Generative/Diffusion", venue: "ICCV 2023", year: 2023 },  // DiT

  /* ---------- 2021 ---------- */
  "2112.10752": { importance: 3, branch: "Generative/Diffusion", venue: "CVPR 2022", year: 2022 },  // Stable-Diffusion

  /* ---------- 2020 ---------- */
  "2006.11239": { importance: 4, branch: "Generative/Diffusion", venue: "NeurIPS 2020", year: 2020 },  // DDPM
  "2003.08934": { importance: 5, branch: "CV/3D Vision", venue: "ECCV 2020", year: 2020 },  // NeRF
  "2010.11929": { importance: 5, branch: "CV/Backbone", venue: "ICLR 2021", year: 2021 },  // ViT

  /* ---------- 2017 ---------- */
  "1706.03762": { importance: 5, branch: "CV/Backbone", venue: "NeurIPS 2017", year: 2017 },  // Transformer
};

/**
 * 论文之间的关联（引用 / 承接 / 同一脉络）—— 只有写在这里的论文之间才会连线。
 * 写一边就行，两个方向都会连上；键是 arXiv 编号。
 */
export const paperRelations: [string, string][] = [
  ["1706.03762", "2010.11929"],  // Transformer → ViT
  ["2006.11239", "2204.06125"],  // DDPM → DALL·E 2
  ["2006.11239", "2303.04137"],  // DDPM → Diffusion Policy
  ["2006.11239", "2112.10752"],  // DDPM → Stable Diffusion
  ["2003.08934", "2503.11651"],  // NeRF → VGGT
  ["2606.15768", "2609.27455"],  // LaWAM ↔ LeWAM
  ["2010.11929", "2212.09748"],  // ViT → DiT
  ["2204.06125", "2112.10752"],  // DALL·E 2 ↔ Stable Diffusion
  ["2212.09748", "2112.10752"],  // DiT → Stable Diffusion
  ["2303.04137", "2504.16054"],  // Diffusion Policy → pi_0.5
  ["2301.08243", "2501.14622"],  // I-JEPA → ACT-JEPA
  ["2301.08243", "2404.08471"],  // I-JEPA → V-JEPA
  ["2301.08243", "2511.08544"],  // I-JEPA ↔ LeJEPA
  ["2307.15818", "2410.24164"],  // RT-2 → pi_0
  ["2404.08471", "2506.09985"],  // V-JEPA → V-JEPA 2
  ["2404.08471", "2512.10942"],  // V-JEPA → VL-JEPA
  ["2410.24164", "2504.16054"],  // pi_0 ↔ pi_0.5
  // Recent Work 这批 WAM / JEPA 工作的承接关系
  ["2603.16666", "2608.24882"],  // Fast-WAM ↔ LAWA
  ["2608.24882", "2608.10780"],  // LAWA ↔ StageWAM
  ["2608.24882", "2610.10528"],  // LAWA ↔ Long-WAM
  ["2608.24882", "2610.07922"],  // LAWA ↔ OpenWAM
  ["2603.14482", "2610.10515"],  // V-JEPA-2.1 ↔ RoboJEPA
  ["2506.09985", "2608.10780"],  // V-JEPA-2 ↔ StageWAM
  // π 系列内部构成完全图
  ["2410.24164", "2511.14759"],  // pi_0 ↔ pi*0.6
  ["2410.24164", "2604.15483"],  // pi_0 ↔ pi0.7
  ["2504.16054", "2511.14759"],  // pi_0.5 ↔ pi*0.6
  ["2504.16054", "2604.15483"],  // pi_0.5 ↔ pi0.7
  ["2511.14759", "2604.15483"],  // pi*0.6 ↔ pi0.7
  ["2609.12081", "2504.16054"],  // MoPA ↔ pi_0.5
  ["2511.08544", "2602.11389"],  // LeJEPA ↔ C-JEPA
  ["2506.09985", "2602.11832"],  // V-JEPA 2 → JEPA-VLA
  ["2506.09985", "2603.22281"],  // V-JEPA 2 → ThinkJEPA
  ["2506.09985", "2603.14482"],  // V-JEPA 2 → V-JEPA 2.1
  ["2503.11651", "2605.15195"],  // VGGT → VGGT-Ω
  ["2602.15922", "2603.19312"],  // DreamZero ↔ LeWorldModel
  ["2603.16666", "2606.15768"],  // Fast-WAM ↔ LaWAM
  ["2609.32779", "2603.16666"],  // Copper-Policy ↔ Fast-WAM
  ["2602.11832", "2602.10098"],  // JEPA-VLA ↔ VLA-JEPA
  ["2606.15768", "2608.09381"],  // LaWAM ↔ JEPA-WAM
  ["2603.19312", "2606.15768"],  // LeWorldModel ↔ LaWAM
  ["2602.10098", "2608.07619"],  // VLA-JEPA ↔ GWM-VLA
];

/** 按 arXiv 编号优先、论文名兜底，取一篇论文的手动配置。 */
export function getPaperMeta(arxivId?: string, title?: string): PaperMeta {
  const byId = arxivId ? paperMeta[arxivId] : undefined;
  if (byId) return byId;
  const byTitle = title ? paperMeta[title] : undefined;
  return byTitle ?? {};
}
