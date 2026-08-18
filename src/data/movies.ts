export interface Movie {
  slug: string;
  title: string;
  director: string;
  cast?: string;
  category?: string;
  year?: number;
  description: string;
  details: string;
  quote?: string;
  poster?: string;
}

export const movies: Movie[] = [
  {
    slug: "interstellar",
    title: "Interstellar",
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    category: "Sci-Fi / Drama",
    year: 2014,
    description:
      "A father leaves a dying Earth to find a new home for humanity, traveling through a wormhole across spacetime.",
    details:
      "In a future where Earth is dying, a pilot turned farmer leaves his daughter behind to search for a habitable world beyond a wormhole. Nolan grounds its cosmic scale in the most human of stakes — a promise between a father and his child.",
    quote:
      "Love is the one thing we're capable of perceiving that transcends dimensions of time and space.",
  },
  {
    slug: "spirited-away",
    title: "Spirited Away",
    director: "Hayao Miyazaki",
    cast: "Rumi Hiiragi, Miyu Irino (voices)",
    category: "Animation / Fantasy",
    year: 2001,
    description:
      "A young girl wanders into a world of spirits and must find the courage to save her parents.",
    details:
      "Ten-year-old Chihiro wanders into a bathhouse for spirits and must work to free her parents, who have been turned into pigs. Miyazaki's masterpiece is a coming-of-age fable about courage, memory, and the will to remember one's own name.",
    quote: "Once you've met someone, you never really forget them.",
  },
  {
    slug: "in-the-mood-for-love",
    title: "In the Mood for Love",
    director: "Wong Kar-wai",
    cast: "Tony Leung, Maggie Cheung",
    category: "Romance / Drama",
    year: 2000,
    description:
      "Two neighbors discover their spouses are having an affair — and fall into a slow, restrained longing of their own.",
    details:
      "In 1960s Hong Kong, two neighbors discover their spouses are having an affair. Instead of confrontation, they rehearse a restrained intimacy of their own — one of the most beautiful films ever made about longing, restraint, and everything left unsaid.",
    quote:
      "In the old days, if someone had a secret they didn't want to share, they went up a mountain, found a tree, carved a hole in it, and whispered the secret into the hole.",
  },
  {
    slug: "blade-runner-2049",
    title: "Blade Runner 2049",
    director: "Denis Villeneuve",
    cast: "Ryan Gosling, Harrison Ford, Ana de Armas",
    category: "Sci-Fi / Neo-noir",
    year: 2017,
    description:
      "A replicant blade runner uncovers a secret that could unravel society, in a rain-soaked neon future.",
    details:
      "A young blade runner unearths a secret that could destabilize society and leads him to Rick Deckard, missing for thirty years. Villeneuve's sequel is a slow-burning meditation on memory, identity, and what it means to be human.",
    quote: "Dying for the right cause. It's the most human thing we can do.",
  },
];
