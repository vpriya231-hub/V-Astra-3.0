export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: string; // ISO String
  messages: Message[];
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
  joinedAt: string;
}

export interface AppSettings {
  geminiApiKey: string;
  systemInstruction: string;
}
