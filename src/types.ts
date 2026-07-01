export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: {
    mimeType: string;
    data: string; // base64 encoded string
  };
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
  primary_language?: string;
  secondary_language?: string;
  v_astra_language?: string;
}

export interface AppSettings {
  geminiApiKey: string;
  systemInstruction: string;
}
