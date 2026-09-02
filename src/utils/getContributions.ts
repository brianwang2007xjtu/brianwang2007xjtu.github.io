import { execSync } from "node:child_process";
import type { CollectionEntry } from "astro:content";
import { countWords } from "./getBlogStats";

type Post = CollectionEntry<"posts">;

/** Map of "YYYY-MM-DD" -> contribution count. */
export type ContributionMap = Record<string, number>;

export type Level = 0 | 1 | 2 | 3 | 4;

function dateKey(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Real contribution data: lines of code added per day from the repository's
 * full git history. Returns `null` when git history is unavailable
 * (e.g. shallow clone on some build platforms).
 */
function getGitContributions(): ContributionMap | null {
  try {
    // Shallow clones have no real history — fall back to content-based data.
    const shallow = execSync("git rev-parse --is-shallow-repository", {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim()
      .toLowerCase();
    if (shallow === "true") return null;

    const out = execSync(
      [
        "git log",
        '--date=short',
        '--pretty=format:"%ad"',
        "--numstat",
        "-- .",
        // Assets (PDFs, etc.) are not code — git can misread a PDF as text and
        // inflate "lines added" massively, so exclude them.
        '":(exclude)**/*.pdf"',
      ].join(" "),
      {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        maxBuffer: 16 * 1024 * 1024,
      }
    );
    const map: ContributionMap = {};
    let cur: string | null = null;
    for (const line of out.split("\n")) {
      const t = line.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        cur = t;
        continue;
      }
      const m = t.split("\t");
      if (cur && m.length === 3 && /^\d+$/.test(m[0]) && /^\d+$/.test(m[1])) {
        map[cur] = (map[cur] ?? 0) + parseInt(m[0], 10);
      }
    }
    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

/**
 * Fallback when git history is missing: distribute each post's word count
 * onto its publish date. Still a real, reasonable signal.
 */
function getContentContributions(posts: Post[]): ContributionMap {
  const map: ContributionMap = {};
  for (const p of posts) {
    const key = dateKey(p.data.pubDatetime.getTime());
    map[key] = (map[key] ?? 0) + countWords(p.body ?? "");
  }
  return map;
}

/** Build-time contribution map: real git data when available, content fallback otherwise. */
export function getContributions(posts: Post[]): ContributionMap {
  return getGitContributions() ?? getContentContributions(posts);
}

/**
 * GitHub-style level thresholds: quartiles (25/50/75) of the non-zero counts.
 * 0 counts stay level 0.
 */
export function getLevelFn(counts: number[]): (n: number) => Level {
  const pos = counts.filter(n => n > 0).sort((a, b) => a - b);
  if (pos.length === 0) return () => 0;
  const q = (p: number) => pos[Math.min(pos.length - 1, Math.floor(p * pos.length))];
  const t1 = q(0.25);
  const t2 = Math.max(q(0.5), t1);
  const t3 = Math.max(q(0.75), t2);
  return n => (n <= 0 ? 0 : n <= t1 ? 1 : n <= t2 ? 2 : n <= t3 ? 3 : 4);
}
