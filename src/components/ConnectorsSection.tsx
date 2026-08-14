import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HardDrive,
  Mail,
  FileText,
  Table,
  Github,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Key,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Power,
  Info,
  Sliders,
  X,
  Check,
  Sparkles,
  Webhook,
  Plus,
  Trash2,
  Edit3,
  Play,
  Send
} from "lucide-react";
import { ConnectorConfig, ConnectorId, CustomWebhookConfig } from "../types";
import {
  buildOAuthUrl,
  fetchUserInfo,
  getCustomClientIds,
  saveCustomClientIds,
  getEffectiveClientId,
  loadCustomWebhooks,
  saveCustomWebhooks,
  getTelegramConfig,
  saveTelegramConfig,
} from "../lib/connectors";

export const GoogleDriveLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Drive_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Drive"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const GmailLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Gmail_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Gmail"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const GoogleDocsLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/1/18/Google_Docs_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Docs"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const GoogleSheetsLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Sheets_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Sheets"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const GitHubLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current text-slate-900 dark:text-white shrink-0 object-contain ${className}`}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const NotionLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Notion"
    className={`w-6 h-6 object-contain shrink-0 ${className} dark:invert`}
  />
);

export const GoogleCalendarLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Google_Calendar_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Calendar"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const GoogleTasksLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Google_Tasks_Logo_05.2026.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Tasks"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const WebSearchLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 shrink-0 object-contain ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" className="text-sky-500" stroke="#0ea5e9" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" stroke="#0284c7" />
    <path d="M2 12h20" stroke="#38bdf8" />
  </svg>
);

export const GoogleFormsLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Google_Forms_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
    alt="Google Forms"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const WeatherLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://cdn.iconscout.com/icon/premium/png-512-thumb/weather-icon-svg-download-png-7912210.png?f=webp&w=512"
    alt="Live Weather & Environment"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const TelegramLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
    alt="Telegram Bot Integration"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const WolframAlphaLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://img.icons8.com/?size=100&id=13667&format=png&color=000000"
    alt="Wolfram Alpha"
    className={`w-6 h-6 object-contain shrink-0 ${className} dark:invert`}
  />
);

export const SciSpaceLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <img
    src="https://cdn.brandfetch.io/id7JyHyG4o/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1767144754268"
    alt="SciSpace"
    className={`w-6 h-6 object-contain shrink-0 ${className}`}
  />
);

export const ConsensusLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 object-contain shrink-0 ${className}`}>
    <path
      d="M32 43.5C32 25 46.5 10 65 10 C81 10 94 21 98 37 C85.5 46 68.5 50.5 48 48 C38.5 46.8 33.5 44.8 32 43.5Z"
      fill="#008BFF"
    />
    <path
      d="M30 50.5C36 52.5 45 54 56 53 C77 51 95.5 61.5 101.5 73.5 C94 92.5 76 105 54 105 C35.5 105 19.5 92 16 74.5 L 3.5 87.5 C 2 89 -0.5 87 0 85 L 6.5 62 C 10 52 19 49.5 30 50.5 Z"
      fill="#00D09C"
    />
  </svg>
);

export const YoutubeLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`w-6 h-6 shrink-0 object-contain ${className}`}>
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
    <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface ConnectorsSectionProps {
  connectors: ConnectorConfig[];
  onUpdateConnectors: (updated: ConnectorConfig[]) => void;
  showToast: (msg: string) => void;
}

export default function ConnectorsSection({
  connectors,
  onUpdateConnectors,
  showToast,
}: ConnectorsSectionProps) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeModalConnector, setActiveModalConnector] = useState<ConnectorConfig | null>(null);
  const [manualTokenInput, setManualTokenInput] = useState("");

  const customIds = getCustomClientIds();
  const [googleClientId, setGoogleClientId] = useState(customIds.googleClientId || "");
  const [githubClientId, setGithubClientId] = useState(customIds.githubClientId || "");
  const [notionClientId, setNotionClientId] = useState(customIds.notionClientId || "");
  const [notionClientSecret, setNotionClientSecret] = useState(customIds.notionClientSecret || "");
  const [tavilyApiKey, setTavilyApiKey] = useState(customIds.tavilyApiKey || "");
  const [clientIdsSaved, setClientIdsSaved] = useState(false);

  // Custom Webhook Management State
  const [webhooks, setWebhooks] = useState<CustomWebhookConfig[]>(() => loadCustomWebhooks());
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<CustomWebhookConfig | null>(null);

  const [webhookName, setWebhookName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookMethod, setWebhookMethod] = useState<"GET" | "POST">("GET");
  const [webhookHeaders, setWebhookHeaders] = useState("");
  const [webhookBody, setWebhookBody] = useState("");

  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<{ status: number; text: string; isError: boolean } | null>(null);

  // Telegram Bot State
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState(() => getTelegramConfig().botToken || "");
  const [telegramChatId, setTelegramChatId] = useState(() => getTelegramConfig().chatId || "");

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    const token = telegramBotToken.trim();
    const chat = telegramChatId.trim();
    if (!token || !chat) {
      showToast("Please enter both Bot Token and Chat ID");
      return;
    }
    saveTelegramConfig({ botToken: token, chatId: chat });
    const updated = connectors.map((c) => {
      if (c.id === "telegram") {
        return {
          ...c,
          connected: true,
          active: true,
          accessToken: token,
          userEmail: `Chat ID: ${chat}`,
        };
      }
      return c;
    });
    onUpdateConnectors(updated);
    setShowTelegramModal(false);
    showToast("Telegram Bot Integration connected successfully!");
  };

  const handleOpenAddWebhook = () => {
    setEditingWebhook(null);
    setWebhookName("My Database");
    setWebhookUrl("");
    setWebhookMethod("GET");
    setWebhookHeaders("Authorization: Bearer my-secret-token");
    setWebhookBody("");
    setTestResult(null);
    setShowWebhookModal(true);
  };

  const handleOpenEditWebhook = (webhook: CustomWebhookConfig) => {
    setEditingWebhook(webhook);
    setWebhookName(webhook.name);
    setWebhookUrl(webhook.url);
    setWebhookMethod(webhook.method);
    setWebhookHeaders(webhook.headers || "");
    setWebhookBody(webhook.body || "");
    setTestResult(null);
    setShowWebhookModal(true);
  };

  const handleDeleteWebhook = (id: string) => {
    const updated = webhooks.filter((w) => w.id !== id);
    setWebhooks(updated);
    saveCustomWebhooks(updated);
    showToast("Custom Webhook endpoint removed.");
  };

  const handleToggleWebhookEnabled = (id: string) => {
    const updated = webhooks.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
    setWebhooks(updated);
    saveCustomWebhooks(updated);
  };

  const handleSaveWebhookForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookName.trim() || !webhookUrl.trim()) {
      showToast("Please enter an API Name and Endpoint URL.");
      return;
    }

    const newWebhook: CustomWebhookConfig = {
      id: editingWebhook ? editingWebhook.id : `wh_${Date.now()}`,
      name: webhookName.trim(),
      url: webhookUrl.trim(),
      method: webhookMethod,
      headers: webhookHeaders.trim(),
      body: webhookBody.trim(),
      enabled: editingWebhook ? editingWebhook.enabled : true,
    };

    let updated: CustomWebhookConfig[];
    if (editingWebhook) {
      updated = webhooks.map((w) => (w.id === editingWebhook.id ? newWebhook : w));
    } else {
      updated = [...webhooks, newWebhook];
    }

    setWebhooks(updated);
    saveCustomWebhooks(updated);
    setShowWebhookModal(false);
    showToast(`Saved custom webhook "${newWebhook.name}"!`);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      showToast("Enter an Endpoint URL to test.");
      return;
    }

    setTestingWebhook(true);
    setTestResult(null);

    try {
      const headersObj: Record<string, string> = {};
      if (webhookHeaders.trim()) {
        const lines = webhookHeaders.trim().split("\n");
        for (const line of lines) {
          const colonIdx = line.indexOf(":");
          if (colonIdx > 0) {
            headersObj[line.substring(0, colonIdx).trim()] = line.substring(colonIdx + 1).trim();
          }
        }
      }

      const res = await fetch("/api/custom-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl.trim(),
          method: webhookMethod,
          headers: headersObj,
          body: webhookMethod === "POST" ? webhookBody : undefined,
          prompt: "Test execution from Settings"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTestResult({
          status: res.status,
          text: typeof data === "object" ? JSON.stringify(data, null, 2) : String(data),
          isError: true,
        });
      } else {
        setTestResult({
          status: data.status || 200,
          text: typeof data.data === "object" ? JSON.stringify(data.data, null, 2) : String(data.data),
          isError: false,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 500,
        text: err?.message || "Failed to reach endpoint",
        isError: true,
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleToggleActive = (id: ConnectorId) => {
    const updated = connectors.map((c) => {
      if (c.id === id) {
        const nextActive = !c.active;
        showToast(`${c.name} connector is now ${nextActive ? "Active (ON)" : "Disabled (OFF)"}`);
        return { ...c, active: nextActive };
      }
      return c;
    });
    onUpdateConnectors(updated);
  };

  const handleDisconnect = (id: ConnectorId) => {
    if (id === "telegram") {
      saveTelegramConfig({ botToken: "", chatId: "" });
    }
    const conn = connectors.find((c) => c.id === id);
    const updated = connectors.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          connected: false,
          accessToken: undefined,
          tokenExpiry: undefined,
          userEmail: undefined,
        };
      }
      return c;
    });
    onUpdateConnectors(updated);
    showToast(`Disconnected from ${conn?.name || "service"}`);
  };

  const handleSaveClientIds = () => {
    saveCustomClientIds({
      googleClientId: googleClientId.trim(),
      githubClientId: githubClientId.trim(),
      notionClientId: notionClientId.trim(),
      notionClientSecret: notionClientSecret.trim(),
      tavilyApiKey: tavilyApiKey.trim(),
    });
    setClientIdsSaved(true);
    setTimeout(() => setClientIdsSaved(false), 2500);
    showToast("OAuth Client IDs & Web Search API Keys updated successfully!");
  };

  const handleConnectClick = (connector: ConnectorConfig) => {
    if (connector.id === "youtube") {
      completeConnection("youtube", "youtube_api_key_active_token");
      showToast("YouTube Data API v3 connector is now active!");
      return;
    }

    if (connector.id === "web_search") {
      completeConnection("web_search", "web_search_active_token");
      showToast("Live Web Search connector is now connected!");
      return;
    }

    if (connector.id === "custom_webhook") {
      completeConnection("custom_webhook", "custom_webhook_active_token");
      showToast("Custom REST API / Webhook connector is active!");
      return;
    }

    if (connector.id === "telegram") {
      setShowTelegramModal(true);
      return;
    }

    if (connector.id === "notion") {
      const clientId = notionClientId.trim() || getEffectiveClientId("notion");
      const authUrl = buildOAuthUrl("notion", clientId || undefined);
      showToast("Redirecting to Notion OAuth authorization...");
      window.location.href = authUrl;
      return;
    }

    const isGoogle = connector.id.startsWith("google") || connector.id === "gmail";
    const clientId = getEffectiveClientId(isGoogle ? "google" : "github");

    if (!clientId) {
      // Prompt user to enter token manually or set client ID
      setActiveModalConnector(connector);
      setManualTokenInput("");
      return;
    }

    // Launch pure client-side OAuth implicit flow popup
    const authUrl = buildOAuthUrl(connector.id, clientId);
    const popup = window.open(authUrl, `oauth_${connector.id}`, "width=600,height=700");

    if (!popup) {
      showToast("Popup was blocked by browser. Please allow popups or use manual token entry.");
      setActiveModalConnector(connector);
      return;
    }

    // Poll popup window for implicit hash token or user return
    showToast(`Opening OAuth authorization window for ${connector.name}...`);
    
    const interval = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(interval);
          return;
        }

        const href = popup.location.href;
        if (href && (href.includes("access_token=") || href.includes("token="))) {
          const hashOrSearch = popup.location.hash || popup.location.search;
          const params = new URLSearchParams(hashOrSearch.replace("#", "?"));
          const accessToken = params.get("access_token") || params.get("token");

          if (accessToken) {
            popup.close();
            clearInterval(interval);
            await completeConnection(connector.id, accessToken);
          }
        }
      } catch {
        // Cross-origin restrictions until popup redirects back to current origin
      }
    }, 600);
  };

  const completeConnection = async (id: ConnectorId, token: string) => {
    const userEmail = await fetchUserInfo(id, token);
    const updated = connectors.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          connected: true,
          active: true,
          accessToken: token,
          userEmail: userEmail || "Connected Workspace",
        };
      }
      return c;
    });

    onUpdateConnectors(updated);
    const conn = connectors.find((c) => c.id === id);
    showToast(`Successfully connected to ${conn?.name || "service"}!`);
    setActiveModalConnector(null);
  };

  const handleManualTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalConnector || !manualTokenInput.trim()) return;

    await completeConnection(activeModalConnector.id, manualTokenInput.trim());
  };

  const getConnectorIcon = (iconNameOrId: string, sizeClass = "w-6 h-6") => {
    switch (iconNameOrId) {
      case "google_drive":
      case "HardDrive":
        return <GoogleDriveLogo className={sizeClass} />;
      case "gmail":
      case "Mail":
        return <GmailLogo className={sizeClass} />;
      case "google_docs":
      case "FileText":
        return <GoogleDocsLogo className={sizeClass} />;
      case "google_sheets":
      case "Table":
        return <GoogleSheetsLogo className={sizeClass} />;
      case "github":
      case "Github":
        return <GitHubLogo className={sizeClass} />;
      case "notion":
      case "Notion":
        return <NotionLogo className={sizeClass} />;
      case "google_calendar":
      case "Calendar":
        return <GoogleCalendarLogo className={sizeClass} />;
      case "google_tasks":
      case "CheckSquare":
      case "Tasks":
        return <GoogleTasksLogo className={sizeClass} />;
      case "google_forms":
      case "FileQuestion":
      case "Forms":
        return <GoogleFormsLogo className={sizeClass} />;
      case "web_search":
      case "Globe":
      case "Search":
        return <WebSearchLogo className={sizeClass} />;
      case "live_weather":
      case "CloudSun":
      case "Weather":
      case "Sun":
        return <WeatherLogo className={sizeClass} />;
      case "youtube":
      case "Youtube":
      case "Video":
        return <YoutubeLogo className={sizeClass} />;
      case "custom_webhook":
      case "Webhook":
        return <Webhook className={`${sizeClass} text-indigo-500`} />;
      case "telegram":
      case "Send":
      case "Telegram":
        return <TelegramLogo className={sizeClass} />;
      case "wolfram_alpha":
      case "WolframAlpha":
      case "Wolfram":
        return <WolframAlphaLogo className={sizeClass} />;
      case "scispace":
      case "SciSpace":
        return <SciSpaceLogo className={sizeClass} />;
      case "consensus":
      case "Consensus":
        return <ConsensusLogo className={sizeClass} />;
      default:
        return <Sparkles className={`${sizeClass} text-indigo-500`} />;
    }
  };

  return (
    <div className="space-y-5 md:col-span-2" id="connectors-section">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Integrations & Connectors
                <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  Pure Client-Side OAuth 2.0
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Connect V-Astra AI to your external Google Workspace and GitHub tools without an intermediary database.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            id="oauth-client-ids-btn"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>OAuth Client IDs</span>
          </button>
        </div>

        {/* OAuth Client ID Drawer / Config box */}
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                Custom OAuth Client IDs (Optional)
              </h4>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Provide your Google or GitHub OAuth Client IDs here if not declared in environment variables. Access tokens are stored safely in client-side <code>localStorage</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Google OAuth Client ID
                </label>
                <input
                  type="text"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub OAuth Client ID
                </label>
                <input
                  type="text"
                  value={githubClientId}
                  onChange={(e) => setGithubClientId(e.target.value)}
                  placeholder="e.g. Ov23li... or Client ID"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notion OAuth Client ID
                </label>
                <input
                  type="text"
                  value={notionClientId}
                  onChange={(e) => setNotionClientId(e.target.value)}
                  placeholder="e.g. 1823ab... or Client ID"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notion Client Secret
                </label>
                <input
                  type="password"
                  value={notionClientSecret}
                  onChange={(e) => setNotionClientSecret(e.target.value)}
                  placeholder="e.g. secret_... (Optional if in env)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Tavily Search API Key</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Optional (Free engine active)</span>
                </label>
                <input
                  type="password"
                  value={tavilyApiKey}
                  onChange={(e) => setTavilyApiKey(e.target.value)}
                  placeholder="e.g. tvly-..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveClientIds}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save OAuth Credentials</span>
              </button>

              {clientIdsSaved && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Saved!
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Custom REST API / Webhook Section */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Webhook className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Custom REST API / Webhook Endpoints
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {webhooks.length} Saved
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Save custom REST API endpoints (GET/POST) with authorization headers to query your own database or post payloads.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddWebhook}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Endpoint</span>
            </button>
          </div>

          {webhooks.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No custom endpoints saved yet. Click <strong>Add Custom Endpoint</strong> to connect your own REST API or Webhook.
              </p>
              <button
                type="button"
                onClick={handleOpenAddWebhook}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure Example (e.g. My Database)</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {webhooks.map((wh) => (
                <div
                  key={wh.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-start justify-between gap-2"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${wh.method === "POST" ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"}`}>
                        {wh.method}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={wh.name}>
                        {wh.name}
                      </h5>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate" title={wh.url}>
                      {wh.url}
                    </p>
                    {wh.headers && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-mono">
                        Headers: {wh.headers.split("\n")[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleWebhookEnabled(wh.id)}
                      className={`p-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${wh.enabled ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" : "text-slate-400 bg-slate-200 dark:bg-slate-800"}`}
                      title={wh.enabled ? "Enabled (Click to disable)" : "Disabled (Click to enable)"}
                    >
                      {wh.enabled ? "Active" : "Off"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditWebhook(wh)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer"
                      title="Edit Endpoint"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer"
                      title="Delete Endpoint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {connectors.map((connector) => {
            const isConnected = connector.connected && !!connector.accessToken;
            const isActive = connector.active;

            return (
              <div
                key={connector.id}
                className={`p-4 rounded-xl border transition-all ${
                  isConnected
                    ? "bg-white dark:bg-slate-850 border-emerald-500/30 dark:border-emerald-500/30 shadow-sm"
                    : "bg-white/60 dark:bg-slate-850/40 border-slate-200/80 dark:border-slate-800"
                }`}
                id={`connector-card-${connector.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 md:gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/60 shrink-0">
                      {getConnectorIcon(connector.id, "w-6 h-6")}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {connector.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                          {connector.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                        {connector.description}
                      </p>
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <label
                      className={`relative inline-flex items-center cursor-pointer ${
                        !isConnected ? "opacity-40 pointer-events-none" : ""
                      }`}
                      title={isConnected ? "Toggle Active State" : "Connect service to activate toggle"}
                    >
                      <input
                        type="checkbox"
                        checked={isActive && isConnected}
                        onChange={() => handleToggleActive(connector.id)}
                        disabled={!isConnected}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:after:border-slate-600 peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-[9px] font-mono font-medium text-slate-400">
                      {isConnected ? (isActive ? "ON" : "OFF") : "DISABLED"}
                    </span>
                  </div>
                </div>

                {/* Footer Controls / Status */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    {isConnected ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[130px]" title={connector.userEmail}>
                          {connector.id === "youtube" ? "API v3 Active" : connector.id === "wolfram_alpha" ? "Wolfram Engine Active" : connector.id === "scispace" ? "Research Search Active" : connector.id === "consensus" ? "Evidence Search Active" : (connector.userEmail || "Connected")}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Not Connected</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        {connector.id === "telegram" && (
                          <button
                            type="button"
                            onClick={() => setShowTelegramModal(true)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                            title="Edit Telegram Bot Token & Chat ID"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDisconnect(connector.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleConnectClick(connector)}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Connect</span>
                        </button>

                        {connector.id !== "youtube" && connector.id !== "web_search" && connector.id !== "custom_webhook" && connector.id !== "telegram" && connector.id !== "wolfram_alpha" && connector.id !== "scispace" && connector.id !== "consensus" && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveModalConnector(connector);
                              setManualTokenInput("");
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                            title="Enter Access Token directly"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Access Token / Connection Modal */}
      <AnimatePresence>
        {activeModalConnector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/60 shrink-0">
                    {getConnectorIcon(activeModalConnector.id, "w-6 h-6")}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Connect {activeModalConnector.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      OAuth 2.0 Access Token Connection
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalConnector(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Implicit OAuth / Access Token Options</span>
                  </div>
                  <p>
                    You can launch standard OAuth authorization or paste your existing access token (or Personal Access Token for GitHub).
                  </p>
                </div>

                <form onSubmit={handleManualTokenSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Paste Access Token / API Token
                    </label>
                    <input
                      type="password"
                      value={manualTokenInput}
                      onChange={(e) => setManualTokenInput(e.target.value)}
                      placeholder="e.g. ya29.a0... or ghp_..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalConnector(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Connect</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Telegram Bot Integration Modal */}
      <AnimatePresence>
        {showTelegramModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/60 shrink-0">
                    <TelegramLogo className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Telegram Bot Integration
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Configure Telegram Bot Credentials
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTelegramModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/50 text-[11px] text-sky-800 dark:text-sky-300 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                  <span>Telegram Bot Setup Guide</span>
                </div>
                <p>
                  Create a bot via <strong>@BotFather</strong> on Telegram to get your <strong>Bot Token</strong>, and message <strong>@userinfobot</strong> to find your <strong>Chat ID</strong>.
                </p>
              </div>

              <form onSubmit={handleSaveTelegram} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telegram Bot Token <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="e.g. 123456:ABC-DEF..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telegram Chat ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. 987654321"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTelegramModal(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Connect</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom REST API / Webhook Modal */}
      <AnimatePresence>
        {showWebhookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Webhook className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {editingWebhook ? "Edit Custom REST API / Webhook" : "Add Custom REST API / Webhook"}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Configure custom API endpoint and authorization headers for V-Astra AI
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveWebhookForm} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    API Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={webhookName}
                    onChange={(e) => setWebhookName(e.target.value)}
                    placeholder="e.g. My Database, User Service, Analytics Webhook"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      HTTP Method
                    </label>
                    <select
                      value={webhookMethod}
                      onChange={(e) => setWebhookMethod(e.target.value as "GET" | "POST")}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Endpoint URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://api.mywebsite.com/data"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Custom Headers</span>
                    <span className="text-[10px] text-slate-400 font-normal">Authorization Bearer Token / API Key</span>
                  </label>
                  <textarea
                    value={webhookHeaders}
                    onChange={(e) => setWebhookHeaders(e.target.value)}
                    placeholder="Authorization: Bearer my-secret-token&#10;X-API-Key: secret123"
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {webhookMethod === "POST" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Custom Body Template (Optional JSON for POST)
                    </label>
                    <textarea
                      value={webhookBody}
                      onChange={(e) => setWebhookBody(e.target.value)}
                      placeholder='{"summary": "AI generated summary", "status": "active"}'
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {/* Test Result Box */}
                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${testResult.isError ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300" : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300"}`}>
                    <div className="font-bold flex items-center gap-1.5 text-[11px]">
                      {testResult.isError ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Response Status: {testResult.status}</span>
                    </div>
                    <pre className="max-h-36 overflow-y-auto whitespace-pre-wrap text-[10px] bg-black/5 dark:bg-black/30 p-2 rounded-lg">
                      {testResult.text}
                    </pre>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testingWebhook || !webhookUrl.trim()}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{testingWebhook ? "Testing..." : "Test Endpoint"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowWebhookModal(false)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Webhook</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
