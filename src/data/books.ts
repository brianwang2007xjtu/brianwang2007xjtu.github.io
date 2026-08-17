export interface Book {
  slug: string;
  title: string;
  author: string;
  year?: number;
  description: string;
  cover?: string;
}

export const books: Book[] = [
  {
    slug: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    description:
      "A sweeping account of how Homo sapiens came to dominate the planet through shared myths and cooperation.",
  },
  {
    slug: "the-three-body-problem",
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    year: 2008,
    description:
      "A hard science-fiction epic that begins with the Cultural Revolution and ends with the fate of the cosmos.",
  },
  {
    slug: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2011,
    description:
      "A tour of the two systems that drive the way we think, and the biases that shape our decisions.",
  },
  {
    slug: "the-structure-of-scientific-revolutions",
    title: "The Structure of Scientific Revolutions",
    author: "Thomas S. Kuhn",
    year: 1962,
    description:
      "How paradigm shifts — not gradual accumulation — drive the progress of science.",
  },
];
