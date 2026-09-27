import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Game records used by the Go commentary posts.
 *
 * The SGF files live in `public/go/` (exported from 星阵围棋), together with a
 * small JSON file holding the game metadata. Everything is read at build time.
 */

export type GoGame = {
  id: string;
  black: string;
  white: string;
  date?: string;
  result?: string;
  komi?: string;
  rule?: string;
  /** SGF coordinates in playing order, e.g. ["pd", "dp", "qp", …]. */
  moves: string[];
};

const cache = new Map<string, GoGame>();

function readJson(id: string): Partial<GoGame> {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), "public", "go", `${id}.json`), "utf8")
    );
  } catch {
    return {};
  }
}

function parseSgf(source: string) {
  const root = source.slice(0, source.indexOf(";", 2));
  const prop = (name: string) =>
    new RegExp(`${name}\\[([^\\]]*)\\]`).exec(root)?.[1];

  const moves: string[] = [];
  const re = /;\s*([BW])\[([a-s]{2})\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    moves.push(match[2]);
  }

  return {
    black: prop("PB"),
    white: prop("PW"),
    date: prop("DT"),
    result: prop("RE"),
    komi: prop("KM"),
    rule: prop("RU"),
    moves,
  };
}

export function loadGame(id: string): GoGame {
  const hit = cache.get(id);
  if (hit) return hit;

  const sgf = readFileSync(
    join(process.cwd(), "public", "go", `${id}.sgf`),
    "utf8"
  );
  const parsed = parseSgf(sgf);
  const meta = readJson(id);

  const game: GoGame = {
    id,
    black: meta.black ?? parsed.black ?? "Black",
    white: meta.white ?? parsed.white ?? "White",
    date: meta.date ?? parsed.date,
    result: meta.result ?? parsed.result,
    komi: meta.komi ?? (parsed.komi ? `${parsed.komi} 目` : undefined),
    rule: meta.rule ?? parsed.rule,
    moves: parsed.moves,
  };

  cache.set(id, game);
  return game;
}

/** `pd` -> `{ x: 15, y: 3 }` (0-based, top-left origin). */
export function sgfPoint(sgf: string) {
  return { x: sgf.charCodeAt(0) - 97, y: sgf.charCodeAt(1) - 97 };
}

const COLUMNS = "ABCDEFGHJKLMNOPQRST";

/** `pd` -> `Q16` (Go coordinates: columns skip I, rows count from the bottom). */
export function goCoordinate(sgf: string, size = 19): string {
  const { x, y } = sgfPoint(sgf);
  return `${COLUMNS[x]}${size - y}`;
}

/* ============================================================
   Board engine — needed both for correct main-line positions
   (captured stones must disappear) and for variation diagrams.
   ============================================================ */

export type StoneColor = 1 | 2; // 1 = black, 2 = white

export type BoardMove = { color: StoneColor; x: number; y: number };

export type BoardPoint = {
  x: number;
  y: number;
  color: StoneColor;
  /** Number printed on the stone, if any. */
  label?: number;
  /** True for stones that only exist in a variation (not in the real game). */
  variation?: boolean;
};

/**
 * Every stone that was ever placed on a point, in order — used to work out
 * which stone to draw there and what to explain under the board.
 */
export type PlacementEntry = {
  /** Real move number of the placement. */
  moveNumber: number;
  /** Number the stone is drawn with in this figure (undefined = unnumbered). */
  label?: number;
  color: StoneColor;
  /** Real move number that captured this stone (main line), if captured. */
  capturedAt?: number;
  /** Set for hypothetical (variation) moves. */
  variation?: number;
};

/**
 * A stone that was captured (removed from the board) during the figure —
 * printed under the diagram as `48 = N6`: the stone played as move 48 stood on
 * N6 and is no longer on the board.
 */
export type BoardCapture = {
  /** Colour of the captured stone. */
  color: StoneColor;
  /** Colour of the player who captured it. */
  by: StoneColor;
  /** Real move number of the captured stone. */
  stoneNumber?: number;
  /** Number the captured stone was drawn with in this figure (if it had one). */
  stoneLabel?: number;
  /** Go coordinates of the captured stone, e.g. `N6`. */
  coordinate: string;
  /** Move number of the capturing move (1-based, main line). */
  moveNumber?: number;
  /** Move number inside the variation, when the capture is hypothetical. */
  variationNumber?: number;
  /**
   * When the point was played on again later, the stone standing there now:
   * its colour and numbers — so the legend can print `150 = N6` (or `50 = N6`
   * when this figure renumbers move 150 as 50) instead of the captured stone.
   */
  occupant?: {
    color: StoneColor;
    number?: number;
    label?: number;
  };
  /** True when the point holds a stone again. */
  reoccupied?: boolean;
};

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

class Board {
  readonly size: number;
  readonly grid: Uint8Array;

  constructor(size: number) {
    this.size = size;
    this.grid = new Uint8Array(size * size);
  }

  at(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return -1;
    return this.grid[y * this.size + x];
  }

  /** Flood-fills the group at (x, y); returns its stones and liberty count. */
  private group(x: number, y: number) {
    const color = this.at(x, y);
    const stones: [number, number][] = [];
    const seen = new Set<number>();
    const liberties = new Set<number>();
    const stack: [number, number][] = [[x, y]];
    seen.add(y * this.size + x);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      stones.push([cx, cy]);
      for (const [dx, dy] of NEIGHBOURS) {
        const nx = cx + dx;
        const ny = cy + dy;
        const value = this.at(nx, ny);
        if (value === 0) liberties.add(ny * this.size + nx);
        else if (value === color && !seen.has(ny * this.size + nx)) {
          seen.add(ny * this.size + nx);
          stack.push([nx, ny]);
        }
      }
    }
    return { stones, liberties: liberties.size };
  }

  /** Plays a stone, removing captured groups (and suicide stones). */
  play(move: BoardMove): { x: number; y: number; color: StoneColor }[] {
    const { x, y, color } = move;
    const removed: { x: number; y: number; color: StoneColor }[] = [];
    const opponent = color === 1 ? 2 : 1;

    // Playing onto an occupied point happens when a variation takes back a
    // ko (or replays a move of the real game): the stone that was there is
    // captured by the move.
    const occupied = this.at(x, y);
    if (occupied === 1 || occupied === 2) {
      removed.push({ x, y, color: occupied });
    }

    this.grid[y * this.size + x] = color;

    const take = (gx: number, gy: number) => {
      removed.push({ x: gx, y: gy, color: this.at(gx, gy) as StoneColor });
      this.grid[gy * this.size + gx] = 0;
    };

    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (this.at(nx, ny) !== opponent) continue;
      const group = this.group(nx, ny);
      if (group.liberties === 0) {
        for (const [gx, gy] of group.stones) take(gx, gy);
      }
    }

    const own = this.group(x, y);
    if (own.liberties === 0) {
      for (const [gx, gy] of own.stones) take(gx, gy);
    }

    return removed;
  }
}

/** Parses `Q4` / `pd` / `B:Q4` / `W:pd` into a move (colour optional). */
export function parseMove(
  text: string,
  size = 19
): { x: number; y: number; color?: StoneColor } | null {
  const raw = text.trim();
  const explicit = /^([BbWw])\s*[:：]\s*(.+)$/.exec(raw);
  const body = (explicit ? explicit[2] : raw).trim();
  const color: StoneColor | undefined = explicit
    ? explicit[1].toLowerCase() === "b"
      ? 1
      : 2
    : undefined;

  const go = /^([A-HJ-Ta-hj-t])\s*(\d{1,2})$/.exec(body);
  if (go) {
    const x = COLUMNS.indexOf(go[1].toUpperCase());
    const y = size - Number(go[2]);
    if (x >= 0 && y >= 0 && y < size) return { x, y, color };
    return null;
  }

  const sgf = /^([a-s])([a-s])$/.exec(body.toLowerCase());
  if (sgf) {
    const point = sgfPoint(body.toLowerCase());
    if (point.x < size && point.y < size) return { ...point, color };
    return null;
  }

  return null;
}

/**
 * Replays a game (plus optional variation moves) and returns the final board.
 *
 * `mainMoves` are the real moves up to the figure's position; `variation` is a
 * hypothetical continuation. Colours of variation moves alternate from the
 * player to move, unless the move carries an explicit `B:` / `W:` prefix.
 */
export function boardState({
  size = 19,
  mainMoves,
  variation = [],
  labelMain,
  nextColor,
  variationStartAt = 1,
}: {
  size?: number;
  mainMoves: string[];
  variation?: string[];
  /** Returns the label for a main-line move number, or undefined for none. */
  labelMain?: (moveNumber: number) => number | undefined;
  nextColor?: StoneColor;
  /** Label of the first variation move (default 1). */
  variationStartAt?: number;
}): {
  points: BoardPoint[];
  captures: BoardCapture[];
  placements: Record<string, PlacementEntry[]>;
} {
  const board = new Board(size);
  const labels = new Map<number, number>();
  /** Real move number of the stone standing on a point. */
  const stoneNumbers = new Map<number, number>();
  const variationPoints = new Set<number>();
  const captures: BoardCapture[] = [];
  /** point (y * size + x) -> stones placed there, in order */
  const placements = new Map<number, PlacementEntry[]>();
  const coordOf = (x: number, y: number) => `${COLUMNS[x]}${size - y}`;

  mainMoves.forEach((sgf, index) => {
    const { x, y } = sgfPoint(sgf);
    const color: StoneColor = index % 2 === 0 ? 1 : 2;
    for (const stone of board.play({ x, y, color })) {
      const key = stone.y * size + stone.x;
      const capturedNumber = stoneNumbers.get(key);
      captures.push({
        color: stone.color,
        by: color,
        stoneNumber: capturedNumber,
        stoneLabel: labels.get(key),
        coordinate: coordOf(stone.x, stone.y),
        moveNumber: index + 1,
      });
      const entry = placements
        .get(key)
        ?.slice()
        .reverse()
        .find(item => item.moveNumber === capturedNumber);
      if (entry) entry.capturedAt = index + 1;
      labels.delete(key);
      stoneNumbers.delete(key);
    }
    const label = labelMain?.(index + 1);
    if (label !== undefined) labels.set(y * size + x, label);
    stoneNumbers.set(y * size + x, index + 1);
    const placedKey = y * size + x;
    placements.set(placedKey, [
      ...(placements.get(placedKey) ?? []),
      { moveNumber: index + 1, label, color },
    ]);
  });

  let color: StoneColor =
    nextColor ?? (mainMoves.length % 2 === 0 ? 1 : 2);

  variation.forEach((entry, index) => {
    const move = parseMove(entry, size);
    if (!move) return;
    const stoneColor = move.color ?? color;
    for (const stone of board.play({ ...move, color: stoneColor })) {
      const key = stone.y * size + stone.x;
      const vEntry = placements
        .get(key)
        ?.slice()
        .reverse()
        .find(item => item.variation !== undefined);
      if (vEntry) vEntry.capturedAt = index + variationStartAt;
      captures.push({
        color: stone.color,
        by: stoneColor,
        stoneNumber: stoneNumbers.get(key),
        stoneLabel: labels.get(key),
        coordinate: coordOf(stone.x, stone.y),
        variationNumber: index + variationStartAt,
      });
      labels.delete(key);
      stoneNumbers.delete(key);
    }
    labels.set(move.y * size + move.x, index + variationStartAt);
    variationPoints.add(move.y * size + move.x);
    const vKey = move.y * size + move.x;
    placements.set(vKey, [
      ...(placements.get(vKey) ?? []),
      {
        moveNumber: index + variationStartAt,
        label: index + variationStartAt,
        color: stoneColor,
        variation: index + variationStartAt,
      },
    ]);
    color = stoneColor === 1 ? 2 : 1;
  });

  // A captured point may have been played on again — record who stands there
  // now, so the legend can name that stone instead of the captured one.
  for (const capture of captures) {
    const x = COLUMNS.indexOf(capture.coordinate[0]);
    const y = size - Number(capture.coordinate.slice(1));
    const key = y * size + x;
    const value = board.grid[key];
    if (value === 1 || value === 2) {
      capture.reoccupied = true;
      capture.occupant = {
        color: value as StoneColor,
        number: stoneNumbers.get(key),
        label: labels.get(key),
      };
    }
  }

  const placementMap: Record<string, PlacementEntry[]> = {};
  for (const [key, list] of placements) {
    placementMap[coordOf(key % size, Math.floor(key / size))] = list;
  }

  const points: BoardPoint[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = board.grid[y * size + x];
      if (value === 0) continue;
      points.push({
        x,
        y,
        color: value as StoneColor,
        label: labels.get(y * size + x),
        variation: variationPoints.has(y * size + x) || undefined,
      });
    }
  }
  return { points, captures, placements: placementMap };
}
