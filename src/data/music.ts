export type MusicCategory = "classical" | "non-classical";

export interface Album {
  slug: string;
  title: string;
  artist: string;
  category: MusicCategory;
  description: string;
  cover?: string;
  downloadUrl?: string;
}

export const albums: Album[] = [
  {
    slug: "beethoven-symphony-9",
    title: "Symphony No. 9",
    artist: "Ludwig van Beethoven",
    category: "classical",
    description:
      "The 'Choral' symphony — an ode to joy and one of the most performed works in the classical canon.",
    downloadUrl: "#",
  },
  {
    slug: "chopin-nocturnes",
    title: "Nocturnes",
    artist: "Frédéric Chopin",
    category: "classical",
    description:
      "Twenty-one short piano pieces that distill melancholy, tenderness, and night into pure sound.",
    downloadUrl: "#",
  },
  {
    slug: "debussy-preludes",
    title: "Préludes",
    artist: "Claude Debussy",
    category: "classical",
    description:
      "Impressionistic sketches whose titles — like 'La fille aux cheveux de lin' — arrive only at the end.",
    downloadUrl: "#",
  },
  {
    slug: "radiohead-ok-computer",
    title: "OK Computer",
    artist: "Radiohead",
    category: "non-classical",
    description:
      "A landmark of late-90s alternative rock, equal parts anxious, beautiful, and prescient.",
    downloadUrl: "#",
  },
  {
    slug: "omnipotent-youth-ji-xi-nan",
    title: "冀西南林路行",
    artist: "万能青年旅店",
    category: "non-classical",
    description:
      "A sweeping, horn-laden journey through the industrial landscapes of northern China.",
    downloadUrl: "#",
  },
  {
    slug: "norah-jones-come-away",
    title: "Come Away with Me",
    artist: "Norah Jones",
    category: "non-classical",
    description:
      "Warm, intimate jazz-pop that feels like late-night rain against the window.",
    downloadUrl: "#",
  },
];
