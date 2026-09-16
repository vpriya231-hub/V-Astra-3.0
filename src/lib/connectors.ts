import { ConnectorConfig, ConnectorId, CustomWebhookConfig } from "../types";

export const DEFAULT_CONNECTORS: ConnectorConfig[] = [
  {
    id: "google_drive",
    name: "Google Drive",
    category: "Google Workspace",
    description: "Search files, inspect folders, and retrieve document contents directly from your Drive.",
    icon: "HardDrive",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly"
    ]
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Google Workspace",
    description: "Access recent email threads, search inbox messages, and draft project updates.",
    icon: "Mail",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly"
    ]
  },
  {
    id: "google_docs",
    name: "Google Docs",
    category: "Google Workspace",
    description: "Read, summarize, and extract text from your Google Docs documents.",
    icon: "FileText",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly"
    ]
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    category: "Google Workspace",
    description: "Read, analyze, query, and append data or budget rows directly in Google Spreadsheets.",
    icon: "Table",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.readonly"
    ]
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "Google Workspace",
    description: "View upcoming events, schedule exam reminders, and create new calendar events directly.",
    icon: "Calendar",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events"
    ]
  },
  {
    id: "google_tasks",
    name: "Google Tasks",
    category: "Google Workspace",
    description: "Manage task lists, view pending to-dos, and insert new tasks directly into Google Tasks.",
    icon: "CheckSquare",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/tasks"
    ]
  },
  {
    id: "google_forms",
    name: "Google Forms",
    category: "Google Workspace",
    description: "Create forms, quizzes, and surveys automatically via AI, and summarize form responses.",
    icon: "FileQuestion",
    connected: false,
    active: true,
    scopes: [
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/forms.responses.readonly"
    ]
  },
  {
    id: "youtube",
    name: "YouTube Data",
    category: "Video & Search",
    description: "Direct Google YouTube Data API v3 integration to fetch video details, channel metadata, tags for summaries, and search video recommendations directly.",
    icon: "Youtube",
    connected: true,
    active: true,
    accessToken: "youtube_api_key_active_token",
    scopes: ["youtube_v3_api"]
  },
  {
    id: "github",
    name: "GitHub",
    category: "Developer Tools",
    description: "Inspect repositories, check recent commits, view issues, and search code.",
    icon: "Github",
    connected: false,
    active: true,
    scopes: ["repo", "user"]
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity & Notes",
    description: "Search workspace pages, query notes & task databases, and create new study tasks or notes.",
    icon: "Notion",
    connected: false,
    active: true,
    scopes: ["read_content", "update_content", "insert_content"]
  },
  {
    id: "web_search",
    name: "Live Web Search",
    category: "Web & Search",
    description: "Search the internet in real-time using Tavily API & search engines for live news, weather, stock prices, and facts.",
    icon: "Globe",
    connected: true,
    active: true,
    accessToken: "web_search_active_token",
    scopes: ["web_search"]
  },
  {
    id: "live_weather",
    name: "Live Weather & Environment",
    category: "Web & Search",
    description: "Get real-time weather updates, temperature, rainfall predictions, and 7-day forecasts for any city worldwide.",
    icon: "CloudSun",
    connected: true,
    active: true,
    accessToken: "weather_active_token",
    scopes: ["weather_forecast"]
  },
  {
    id: "custom_webhook",
    name: "Custom REST API / Webhook",
    category: "Developer Tools",
    description: "Connect and trigger custom REST API endpoints & Webhooks (GET/POST) with custom headers & authorization.",
    icon: "Webhook",
    connected: true,
    active: true,
    accessToken: "custom_webhook_active_token",
    scopes: ["webhook"]
  },
  {
    id: "telegram",
    name: "Telegram Bot Integration",
    category: "Developer Tools",
    description: "Send chat summaries, notes, reminders, and generated content directly to your Telegram chat.",
    icon: "Send",
    connected: false,
    active: true,
    scopes: ["telegram_bot"]
  },
  {
    id: "wolfram_alpha",
    name: "Wolfram Alpha",
    category: "Web & Search",
    description: "Solve complex math & science problems.",
    icon: "WolframAlpha",
    connected: true,
    active: true,
    accessToken: "wolfram_alpha_active_token",
    scopes: ["wolfram_alpha"]
  },
  {
    id: "scispace",
    name: "SciSpace",
    category: "Web & Search",
    description: "Search and analyze scientific research papers (Powered by Web-Search).",
    icon: "SciSpace",
    connected: true,
    active: true,
    accessToken: "scispace_active_token",
    scopes: ["scispace"]
  },
  {
    id: "consensus",
    name: "Consensus",
    category: "Web & Search",
    description: "Explore evidence-based answers from scientific research papers (Powered by Web-Search).",
    icon: "Consensus",
    connected: true,
    active: true,
    accessToken: "consensus_active_token",
    scopes: ["consensus"]
  }
];

const LOCAL_STORAGE_KEY = "v_astra_connectors_config";
const LOCAL_CLIENT_IDS_KEY = "v_astra_connector_client_ids";
const LOCAL_CUSTOM_WEBHOOKS_KEY = "v_astra_custom_webhooks";
const LOCAL_TELEGRAM_KEY = "v_astra_telegram_config";

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export function getTelegramConfig(): TelegramConfig {
  if (typeof window === "undefined") return { botToken: "", chatId: "" };
  try {
    const saved = localStorage.getItem(LOCAL_TELEGRAM_KEY);
    return saved ? JSON.parse(saved) : { botToken: "", chatId: "" };
  } catch {
    return { botToken: "", chatId: "" };
  }
}

export function saveTelegramConfig(config: TelegramConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_TELEGRAM_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Error saving Telegram config:", err);
  }
}

export function loadCustomWebhooks(): CustomWebhookConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(LOCAL_CUSTOM_WEBHOOKS_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (err) {
    console.error("Error loading custom webhooks:", err);
    return [];
  }
}

export function saveCustomWebhooks(webhooks: CustomWebhookConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_CUSTOM_WEBHOOKS_KEY, JSON.stringify(webhooks));
  } catch (err) {
    console.error("Error saving custom webhooks:", err);
  }
}

export function loadConnectors(): ConnectorConfig[] {
  if (typeof window === "undefined") return DEFAULT_CONNECTORS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed: ConnectorConfig[] = saved ? JSON.parse(saved) : [];

    // Merge saved config with defaults to ensure all fields and new connectors exist
    return DEFAULT_CONNECTORS.map((def) => {
      if (def.id === "telegram") {
        const tg = getTelegramConfig();
        const hasTg = !!(tg.botToken.trim() && tg.chatId.trim());
        const match = parsed.find((p) => p.id === "telegram");
        return {
          ...def,
          connected: hasTg,
          active: match ? match.active !== false : true,
          accessToken: tg.botToken.trim() || undefined,
          userEmail: tg.chatId.trim() ? `Chat ID: ${tg.chatId.trim()}` : undefined,
        };
      }

      const match = parsed.find((p) => p.id === def.id);
      if (!match) return def;
      const isAlwaysConnected = def.id === "web_search" || def.id === "custom_webhook" || def.id === "youtube" || def.id === "live_weather" || def.id === "wolfram_alpha" || def.id === "scispace" || def.id === "consensus";
      const isConnected = isAlwaysConnected ? (match.connected !== false) : (!!match.accessToken && match.connected);
      return {
        ...def,
        connected: isConnected,
        active: match.active !== undefined ? match.active : true,
        accessToken: match.accessToken || (isAlwaysConnected ? `${def.id}_active_token` : undefined),
        tokenExpiry: match.tokenExpiry,
        userEmail: match.userEmail,
      };
    });
  } catch (err) {
    console.error("Error loading connectors config:", err);
    return DEFAULT_CONNECTORS;
  }
}

export function saveConnectors(connectors: ConnectorConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(connectors));
  } catch (err) {
    console.error("Error saving connectors config:", err);
  }
}

export function getCustomClientIds(): {
  googleClientId?: string;
  githubClientId?: string;
  notionClientId?: string;
  notionClientSecret?: string;
  tavilyApiKey?: string;
} {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(LOCAL_CLIENT_IDS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveCustomClientIds(ids: {
  googleClientId?: string;
  githubClientId?: string;
  notionClientId?: string;
  notionClientSecret?: string;
  tavilyApiKey?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_CLIENT_IDS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error("Error saving custom client IDs:", err);
  }
}

export function getEffectiveClientId(provider: "google" | "github" | "notion"): string {
  const custom = getCustomClientIds();
  const env = (import.meta as unknown as { env: Record<string, string> }).env || {};
  if (provider === "google") {
    return custom.googleClientId?.trim() || env.VITE_GOOGLE_CLIENT_ID || "101317789836-gnhrtmrq0p09u9rdk8sqqet25595ptvt.apps.googleusercontent.com";
  } else if (provider === "github") {
    return custom.githubClientId?.trim() || env.VITE_GITHUB_CLIENT_ID || "";
  } else {
    return custom.notionClientId?.trim() || env.VITE_NOTION_CLIENT_ID || "";
  }
}

/**
 * Initiates Pure Client-side OAuth 2.0 flow
 */
export function buildOAuthUrl(connectorId: ConnectorId, customClientId?: string): string {
  if (connectorId === "notion") {
    const clientId = customClientId || getEffectiveClientId("notion") || "PLACEHOLDER_NOTION_CLIENT_ID";
    const redirectUri = "https://v-astra-ai.ai.studio";
    const notionAuthUrl = "https://api.notion.com/v1/oauth/authorize";

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      owner: "user",
      redirect_uri: redirectUri,
      state: "notion",
    });

    return `${notionAuthUrl}?${params.toString()}`;
  }

  const isGoogle = connectorId.startsWith("google") || connectorId === "gmail";
  const clientId =
    customClientId ||
    getEffectiveClientId(isGoogle ? "google" : "github");

  const redirectUri = window.location.origin;

  if (isGoogle) {
    const connector = DEFAULT_CONNECTORS.find((c) => c.id === connectorId);
    let scopes = (connector?.scopes || []).join(" ");
    if (connectorId === "gmail") {
      scopes = "https://www.googleapis.com/auth/gmail.readonly";
    } else if (connectorId === "google_docs") {
      scopes = "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly";
    } else if (connectorId === "google_calendar") {
      scopes = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";
    } else if (connectorId === "google_tasks") {
      scopes = "https://www.googleapis.com/auth/tasks";
    } else if (connectorId === "google_forms") {
      scopes = "https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/drive.readonly";
    }
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
      client_id: clientId || "PLACEHOLDER_CLIENT_ID",
      redirect_uri: redirectUri,
      response_type: "token",
      scope: scopes || "https://www.googleapis.com/auth/drive.readonly",
      include_granted_scopes: "true",
      state: connectorId,
      prompt: "select_account",
    });

    return `${googleAuthUrl}?${params.toString()}`;
  } else {
    // GitHub
    const githubAuthUrl = "https://github.com/login/oauth/authorize";
    const params = new URLSearchParams({
      client_id: clientId || "PLACEHOLDER_CLIENT_ID",
      redirect_uri: redirectUri,
      scope: "repo user",
      state: connectorId,
    });

    return `${githubAuthUrl}?${params.toString()}`;
  }
}

/**
 * Parses OAuth redirect URL hash or query parameters (e.g. access_token=... in window.location.hash)
 */
export function parseOAuthCallback(): { connectorId: ConnectorId | null; token: string | null } {
  if (typeof window === "undefined") return { connectorId: null, token: null };

  const hash = window.location.hash;
  const search = window.location.search;

  if (hash && hash.includes("access_token")) {
    const params = new URLSearchParams(hash.replace("#", "?"));
    const token = params.get("access_token");
    const state = params.get("state") as ConnectorId | null;
    return { connectorId: state, token };
  }

  if (search && search.includes("access_token")) {
    const params = new URLSearchParams(search);
    const token = params.get("access_token");
    const state = params.get("state") as ConnectorId | null;
    return { connectorId: state, token };
  }

  return { connectorId: null, token: null };
}

// Helper to fetch user profile info for connected Google, GitHub, or Notion account
export async function fetchUserInfo(connectorId: ConnectorId, token: string): Promise<string | undefined> {
  try {
    if (connectorId === "github") {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.login || data.email || data.name;
      }
    } else if (connectorId === "notion") {
      try {
        const res = await fetch("/api/notion/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ page_size: 1 }),
        });
        if (res.ok) {
          return "Connected Notion Workspace";
        }
      } catch {
        return "Notion Workspace";
      }
    } else {
      const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.email || data.name;
      }
    }
  } catch (err) {
    console.warn("Could not fetch user profile info:", err);
  }
  return undefined;
}

/**
 * Searches Notion pages and databases via server proxy
 */
export async function fetchNotionSearchResults(token: string, query?: string): Promise<string> {
  try {
    const cleanQuery = query
      ? query.replace(/(show|get|list|read|find|search|check|view|my|notion|notes|tasks|pages)/gi, "").trim()
      : "";

    const res = await fetch("/api/notion/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: cleanQuery,
        page_size: 10,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[Notion Notice]: Unable to search Notion workspace (HTTP ${res.status}): ${errData.message || "Ensure your Notion token is active."}`;
    }

    const data = await res.json();
    const results = data.results || [];

    if (results.length === 0) {
      return "[LIVE NOTION WORKSPACE]: Connected to Notion successfully, but no matching pages or databases were found in your workspace.";
    }

    const formattedList = results.map((item: any) => {
      const isDb = item.object === "database";
      let title = "Untitled";

      if (item.title && Array.isArray(item.title) && item.title.length > 0) {
        title = item.title.map((t: any) => t.plain_text || t.text?.content || "").join("");
      } else if (item.properties) {
        for (const propKey of Object.keys(item.properties)) {
          const prop = item.properties[propKey];
          if (prop.type === "title" && Array.isArray(prop.title) && prop.title.length > 0) {
            title = prop.title.map((t: any) => t.plain_text || t.text?.content || "").join("");
            break;
          }
        }
      }

      return `• [${isDb ? "DATABASE" : "PAGE"}] "${title.trim() || "Untitled"}" (ID: ${item.id})\n  URL: ${item.url || "N/A"}\n  Last Edited: ${item.last_edited_time || "N/A"}`;
    });

    return `[LIVE NOTION WORKSPACE PAGES & DATABASES]:\n${formattedList.join("\n\n")}`;
  } catch (err: any) {
    console.error("Error in fetchNotionSearchResults:", err);
    return `[Notion API Error]: Failed to query Notion workspace (${err?.message || String(err)})`;
  }
}

/**
 * Creates a new Notion page or task item in the user's workspace
 */
export async function createNotionPageOrTask(token: string, promptText: string): Promise<string> {
  try {
    // 1. Search existing workspace to find a parent page or database
    const searchRes = await fetch("/api/notion/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ page_size: 5 }),
    });

    let parent: any = null;
    let parentType: "page" | "database" = "page";

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const results = searchData.results || [];
      const dbMatch = results.find((r: any) => r.object === "database");
      const pageMatch = results.find((r: any) => r.object === "page");

      if (dbMatch) {
        parent = { database_id: dbMatch.id };
        parentType = "database";
      } else if (pageMatch) {
        parent = { page_id: pageMatch.id };
        parentType = "page";
      }
    }

    if (!parent) {
      return `[Notion Page Creation Notice]: No parent page or database found in your Notion workspace. Please grant page access or create at least one page in Notion so Astra can attach new pages/tasks.`;
    }

    // Extract title from prompt
    let title = promptText
      .replace(/(create|add|new|make|save|write|insert)\s+(a|an)?\s*/gi, "")
      .replace(/(note|task|page|item)\s+(in|to|on)?\s*notion/gi, "")
      .replace(/in notion/gi, "")
      .trim();

    if (!title || title.length < 2) {
      title = "New Study Task / Note";
    }

    title = title.charAt(0).toUpperCase() + title.slice(1);

    const properties = parentType === "database"
      ? { Name: { title: [{ text: { content: title } }] } }
      : { title: { title: [{ text: { content: title } }] } };

    const children = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: `Created via V-Astra AI on ${new Date().toLocaleString()}` },
            },
          ],
        },
      },
    ];

    const createRes = await fetch("/api/notion/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        parent,
        properties,
        children,
      }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      return `[Notion Page Creation Error]: HTTP ${createRes.status} - ${createData.message || JSON.stringify(createData)}`;
    }

    return `[LIVE NOTION PAGE / TASK CREATED SUCCESSFULLY]:\n• Title: "${title}"\n• Page ID: ${createData.id}\n• URL: ${createData.url || "N/A"}\n• Status: Successfully added item to your Notion workspace!`;
  } catch (err: any) {
    console.error("Error creating Notion page:", err);
    return `[Notion API Error]: Failed to create page in Notion (${err?.message || String(err)})`;
  }
}

/**
 * Fetches upcoming events from the primary Google Calendar
 */
export async function fetchGoogleCalendarEvents(token: string, userPrompt: string): Promise<string> {
  try {
    const now = new Date();
    // Default to start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    url.searchParams.set("timeMin", startOfToday);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", "12");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[Google Calendar Notice]: Unable to fetch calendar events (HTTP ${res.status}): ${errData.error?.message || "Ensure Google Calendar scope is authorized."}`;
    }

    const data = await res.json();
    const items = data.items || [];

    if (items.length === 0) {
      return `[LIVE GOOGLE CALENDAR EVENTS]: Connected to Google Calendar successfully, but no upcoming events were found in your primary calendar starting from today (${now.toLocaleDateString()}).`;
    }

    const formattedEvents = items.map((item: any) => {
      const summary = item.summary || "Untitled Event";
      const start = item.start?.dateTime ? new Date(item.start.dateTime).toLocaleString() : item.start?.date || "N/A";
      const end = item.end?.dateTime ? new Date(item.end.dateTime).toLocaleString() : item.end?.date || "N/A";
      const location = item.location ? `\n  Location: ${item.location}` : "";
      const description = item.description ? `\n  Description: ${item.description.slice(0, 150)}` : "";
      const htmlLink = item.htmlLink ? `\n  Link: ${item.htmlLink}` : "";

      return `• "${summary}"\n  Time: ${start} - ${end}${location}${description}${htmlLink}`;
    });

    return `[LIVE GOOGLE CALENDAR UPCOMING EVENTS]:\n${formattedEvents.join("\n\n")}`;
  } catch (err: any) {
    console.error("Error in fetchGoogleCalendarEvents:", err);
    return `[Google Calendar API Error]: Failed to fetch calendar events (${err?.message || String(err)})`;
  }
}

/**
 * Inserts a new event or reminder into the primary Google Calendar
 */
export async function createGoogleCalendarEvent(token: string, userPrompt: string): Promise<string> {
  try {
    const now = new Date();
    let eventDate = new Date(now);

    const lower = userPrompt.toLowerCase();

    if (lower.includes("tomorrow")) {
      eventDate.setDate(eventDate.getDate() + 1);
    } else if (lower.includes("next week")) {
      eventDate.setDate(eventDate.getDate() + 7);
    } else {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      for (let i = 0; i < days.length; i++) {
        if (lower.includes(days[i])) {
          const currentDay = eventDate.getDay();
          let diff = i - currentDay;
          if (diff <= 0) diff += 7;
          eventDate.setDate(eventDate.getDate() + diff);
          break;
        }
      }
    }

    let startHour = 10;
    let startMinute = 0;

    const timeMatch = userPrompt.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const ampm = timeMatch[3]?.toLowerCase();

      if (ampm === "pm" && h < 12) h += 12;
      if (ampm === "am" && h === 12) h = 0;

      if (h >= 0 && h <= 23) {
        startHour = h;
        startMinute = m;
      }
    } else if (lower.includes("tomorrow") || lower.includes("today")) {
      startHour = 10;
    } else {
      startHour = Math.min(now.getHours() + 1, 23);
    }

    eventDate.setHours(startHour, startMinute, 0, 0);

    const startDateIso = eventDate.toISOString();
    const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);
    const endDateIso = endDate.toISOString();

    let title = userPrompt
      .replace(/(add|create|schedule|set|insert|put|book|new)\s+(a|an)?\s*/gi, "")
      .replace(/(calendar|event|reminder|meeting|appointment)\s+(for|at|on)?\s*/gi, "")
      .replace(/(tomorrow|today|at\s+\d{1,2}(:\d{2})?\s*(am|pm)?|for\s+tomorrow|for\s+today)/gi, "")
      .replace(/in google calendar/gi, "")
      .replace(/on google calendar/gi, "")
      .trim();

    if (!title || title.length < 2) {
      if (lower.includes("exam")) {
        title = "Exam Reminder";
      } else {
        title = "Scheduled Calendar Event";
      }
    }

    title = title.charAt(0).toUpperCase() + title.slice(1);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const payload = {
      summary: title,
      description: `Created via V-Astra AI Companion from prompt: "${userPrompt}"`,
      start: {
        dateTime: startDateIso,
        timeZone,
      },
      end: {
        dateTime: endDateIso,
        timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
          { method: "email", minutes: 60 },
        ],
      },
    };

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return `[Google Calendar Event Creation Notice]: HTTP ${res.status} - ${data.error?.message || JSON.stringify(data)}`;
    }

    return `[LIVE GOOGLE CALENDAR EVENT CREATED SUCCESSFULLY]:\n• Title: "${title}"\n• Start Time: ${new Date(startDateIso).toLocaleString()}\n• End Time: ${new Date(endDateIso).toLocaleString()}\n• Link: ${data.htmlLink || "N/A"}\n• Status: Event and exam reminders have been scheduled on your Google Calendar!`;
  } catch (err: any) {
    console.error("Error creating Google Calendar event:", err);
    return `[Google Calendar API Error]: Failed to create event (${err?.message || String(err)})`;
  }
}

/**
 * Fetches user's task lists and active tasks from Google Tasks API
 */
export async function fetchGoogleTasks(token: string, userPrompt: string): Promise<string> {
  try {
    const listsRes = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!listsRes.ok) {
      const errData = await listsRes.json().catch(() => ({}));
      return `[Google Tasks Notice]: Unable to fetch task lists (HTTP ${listsRes.status}): ${errData.error?.message || "Ensure Google Tasks scope is authorized."}`;
    }

    const listsData = await listsRes.json();
    const taskLists = listsData.items || [];

    if (taskLists.length === 0) {
      return "[LIVE GOOGLE TASKS]: Connected to Google Tasks successfully, but no task lists were found.";
    }

    const allTasksOutput: string[] = [];

    // Fetch tasks for up to 3 task lists
    for (const list of taskLists.slice(0, 3)) {
      const tasksRes = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(list.id)}/tasks?showCompleted=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        const items = tasksData.items || [];
        if (items.length > 0) {
          const formattedItems = items.map((task: any) => {
            const dueStr = task.due ? ` (Due: ${new Date(task.due).toLocaleDateString()})` : "";
            const notesStr = task.notes ? ` - ${task.notes.slice(0, 100)}` : "";
            return `  • [${task.status === "completed" ? "✓" : " "}] ${task.title}${dueStr}${notesStr}`;
          });
          allTasksOutput.push(`Task List: "${list.title}" (ID: ${list.id}):\n${formattedItems.join("\n")}`);
        } else {
          allTasksOutput.push(`Task List: "${list.title}" (ID: ${list.id}):\n  (No active pending tasks)`);
        }
      }
    }

    return `[LIVE GOOGLE TASKS / TODO LISTS]:\n${allTasksOutput.join("\n\n")}`;
  } catch (err: any) {
    console.error("Error in fetchGoogleTasks:", err);
    return `[Google Tasks API Error]: Failed to fetch tasks (${err?.message || String(err)})`;
  }
}

/**
 * Inserts a new task into the user's primary Google Tasks list
 */
export async function createGoogleTask(token: string, userPrompt: string): Promise<string> {
  try {
    // 1. Get task list ID (first/default task list)
    const listsRes = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!listsRes.ok) {
      const errData = await listsRes.json().catch(() => ({}));
      return `[Google Tasks Notice]: Unable to fetch task lists for task creation (HTTP ${listsRes.status}): ${errData.error?.message || "Ensure Google Tasks scope is authorized."}`;
    }

    const listsData = await listsRes.json();
    const taskLists = listsData.items || [];
    const taskListId = taskLists.length > 0 ? taskLists[0].id : "@default";
    const taskListName = taskLists.length > 0 ? taskLists[0].title : "My Tasks";

    // Clean prompt to extract title
    let taskTitle = userPrompt
      .replace(/(add|create|insert|put|append|save|new)\s+(a|an)?\s*/gi, "")
      .replace(/(task|todo|to-do|item)\s+(to|in|into|on)?\s*/gi, "")
      .replace(/(my todo list|my task list|my tasks|todo list|task list|tasks)/gi, "")
      .replace(/in google tasks/gi, "")
      .replace(/to google tasks/gi, "")
      .trim();

    if (!taskTitle || taskTitle.length < 2) {
      taskTitle = "New Task";
    }

    taskTitle = taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1);

    const payload = {
      title: taskTitle,
      notes: `Created via V-Astra AI Companion on ${new Date().toLocaleString()}`,
    };

    const insertRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(taskListId)}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await insertRes.json();
    if (!insertRes.ok) {
      return `[Google Task Creation Notice]: HTTP ${insertRes.status} - ${data.error?.message || JSON.stringify(data)}`;
    }

    return `[LIVE GOOGLE TASK CREATED SUCCESSFULLY]:\n• Title: "${taskTitle}"\n• Task List: "${taskListName}"\n• Task ID: ${data.id}\n• Status: Successfully added task to your Google Tasks!`;
  } catch (err: any) {
    console.error("Error creating Google Task:", err);
    return `[Google Tasks API Error]: Failed to create task (${err?.message || String(err)})`;
  }
}

/**
 * Creates a new Google Form or Quiz using the Google Forms API
 */
export async function createGoogleForm(token: string, userPrompt: string): Promise<string> {
  try {
    const lower = userPrompt.toLowerCase();

    // Extract title from prompt
    const titleMatch =
      userPrompt.match(/(?:title|named|called|for)\s+["']?([^"'\.\n\?]+)["']?/i) ||
      userPrompt.match(/(?:create|build|make|generate)\s+a?\s*["']?([^"'\.\n\?]+?)["']?\s*(?:form|quiz|survey)/i);

    let formTitle = titleMatch && titleMatch[1] && titleMatch[1].trim().length > 2
      ? titleMatch[1].trim()
      : "V-Astra Form";

    if (lower.includes("quiz")) {
      formTitle = formTitle.toLowerCase().includes("quiz") ? formTitle : `${formTitle} Quiz`;
    } else if (lower.includes("feedback")) {
      formTitle = formTitle.toLowerCase().includes("feedback") ? formTitle : `${formTitle} Feedback Form`;
    } else if (lower.includes("survey")) {
      formTitle = formTitle.toLowerCase().includes("survey") ? formTitle : `${formTitle} Survey`;
    }

    formTitle = formTitle.charAt(0).toUpperCase() + formTitle.slice(1);

    // Step 1: Create Form
    const createRes = await fetch("https://forms.googleapis.com/v1/forms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: {
          title: formTitle,
          documentTitle: formTitle,
        },
      }),
    });

    const formData = await createRes.json();
    if (!createRes.ok) {
      return `[Google Form Creation Notice]: HTTP ${createRes.status} - ${formData.error?.message || JSON.stringify(formData)}`;
    }

    const formId = formData.formId;
    const responderUri = formData.responderUri || `https://docs.google.com/forms/d/${formId}/viewform`;

    // Step 2: Add initial questions/items via batchUpdate
    let requests: any[] = [];

    if (lower.includes("quiz")) {
      requests = [
        {
          createItem: {
            item: {
              title: "What is your primary goal or objective?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [
                      { value: "Option A" },
                      { value: "Option B" },
                      { value: "Option C" },
                      { value: "Option D" },
                    ],
                  },
                },
              },
            },
            location: { index: 0 },
          },
        },
        {
          createItem: {
            item: {
              title: "Which option best describes your experience level?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [
                      { value: "Beginner" },
                      { value: "Intermediate" },
                      { value: "Advanced" },
                    ],
                  },
                },
              },
            },
            location: { index: 1 },
          },
        },
        {
          createItem: {
            item: {
              title: "Additional comments or feedback",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: true },
                },
              },
            },
            location: { index: 2 },
          },
        },
      ];
    } else if (lower.includes("feedback") || lower.includes("event")) {
      requests = [
        {
          createItem: {
            item: {
              title: "How satisfied were you with the overall event?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [
                      { value: "Very Satisfied" },
                      { value: "Satisfied" },
                      { value: "Neutral" },
                      { value: "Unsatisfied" },
                    ],
                  },
                },
              },
            },
            location: { index: 0 },
          },
        },
        {
          createItem: {
            item: {
              title: "What was the most valuable part of the event?",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: true },
                },
              },
            },
            location: { index: 1 },
          },
        },
        {
          createItem: {
            item: {
              title: "Would you recommend future events to colleagues or friends?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [{ value: "Yes" }, { value: "Maybe" }, { value: "No" }],
                  },
                },
              },
            },
            location: { index: 2 },
          },
        },
      ];
    } else {
      requests = [
        {
          createItem: {
            item: {
              title: "Your Name / Email",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: false },
                },
              },
            },
            location: { index: 0 },
          },
        },
        {
          createItem: {
            item: {
              title: "How would you rate your experience?",
              questionItem: {
                question: {
                  required: true,
                  choiceQuestion: {
                    type: "RADIO",
                    options: [
                      { value: "Excellent" },
                      { value: "Good" },
                      { value: "Average" },
                      { value: "Poor" },
                    ],
                  },
                },
              },
            },
            location: { index: 1 },
          },
        },
        {
          createItem: {
            item: {
              title: "Suggestions or Comments",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: true },
                },
              },
            },
            location: { index: 2 },
          },
        },
      ];
    }

    if (requests.length > 0) {
      await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      });
    }

    return `[LIVE GOOGLE FORM CREATED SUCCESSFULLY]:\n• Title: "${formTitle}"\n• Form ID: ${formId}\n• Shareable Responder Link: ${responderUri}\n• Edit Link: https://docs.google.com/forms/d/${formId}/edit\n• Questions added: ${requests.length}\n• Status: Google Form created and populated successfully!`;
  } catch (err: any) {
    console.error("Error creating Google Form:", err);
    return `[Google Forms API Error]: Failed to create form (${err?.message || String(err)})`;
  }
}

/**
 * Retrieves form details and responses from Google Forms API and formats a summary
 */
export async function fetchGoogleFormResponses(token: string, userPrompt: string): Promise<string> {
  try {
    let formId: string | null = null;

    const idMatch =
      userPrompt.match(/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]{20,})/i) ||
      userPrompt.match(/([a-zA-Z0-9_-]{25,})/);
    if (idMatch) {
      formId = idMatch[1];
    }

    if (!formId) {
      const driveSearchRes = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.form'+and+trashed%3Dfalse&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (driveSearchRes.ok) {
        const driveData = await driveSearchRes.json();
        if (driveData.files && driveData.files.length > 0) {
          formId = driveData.files[0].id;
        }
      }
    }

    if (!formId) {
      return `[Google Forms Notice]: Google Forms connector active, but no Google Form was found in your Google Drive or specified in your request.`;
    }

    let formTitle = "Google Form";
    const questionMap: Record<string, string> = {};

    const formDetailsRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (formDetailsRes.ok) {
      const formData = await formDetailsRes.json();
      formTitle = formData.info?.title || formTitle;
      const items = formData.items || [];
      for (const item of items) {
        if (item.questionItem?.question?.questionId) {
          questionMap[item.questionItem.question.questionId] = item.title || "Question";
        }
      }
    }

    const responsesRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!responsesRes.ok) {
      return `[Google Forms Notice]: Unable to fetch responses for Form ID (${formId}) - HTTP ${responsesRes.status}. Ensure you have permission to view responses.`;
    }

    const responsesData = await responsesRes.json();
    const responses = responsesData.responses || [];

    if (responses.length === 0) {
      return `[LIVE GOOGLE FORMS RESPONSES - Title: "${formTitle}" (ID: ${formId})]:\nNo responses have been submitted to this form yet (0 responses).`;
    }

    const responseSummaries: string[] = [];
    responses.slice(0, 10).forEach((resp: any, idx: number) => {
      const submittedTime = resp.lastSubmittedTime || resp.createTime || "N/A";
      const answers: string[] = [];

      if (resp.answers) {
        Object.entries(resp.answers).forEach(([qId, answerObj]: [string, any]) => {
          const qTitle = questionMap[qId] || `Question (${qId.slice(0, 6)})`;
          const textAnswers = (answerObj.textAnswers?.answers || [])
            .map((a: any) => a.value)
            .join(", ");
          answers.push(`    - ${qTitle}: "${textAnswers || "No answer"}"`);
        });
      }

      responseSummaries.push(
        `Response #${idx + 1} (Submitted: ${submittedTime}):\n${answers.join("\n") || "    (No answers recorded)"}`
      );
    });

    let resultMsg = `[LIVE GOOGLE FORMS RESPONSES SUMMARY]:\n• Form Title: "${formTitle}"\n• Form ID: ${formId}\n• Total Responses Received: ${responses.length}\n\nRecent Submissions:\n${responseSummaries.join("\n\n")}`;
    resultMsg += `\n\n[MANDATORY RESPONSE INSTRUCTION]: Analyze and summarize the Google Form responses above for the user. Provide key insights, patterns, and concise takeaways.`;

    return resultMsg;
  } catch (err: any) {
    console.error("Error fetching Google Form responses:", err);
    return `[Google Forms API Error]: Failed to retrieve form responses (${err?.message || String(err)})`;
  }
}

/**
 * Helper to map WMO Weather Codes (Open-Meteo) to human-readable weather descriptions
 */
function getWeatherCodeDescription(code: number): string {
  switch (code) {
    case 0: return "Clear sky ☀️";
    case 1: return "Mainly clear 🌤️";
    case 2: return "Partly cloudy ⛅";
    case 3: return "Overcast ☁️";
    case 45: case 48: return "Fog / Depositing rime fog 🌫️";
    case 51: case 53: case 55: return "Drizzle 🌧️";
    case 56: case 57: return "Freezing Drizzle 🌧️❄️";
    case 61: case 63: case 65: return "Rain 🌧️";
    case 66: case 67: return "Freezing Rain 🌨️";
    case 71: case 73: case 75: return "Snow fall ❄️";
    case 77: return "Snow grains ❄️";
    case 80: case 81: case 82: return "Rain showers 🌦️";
    case 85: case 86: return "Snow showers 🌨️";
    case 95: return "Thunderstorm 🌩️";
    case 96: case 99: return "Thunderstorm with slight/heavy hail ⛈️";
    default: return "Variable weather conditions";
  }
}

/**
 * Fetches live weather, temperature, humidity, wind, and 7-day forecast for any city via Open-Meteo API
 */
export async function fetchLiveWeatherData(userPrompt: string): Promise<string> {
  try {
    // Extract city name from user prompt
    let cityName = "";
    const inMatch =
      userPrompt.match(/(?:weather|temperature|forecast|rain|rainfall|climate|humidity|wind)\s+(?:in|for|at|around|near|of)\s+([a-zA-Z\s]{2,30})(?:\s+today|\s+tomorrow|\s+this|\s+next|\?|\.|$)/i) ||
      userPrompt.match(/(?:in|for)\s+([a-zA-Z\s]{2,30})\s+(?:weather|forecast|today|tomorrow)/i) ||
      userPrompt.match(/([a-zA-Z\s]{2,20})\s+(?:weather|forecast|temperature)/i);

    if (inMatch && inMatch[1]) {
      cityName = inMatch[1].replace(/(today|tomorrow|this week|now|current|forecast|live)/gi, "").trim();
    }

    if (!cityName) {
      const stopWords = new Set(["what", "is", "the", "will", "it", "rain", "today", "tomorrow", "forecast", "weather", "in", "for", "show", "get", "check", "tell", "me", "about", "how", "hot", "cold", "like", "temperature", "there", "degree", "celsius"]);
      const words = userPrompt.split(/\s+/).map(w => w.replace(/[^\w]/g, "")).filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));
      if (words.length > 0) {
        cityName = words[0];
      }
    }

    if (!cityName) {
      cityName = "Kochi";
    }

    // Step 1: Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      return `[Live Weather Notice]: Unable to geocode city "${cityName}".`;
    }

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return `[Live Weather Notice]: Could not find coordinates for city "${cityName}". Please check the city spelling.`;
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, country, admin1 } = location;
    const locationDisplayName = [name, admin1, country].filter(Boolean).join(", ");

    // Step 2: Weather Forecast API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      return `[Live Weather Notice]: Failed to fetch weather data for ${locationDisplayName}.`;
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;

    const currentHumidity = hourly && hourly.relativehumidity_2m && hourly.relativehumidity_2m.length > 0 ? `${hourly.relativehumidity_2m[0]}%` : "N/A";
    const currentRainProb = daily && daily.precipitation_probability_max && daily.precipitation_probability_max.length > 0 ? `${daily.precipitation_probability_max[0]}%` : "N/A";
    const conditionText = getWeatherCodeDescription(current.weathercode);

    // 7-Day Forecast
    const forecastDays: string[] = [];
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const dateStr = daily.time[i];
        const maxTemp = daily.temperature_2m_max[i];
        const minTemp = daily.temperature_2m_min[i];
        const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : "N/A";
        const dayCondition = getWeatherCodeDescription(daily.weathercode[i]);
        forecastDays.push(`  • ${dateStr}: ${dayCondition} | High: ${maxTemp}°C, Low: ${minTemp}°C | Rain Probability: ${rainProb}%`);
      }
    }

    return `[LIVE WEATHER & ENVIRONMENT DATA - Location: ${locationDisplayName} (Lat: ${latitude}, Lon: ${longitude})]:
• Current Temperature: ${current.temperature}°C
• Weather Condition: ${conditionText}
• Wind Speed: ${current.windspeed} km/h
• Humidity: ${currentHumidity}
• Today's Max Rain Probability: ${currentRainProb}

7-Day Forecast:
${forecastDays.join("\n") || "  • Forecast data unavailable"}

[MANDATORY RESPONSE INSTRUCTION]: Use the real-time weather data above to accurately answer the user's weather question for ${locationDisplayName}. Present the current temperature, weather conditions, rain forecast, and upcoming trend clearly.`;
  } catch (err: any) {
    console.error("Live weather error:", err);
    return `[Live Weather API Error]: ${err?.message || String(err)}`;
  }
}

/**
 * Sends a message, summary, code snippet, or alert directly to a Telegram chat using Telegram Bot API
 * POST https://api.telegram.org/bot{bot_token}/sendMessage
 */
export async function sendTelegramMessage(botToken: string, chatId: string, messageContent: string): Promise<string> {
  if (!botToken || !chatId) {
    return `[Telegram Notice]: Bot Token or Chat ID is missing. Please configure your Telegram Bot Token and Chat ID under Settings > Connectors.`;
  }

  const cleanToken = botToken.trim();
  const cleanChatId = chatId.trim();
  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

  // Safely format basic HTML tags for Telegram
  let formattedHtml = messageContent
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Format code blocks, bold, italic, inline code
  formattedHtml = formattedHtml
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: formattedHtml,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      // Fallback attempt with plain text if Telegram API rejects HTML formatting
      const plainRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: messageContent,
        }),
      });
      const plainData = await plainRes.json();
      if (!plainRes.ok || !plainData.ok) {
        return `[Telegram API Error]: HTTP ${plainRes.status} - ${plainData.description || JSON.stringify(plainData)}`;
      }
    }

    return `[TELEGRAM MESSAGE DELIVERED SUCCESSFULLY]:\n• Destination Chat ID: ${cleanChatId}\n• Message Content Preview: "${messageContent.slice(0, 150)}..."\n• Status: Sent directly to your Telegram chat via Telegram Bot API!`;
  } catch (err: any) {
    console.error("Telegram API Error:", err);
    return `[Telegram API Error]: Failed to send message (${err?.message || String(err)})`;
  }
}

/**
 * Executes a real-time web search query via Tavily API or server search engine fallback
 */
export async function fetchWebSearchResults(userQuery: string, customTavilyKey?: string): Promise<string> {
  try {
    const customIds = getCustomClientIds();
    const tavilyApiKey = customTavilyKey || customIds.tavilyApiKey;

    // Clean prompt to extract search terms if needed
    let cleanQuery = userQuery
      .replace(/(search for|search the web for|search|find live info on|look up|get latest|find out|google)\s*/gi, "")
      .replace(/on the web/gi, "")
      .replace(/online/gi, "")
      .trim();

    if (!cleanQuery) {
      cleanQuery = userQuery.trim();
    }

    console.log(`[Connectors] Executing live web search for query: "${cleanQuery}"`);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: cleanQuery,
        tavilyApiKey,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[Live Web Search Notice]: Unable to fetch search results (HTTP ${res.status}): ${errData.error || "Search API unavailable"}`;
    }

    const data = await res.json();
    const results = data.results || [];
    const answer = data.answer;

    if (results.length === 0 && !answer) {
      return `[LIVE WEB SEARCH RESULTS]: Connected to web search, but no real-time results were found for query: "${cleanQuery}".`;
    }

    const formattedResults = results.map((r: any, idx: number) => {
      const title = r.title || "Web Source";
      const url = r.url || "#";
      const snippet = r.content || r.snippet || "No detailed snippet available.";
      return `[Result ${idx + 1}]: "${title}"\n  URL: ${url}\n  Snippet: ${snippet.slice(0, 300)}`;
    });

    let output = `[LIVE REAL-TIME WEB SEARCH RESULTS FOR: "${cleanQuery}"]\n`;
    if (answer) {
      output += `Quick Answer Summary: ${answer}\n\n`;
    }
    output += formattedResults.join("\n\n");
    output += `\n\n[MANDATORY RESPONSE INSTRUCTION]: Use the provided live web search results above to answer the user's question with accurate, up-to-date facts. Cite source names/URLs inline where appropriate so the user can see source references!`;

    return output;
  } catch (err: any) {
    console.error("Error in fetchWebSearchResults:", err);
    return `[Live Web Search Error]: Failed to fetch web search results (${err?.message || String(err)})`;
  }
}

/**
 * Extracts YouTube Video ID from URL or prompt text
 */
export function extractYouTubeVideoId(input: string): string | null {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = input.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

/**
 * Fetches YouTube video snippet, content details, tags, and statistics for AI summarization
 */
export async function fetchYouTubeVideoDetails(token: string | null, videoId: string): Promise<string> {
  try {
    const apiKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY || "";
    let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(videoId)}`;
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token && !token.includes("active_token")) {
      headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(url, { headers });

    // Fallback to server proxy if direct call fails
    if (!res.ok) {
      const serverRes = await fetch(`/api/youtube/video?id=${encodeURIComponent(videoId)}`, {
        headers: (token && !token.includes("active_token")) ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => null);
      if (serverRes && serverRes.ok) {
        res = serverRes;
      }
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[YouTube Data Notice]: Unable to fetch video details for ID "${videoId}" (HTTP ${res.status}): ${errData.error?.message || "Ensure YouTube Data API key is configured or valid."}`;
    }

    const data = await res.json();
    const items = data.items || [];
    if (items.length === 0) {
      return `[LIVE YOUTUBE DATA]: Connected to YouTube API, but no video details were found for ID: "${videoId}".`;
    }

    const video = items[0];
    const snippet = video.snippet || {};
    const stats = video.statistics || {};
    const contentDetails = video.contentDetails || {};

    const title = snippet.title || "Untitled Video";
    const channel = snippet.channelTitle || "Unknown Channel";
    const publishedAt = snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : "Unknown";
    const tags = Array.isArray(snippet.tags) ? snippet.tags.slice(0, 12).join(", ") : "None";
    const description = snippet.description || "No description provided.";
    const views = stats.viewCount ? parseInt(stats.viewCount, 10).toLocaleString() : "N/A";
    const likes = stats.likeCount ? parseInt(stats.likeCount, 10).toLocaleString() : "N/A";

    return `[LIVE YOUTUBE VIDEO METADATA FOR SUMMARY]:
• Video Title: "${title}"
• Channel: ${channel}
• Published Date: ${publishedAt}
• Views: ${views} | Likes: ${likes}
• Duration: ${contentDetails.duration || "N/A"}
• Video URL: https://www.youtube.com/watch?v=${videoId}
• Video Tags: ${tags}
• Full Video Description:
${description.slice(0, 1500)}

[MANDATORY AI INSTRUCTION]: The user provided a YouTube video link or requested a video summary. Using the detailed title, channel name, video tags, and complete description above, provide a thorough, elegant, and well-structured summary of what this video covers!`;
  } catch (err: any) {
    console.error("Error in fetchYouTubeVideoDetails:", err);
    return `[YouTube API Error]: Failed to fetch video details (${err?.message || String(err)})`;
  }
}

/**
 * Searches YouTube for video recommendations based on query
 */
export async function searchYouTubeVideos(token: string | null, userPrompt: string): Promise<string> {
  try {
    let cleanQuery = userPrompt
      .replace(/(find|search|show|get|recommend|look for|find me|give me)\s+/gi, "")
      .replace(/(python|coding|tech|video|videos|tutorial|tutorials|course|playlist)\s+(on|in|from|about)\s+(youtube)/gi, "$1")
      .replace(/on youtube|in youtube|youtube video|youtube videos|youtube/gi, "")
      .trim();

    if (!cleanQuery || cleanQuery.length < 2) {
      cleanQuery = userPrompt.trim();
    }

    const apiKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY || "";
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(cleanQuery)}&maxResults=5`;
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token && !token.includes("active_token")) {
      headers.Authorization = `Bearer ${token}`;
    }

    let res = await fetch(url, { headers });

    // Fallback to server proxy if direct call fails
    if (!res.ok) {
      const serverRes = await fetch(`/api/youtube/search?q=${encodeURIComponent(cleanQuery)}`, {
        headers: (token && !token.includes("active_token")) ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => null);
      if (serverRes && serverRes.ok) {
        res = serverRes;
      }
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[YouTube Data Notice]: Unable to search videos for query "${cleanQuery}" (HTTP ${res.status}): ${errData.error?.message || "YouTube API search unavailable."}`;
    }

    const data = await res.json();
    const items = data.items || [];
    if (items.length === 0) {
      return `[LIVE YOUTUBE SEARCH RESULTS]: Connected to YouTube API, but no videos were found for search query: "${cleanQuery}".`;
    }

    const formattedVideos = items.map((item: any, idx: number) => {
      const vId = item.id?.videoId || item.id;
      const snippet = item.snippet || {};
      const title = snippet.title || "YouTube Video";
      const channel = snippet.channelTitle || "YouTube Channel";
      const description = snippet.description || "No description";
      const publishedAt = snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : "";
      return `[Video ${idx + 1}]: "${title}"\n  Channel: ${channel} (${publishedAt})\n  URL: https://www.youtube.com/watch?v=${vId}\n  Snippet: ${description.slice(0, 200)}`;
    });

    return `[LIVE YOUTUBE SEARCH RESULTS FOR: "${cleanQuery}"]\n\n${formattedVideos.join("\n\n")}\n\n[MANDATORY AI INSTRUCTION]: Present these top YouTube video recommendations clearly to the user with title, channel name, and clickable YouTube links (e.g. [Video Title](url)).`;
  } catch (err: any) {
    console.error("Error in searchYouTubeVideos:", err);
    return `[YouTube API Error]: Failed to search YouTube videos (${err?.message || String(err)})`;
  }
}

/**
 * Executes a custom REST API / Webhook call (GET/POST) with custom headers
 */
export async function executeCustomWebhook(webhook: CustomWebhookConfig, userPrompt: string): Promise<string> {
  try {
    console.log(`[Connectors] Executing Custom Webhook/REST API "${webhook.name}" (${webhook.method} ${webhook.url})`);

    const headersObj: Record<string, string> = {};
    if (webhook.headers && webhook.headers.trim()) {
      const trimmed = webhook.headers.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          Object.assign(headersObj, JSON.parse(trimmed));
        } catch {
          // ignore JSON parse error
        }
      }
      if (Object.keys(headersObj).length === 0) {
        const lines = trimmed.split("\n");
        for (const line of lines) {
          const colonIdx = line.indexOf(":");
          if (colonIdx > 0) {
            const key = line.substring(0, colonIdx).trim();
            const val = line.substring(colonIdx + 1).trim();
            if (key && val) headersObj[key] = val;
          }
        }
      }
    }

    let requestBody = webhook.body || "";
    if (webhook.method === "POST" && !requestBody) {
      requestBody = JSON.stringify({
        prompt: userPrompt,
        timestamp: new Date().toISOString(),
        source: "V-Astra AI Companion"
      });
    }

    const res = await fetch("/api/custom-webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhook.url,
        method: webhook.method,
        headers: headersObj,
        body: webhook.method === "POST" ? requestBody : undefined,
        prompt: userPrompt
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return `[CUSTOM REST API / WEBHOOK NOTICE]: Unable to fetch data from "${webhook.name}" (${webhook.url}) - HTTP ${res.status}: ${errData.error || "API unavailable"}`;
    }

    const data = await res.json();
    const status = data.status || 200;
    const responsePayload = data.data;

    let formattedData = "";
    if (typeof responsePayload === "object") {
      formattedData = JSON.stringify(responsePayload, null, 2);
    } else {
      formattedData = String(responsePayload);
    }

    return `[LIVE CUSTOM REST API / WEBHOOK RESPONSE FOR: "${webhook.name}"]
• API Name: ${webhook.name}
• Endpoint URL: ${webhook.url}
• HTTP Method: ${webhook.method}
• HTTP Status: ${status} OK
• Response Payload / Data:
\`\`\`json
${formattedData.slice(0, 3000)}
\`\`\`

[MANDATORY AI INSTRUCTION]: The custom REST API / webhook endpoint "${webhook.name}" was triggered successfully and returned the response data above. Use this live data directly to answer the user's question, fulfill their query, or confirm sending data!`;
  } catch (err: any) {
    console.error("Error in executeCustomWebhook:", err);
    return `[Custom Webhook Error]: Failed to call webhook "${webhook.name}" (${err?.message || String(err)})`;
  }
}

// Helper to extract Spreadsheet ID from user prompt or URL
function extractSpreadsheetId(prompt: string): string | null {
  const urlMatch = prompt.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];
  const idMatch = prompt.match(/\b([a-zA-Z0-9-_]{25,})\b/);
  if (idMatch && !prompt.includes("http")) return idMatch[1];
  return null;
}

// Helper to extract Document ID from user prompt or URL
function extractDocumentId(prompt: string): string | null {
  const urlMatch = prompt.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) return urlMatch[1];
  return null;
}

/**
 * Fetches math & science solutions via Wolfram Alpha API (or server proxy)
 */
export async function fetchWolframAlphaResult(userPrompt: string): Promise<string> {
  try {
    let query = userPrompt
      .replace(/(solve|calculate|evaluate|compute|ask wolfram|wolfram alpha|wolfram|what is the value of|find the value of)\s*/gi, "")
      .trim();

    if (!query || query.length < 2) {
      query = userPrompt.trim();
    }

    const appId =
      (import.meta as any).env?.VITE_WOLFRAM_APP_ID ||
      (import.meta as any).env?.WOLFRAM_APP_ID ||
      (typeof process !== "undefined" ? (process.env.VITE_WOLFRAM_APP_ID || process.env.WOLFRAM_APP_ID) : "");

    console.log(`[Connectors] Executing Wolfram Alpha query: "${query}"`);

    let resultText = "";
    if (appId) {
      const directUrl = `https://api.wolframalpha.com/v1/result?appid=${encodeURIComponent(appId)}&i=${encodeURIComponent(query)}`;
      const res = await fetch(directUrl);
      if (res.ok) {
        resultText = await res.text();
      }
    }

    if (!resultText) {
      const serverRes = await fetch(`/api/wolfram?q=${encodeURIComponent(query)}`);
      if (serverRes.ok) {
        resultText = await serverRes.text();
      } else {
        const errText = await serverRes.text().catch(() => "");
        return `[Wolfram Alpha Notice]: Unable to compute result (${errText || `HTTP ${serverRes.status}`}). Ensure VITE_WOLFRAM_APP_ID is configured in Secrets.`;
      }
    }

    return `[LIVE WOLFRAM ALPHA COMPUTATION RESULT FOR: "${query}"]:\n${resultText}\n\n[MANDATORY AI INSTRUCTION]: Use the exact Wolfram Alpha computational result above to answer the user's math, physics, or science problem accurately with step-by-step mathematical reasoning.`;
  } catch (err: any) {
    console.error("Error in fetchWolframAlphaResult:", err);
    return `[Wolfram Alpha API Error]: ${err?.message || String(err)}`;
  }
}

/**
 * Intelligent Intent Execution Layer
 * Executes real API requests to connected services before generating LLM responses
 */
export async function processConnectorIntent(
  userPrompt: string,
  connectors: ConnectorConfig[]
): Promise<string | null> {
  const lowerPrompt = userPrompt.toLowerCase();
  const contexts: string[] = [];

  // Helper to check active & connected connector
  const isEnabled = (id: ConnectorId) => {
    const conn = connectors.find((c) => c.id === id);
    return conn && conn.connected && conn.active && !!conn.accessToken;
  };

  const getConnector = (id: ConnectorId) => connectors.find((c) => c.id === id);

  // 1. GOOGLE SHEETS INTENT
  if (
    isEnabled("google_sheets") &&
    /(sheet|spreadsheet|excel|csv|cell|column|row|table|budget|value|add a new row|summarize my budget|google sheet)/i.test(userPrompt)
  ) {
    const conn = getConnector("google_sheets")!;
    const token = conn.accessToken!;

    try {
      let sheetId = extractSpreadsheetId(userPrompt);

      // If no ID is explicitly in prompt, search Drive for recent spreadsheets
      if (!sheetId) {
        const driveSearchRes = await fetch(
          "https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.spreadsheet'+and+trashed%3Dfalse&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (driveSearchRes.ok) {
          const searchData = await driveSearchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            sheetId = searchData.files[0].id;
            contexts.push(`[Google Sheets API - Active Sheet Found]: "${searchData.files[0].name}" (ID: ${sheetId})`);
          }
        }
      }

      if (sheetId) {
        // Check if user wants to ADD a row
        if (/(add|insert|append|new row|create row|log)/i.test(lowerPrompt)) {
          // Attempt to append values if values can be parsed or pass prompt intent
          const appendRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                values: [
                  [new Date().toLocaleDateString(), "User Entry via V-Astra AI", userPrompt.slice(0, 100)]
                ]
              })
            }
          );
          if (appendRes.ok) {
            const appendData = await appendRes.json();
            contexts.push(
              `[Google Sheets Action Success]: Appended new row to Spreadsheet ID (${sheetId}). Updated Range: ${appendData.updates?.updatedRange}`
            );
          }
        }

        // Fetch values from spreadsheet A1:Z50
        const valuesRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (valuesRes.ok) {
          const valuesData = await valuesRes.json();
          const rows = valuesData.values || [];
          const formattedRows = rows
            .slice(0, 35)
            .map((r: string[], idx: number) => `Row ${idx + 1}: ${r.join(" | ")}`)
            .join("\n");

          contexts.push(
            `[LIVE GOOGLE SHEETS CONTENT - ID: ${sheetId}]:\nRange: ${valuesData.range || "A1:Z50"}\nData Rows:\n${formattedRows || "(Empty sheet)"}`
          );
        } else {
          contexts.push(`[Google Sheets Notice]: Could not read spreadsheet values (HTTP ${valuesRes.status}).`);
        }
      } else {
        contexts.push("[Google Sheets Notice]: Google Sheets connector active, but no spreadsheet file was found in Google Drive.");
      }
    } catch (err) {
      console.error("Google Sheets API execution error:", err);
      contexts.push(`[Google Sheets Error]: ${err instanceof Error ? err.message : "API Call failed"}`);
    }
  }

  // 2. GOOGLE DOCS / DRIVE INTENT
  if (
    (isEnabled("google_docs") || isEnabled("google_drive")) &&
    /(doc|docs|document|documents|drive|file|pdf|folder|read document|read doc|read my doc|summarize doc|find files|search drive|my documents|my files|my doc)/i.test(userPrompt)
  ) {
    const driveConn = getConnector("google_drive");
    const docsConn = getConnector("google_docs");
    const token = docsConn?.accessToken || driveConn?.accessToken;

    if (token) {
      try {
        let docId = extractDocumentId(userPrompt);

        // If asking explicitly about reading or summarizing a document
        if (isEnabled("google_docs") && (docId || /(doc|docs|document|documents|read|summarize)/i.test(userPrompt))) {
          // If no doc ID in prompt, search Drive API for matching Google Docs files
          if (!docId) {
            const matchDocTitle = userPrompt.match(/(?:read|open|check|summarize|get)\s+(?:doc|document)\s+["']?([^"'\.\n\?]+)["']?/i);
            let searchQ = "mimeType='application/vnd.google-apps.document' and trashed=false";
            if (matchDocTitle && matchDocTitle[1] && matchDocTitle[1].trim().length > 1) {
              const cleanTitle = matchDocTitle[1].trim().replace(/'/g, "\\'");
              searchQ += ` and name contains '${cleanTitle}'`;
            }

            const driveSearchRes = await fetch(
              `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQ)}&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (driveSearchRes.ok) {
              const searchData = await driveSearchRes.json();
              if (searchData.files && searchData.files.length > 0) {
                docId = searchData.files[0].id;
              } else if (searchQ.includes("name contains")) {
                // Fallback to searching any recent Google Doc
                const fallbackRes = await fetch(
                  "https://www.googleapis.com/drive/v3/files?q=mimeType%3D'application%2Fvnd.google-apps.document'+and+trashed%3Dfalse&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)",
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                if (fallbackRes.ok) {
                  const fallbackData = await fallbackRes.json();
                  if (fallbackData.files && fallbackData.files.length > 0) {
                    docId = fallbackData.files[0].id;
                  }
                }
              }
            }
          }

          if (docId) {
            // Call Google Docs API https://docs.googleapis.com/v1/documents/{documentId}
            const docRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (docRes.ok) {
              const docData = await docRes.json();
              let textContent = "";
              const bodyElements = docData.body?.content || [];
              for (const elem of bodyElements) {
                if (elem.paragraph) {
                  for (const run of elem.paragraph.elements || []) {
                    if (run.textRun?.content) textContent += run.textRun.content;
                  }
                } else if (elem.table) {
                  for (const row of elem.table.tableRows || []) {
                    for (const cell of row.tableCells || []) {
                      for (const cellElem of cell.content || []) {
                        if (cellElem.paragraph) {
                          for (const run of cellElem.paragraph.elements || []) {
                            if (run.textRun?.content) textContent += run.textRun.content + " ";
                          }
                        }
                      }
                      textContent += " | ";
                    }
                    textContent += "\n";
                  }
                }
              }

              contexts.push(
                `[LIVE GOOGLE DOCS CONTENT - Title: "${docData.title}" (ID: ${docId})]:\n${textContent.trim().slice(0, 4000) || "(Document is empty)"}`
              );
            } else {
              contexts.push(`[Google Docs API Notice]: Found document ID (${docId}) but Google Docs API returned HTTP ${docRes.status}.`);
            }
          }
        }

        // Also fetch general Drive files list if Drive connector is enabled or requested
        if (isEnabled("google_drive") && (/(drive|files|folder|my drive|list files)/i.test(userPrompt) || !docId)) {
          const driveRes = await fetch(
            "https://www.googleapis.com/drive/v3/files?q=trashed%3Dfalse&pageSize=8&orderBy=recency+desc&fields=files(id,name,mimeType,modifiedTime,webViewLink)",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (driveRes.ok) {
            const driveData = await driveRes.json();
            const fileList = (driveData.files || [])
              .map((f: { name: string; mimeType: string; modifiedTime: string; id: string }) =>
                `- ${f.name} [Type: ${f.mimeType.replace("application/vnd.google-apps.", "")}] (ID: ${f.id})`
              )
              .join("\n");

            contexts.push(`[LIVE GOOGLE DRIVE FILES LIST]:\n${fileList || "No recent files found."}`);
          }
        }
      } catch (err) {
        console.error("Google Drive/Docs API execution error:", err);
        contexts.push(`[Google Drive/Docs Error]: ${err instanceof Error ? err.message : "API Call failed"}`);
      }
    }
  }

  // 3. GMAIL INTENT
  if (
    isEnabled("gmail") &&
    /(email|emails|gmail|inbox|mail|mails|message|messages|check my last emails|project emails|recent email|unread email|check my email|read my emails)/i.test(userPrompt)
  ) {
    const conn = getConnector("gmail")!;
    const token = conn.accessToken!;

    try {
      // Call Gmail API https://gmail.googleapis.com/gmail/v1/users/me/messages
      const messagesListRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (messagesListRes.ok) {
        const listData = await messagesListRes.json();
        const messageIds: Array<{ id: string }> = listData.messages || [];

        const messageDetails: string[] = [];

        for (const item of messageIds.slice(0, 5)) {
          const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (detailRes.ok) {
            const msg = await detailRes.json();
            const headers = msg.payload?.headers || [];
            const subject = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === "subject")?.value || "No Subject";
            const from = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
            const date = headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === "date")?.value || "";
            const snippet = msg.snippet || "";

            messageDetails.push(`• From: ${from}\n  Subject: ${subject}\n  Date: ${date}\n  Snippet: ${snippet}`);
          }
        }

        contexts.push(
          `[LIVE GMAIL INBOX RECENT MESSAGES]:\n${messageDetails.join("\n\n") || "No messages found in inbox."}`
        );
      } else {
        contexts.push(`[Gmail Notice]: Unable to access Gmail messages (HTTP ${messagesListRes.status}). Ensure the Gmail connector is active.`);
      }
    } catch (err) {
      console.error("Gmail API execution error:", err);
      contexts.push(`[Gmail Error]: ${err instanceof Error ? err.message : "API Call failed"}`);
    }
  }

  // 4. GITHUB INTENT
  if (
    isEnabled("github") &&
    /(github|repo|repos|repository|repositories|commit|commits|issue|issues|pull request|pr|code|branch)/i.test(userPrompt)
  ) {
    const conn = getConnector("github")!;
    const token = conn.accessToken!;

    try {
      const githubContexts: string[] = [];

      // Check if user specifically asks for issues/bugs/prs
      if (/(issue|issues|bug|bugs|pr|pull request)/i.test(userPrompt)) {
        const issuesRes = await fetch("https://api.github.com/user/issues?state=all&per_page=10", {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          const issueSummaries = issuesData
            .map(
              (i: { number: number; title: string; state: string; repository?: { full_name: string }; created_at: string; html_url: string }) =>
                `• [#${i.number}] ${i.title} (${i.state}) - Repo: ${i.repository?.full_name || "N/A"}\n  Created: ${i.created_at}\n  URL: ${i.html_url}`
            )
            .join("\n\n");
          githubContexts.push(`[LIVE GITHUB ISSUES & PULL REQUESTS]:\n${issueSummaries || "No issues found."}`);
        }
      }

      // Fetch user's GitHub repositories if requested or if issues were not exclusively asked
      if (/(repo|repos|repository|repositories|github|code)/i.test(userPrompt) || githubContexts.length === 0) {
        const reposRes = await fetch("https://api.github.com/user/repos?sort=updated&per_page=8", {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          const repoSummaries = reposData
            .map(
              (r: { name: string; full_name: string; open_issues_count: number; updated_at: string; html_url: string; description: string; stargazers_count: number }) =>
                `• ${r.full_name}: ${r.description || "No description"} (${r.open_issues_count} open issues, ${r.stargazers_count} stars) [URL: ${r.html_url}]`
            )
            .join("\n");

          githubContexts.push(`[LIVE GITHUB REPOSITORIES]:\n${repoSummaries || "No repositories found."}`);
        }
      }

      if (githubContexts.length > 0) {
        contexts.push(githubContexts.join("\n\n"));
      }
    } catch (err) {
      console.error("GitHub API execution error:", err);
      contexts.push(`[GitHub Error]: ${err instanceof Error ? err.message : "API Call failed"}`);
    }
  }

  // 5. NOTION INTENT
  if (
    isEnabled("notion") &&
    /(notion|notion note|notion notes|notion task|notion tasks|my notes|study task|create note|create task in notion|search notion|add note to notion|show my notion|my notion pages|note in notion|task in notion)/i.test(userPrompt)
  ) {
    const conn = getConnector("notion")!;
    const token = conn.accessToken!;

    try {
      if (
        /(create|add|new|make|save|write|insert)\s+.*(note|task|page|item).*(in|to|on)?\s*notion/i.test(userPrompt) ||
        /(create|add|new|make)\s+a?\s*.*(task|note)\s+in\s+notion/i.test(userPrompt) ||
        lowerPrompt.includes("task in notion") ||
        lowerPrompt.includes("note in notion")
      ) {
        const creationResult = await createNotionPageOrTask(token, userPrompt);
        contexts.push(creationResult);
      } else {
        const searchResult = await fetchNotionSearchResults(token, userPrompt);
        contexts.push(searchResult);
      }
    } catch (err) {
      console.error("Notion intent processing error:", err);
      contexts.push(`[Notion Error]: ${err instanceof Error ? err.message : "Notion API failed"}`);
    }
  }

  // 6. GOOGLE CALENDAR INTENT
  if (
    isEnabled("google_calendar") &&
    /(calendar|event|events|schedule|reminder|reminders|meeting|meetings|exam|exams|add event|create event|schedule event|what are my events|my calendar|my schedule|today's schedule|exam reminder)/i.test(userPrompt)
  ) {
    const conn = getConnector("google_calendar")!;
    const token = conn.accessToken!;

    try {
      if (
        /(add|create|schedule|set|insert|put|book|new)\s+.*(event|reminder|meeting|exam|appointment|schedule)/i.test(userPrompt) ||
        /(add|schedule)\s+an?\s+(exam|reminder|event)/i.test(userPrompt) ||
        lowerPrompt.includes("add an exam") ||
        lowerPrompt.includes("add event") ||
        lowerPrompt.includes("create event") ||
        lowerPrompt.includes("schedule event") ||
        lowerPrompt.includes("add reminder") ||
        lowerPrompt.includes("exam reminder")
      ) {
        const creationResult = await createGoogleCalendarEvent(token, userPrompt);
        contexts.push(creationResult);
      } else {
        const fetchResult = await fetchGoogleCalendarEvents(token, userPrompt);
        contexts.push(fetchResult);
      }
    } catch (err) {
      console.error("Google Calendar intent processing error:", err);
      contexts.push(`[Google Calendar Error]: ${err instanceof Error ? err.message : "Google Calendar API failed"}`);
    }
  }

  // 7. GOOGLE TASKS INTENT
  if (
    isEnabled("google_tasks") &&
    /(task|tasks|todo|to-do|task list|todo list|to-do list|show my task|show my tasks|show my todo|add.*to my todo|add.*to my task|my tasks|my todos|my task list|tasklist)/i.test(userPrompt)
  ) {
    const conn = getConnector("google_tasks")!;
    const token = conn.accessToken!;

    try {
      if (
        /(add|create|insert|put|append|save|new)\s+.*(task|todo|to-do|item|list)/i.test(userPrompt) ||
        /(add|create)\s+.*to\s+my\s+(todo|task|to-do)/i.test(userPrompt) ||
        lowerPrompt.includes("add buy milk") ||
        lowerPrompt.includes("add task") ||
        lowerPrompt.includes("create task") ||
        lowerPrompt.includes("add to my todo list") ||
        lowerPrompt.includes("add to my task list")
      ) {
        const creationResult = await createGoogleTask(token, userPrompt);
        contexts.push(creationResult);
      } else {
        const fetchResult = await fetchGoogleTasks(token, userPrompt);
        contexts.push(fetchResult);
      }
    } catch (err) {
      console.error("Google Tasks intent processing error:", err);
      contexts.push(`[Google Tasks Error]: ${err instanceof Error ? err.message : "Google Tasks API failed"}`);
    }
  }

  // 8. GOOGLE FORMS INTENT
  if (
    isEnabled("google_forms") &&
    /(form|forms|quiz|quizzes|survey|surveys|google form|google forms|create form|create a form|create quiz|summarize form|form response|form responses|quiz response|quiz responses)/i.test(userPrompt)
  ) {
    const conn = getConnector("google_forms")!;
    const token = conn.accessToken!;

    try {
      if (
        /(create|add|build|make|generate|new|construct)\s+.*(form|quiz|survey)/i.test(userPrompt) ||
        lowerPrompt.includes("create a form") ||
        lowerPrompt.includes("create a quiz") ||
        lowerPrompt.includes("create form") ||
        lowerPrompt.includes("create quiz") ||
        lowerPrompt.includes("make a form") ||
        lowerPrompt.includes("make a quiz") ||
        lowerPrompt.includes("build a form")
      ) {
        const creationResult = await createGoogleForm(token, userPrompt);
        contexts.push(creationResult);
      } else {
        const fetchResult = await fetchGoogleFormResponses(token, userPrompt);
        contexts.push(fetchResult);
      }
    } catch (err) {
      console.error("Google Forms intent processing error:", err);
      contexts.push(`[Google Forms Error]: ${err instanceof Error ? err.message : "Google Forms API failed"}`);
    }
  }

  // 9. LIVE WEATHER INTENT
  if (
    isEnabled("live_weather") &&
    (
      /(weather|temperature|rain|rainfall|forecast|climate|wind|humidity|cloud|sun|degree|celsius|kochi|trivandrum|mumbai|delhi|london|tokyo|paris|new york|will it rain|weather in|how hot|how cold|is it raining)/i.test(userPrompt) ||
      lowerPrompt.includes("weather") ||
      lowerPrompt.includes("temperature") ||
      lowerPrompt.includes("rain") ||
      lowerPrompt.includes("forecast")
    )
  ) {
    try {
      const weatherResult = await fetchLiveWeatherData(userPrompt);
      contexts.push(weatherResult);
    } catch (err) {
      console.error("Live weather intent processing error:", err);
      contexts.push(`[Live Weather Error]: ${err instanceof Error ? err.message : "Live weather API failed"}`);
    }
  }

  // 10. TELEGRAM BOT INTENT
  if (
    isEnabled("telegram") &&
    (
      /(telegram|send to telegram|send to my telegram|forward to telegram|forward to my telegram|alert me on telegram|notify telegram|send summary to telegram|send code to telegram|post to telegram|telegram bot|telegram chat)/i.test(userPrompt) ||
      lowerPrompt.includes("telegram")
    )
  ) {
    const tgConfig = getTelegramConfig();
    const conn = getConnector("telegram");
    const botToken = tgConfig.botToken || conn?.accessToken;
    const chatId = tgConfig.chatId;

    if (!botToken || !chatId) {
      contexts.push(`[Telegram Notice]: Telegram connector is active, but Telegram Bot Token or Chat ID is not configured in Settings > Connectors. Please configure your Bot Token and Chat ID.`);
    } else {
      let contentToSend = userPrompt;
      const sendMatch = userPrompt.match(/(?:send|forward|alert|notify|post)\s+(?:this|the|a)?\s*(?:summary|code|note|message|alert|reminder)?\s*(?:to|on)\s*(?:my\s*)?telegram[:\s]*(.*)/i);
      if (sendMatch && sendMatch[1] && sendMatch[1].trim().length > 0) {
        contentToSend = sendMatch[1].trim();
      }

      try {
        const tgResult = await sendTelegramMessage(botToken, chatId, contentToSend);
        contexts.push(tgResult);
      } catch (err) {
        console.error("Telegram intent processing error:", err);
        contexts.push(`[Telegram Error]: ${err instanceof Error ? err.message : "Failed to send message to Telegram"}`);
      }
    }
  }

  // 8. LIVE WEB SEARCH INTENT
  if (
    isEnabled("web_search") &&
    (
      /(search|search for|search the web|latest news|news today|current weather|weather in|latest tech|tech updates|latest updates|who won|today's news|stock price|real-time|live score|what is the price|who is the current|latest info|find online|browse the web)/i.test(userPrompt) ||
      lowerPrompt.includes("latest news today") ||
      lowerPrompt.includes("weather in kochi") ||
      lowerPrompt.includes("latest tech updates") ||
      lowerPrompt.startsWith("search") ||
      lowerPrompt.startsWith("find") ||
      lowerPrompt.startsWith("what is the latest")
    )
  ) {
    try {
      const searchResult = await fetchWebSearchResults(userPrompt);
      contexts.push(searchResult);
    } catch (err) {
      console.error("Web Search intent processing error:", err);
      contexts.push(`[Web Search Error]: ${err instanceof Error ? err.message : "Web Search API failed"}`);
    }
  }

  // 9. YOUTUBE DATA INTENT
  const extractedVideoId = extractYouTubeVideoId(userPrompt);
  const isYouTubeSearch =
    /(youtube|find.*video|search.*video|python tutorial|tutorial on youtube|video recommendation|recommend.*video|watch on youtube|show.*video)/i.test(userPrompt) ||
    lowerPrompt.includes("find python tutorials on youtube") ||
    lowerPrompt.includes("youtube.com") ||
    lowerPrompt.includes("youtu.be");

  if (isEnabled("youtube") && (extractedVideoId || isYouTubeSearch)) {
    const conn = getConnector("youtube");
    const token = conn?.accessToken || null;

    try {
      if (extractedVideoId) {
        const videoInfoResult = await fetchYouTubeVideoDetails(token, extractedVideoId);
        contexts.push(videoInfoResult);
      } else {
        const searchResult = await searchYouTubeVideos(token, userPrompt);
        contexts.push(searchResult);
      }
    } catch (err) {
      console.error("YouTube Data intent processing error:", err);
      contexts.push(`[YouTube API Error]: ${err instanceof Error ? err.message : "YouTube API call failed"}`);
    }
  }

  // 10. CUSTOM WEBHOOK / REST API INTENT
  if (isEnabled("custom_webhook")) {
    const webhooks = loadCustomWebhooks().filter((w) => w.enabled && w.url);
    if (webhooks.length > 0) {
      const isGeneralWebhookIntent =
        /(custom api|custom endpoint|my api|my webhook|rest api|webhook|send.*to my endpoint|send.*to endpoint|fetch.*custom api|fetch.*from my api|fetch.*from custom api|fetch.*from endpoint|call my api|call api|trigger webhook|trigger my api|post to api|post to webhook|my database)/i.test(userPrompt) ||
        lowerPrompt.includes("fetch data from my custom api") ||
        lowerPrompt.includes("send this summary to my endpoint") ||
        lowerPrompt.includes("trigger my webhook") ||
        lowerPrompt.includes("query my api");

      for (const webhook of webhooks) {
        const matchesName = webhook.name && lowerPrompt.includes(webhook.name.toLowerCase());
        if (isGeneralWebhookIntent || matchesName) {
          try {
            const webhookResult = await executeCustomWebhook(webhook, userPrompt);
            contexts.push(webhookResult);
          } catch (err) {
            console.error(`Error processing webhook ${webhook.name}:`, err);
            contexts.push(`[Webhook Error]: Failed to call ${webhook.name}`);
          }
        }
      }
    }
  }

  // 11. WOLFRAM ALPHA INTENT
  if (
    isEnabled("wolfram_alpha") &&
    (
      /(wolfram|math|science|solve|calculate|integral|derivative|equation|physics|chemistry|formula|limit|matrix|factor|simplify|evaluate|sqrt|plot|graph|convert|molar mass|speed of light|distance to|computation)/i.test(userPrompt) ||
      /[\d\+\-\*\/\^\=]{3,}/.test(userPrompt) ||
      lowerPrompt.includes("wolfram") ||
      lowerPrompt.includes("solve") ||
      lowerPrompt.includes("calculate") ||
      lowerPrompt.includes("integrate") ||
      lowerPrompt.includes("differentiate")
    )
  ) {
    try {
      const wolframResult = await fetchWolframAlphaResult(userPrompt);
      contexts.push(wolframResult);
    } catch (err) {
      console.error("Wolfram Alpha intent processing error:", err);
      contexts.push(`[Wolfram Alpha Error]: ${err instanceof Error ? err.message : "Wolfram Alpha request failed"}`);
    }
  }

  // 12. SCISPACE RESEARCH PAPERS INTENT
  if (
    isEnabled("scispace") &&
    (
      /(scispace|research paper|scientific paper|arxiv|journal article|literature review|DOI|citation|abstract|peer-reviewed|academic paper|find papers|search paper)/i.test(userPrompt) ||
      lowerPrompt.includes("scispace") ||
      lowerPrompt.includes("research paper") ||
      lowerPrompt.includes("scientific paper")
    )
  ) {
    try {
      const paperSearchRes = await fetchWebSearchResults(`site:typeset.io OR site:arxiv.org OR scientific research papers ${userPrompt}`);
      contexts.push(`[SCISPACE RESEARCH PAPER SEARCH CONTEXT]:\n${paperSearchRes}\n\n[MANDATORY AI INSTRUCTION]: Provide a thorough, academic analysis of relevant scientific research papers, abstracts, methodologies, findings, and citations based on the SciSpace search context.`);
    } catch (err) {
      console.error("SciSpace intent processing error:", err);
      contexts.push(`[SciSpace Status]: SciSpace active (Powered by Web-Search).`);
    }
  }

  // 13. CONSENSUS EVIDENCE-BASED RESEARCH INTENT
  if (
    isEnabled("consensus") &&
    (
      /(consensus|evidence-based|evidence based|scientific consensus|meta-analysis|systematic review|what does research say|scientific evidence|what does science say)/i.test(userPrompt) ||
      lowerPrompt.includes("consensus")
    )
  ) {
    try {
      const consensusRes = await fetchWebSearchResults(`site:consensus.app OR evidence-based scientific research ${userPrompt}`);
      contexts.push(`[CONSENSUS EVIDENCE-BASED RESEARCH CONTEXT]:\n${consensusRes}\n\n[MANDATORY AI INSTRUCTION]: Synthesize an evidence-based answer summarizing key scientific research findings, study consensuses, and paper citations based on the Consensus search context.`);
    } catch (err) {
      console.error("Consensus intent processing error:", err);
      contexts.push(`[Consensus Status]: Consensus active (Powered by Web-Search).`);
    }
  }

  if (contexts.length === 0) return null;
  return contexts.join("\n\n");
}
