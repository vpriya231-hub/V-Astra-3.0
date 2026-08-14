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

export type ConnectorId = "google_drive" | "gmail" | "google_docs" | "google_sheets" | "google_calendar" | "google_tasks" | "google_forms" | "live_weather" | "telegram" | "youtube" | "github" | "notion" | "web_search" | "custom_webhook" | "wolfram_alpha" | "scispace" | "consensus";

export interface CustomWebhookConfig {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST";
  headers: string;
  body?: string;
  enabled: boolean;
}

export interface ConnectorConfig {
  id: ConnectorId;
  name: string;
  category: "Google Workspace" | "Developer Tools" | "Productivity & Notes" | "Web & Search" | "Video & Search";
  description: string;
  icon: string;
  connected: boolean;
  active: boolean; // toggle switch
  accessToken?: string;
  tokenExpiry?: number;
  userEmail?: string;
  scopes: string[];
}
