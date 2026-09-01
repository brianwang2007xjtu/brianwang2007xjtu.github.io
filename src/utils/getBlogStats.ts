import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

const DAY = 86400000;

/** Strip frontmatter, code blocks and markup noise from raw markdown/MDX source. */
function cleanText(src: string): string {
  return src
    .replace(/^---[\s\S]*?---\s*/, "") // frontmatter
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/<!--[\s\S]*?-->/g, " ") // comments
    .replace(/<[^>]+>/g, " ") // html / mdx tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ") // links
    .replace(/^import .*$/gm, " ") // mdx imports
    .replace(/^export .*$/gm, " "); // mdx exports
}

/**
 * Reasonable mixed CN/EN word count: every CJK character counts as one word,
 * Latin/number sequences count as one word.
 */
export function countWords(src: string): number {
  const text = cleanText(src);
  const cjk =
    text.match(/[\u4e00-\u9fff\u3400-\u4dbf\u3007\uf900-\ufaff]/g)?.length ?? 0;
  const latin =
    text
      .replace(/[\u4e00-\u9fff\u3400-\u4dbf\u3007\uf900-\ufaff]/g, " ")
      .match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g)?.length ?? 0;
  return cjk + latin;
}

/** Total word count of a list of posts (raw source body). */
export function getTotalWords(posts: Post[]): number {
  return posts.reduce((sum, p) => sum + countWords(p.body ?? ""), 0);
}

/** Most recent date any post was published or modified. */
export function getLastUpdated(posts: Post[]): Date | null {
  let latest: Date | null = null;
  for (const p of posts) {
    const d = p.data.modDatetime ?? p.data.pubDatetime;
    if (!d) continue;
    if (!latest || d.getTime() > latest.getTime()) latest = d;
  }
  return latest;
}

/**
 * Days the site has been online counted from `since` (launch day = day 1),
 * e.g. 2026-08-27 -> 1, 2026-08-28 -> 2, ...
 */
export function getDaysOnline(since: Date, now: Date = new Date()): number {
  const start = Date.UTC(
    since.getUTCFullYear(),
    since.getUTCMonth(),
    since.getUTCDate()
  );
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.max(1, Math.floor((today - start) / DAY) + 1);
}

/** Format a date like axi404: "Aug 31, 2026". */
export function formatStatsDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Format word counts the way axi404 does: 36.2w for 362000. */
export function formatWords(n: number): string {
  if (n >= 10000) return `${Math.round((n / 10000) * 10) / 10}w`;
  return n.toLocaleString("en-US");
}
