export type MediaIcon = "music" | "book" | "film";

export interface MediaMetaItem {
  label: string;
  value: string;
}

export interface MediaSection {
  label: string;
  body: string;
}

export interface MediaQuote {
  label: string;
  text: string;
}
