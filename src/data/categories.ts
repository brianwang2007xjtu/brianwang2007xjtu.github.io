export interface BlogCategory {
  slug: string;
  label: string;
  description: string;
}

export const blogCategories: BlogCategory[] = [
  {
    slug: "research",
    label: "Research",
    description: "AI research, paper readings and technical deep-dives.",
  },
  {
    slug: "course",
    label: "Course",
    description: "Course notes and lecture summaries.",
  },
  {
    slug: "daily",
    label: "Daily Life",
    description: "Notes and thoughts from everyday life.",
  },
  {
    slug: "others",
    label: "Others",
    description: "Other posts, notes and everything in between.",
  },
];
