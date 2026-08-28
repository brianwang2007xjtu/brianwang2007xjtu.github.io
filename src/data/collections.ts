export interface Collection {
  slug: string;
  title: string;
  description: string;
  /** The tag that defines membership in this collection. */
  tag: string;
}

export const collections: Collection[] = [
  {
    slug: "ai-paper",
    title: "AI Paper",
    description: "Notes on key AI papers and the logic behind them",
    tag: "ai-paper",
  },
  {
    slug: "manuals",
    title: "Manuals",
    description: "How-to guides, tips and technical notes",
    tag: "manual",
  },
];
