export interface FriendLink {
  name: string;
  desc: string;
  url: string;
  /** Avatar image URL; falls back to the site's favicon when omitted. */
  avatar?: string;
  /** RSS/Atom feed URL — used by the 朋友圈 (friend circle) section. */
  rss?: string;
}

/** 精选博客友链（示例数据：改成你自己的博友吧）。 */
export const commonLinks: FriendLink[] = [
  {
    name: "Axi's Blog",
    desc: "一只可爱小猫",
    url: "https://axi404.com",
    rss: "https://axi404.com/rss.xml",
  },
  {
    name: "Leo's Realms",
    desc: "求知若愚，虚怀若谷",
    url: "https://blog.leosrealms.top",
    rss: "https://blog.leosrealms.top/rss.xml",
  },
];

/** 申请友链时展示的本站信息（点击即可复制）。 */
export const siteCard = {
  name: "master's blog",
  desc: "生活、音乐与知识的切片",
  link: "https://brianwang2007.com",
  avatar: "https://brianwang2007.com/favicon.svg",
};

/** 友链申请规则（与 axi404.com 完全一致）。 */
export const applyRules: string[] = [
  "在你的友链上添加了本站；",
  "请确保你的站点活着；",
  "博客内容不违反国家法律。",
];

/** 头像兜底：用站点 favicon。 */
export function friendAvatar(f: FriendLink): string {
  if (f.avatar) return f.avatar;
  try {
    const host = new URL(f.url).hostname;
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
  } catch {
    return "https://brianwang2007.com/favicon.svg";
  }
}
