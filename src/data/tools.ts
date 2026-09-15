export interface Tool {
  name: string;
  /** Short role/label shown next to the name, e.g. "Browser". */
  role: string;
  url: string;
  /** Optional icon URL; falls back to the site's favicon. */
  icon?: string;
}

export interface ToolGroup {
  name: string;
  tools: Tool[];
}

/** 工具分组（改成你自己在用的工具即可）。 */
export const toolGroups: ToolGroup[] = [
  {
    name: "Research",
    tools: [
      { name: "Overleaf", role: "LaTeX", url: "https://www.overleaf.com/" },
      { name: "arXiv", role: "Preprints", url: "https://arxiv.org/" },
      { name: "GitHub", role: "Code Hosting", url: "https://github.com/" },
      {
        name: "Hugging Face",
        role: "Models & Datasets",
        url: "https://huggingface.co/",
      },
    ],
  },
  {
    name: "Development",
    tools: [
      {
        name: "VS Code",
        role: "Editor",
        url: "https://code.visualstudio.com/",
      },
      {
        name: "Sublime Text",
        role: "Editor",
        url: "https://www.sublimetext.com/",
      },
      { name: "PyTorch", role: "Deep Learning", url: "https://pytorch.org/" },
      {
        name: "snnTorch",
        role: "Spiking Neural Nets",
        url: "https://github.com/jeshraghian/snntorch",
        // 取自官方文档 logo 中的神经元图标（已裁成方形自托管）。
        icon: "/icons/snntorch.png",
      },
    ],
  },
  {
    name: "Productivity",
    tools: [
      {
        name: "Google Chrome",
        role: "Browser",
        url: "https://www.google.com/chrome/",
      },
      { name: "OneNote", role: "Notes", url: "https://www.onenote.com/" },
      { name: "ChatGPT", role: "AI Assistant", url: "https://chatgpt.com/" },
      {
        name: "DSH",
        role: "DeepSeek Harness",
        url: "https://github.com/deepseek-ai/deepseek-harness",
        // DeepSeek 鲸鱼标志（自托管 SVG）。
        icon: "/icons/deepseek.svg",
      },
    ],
  },
  {
    name: "For Fun",
    tools: [
      { name: "MuseScore", role: "Sheet Music", url: "https://musescore.org/" },
      {
        name: "playgo.gg",
        role: "Online Go",
        url: "https://playgo.gg/",
        // 该站没有标准 favicon，用其页面声明的图标。
        icon: "https://playgo.aimelo.com/Pickles_favicon_2_17_2026.png",
      },
      {
        name: "DaVinci Resolve",
        role: "Video Editing",
        url: "https://www.blackmagicdesign.com/products/davinciresolve",
      },
      { name: "剪映", role: "Video Editing", url: "https://www.jianying.com/" },
    ],
  },
];

/** 图标兜底：用站点 favicon。 */
export function toolIcon(t: Tool): string {
  if (t.icon) return t.icon;
  try {
    return `https://icons.duckduckgo.com/ip3/${new URL(t.url).hostname}.ico`;
  } catch {
    return "/favicon.svg";
  }
}
