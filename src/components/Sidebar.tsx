import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, MessageSquare, Edit2, Trash2, Check, X, Settings, 
  Sparkles, ChevronDown, Trash, RefreshCw, Sun, Moon, ExternalLink, Globe, Languages,
  Search, Star, Flag, Zap, BookOpen
} from "lucide-react";
import { ChatHistoryItem } from "../types";
import { t } from "../translations";
import VTransLogo from "./VTransLogo";

const PRIMARY_LANGUAGES = [
  "English (India)",
  "English (US)",
  "English (UK)",
  "Other English dialects"
];

const SECONDARY_LANGUAGES = [
  "Arabic (العربية)",
  "Bengali (বাংলা)",
  "Chinese, Mandarin (中文)",
  "Dutch (Nederlands)",
  "French (Français)",
  "German (Deutsch)",
  "Hindi (हिंदी)",
  "Italian (Italiano)",
  "Japanese (日本語)",
  "Korean (한국어)",
  "Malayalam (മലയാളം)",
  "Portuguese (Português)",
  "Russian (Русский)",
  "Spanish (Español)",
  "Swahili (Kiswahili)",
  "Swedish (Svenska)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
  "Turkish (Türkçe)",
  "Vietnamese (Tiếng Việt)"
];

const V_ASTRA_LANGUAGES = [
  "English (India)",
  "English (US)",
  "English (UK)",
  "Malayalam (മലയാളം)",
  "Arabic (العربية)",
  "Bengali (বাংলা)",
  "Chinese, Mandarin (中文)",
  "Dutch (Nederlands)",
  "French (Français)",
  "German (Deutsch)",
  "Hindi (हिंदी)",
  "Italian (Italiano)",
  "Japanese (日本語)",
  "Korean (한국어)",
  "Portuguese (Português)",
  "Russian (Русский)",
  "Spanish (Español)",
  "Swahili (Kiswahili)",
  "Swedish (Svenska)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
  "Turkish (Türkçe)",
  "Vietnamese (Tiếng Việt)"
];

interface SidebarProps {
  chats: ChatHistoryItem[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onClearAllChats: () => void;
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onResetUser: () => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  webSearchEnabled: boolean;
  onWebSearchToggle: () => void;
  primaryLanguage: string;
  secondaryLanguage: string;
  onLanguageChange: (primary: string, secondary: string) => void;
  onOpenRatingModal: () => void;
  vAstraLanguage: string;
  onVAstraLanguageChange: (lang: string) => void;
  interfaceLanguage: string;
  onOpenTranslationModal: () => void;
  onOpenVFlow: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onClearAllChats,
  isOpen,
  onClose,
  userName,
  onResetUser,
  theme,
  onThemeToggle,
  webSearchEnabled,
  onWebSearchToggle,
  primaryLanguage,
  secondaryLanguage,
  onLanguageChange,
  onOpenRatingModal,
  vAstraLanguage,
  onVAstraLanguageChange,
  interfaceLanguage,
  onOpenTranslationModal,
  onOpenVFlow,
  onOpenSettings,
}: SidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chronological Grouping of Chats
  const getChronologicalGroups = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups: { [key: string]: ChatHistoryItem[] } = {
      "Today": [],
      "Yesterday": [],
      "Previous 7 Days": [],
      "Older": []
    };

    filteredChats.forEach(chat => {
      const chatDate = new Date(chat.createdAt);
      if (chatDate >= today) {
        groups["Today"].push(chat);
      } else if (chatDate >= yesterday) {
        groups["Yesterday"].push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups["Previous 7 Days"].push(chat);
      } else {
        groups["Older"].push(chat);
      }
    });

    // Clean up empty groups
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  };

  const startEditing = (chat: ChatHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const saveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      onDeleteChat(id);
    }
  };

  const groups = getChronologicalGroups();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[2px] lg:hidden"
            id="sidebar-overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 bottom-0 left-0 z-50 w-[280px] md:w-[320px] flex flex-col h-screen liquid-glass border-r border-white/40 dark:border-slate-800/50 shadow-2xl shadow-slate-100/50 dark:shadow-none text-slate-800 dark:text-slate-100"
        id="sidebar-container"
      >
        {/* Header Branding */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100/40 dark:border-slate-800/30 shrink-0" id="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 dark:bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-slate-950/10">
              <Sparkles className="w-6 h-6 text-indigo-300 dark:text-indigo-100" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                V-Astra AI
              </h2>
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                {theme === "light" ? "Light Edition" : "Dark Edition"}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            aria-label="Close sidebar"
            id="sidebar-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-4 space-y-3 shrink-0" id="sidebar-actions">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full bg-slate-950 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white font-sans font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 group shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-slate-950/15 cursor-pointer transition-all duration-300"
            id="new-chat-btn"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            {t("new_conversation", interfaceLanguage)}
          </button>

          {/* V Flow Option connected to Supabase */}
          <button
            onClick={() => {
              onOpenVFlow();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-indigo-500/60 dark:border-indigo-400/80 bg-indigo-500/10 hover:bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 cursor-pointer group text-left"
            id="v-flow-menu-option"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500/20 shrink-0" />
              <span className="text-sm font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                V Flow
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase shadow-sm">
                Scheduler
              </span>
            </div>
          </button>

          {/* V Astra-NoteBook external application launcher */}
          <a
            href="https://v-notebook.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              onClose();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/60 dark:border-emerald-400/80 bg-emerald-500/10 hover:bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.45)] transition-all duration-300 cursor-pointer group text-left no-underline"
            id="v-notebook-menu-option"
            title="Open V Astra-NoteBook in new tab"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen className="w-5 h-5 text-emerald-500 fill-emerald-500/20 shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-sans font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                V Astra-NoteBook
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase shadow-sm flex items-center gap-1">
                <span>RESEARCH</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-90" />
              </span>
            </div>
          </a>

          {/* Design (beta) Option temporarily hidden */}

          {/* Translate Option with custom glowing V-Trans design */}
          <button
            onClick={() => {
              onOpenTranslationModal();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-orange-500/60 dark:border-orange-400/80 bg-orange-500/10 hover:bg-orange-500/15 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all duration-300 cursor-pointer group text-left"
            id="translate-menu-option"
          >
            <div className="flex items-center gap-2.5">
              <VTransLogo className="w-6 h-6 shrink-0" />
              <span className="text-sm font-sans font-semibold text-orange-600 dark:text-orange-400">
                {t("translate", interfaceLanguage)}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500 text-white uppercase shadow-sm animate-pulse">
                Live
              </span>
            </div>
          </button>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4" id="chat-history-scroll-container">
          
          {/* Search Chats Row */}
          {chats.length > 0 && (
            <div className="px-3 pb-2 border-b border-slate-100/30 dark:border-slate-850/30" id="search-chats-container">
              <div className="flex items-center justify-between" id="search-chats-header">
                {isSearchExpanded ? (
                  <motion.div 
                    initial={{ width: "60%", opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    className="flex items-center gap-2 w-full bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500/50"
                    id="search-input-container"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <input
                      type="text"
                      placeholder={t("search_chats", interfaceLanguage)}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-sans focus:ring-0"
                      autoFocus
                      id="search-chats-input"
                    />
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchExpanded(false);
                      }}
                      className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                      id="search-clear-btn"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-between w-full" id="search-collapsed-container">
                    <span className="text-[10px] font-sans font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {t("history", interfaceLanguage)}
                    </span>
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-1.5 hover:bg-white/40 dark:hover:bg-slate-850/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-all duration-200 cursor-pointer"
                      title="Search Chats"
                      id="search-chats-toggle-btn"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {chats.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t("no_history", interfaceLanguage)}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t("start_chatting_desc", interfaceLanguage)}</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-10 px-4" id="no-search-results">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t("no_search_results", interfaceLanguage)}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t("try_different_search", interfaceLanguage)}</p>
            </div>
          ) : (
            <div className="space-y-6" id="filtered-chats-list">
              {groups.map(([groupName, items]) => (
                <div key={groupName} className="space-y-1" id={`group-${groupName.replace(/\s+/g, "-")}`}>
                  <h3 className="px-3 text-[10px] font-sans font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    {groupName}
                  </h3>
                  <div className="space-y-1">
                    {items.map(chat => {
                      const isActive = chat.id === activeChatId;
                      const isEditing = chat.id === editingChatId;

                      return (
                        <div
                          key={chat.id}
                          onClick={() => {
                            if (!isEditing) {
                              onSelectChat(chat.id);
                              onClose();
                            }
                          }}
                          className={`group relative flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                            isActive 
                              ? "bg-white dark:bg-slate-850 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700/50 border border-slate-200/50 dark:border-slate-700" 
                              : "hover:bg-white/40 dark:hover:bg-slate-800/20 hover:translate-x-0.5"
                          }`}
                          id={`chat-item-${chat.id}`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`} />
                            
                            {isEditing ? (
                              <form 
                                onSubmit={(e) => saveRename(chat.id, e)} 
                                className="flex-1 flex items-center gap-1.5"
                                onClick={e => e.stopPropagation()}
                                id={`edit-form-${chat.id}`}
                              >
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-400 font-sans"
                                  autoFocus
                                  required
                                />
                                <button
                                  type="submit"
                                  className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded cursor-pointer"
                                  id={`save-btn-${chat.id}`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelRename}
                                  className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                                  id={`cancel-btn-${chat.id}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            ) : (
                              <span className={`text-xs font-sans truncate font-medium ${isActive ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400"}`}>
                                {chat.title}
                              </span>
                            )}
                          </div>

                          {/* Edit / Delete actions shown on hover or when active */}
                          {!isEditing && (
                            <div className={`flex items-center gap-1 shrink-0 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`}>
                              <button
                                onClick={(e) => startEditing(chat, e)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                title="Rename Chat"
                                id={`edit-icon-${chat.id}`}
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(chat.id, e)}
                                className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Chat"
                                id={`delete-icon-${chat.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer with interactive Gemini API Key Secret Box */}
        <div className="p-4 border-t border-slate-100/40 dark:border-slate-800/40 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md shrink-0" id="sidebar-footer">
          {/* Google Play Compliant AI-generated content user reporting link */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeWnFSIQfBah8Je7kvxCtH3ksuotbB8xrqRM0_GvM-4BN9iGg/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2.5 mb-3 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/20 hover:bg-rose-500/10 dark:hover:bg-rose-500/15 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 cursor-pointer text-xs font-sans font-medium decoration-none"
            id="report-ai-content-link"
          >
            <Flag className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="truncate">{t("report_ai_content", interfaceLanguage)}</span>
          </a>

          {/* Settings trigger */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
              id="sidebar-user-profile-row"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-display text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase">
                {userName.charAt(0) || "U"}
              </div>
              <span className="text-xs font-sans font-medium text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                {userName}
              </span>
            </div>
            
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Open Settings Page"
              id="sidebar-settings-toggle"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-medium font-sans">{t("astra_settings", interfaceLanguage)}</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
