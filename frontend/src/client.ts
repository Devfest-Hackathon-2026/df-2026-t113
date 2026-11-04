export type Language = "en" | "ja";
export type BilingualText = Record<Language, string>;
export interface Source {
  id: string;
  text: string;
}
export interface Notice {
  id: string;
  title: BilingualText;
  issuer: BilingualText;
  summary: BilingualText;
  deadline: BilingualText;
  items: BilingualText[];
  actions: {
    id: string;
    title: BilingualText;
    detail: BilingualText;
    source_id: string;
  }[];
  sources: Source[];
  demo: boolean;
}
export interface Answer {
  text: string;
  source_ids: string[];
  demo: boolean;
}

/** Request a validated demo API response, surfacing a useful connection error. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok)
    throw new Error(
      "We couldn’t reach the demo. Check that the Python server is running, then try again.",
    );
  return response.json() as Promise<T>;
}

export const getSample = () => request<Notice>("/api/notices/sample");
export const askQuestion = (id: string, text: string, language: Language) =>
  request<Answer>(`/api/notices/${encodeURIComponent(id)}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
