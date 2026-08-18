export interface Book {
  slug: string;
  title: string;
  author: string;
  nationality?: string;
  category?: string;
  year?: number;
  description: string;
  details: string;
  quote?: string;
  cover?: string;
}

export const books: Book[] = [
  {
    slug: "sapiens",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    nationality: "Israel",
    category: "History / Anthropology",
    year: 2011,
    description:
      "A sweeping account of how Homo sapiens came to dominate the planet through shared myths and cooperation.",
    details:
      "Harari traces how Homo sapiens rose from an insignificant ape to the planet's dominant species. The central argument: our ability to believe in shared fictions — money, nations, gods — enabled cooperation at scales no other animal can match, for better and for worse.",
    quote:
      "Large numbers of strangers can cooperate successfully by believing in common myths.",
  },
  {
    slug: "the-three-body-problem",
    title: "The Three-Body Problem",
    author: "Liu Cixin",
    nationality: "China",
    category: "Science Fiction",
    year: 2008,
    description:
      "A hard science-fiction epic that begins with the Cultural Revolution and ends with the fate of the cosmos.",
    details:
      "The first volume of the 'Remembrance of Earth's Past' trilogy. It opens during the Cultural Revolution, where a secret military project makes contact with an alien civilization — setting in motion a confrontation that spans centuries and light-years.",
    quote:
      "The universe is a dark forest. Every civilization is an armed hunter stalking through the trees.",
  },
  {
    slug: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    nationality: "Israel / United States",
    category: "Psychology",
    year: 2011,
    description:
      "A tour of the two systems that drive the way we think, and the biases that shape our decisions.",
    details:
      "Nobel laureate Daniel Kahneman distills decades of research into two systems of thought: the fast, intuitive System 1 and the slow, deliberate System 2. It explains why we so reliably misjudge risk, probability, and our own memories.",
    quote:
      "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
  },
  {
    slug: "the-structure-of-scientific-revolutions",
    title: "The Structure of Scientific Revolutions",
    author: "Thomas S. Kuhn",
    nationality: "United States",
    category: "Philosophy of Science",
    year: 1962,
    description:
      "How paradigm shifts — not gradual accumulation — drive the progress of science.",
    details:
      "Kuhn's landmark essay argues that science does not advance by steady accumulation, but through 'paradigm shifts' that overturn entire frameworks. Concepts like 'normal science' and 'incommensurability' reshaped how we understand scientific progress.",
    quote:
      "Normal science, the activity in which most scientists inevitably spend almost all their time, is predicated on the assumption that the scientific community knows what the world is like.",
  },
];
