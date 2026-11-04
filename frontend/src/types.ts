export type Screen = "home" | "notice" | "saved" | "about";
export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  sourceIds?: string[];
}
export interface SavedState {
  completed: string[];
  saved: boolean;
  largeText: boolean;
}

export type Translate = (en: string, ja: string) => string;
