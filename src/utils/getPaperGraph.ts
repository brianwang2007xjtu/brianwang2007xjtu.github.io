import { getCollection, render } from "astro:content";
import { getPostUrl } from "./getPostPaths";
import config from "@/config";
import {
  DEFAULT_BRANCH,
  DEFAULT_IMPORTANCE,
  getPaperMeta,
  paperRelations,
  type PaperMeta,
} from "@/data/paperGraphMeta";

/**
 * One node of the Paper Graph: a paper from the Paper-Reading series.
 */
export interface PaperNode {
  /** Stable id (arXiv id when known, else a slug of the name). */
  id: string;
  name: string;
  /** 图上显示用（可能是 LaTeX）；默认等于 name。 */
  label: string;
  arxivId?: string;
  summary?: string;
  /** Figure that appears in the note (first image of the PaperNote). */
  image?: string;
  /** 1–5, set by hand in `src/data/paperGraphMeta.ts`. */
  importance: number;
  year?: number;
  /** Journal / conference, or "preprint" when not given. */
  venue: string;
  /** Where clicking the node goes: the note's section in the post. */
  href: string;
  /** Post title the note lives in. */
  group: string;
  groupSlug: string;
  /** 一级分类，例如 "Embodied"。 */
  branch: string;
  /** 二级分类，例如 "JEPA"。 */
  leaf: string;
  /** 有关联的论文（arXiv 编号），来自配置文件。 */
  related: string[];
}

/** `2301.08243` -> 2023 (arXiv ids start with YYMM). */
function yearFromArxiv(arxivId?: string): number | undefined {
  const match = /^(\d{2})\d{2}\.\d{4,5}$/.exec(arxivId ?? "");
  if (!match) return undefined;
  const yy = Number(match[1]);
  return yy >= 90 ? 1900 + yy : 2000 + yy;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type RawPaper = {
  name: string;
  arxivId?: string;
  summary?: string;
  image?: string;
  /** Character offset of the heading this note sits under. */
  headingIndex?: number;
  /** Raw text of that heading (used for a first, exact match). */
  headingText?: string;
};

/** Reads one prop out of a `<PaperNote … />` block. */
function readProp(block: string, prop: string): string | undefined {
  const quoted = new RegExp(`${prop}\\s*=\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(
    block
  );
  if (quoted) return quoted[1].replace(/\\"/g, '"');
  const braced = new RegExp(
    `${prop}\\s*=\\s*\\{\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*\\}`
  ).exec(block);
  return braced?.[1];
}

/** `images={["/a.png", "/b.png"]}` -> "/a.png" */
function readFirstImage(block: string): string | undefined {
  const list = /images\s*=\s*\{\s*\[([\s\S]*?)\]\s*\}/.exec(block);
  if (!list) return undefined;
  const first = /"([^"]+)"/.exec(list[1]);
  return first ? first[1] : undefined;
}

/**
 * All `## …` / `### …` headings of a post body, in order, with the **character
 * offset** where each one starts (used to find the heading a note belongs to).
 */
function bodyHeadings(body: string): { text: string; index: number }[] {
  const out: { text: string; index: number }[] = [];
  const re = /^#{2,3}\s+(.*\S)\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    out.push({ text: match[1].trim(), index: match.index });
  }
  return out;
}

/** Papers written as `<PaperNote …>` in a post body. */
function rawPapers(body: string): RawPaper[] {
  const headings = bodyHeadings(body);
  const papers: RawPaper[] = [];
  // `<PaperNote … >`（结尾是普通 `>`，不是自闭合）
  const re = /<PaperNote\b([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const block = match[1];
    const name = readProp(block, "title");
    if (!name) continue;
    const position = match.index;
    const heading = headings.filter(h => h.index < position).pop();
    papers.push({
      name,
      arxivId: readProp(block, "arxivId"),
      summary: readProp(block, "summary"),
      image: readFirstImage(block),
      headingIndex: heading?.index,
      headingText: heading?.text,
    });
  }
  return papers;
}

/**
 * 找到一条笔记所属小节的锚点：先按标题文字精确匹配（两边都去掉 markdown
 * 标记与 LaTeX 的 $），匹配不上（例如标题写成 `$\\pi_0$`）就按「第几个
 * h2/h3 标题」的顺序对齐 —— 两条列表的顺序一定是一致的。
 */
function anchorOf(
  raw: RawPaper,
  rawHeadings: { text: string; index: number }[],
  rendered: { depth: number; slug: string; text: string }[]
): string | undefined {
  const h23 = rendered.filter(h => h.depth >= 2 && h.depth <= 3);
  const clean = (text: string) =>
    text
      .replace(/[`*_$\\]/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .trim()
      .toLowerCase();

  if (raw.headingText) {
    const wanted = clean(raw.headingText);
    const hit = h23.find(h => clean(h.text) === wanted);
    if (hit) return hit.slug;
  }

  if (raw.headingIndex !== undefined) {
    const ordinal = rawHeadings.findIndex(h => h.index === raw.headingIndex);
    if (ordinal >= 0 && ordinal < h23.length) return h23[ordinal].slug;
  }
  return undefined;
}

/**
 * Collects every paper of the Paper-Reading series (tag `ai-paper`) together
 * with the section of the note it belongs to, so the graph can link to it.
 */
export async function getPaperGraph(): Promise<PaperNode[]> {
  const posts = await getCollection(
    "posts",
    post => !post.data.draft && post.data.tags.includes("ai-paper")
  );

  const nodes: PaperNode[] = [];
  const seen = new Set<string>();

  for (const post of posts) {
    const { headings } = await render(post);
    const body = post.body ?? "";
    const postUrl = getPostUrl(post.id, post.filePath, config.site.lang);

    const rawHeadings = bodyHeadings(body);
    const notes = rawPapers(body);
    // 只有「有专门版块」的论文（写了 <PaperNote>）才进图
    const raw = notes;

    for (const paper of raw) {
      const meta = getPaperMeta(paper.arxivId, paper.name) as PaperMeta;
      if (meta.hidden) continue;
      const id = paper.arxivId ?? slugify(paper.name);
      if (seen.has(id)) continue;
      seen.add(id);

      const anchor = anchorOf(paper, rawHeadings, headings);
      const [branch, leaf] = (meta.branch ?? DEFAULT_BRANCH).split("/");
      nodes.push({
        id,
        name: paper.name,
        label: meta.label?.trim() ? meta.label.trim() : paper.name,
        arxivId: paper.arxivId,
        summary: paper.summary,
        image: paper.image,
        importance: meta.importance ?? DEFAULT_IMPORTANCE,
        year: meta.year ?? yearFromArxiv(paper.arxivId),
        venue: meta.venue?.trim() ? meta.venue.trim() : "preprint",
        href: anchor ? `${postUrl}#${anchor}` : postUrl,
        group: post.data.title,
        groupSlug: slugify(post.id),
        branch: (branch ?? "Others").trim(),
        leaf: (leaf ?? "Misc").trim(),
        related: [],
      });
    }
  }

  // 关联关系：写一边即可，两个方向都补上
  const byId = new Map(nodes.map(node => [node.id, node]));
  for (const [a, b] of paperRelations) {
    if (byId.has(a) && byId.has(b)) {
      byId.get(a)!.related.push(b);
      byId.get(b)!.related.push(a);
    }
  }

  // Newest first, then alphabetical.
  return nodes.sort(
    (a, b) =>
      (b.year ?? 0) - (a.year ?? 0) || a.name.localeCompare(b.name)
  );
}
