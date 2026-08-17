export interface Movie {
  slug: string;
  title: string;
  director: string;
  year?: number;
  description: string;
  poster?: string;
}

export const movies: Movie[] = [
  {
    slug: "interstellar",
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    description:
      "A father leaves a dying Earth to find a new home for humanity, traveling through a wormhole across spacetime.",
  },
  {
    slug: "spirited-away",
    title: "Spirited Away",
    director: "Hayao Miyazaki",
    year: 2001,
    description:
      "A young girl wanders into a world of spirits and must find the courage to save her parents.",
  },
  {
    slug: "in-the-mood-for-love",
    title: "In the Mood for Love",
    director: "Wong Kar-wai",
    year: 2000,
    description:
      "Two neighbors discover their spouses are having an affair — and fall into a slow, restrained longing of their own.",
  },
  {
    slug: "blade-runner-2049",
    title: "Blade Runner 2049",
    director: "Denis Villeneuve",
    year: 2017,
    description:
      "A replicant blade runner uncovers a secret that could unravel society, in a rain-soaked neon future.",
  },
];
