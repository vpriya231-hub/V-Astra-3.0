import React, { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import RatingModal from "./components/RatingModal";
import { ChatHistoryItem, Message, UserProfile } from "./types";
import { Sparkles } from "lucide-react";

export default function App() {
  // 1. Core Local Storage States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("v_astra_user_profile");
    const defaultProfile = {
      name: "",
      onboarded: false,
      joinedAt: "",
      primary_language: "English (India)",
      secondary_language: "Malayalam (മലയാളം)",
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
    setProfile({
      name,
      onboarded: true,
      joinedAt: new Date().toISOString(),
      primary_language: "English (India)",
      secondary_language: "Malayalam (മലയാളം)",
    });
  };

  // Synchronize/Fetch saved language preferences from the backend database when user is loaded
  useEffect(() => {
    if (profile.onboarded && profile.name) {
      const fetchLanguageSettings = async () => {
        try {
          const response = await fetch(`/api/user/settings/language?userName=${encodeURIComponent(profile.name)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.primary_language && data.secondary_language) {
              setProfile((prev) => ({
                ...prev,
                primary_language: data.primary_language,
                secondary_language: data.secondary_language,
              }));
            }
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

  const handleResetUser = () => {
    setProfile({
      name: "",
      onboarded: false,
      joinedAt: "",
      primary_language: "English (India)",
      secondary_language: "Malayalam (മലയാളം)",
    });
    setActiveChatId(null);
    setChats([]);
    setApiKey("");
    setIsReturningUser(false);
    setTheme("light");
    setWebSearchEnabled(true);
    localStorage.removeItem("v_astra_user_profile");
    localStorage.removeItem("v_astra_chats");
    localStorage.removeItem("v_astra_api_key");
    localStorage.removeItem("v_astra_active_chat_id");
    localStorage.removeItem("v_astra_is_returning");
    localStorage.removeItem("v_astra_theme");
    localStorage.removeItem("v_astra_web_search_enabled");
    sessionStorage.removeItem("v_astra_session_loaded");
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
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
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
  };

  const handleSendMessage = async (content: string) => {
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
      // Build proper system instructions incorporating user's configured name
      const systemInstruction = `You are V-Astra AI, a highly smart, sophisticated, and polished AI companion with an elegant minimalist designer theme. Address the user gracefully as ${profile.name}. Keep your responses beautifully styled, utilizing markdown where helpful. Speak eloquently, professionally, and directly without fluff.`;

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
          userName: profile.name,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to retrieve generated response from the Astra proxy.");
      }

      const data = await response.json();

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
    return <Onboarding onComplete={handleOnboardingComplete} />;
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
      />

      {/* Main Interactive Screen Segment */}
      <main className="flex-1 flex flex-col h-full min-w-0" id="main-content-layout">
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
        />
      </main>

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
      />
    </div>
  );
}
