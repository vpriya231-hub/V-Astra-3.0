import React, { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import RatingModal from "./components/RatingModal";
import SettingsPage from "./components/SettingsPage";
import { ChatHistoryItem, ConnectorConfig, Message, UserProfile } from "./types";
import { Sparkles } from "lucide-react";
import TranslationModal from "./components/TranslationModal";
import TranslationTransition from "./components/TranslationTransition";
import VFlowPage from "./components/VFlowPage";
import { useVFlowScheduler } from "./hooks/useVFlowScheduler";
import { Language, t } from "./translations";
import {
  loadConnectors,
  saveConnectors,
  processConnectorIntent,
  parseOAuthCallback,
  fetchUserInfo,
  getCustomClientIds,
} from "./lib/connectors";

export default function App() {
  // Connectors State
  const [connectors, setConnectors] = useState<ConnectorConfig[]>(() => loadConnectors());

  const handleUpdateConnectors = (updated: ConnectorConfig[]) => {
    setConnectors(updated);
    saveConnectors(updated);
  };
  // 1. Core Local Storage States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("v_astra_user_profile");
    const defaultProfile = {
      name: "",
      onboarded: false,
      joinedAt: "",
      primary_language: "English (India)",
      secondary_language: "Malayalam (മലയാളം)",
      v_astra_language: "English (India)",
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProfile,
          ...parsed,
        };
      } catch (e) {
        // Fallback
      }
    }
    return defaultProfile;
  });

  const [chats, setChats] = useState<ChatHistoryItem[]>(() => {
    const saved = localStorage.getItem("v_astra_chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("v_astra_api_key") || "";
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const lastActive = localStorage.getItem("v_astra_active_chat_id");
    return lastActive || null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => {
    return localStorage.getItem("v_astra_selected_voice") || "default";
  });

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem("v_astra_selected_voice", voiceURI);
  };

  // View state: 'chat', 'v_flow', or 'settings'
  const [currentView, setCurrentView] = useState<"chat" | "v_flow" | "settings">(
    window.location.pathname === "/settings" || window.location.hash === "#settings"
      ? "settings"
      : window.location.pathname === "/v_flow" || window.location.hash === "#v_flow"
      ? "v_flow"
      : "chat"
  );
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // Handle browser back / forward navigation and URL state sync
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/settings" || window.location.hash === "#settings") {
        setCurrentView("settings");
      } else if (window.location.pathname === "/v_flow" || window.location.hash === "#v_flow") {
        setCurrentView("v_flow");
      } else {
        setCurrentView("chat");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentView === "settings") {
      if (window.location.pathname !== "/settings") {
        window.history.pushState({}, "", "/settings");
      }
    } else if (currentView === "v_flow") {
      if (window.location.pathname !== "/v_flow") {
        window.history.pushState({}, "", "/v_flow");
      }
    } else {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
      }
    }
  }, [currentView]);

  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => {
      setGlobalToast((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // OAuth Callback Handler for Client-Side Redirects / OAuth Codes
  useEffect(() => {
    // 1. Check Notion OAuth Code search query callback
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && (state === "notion" || !state)) {
      const customIds = getCustomClientIds();
      fetch("/api/auth/notion/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          redirect_uri: "https://v-astra-ai.ai.studio",
          custom_client_id: customIds.notionClientId,
          custom_client_secret: customIds.notionClientSecret,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            const token = data.access_token;
            const workspaceName = data.workspace_name || data.workspace_icon || "Notion Workspace";
            const updated = connectors.map((c) => {
              if (c.id === "notion") {
                return {
                  ...c,
                  connected: true,
                  active: true,
                  accessToken: token,
                  userEmail: workspaceName,
                };
              }
              return c;
            });
            handleUpdateConnectors(updated);
            showGlobalToast(`Successfully connected to Notion Workspace: ${workspaceName}!`);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error("Notion code exchange error:", data);
            showGlobalToast(`Notion authentication error: ${data.error || data.message || "Code exchange failed"}`);
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch((err) => {
          console.error("Error exchanging Notion code:", err);
          showGlobalToast("Failed to complete Notion OAuth exchange.");
          window.history.replaceState({}, document.title, window.location.pathname);
        });
      return;
    }

    // 2. Standard Google/GitHub Implicit Hash/Token Callback
    const { connectorId, token } = parseOAuthCallback();
    if (connectorId && token) {
      fetchUserInfo(connectorId, token).then((userEmail) => {
        const updated = connectors.map((c) => {
          if (c.id === connectorId) {
            return {
              ...c,
              connected: true,
              active: true,
              accessToken: token,
              userEmail: userEmail || "Connected User",
            };
          }
          return c;
        });
        handleUpdateConnectors(updated);
        showGlobalToast(`Successfully connected to ${connectorId.replace("_", " ")}!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []);

  // Background V Flow Task Scheduler Execution
  useVFlowScheduler({
    userName: profile.name,
    onTaskExecuted: (task) => {
      showGlobalToast(`⚡ V Flow task executed by Gemini! (${task.prompt.slice(0, 30)}...)`);
    },
  });

  // Interface Translation states (V-Trans)
  const [interfaceLanguage, setInterfaceLanguage] = useState<string>(() => {
    return localStorage.getItem("v_astra_interface_language") || "English";
  });
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingToLanguage, setTranslatingToLanguage] = useState("");

  // Theme & Session-based Greeting
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("v_astra_theme") as "light" | "dark") || "light";
  });
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("v_astra_web_search_enabled");
    return saved !== null ? saved === "true" : true;
  });

  const [aiMode, setAiMode] = useState<"standard" | "medium" | "thinking">("standard");

  useEffect(() => {
    localStorage.setItem("v_astra_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("v_astra_web_search_enabled", String(webSearchEnabled));
  }, [webSearchEnabled]);

  useEffect(() => {
    if (profile.onboarded) {
      const hasSeenGreetingInSession = sessionStorage.getItem("v_astra_session_loaded");
      if (!hasSeenGreetingInSession) {
        setIsReturningUser(true);
        sessionStorage.setItem("v_astra_session_loaded", "true");
        localStorage.setItem("v_astra_is_returning", "true");
      } else {
        const wasReturning = localStorage.getItem("v_astra_is_returning") === "true";
        if (wasReturning) {
          setIsReturningUser(true);
        }
      }
    }
  }, [profile.onboarded]);

  // Automatic Delay Trigger for Rating Modal (12 seconds after onboarded load)
  useEffect(() => {
    if (profile.onboarded) {
      const currentRatingStatus = localStorage.getItem("v_astra_rating_status");
      if (!currentRatingStatus) {
        const timer = setTimeout(() => {
          setRatingModalOpen(true);
        }, 12000); // 12 seconds delay
        return () => clearTimeout(timer);
      }
    }
  }, [profile.onboarded]);

  // 2. Synchronize Storage
  useEffect(() => {
    localStorage.setItem("v_astra_user_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("v_astra_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("v_astra_api_key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("v_astra_active_chat_id", activeChatId);
    } else {
      localStorage.removeItem("v_astra_active_chat_id");
    }
  }, [activeChatId]);

  // 3. Side Actions
  const handleOnboardingComplete = (name: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      onboarded: true,
      joinedAt: prev.joinedAt || new Date().toISOString(),
      primary_language: prev.primary_language || "English (India)",
      secondary_language: prev.secondary_language || "Malayalam (മലയാളം)",
      v_astra_language: prev.v_astra_language || "English (India)",
    }));
    setCurrentView("chat");
    showGlobalToast(`Welcome back, ${name}!`);
  };

  // Synchronize/Fetch saved language preferences from the backend database when user is loaded
  useEffect(() => {
    if (profile.onboarded && profile.name) {
      const fetchLanguageSettings = async () => {
        try {
          const response = await fetch(`/api/user/settings/language?userName=${encodeURIComponent(profile.name)}`);
          if (response.ok) {
            const data = await response.json();
            setProfile((prev) => ({
              ...prev,
              primary_language: data.primary_language || prev.primary_language,
              secondary_language: data.secondary_language || prev.secondary_language,
              v_astra_language: data.v_astra_language || prev.v_astra_language || "English (India)",
            }));
          }
        } catch (err) {
          console.error("Error fetching language settings from database:", err);
        }
      };
      fetchLanguageSettings();
    }
  }, [profile.onboarded, profile.name]);

  const handleLanguageChange = async (primary: string, secondary: string) => {
    // 1. Update local state
    setProfile((prev) => ({
      ...prev,
      primary_language: primary,
      secondary_language: secondary,
    }));

    // 2. Securely save user language preferences to the backend database
    try {
      const response = await fetch("/api/user/settings/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primary_language: primary,
          secondary_language: secondary,
          v_astra_language: profile.v_astra_language,
          userName: profile.name,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save language settings to database API");
      } else {
        const data = await response.json();
        console.log("Language preferences saved to database:", data);
      }
    } catch (err) {
      console.error("Error communicating with server language API:", err);
    }
  };

  const handleVAstraLanguageChange = async (lang: string) => {
    // 1. Update local state
    setProfile((prev) => ({
      ...prev,
      v_astra_language: lang,
    }));

    // 2. Securely save user language preferences to the backend database
    try {
      const response = await fetch("/api/user/settings/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primary_language: profile.primary_language,
          secondary_language: profile.secondary_language,
          v_astra_language: lang,
          userName: profile.name,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save v_astra_language setting");
      }
    } catch (err) {
      console.error("Error saving v_astra_language settings:", err);
    }
  };

  const handleSelectInterfaceLanguage = (language: Language) => {
    setShowTranslationModal(false);
    setTranslatingToLanguage(`${language.name} (${language.nativeName})`);
    setIsTranslating(true);

    // Apply the translation after a 1.8-second duration (simulating translation wave)
    setTimeout(() => {
      setInterfaceLanguage(language.name);
      localStorage.setItem("v_astra_interface_language", language.name);
      setIsTranslating(false);
    }, 1800);
  };

  const handleResetUser = () => {
    setProfile((prev) => ({
      ...prev,
      name: "",
      onboarded: false,
    }));
    setIsReturningUser(false);
    sessionStorage.removeItem("v_astra_session_loaded");
    localStorage.removeItem("v_astra_is_returning");
    showGlobalToast("Onboarding name reset successfully");
  };

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat: ChatHistoryItem = {
      id: newId,
      title: "New Astra Session",
      createdAt: new Date().toISOString(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setCurrentView("chat");
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setCurrentView("chat");
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter((chat) => chat.id !== id);
      if (remaining.length > 0) {
        setActiveChatId(remaining[0].id);
      } else {
        setActiveChatId(null);
      }
    }
  };

  const handleClearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem("v_astra_chats");
    localStorage.removeItem("v_astra_active_chat_id");
    showGlobalToast("Chat history cleared");
  };

  const handleSendMessage = async (content: string, image?: { mimeType: string; data: string }) => {
    // Determine the current conversation context
    let currentChatId = activeChatId;
    let currentChats = [...chats];

    // Auto-create a session if none is active
    if (!currentChatId) {
      currentChatId = `chat-${Date.now()}`;
      const newChat: ChatHistoryItem = {
        id: currentChatId,
        title: content.slice(0, 24) + (content.length > 24 ? "..." : ""),
        createdAt: new Date().toISOString(),
        messages: [],
      };
      currentChats = [newChat, ...currentChats];
      setChats(currentChats);
      setActiveChatId(currentChatId);
    }

    const activeChat = currentChats.find((chat) => chat.id === currentChatId);
    if (!activeChat) return;

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      ...(image ? { image } : {}),
    };

    // Update history locally with user message
    const updatedMessages = [...activeChat.messages, userMessage];
    const isFirstUserMessage = activeChat.messages.length === 0;
    
    const updatedChatTitle = isFirstUserMessage
      ? content.slice(0, 28) + (content.length > 28 ? "..." : "")
      : activeChat.title;

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, title: updatedChatTitle, messages: updatedMessages }
          : chat
      )
    );

    setIsLoading(true);

    try {
      // Execute Intelligent Connector Intent layer before generating LLM response
      let connectorContext = "";
      try {
        const fetchedContext = await processConnectorIntent(content, connectors);
        if (fetchedContext) {
          connectorContext = `\n\n[EXTERNAL CONNECTORS REAL-TIME CONTEXT & API RESULTS]:\n${fetchedContext}\n\nINSTRUCTION FOR V-ASTRA AI: You have active real-time data retrieved from connected external services above. Summarize, explain, or perform requested analysis accurately using this data.`;
        }
      } catch (connErr) {
        console.warn("Error processing connector intent:", connErr);
      }

      // Build active connectors list
      const activeConnectorsList = connectors
        .filter((c) => c.connected && c.active && c.accessToken)
        .map((c) => c.name)
        .join(", ");

      const writePermissionsDirective = `\n\n[WRITE/CREATE/SEND PERMISSIONS DIRECTIVE]: You have full permission to CREATE, INSERT, and EDIT content in the user's Notion, Google Calendar, Google Tasks, Google Forms, and SEND messages to Telegram when requested. NEVER state that you cannot send messages or modify data.`;

      const connectorOverrideInstruction = activeConnectorsList
        ? `\n\n[ACTIVE CONNECTORS DIRECTIVE]: You are actively connected to the user's services: ${activeConnectorsList}.${writePermissionsDirective}\nCRITICAL INSTRUCTION: You MUST NEVER state or reply "I cannot browse the web", "I cannot summarize YouTube videos", "I cannot search YouTube", "I do not have real-time access", "I cannot access live internet data", "I cannot check current weather", "I cannot access live weather data", "I cannot send messages to Telegram", "I cannot alert you on Telegram", "I cannot solve math problems with Wolfram Alpha", "I cannot search research papers with SciSpace or Consensus", "I cannot forward to Telegram", "I cannot access your emails", "I cannot read your documents", "I cannot access GitHub", "I cannot read your Notion notes", "I cannot access your calendar", "I cannot access your tasks", "I cannot create Google Forms", "I cannot summarize Google Forms", "I cannot trigger custom webhooks", "I cannot access custom REST APIs", or similar statements. The application automatically invokes the respective connector APIs (Consensus Evidence Search, SciSpace / Scientific Web-Search Module, Wolfram Alpha API, Telegram Bot API, Open-Meteo Live Weather API, YouTube Data API v3, Live Web Search API, Gmail API, Google Docs API, Google Drive API, Google Sheets API, Google Calendar API, Google Tasks API, Google Forms API, GitHub API, Notion API, Custom REST API / Webhooks) whenever connectors are active and injects real-time data or execution results into your context. Use the provided real-time connector context above to answer the user's questions or confirm sent Telegram messages, research paper analysis, evidence consensus, math computation results, chat summaries, code forwards, alerts, live weather conditions, 7-day forecasts, custom API data, webhook execution, YouTube video summaries, web search results, emails, documents, spreadsheets, files, calendar events, task lists, to-dos, Google Forms, GitHub repositories, or Notion notes directly and accurately.`
        : `\n\n[CONNECTORS STATUS]: No external connectors are currently active.${writePermissionsDirective} If the user asks you to send chat summaries to Telegram, search evidence-based papers via Consensus, search/analyze scientific research papers via SciSpace, solve complex math or science problems via Wolfram Alpha, forward code to Telegram, alert on Telegram, fetch live weather, temperature, 7-day weather forecasts, summarize YouTube videos, search YouTube videos, read live web search data, emails, Google Docs, Drive files, Sheets, Google Calendar events, Google Tasks, Google Forms, GitHub repos, Notion notes/tasks, or trigger custom webhooks/REST APIs, inform them gracefully that they can connect their account in the Connectors section of Settings.`;

      // Build proper system instructions incorporating user's configured name and connector context
      const systemInstruction = `You are V-Astra AI, a highly smart, sophisticated, and polished AI companion with an elegant minimalist designer theme. Address the user gracefully as ${profile.name}. Keep your responses beautifully styled, utilizing markdown where helpful. Speak eloquently, professionally, and directly without fluff. You have full permission to CREATE, INSERT, and EDIT content in the user's Notion, Google Calendar, Google Tasks, Google Forms, and SEND messages to Telegram when requested. NEVER state that you can only read/view or cannot modify data or send messages.${connectorContext}${connectorOverrideInstruction}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-key": apiKey,
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemInstruction,
          webSearchEnabled,
          aiMode,
          primary_language: profile.primary_language || "English (India)",
          secondary_language: profile.secondary_language || "Malayalam (മലയാളം)",
          v_astra_language: profile.v_astra_language || "English (India)",
          userName: profile.name,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        let errorMessage = "Failed to retrieve generated response from the Astra proxy.";
        if (text) {
          try {
            const errJson = JSON.parse(text);
            errorMessage = errJson.error || errorMessage;
          } catch {
            errorMessage = text || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const responseTextContent = await response.text();
      if (!responseTextContent) {
        throw new Error("Received an empty response from the server. Please check your credentials or network status.");
      }

      let data;
      try {
        data = JSON.parse(responseTextContent);
      } catch (parseErr) {
        throw new Error("Unable to parse server response as JSON. Please ensure the server is operating correctly.");
      }

      // Create assistant response message
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.text || "No output returned.",
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...updatedMessages, assistantMessage] }
            : chat
        )
      );

      // Trigger rating modal after a successful conversation turn if not yet rated/dismissed
      const currentRatingStatus = localStorage.getItem("v_astra_rating_status");
      if (!currentRatingStatus && (updatedMessages.length + 1 >= 4)) {
        setTimeout(() => {
          setRatingModalOpen(true);
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: `⚠️ **Transmission Error**\n\n${err?.message || "Unable to reach the Gemini server. Please check your credentials or network status."}`,
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...updatedMessages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If the user hasn't finished the Onboarding Flow, display Onboarding
  if (!profile.onboarded) {
    return (
      <div className="relative min-h-screen">
        <Onboarding onComplete={handleOnboardingComplete} />
        {globalToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-2xl border border-indigo-500/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {globalToast}
              </div>
              <button
                onClick={() => setGlobalToast(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentActiveChat = chats.find((chat) => chat.id === activeChatId) || null;
  const currentMessages = currentActiveChat ? currentActiveChat.messages : [];
  const currentTitle = currentActiveChat ? currentActiveChat.title : "Astra Playground";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans" id="app-root">
      {/* Liquid Glass Frosted Navigation Drawer */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onClearAllChats={handleClearAllChats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={profile.name}
        onResetUser={handleResetUser}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
        webSearchEnabled={webSearchEnabled}
        onWebSearchToggle={() => setWebSearchEnabled(!webSearchEnabled)}
        primaryLanguage={profile.primary_language || "English (India)"}
        secondaryLanguage={profile.secondary_language || "Malayalam (മലയാളം)"}
        onLanguageChange={handleLanguageChange}
        onOpenRatingModal={() => setRatingModalOpen(true)}
        vAstraLanguage={profile.v_astra_language || "English (India)"}
        onVAstraLanguageChange={handleVAstraLanguageChange}
        interfaceLanguage={interfaceLanguage}
        onOpenTranslationModal={() => setShowTranslationModal(true)}
        onOpenVFlow={() => setCurrentView("v_flow")}
        onOpenSettings={() => setCurrentView("settings")}
      />

      {/* Main Interactive Screen Segment */}
      <main className="flex-1 flex flex-col h-full min-w-0" id="main-content-layout">
        {currentView === "v_flow" ? (
          <VFlowPage
            onBackToChat={() => setCurrentView("chat")}
            userName={profile.name}
            showToast={showGlobalToast}
          />
        ) : currentView === "settings" ? (
          <SettingsPage
            onBack={() => setCurrentView("chat")}
            userName={profile.name}
            theme={theme}
            onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
            webSearchEnabled={webSearchEnabled}
            onWebSearchToggle={() => setWebSearchEnabled(!webSearchEnabled)}
            primaryLanguage={profile.primary_language || "English (India)"}
            secondaryLanguage={profile.secondary_language || "Malayalam (മലയാളം)"}
            onLanguageChange={handleLanguageChange}
            vAstraLanguage={profile.v_astra_language || "English (India)"}
            onVAstraLanguageChange={handleVAstraLanguageChange}
            interfaceLanguage={interfaceLanguage}
            onOpenTranslationModal={() => setShowTranslationModal(true)}
            onOpenRatingModal={() => setRatingModalOpen(true)}
            onResetUser={handleResetUser}
            chatsCount={chats.length}
            onClearAllChats={handleClearAllChats}
            selectedVoiceURI={selectedVoiceURI}
            onVoiceChange={handleVoiceChange}
            apiKey={apiKey}
            onApiKeyChange={(key) => {
              setApiKey(key);
              if (key) {
                localStorage.setItem("v_astra_api_key", key);
              } else {
                localStorage.removeItem("v_astra_api_key");
              }
            }}
            connectors={connectors}
            onUpdateConnectors={handleUpdateConnectors}
            showToast={showGlobalToast}
          />
        ) : (
          <ChatArea
            messages={currentMessages}
            activeChatTitle={currentTitle}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            userName={profile.name}
            isReturningUser={isReturningUser}
            aiMode={aiMode}
            onAiModeChange={setAiMode}
            vAstraLanguage={profile.v_astra_language || "English (India)"}
            interfaceLanguage={interfaceLanguage}
            selectedVoiceURI={selectedVoiceURI}
          />
        )}
      </main>

      {/* Global Toast Banner for V Flow Execution Alerts */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-2xl border border-indigo-500/40 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {globalToast}
            </div>
            <button
              onClick={() => setGlobalToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modern Google Play In-App Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => {
          setRatingModalOpen(false);
          // Flag as dismissed locally so we don't annoy user on future sessions, but can still trigger from Sidebar
          localStorage.setItem("v_astra_rating_status", "dismissed");
        }}
        onRate={() => {
          setRatingModalOpen(false);
          // Mark as successfully rated!
          localStorage.setItem("v_astra_rating_status", "rated");
        }}
        appName="V-Astra AI"
        interfaceLanguage={interfaceLanguage}
      />

      {/* Modern Selection Modal */}
      <TranslationModal
        isOpen={showTranslationModal}
        onClose={() => setShowTranslationModal(false)}
        onSelectLanguage={handleSelectInterfaceLanguage}
        currentLanguage={interfaceLanguage}
      />

      {/* Soft Wave Ripple Transition Overlay */}
      <TranslationTransition
        isVisible={isTranslating}
        targetLanguage={translatingToLanguage}
      />
    </div>
  );
}
