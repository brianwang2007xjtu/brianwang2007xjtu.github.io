export interface Social {
  name: string;
  url: string;
  /**
   * Substats source, e.g. "github" | "zhihu" | "bilibili" | "steamgames"
   * | "steamfriends" | "telegram" | "twitter" | "weibo" | "juejin" | "yuque"
   * | "medium" | "sspai". Omit to show a plain link with no count.
   * See https://github.com/spencerwooo/substats
   */
  source?: string;
  /** Substats key (username / uid). */
  key?: string;
  /** Label after the number, e.g. "followers" / "games". */
  label?: string;
  /** Inline SVG markup (viewBox 0 0 24 24) — used instead of a favicon. */
  iconSvg?: string;
  /** Brand color for the inline icon (defaults to the text color). */
  iconColor?: string;
  /** Optional icon URL; falls back to the site's favicon. */
  icon?: string;
}

/** GitHub mark (Solar icon set), as used on arthals.ink/about. */
const GITHUB_ICON = `<g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M6.315 6.176c-.25-.638-.24-1.367-.129-2.034a6.8 6.8 0 0 1 2.12 1.07c.28.214.647.283.989.18A9.3 9.3 0 0 1 12 5c.961 0 1.874.14 2.703.391c.342.104.709.034.988-.18a6.8 6.8 0 0 1 2.119-1.07c.111.667.12 1.396-.128 2.033c-.15.384-.075.826.208 1.14C18.614 8.117 19 9.04 19 10c0 2.114-1.97 4.187-5.134 4.818c-.792.158-1.101 1.155-.495 1.726c.389.366.629.882.629 1.456v3a1 1 0 0 0 2 0v-3c0-.57-.12-1.112-.334-1.603C18.683 15.35 21 12.993 21 10c0-1.347-.484-2.585-1.287-3.622c.21-.82.191-1.646.111-2.28c-.071-.568-.17-1.312-.57-1.756c-.595-.659-1.58-.271-2.28-.032a9 9 0 0 0-2.125 1.045A11.4 11.4 0 0 0 12 3c-.994 0-1.953.125-2.851.356a9 9 0 0 0-2.125-1.045c-.7-.24-1.686-.628-2.281.031c-.408.452-.493 1.137-.566 1.719l-.005.038c-.08.635-.098 1.462.112 2.283C3.484 7.418 3 8.654 3 10c0 2.992 2.317 5.35 5.334 6.397A4 4 0 0 0 8 17.98l-.168.034c-.717.099-1.176.01-1.488-.122c-.76-.322-1.152-1.133-1.63-1.753c-.298-.385-.732-.866-1.398-1.088a1 1 0 0 0-.632 1.898c.558.186.944 1.142 1.298 1.566c.373.448.869.916 1.58 1.218c.682.29 1.483.393 2.438.276V21a1 1 0 0 0 2 0v-3c0-.574.24-1.09.629-1.456c.607-.572.297-1.568-.495-1.726C6.969 14.187 5 12.114 5 10c0-.958.385-1.881 1.108-2.684c.283-.314.357-.756.207-1.14"/></g>`;

/** Bilibili mark (Solar icon set), as used on arthals.ink/about. */
const BILIBILI_ICON = `<path fill="currentColor" d="M7.172 2.757L10.414 6h3.171l3.243-3.242a1 1 0 1 1 1.415 1.415L16.414 6H18.5A3.5 3.5 0 0 1 22 9.5v8a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 17.5v-8A3.5 3.5 0 0 1 5.5 6h2.085L5.757 4.171a1 1 0 0 1 1.415-1.415M18.5 8h-13a1.5 1.5 0 0 0-1.493 1.356L4 9.5v8a1.5 1.5 0 0 0 1.356 1.493L5.5 19h13a1.5 1.5 0 0 0 1.493-1.355L20 17.5v-8A1.5 1.5 0 0 0 18.5 8M8 11a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1"/>`;

/** 社交网络（把 key 换成你自己的账号即可显示实时粉丝数）。 */
export const socials: Social[] = [
  {
    name: "GitHub",
    url: "https://github.com/brianwang2007xjtu",
    source: "github",
    key: "brianwang2007xjtu",
    label: "followers",
    iconSvg: GITHUB_ICON,
  },
  {
    name: "Bilibili",
    url: "https://space.bilibili.com/523216468",
    // Substats 的 bilibili 源目前不可用（被 B 站反爬拦截），组件会在构建时
    // 改用 B 站官方接口取粉丝数作为兜底。
    source: "bilibili",
    key: "523216468",
    label: "followers",
    iconSvg: BILIBILI_ICON,
    iconColor: "#fe7398",
  },
  // 下面是示例，填上自己的账号即可自动显示实时数据：
  // {
  //   name: "Zhihu",
  //   url: "https://www.zhihu.com/people/<your-id>",
  //   source: "zhihu",
  //   key: "<your-id>",
  //   label: "followers",
  // },
];

/** 图标兜底：用站点 favicon（仅当没有内联 SVG 时使用）。 */
export function socialIcon(s: Social): string {
  if (s.icon) return s.icon;
  try {
    return `https://icons.duckduckgo.com/ip3/${new URL(s.url, "https://brianwang2007.com").hostname}.ico`;
  } catch {
    return "/favicon.svg";
  }
}
