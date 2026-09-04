import fs from "node:fs";
import path from "node:path";

export interface GoGame {
  id: string;
  black: string;
  white: string;
  date: string;
  rule: string;
  komi: string;
  result: string;
  moves: number;
  sgfUrl: string;
  reportUrl: string | null;
}

interface SgfNode {
  props: Record<string, string[]>;
  /** Child variation sequences (first = mainline). */
  children: SgfNode[][];
}

const RULES: Record<string, string> = {
  chinese: "中国规则",
  japanese: "日本规则",
  korean: "韩国规则",
  aga: "AGA 规则",
  "tromp-taylor": "Tromp-Taylor",
};

/* ---------------- SGF parsing (mainline only) ---------------- */

function parseSequence(
  text: string,
  start: number
): { nodes: SgfNode[]; end: number } {
  const nodes: SgfNode[] = [];
  let p = start;
  let cur: SgfNode | null = null;
  while (p < text.length) {
    const c = text[p];
    if (c === "(") {
      const { nodes: childNodes, end } = parseSequence(text, p + 1);
      if (cur) cur.children.push(childNodes);
      p = end;
      continue;
    }
    if (c === ")") return { nodes, end: p + 1 };
    if (c === ";") {
      cur = { props: {}, children: [] };
      nodes.push(cur);
      p++;
      continue;
    }
    const m = /^([A-Za-z]+)((?:\[(?:[^\]\\]|\\.)*\])+)/.exec(text.slice(p));
    if (m) {
      const values = [...m[2].matchAll(/\[(?:[^\]\\]|\\.)*\]/g)].map(v =>
        v[0].slice(1, -1).replace(/\\(.)/g, "$1")
      );
      if (cur) {
        const arr = (cur.props[m[1]] ??= []);
        arr.push(...values);
      }
      p += m[0].length;
      continue;
    }
    p++;
  }
  return { nodes, end: p };
}

/** Minimal SGF parser: root props + mainline node list. */
export function parseSgf(src: string): {
  props: Record<string, string[]>;
  nodes: Record<string, string[]>[];
} {
  const text = src.replace(/^\uFEFF/, "");
  const start = text.indexOf("(");
  if (start === -1) return { props: {}, nodes: [] };
  const { nodes: seq } = parseSequence(text, start + 1);
  if (seq.length === 0) return { props: {}, nodes: [] };

  const props = seq[0]!.props;
  const main: Record<string, string[]>[] = [];
  let cur: SgfNode[] = seq;
  let i = 0;
  while (true) {
    const node = cur[i];
    if (!node) break;
    main.push(node.props);
    if (node.children.length > 0) {
      cur = node.children[0]!;
      i = 0;
    } else {
      i++;
    }
  }
  return { props, nodes: main };
}

/* ---------------- formatters ---------------- */

function fmtRule(raw: string | undefined): string {
  if (!raw) return "—";
  return RULES[raw.toLowerCase()] ?? raw;
}

function fmtKomi(raw: string | undefined): string {
  return raw ? `${raw} 目` : "—";
}

/** 星阵-style result text: B+R -> 黑中盘胜, W+2.5 -> 白胜 2.5 目. */
export function fmtResult(raw: string | undefined): string {
  if (!raw) return "—";
  const s = raw.toUpperCase();
  const color = s.startsWith("B") ? "黑" : s.startsWith("W") ? "白" : "";
  if (s.includes("+R") || s.includes("+RESIGN")) {
    return color ? `${color}中盘胜` : "中盘胜";
  }
  if (/^[BW]\+0/.test(s)) return "中盘无胜负";
  const m = /^[BW]\+(.+)$/.exec(s);
  if (m) return color ? `${color}胜 ${m[1]} 目` : `胜 ${m[1]} 目`;
  return raw;
}

function fmtDate(raw: string | undefined): string {
  if (!raw) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : raw;
}

/* ---------------- game discovery ---------------- */

const GO_DIR = path.join(process.cwd(), "public", "go");

/**
 * Optional per-game metainfo sidecar file `public/go/<id>.json`:
 * {
 *   "black": "...", "white": "...", "date": "2026-09-04",
 *   "rule": "...", "komi": "...", "result": "..."
 * }
 * Values here override what the SGF provides (editable by hand).
 */
function readGoSidecar(id: string): Partial<GoGame> | null {
  const p = path.join(GO_DIR, `${id}.json`);
  if (!fs.existsSync(p)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf8")) as Partial<GoGame>;
    return raw && typeof raw === "object" ? raw : null;
  } catch {
    return null;
  }
}

function fromSgfFile(id: string, src: string): GoGame | null {
  try {
    const { props, nodes } = parseSgf(src);
    const side = readGoSidecar(id) ?? {};
    return {
      id,
      black: side.black ?? props.PB?.[0] ?? "黑方",
      white: side.white ?? props.PW?.[0] ?? "白方",
      date: side.date ?? fmtDate(props.DT?.[0]),
      rule: side.rule ?? fmtRule(props.RU?.[0]),
      komi: side.komi ?? fmtKomi(props.KM?.[0]),
      result: side.result ?? fmtResult(props.RE?.[0]),
      moves: nodes.filter(n => n.B || n.W).length,
      sgfUrl: `/go/${id}.sgf`,
      reportUrl: fs.existsSync(path.join(GO_DIR, `${id}.pdf`))
        ? `/go/${id}.pdf`
        : null,
    };
  } catch {
    return null;
  }
}

/** Discover every .sgf in public/go and read its metadata. */
export function getGoGames(): GoGame[] {
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(GO_DIR)
      .filter(f => f.toLowerCase().endsWith(".sgf"))
      .sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
  const games: GoGame[] = [];
  for (const f of files) {
    const id = f.replace(/\.sgf$/i, "");
    const game = fromSgfFile(id, fs.readFileSync(path.join(GO_DIR, f), "utf8"));
    if (game) games.push(game);
  }
  // newest first (by date string when present, otherwise by id)
  return games.sort((a, b) => {
    if (a.date !== "—" && b.date !== "—" && a.date !== b.date)
      return b.date.localeCompare(a.date);
    return b.id.localeCompare(a.id);
  });
}

/** Read one game by id (used by the detail page). */
export function getGoGame(id: string): GoGame | null {
  const safe = id.replace(/[^a-zA-Z0-9._-]/g, "");
  const sgfPath = path.join(GO_DIR, `${safe}.sgf`);
  if (!fs.existsSync(sgfPath)) return null;
  return fromSgfFile(safe, fs.readFileSync(sgfPath, "utf8"));
}

/** Read the raw SGF text of one game (for the board viewer). */
export function readGoSgf(id: string): string | null {
  const safe = id.replace(/[^a-zA-Z0-9._-]/g, "");
  const p = path.join(GO_DIR, `${safe}.sgf`);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

/** Enrich an SGF with form metadata so every stored record is self-describing. */
export function enrichSgf(
  src: string,
  meta: Partial<{
    date: string;
    black: string;
    white: string;
    komi: string;
    rule: string;
    result: string;
  }>
): string {
  const text = src.replace(/^\uFEFF/, "");
  if (!text.replace(/\s/, "").startsWith("(;")) return text;
  let out = text;
  for (const [name, value] of Object.entries(meta)) {
    if (!value) continue;
    const re = new RegExp(`${name}\\[[^\\]]*\\]`);
    if (re.test(out)) {
      out = out.replace(re, `${name}[${value}]`);
    } else {
      out = out.replace(/^(\s*\(\s*;)/, `$1${name}[${value}]`);
    }
  }
  return out;
}
