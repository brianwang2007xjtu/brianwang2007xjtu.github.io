import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * 列表卡片用的「封面图 + 主色调」。
 *
 * 参考 Leo's Realms 的做法：卡片背景是一张被渐变遮罩的封面图，
 * 悬浮时整张卡片染上一层从封面图里提取出来的颜色。
 *
 * 这里没有 cover 字段，所以自动从正文里挑**第一张图**当封面：
 *   ![](/papers/x.png)、<img src="...">、<ImageRow images={[{ src: "..." }]}>、<PaperNote images={["..."]}>
 * 颜色用 sharp 把图缩到 1×1 取平均色（就是那张图的主色调）。
 */

export interface PostCover {
  /** 图片在站点里的绝对路径，例如 /papers/DiT.png */
  src: string;
  /** 主色调，形如 "183 161 192"（h s l） */
  hsl: string;
  /** 带透明度的背景色，直接给卡片用 */
  highlight: string;
}

const IMAGE_PATTERNS = [
  /<img[^>]+src="([^"]+)"/, // 普通 <img>
  /<ImageRow[\s\S]*?src:\s*"([^"]+)"/, // ImageRow 组件
  /<PaperNote[\s\S]*?images=\{\[\s*"([^"]+)"/, // PaperNote 的配图
  /!\[[^\]]*\]\(([^)\s]+)/, // markdown 图片
];

/** 从正文里找第一张图（跳过外链和 data URL）。 */
export function firstImage(body: string): string | undefined {
  let best: { index: number; src: string } | undefined;
  for (const pattern of IMAGE_PATTERNS) {
    const match = pattern.exec(body);
    if (!match) continue;
    const src = match[1];
    if (!src.startsWith("/")) continue;
    if (!best || match.index < best.index) {
      best = { index: match.index, src };
    }
  }
  return best?.src;
}

const cache = new Map<string, PostCover | null>();

/**
 * 计算一篇博文的封面图与主色调；没有图片或算不出来时返回 null。
 */
export async function getPostCover(
  body: string,
  root = process.cwd(),
  manual: { cover?: string; accent?: string } = {}
): Promise<PostCover | null> {
  // 手动指定优先：cover 决定底图，accent 决定颜色
  const src = manual.cover?.trim() || firstImage(body);
  if (!src) return null;
  const key = `${src}|${manual.accent ?? ""}`;
  if (cache.has(key)) return cache.get(key)!;

  const accentHsl = manual.accent ? hexToHsl(manual.accent) : null;
  if (accentHsl) {
    const cover: PostCover = {
      src,
      hsl: accentHsl,
      highlight: `hsl(${accentHsl} / 0.22)`,
    };
    cache.set(key, cover);
    return cover;
  }

  try {
    const file = path.join(root, "public", src.replace(/^\//, ""));
    const buffer = await readFile(file);
    // 缩到 24×24，取「有颜色、不太亮也不太暗」的像素求平均，避免整图偏白时颜色发灰
    const { data, info } = await sharp(buffer)
      .resize(24, 24, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const picked: { h: number; s: number; l: number }[] = [];
    for (let i = 0; i < data.length; i += info.channels) {
      const { r: h, g: s, b: l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      if (l < 10 || l > 90) continue; // 纯黑 / 纯白背景跳过
      if (s < 6) continue; // 灰色像素跳过
      picked.push({ h, s, l });
    }

    const pool = picked.length > 0 ? picked : [{ h: 220, s: 40, l: 60 }];
    // 色相取圆周平均，饱和度和亮度取平均后稍微「提纯提亮」，让底色像参考站那样明显
    let x = 0;
    let y = 0;
    let sSum = 0;
    let lSum = 0;
    for (const c of pool) {
      const rad = (c.h * Math.PI) / 180;
      x += Math.cos(rad);
      y += Math.sin(rad);
      sSum += c.s;
      lSum += c.l;
    }
    const h = Math.round(((Math.atan2(y / pool.length, x / pool.length) * 180) / Math.PI + 360) % 360);
    const s = Math.round(Math.min(85, Math.max(38, sSum / pool.length + 12)));
    const l = Math.round(Math.min(66, Math.max(46, lSum / pool.length)));

    const cover: PostCover = {
      src,
      hsl: `${h} ${s}% ${l}%`,
      highlight: `hsl(${h} ${s}% ${l}% / 0.22)`,
    };
    cache.set(key, cover);
    return cover;
  } catch {
    cache.set(key, null);
    return null;
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  return { r: Math.round(h), g: Math.round(s * 100), b: Math.round(l * 100) };
}

/** "#B7A1C0" → "h s% l%"；解析失败返回 null。 */
export function hexToHsl(hex: string): string | null {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? [...value].map(c => c + c).join("")
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const { r: h, g: s, b: l } = rgbToHsl(r, g, b);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}
