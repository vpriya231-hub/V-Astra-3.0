import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, MessageSquare, Edit2, Trash2, Check, X, Settings, 
  Sparkles, ChevronDown, Trash, RefreshCw, Sun, Moon, ExternalLink, Globe, Languages,
  Search, Star, Flag
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
}: SidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
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

          {/* Design (beta) Option inside a neon pink curved box */}
          <a
            href="https://anther-desgin.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-pink-500/60 dark:border-pink-400/80 bg-pink-500/10 hover:bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 cursor-pointer group decoration-none"
            id="design-beta-option-link"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4.5 h-4.5 text-pink-500" />
              <span className="text-sm font-sans font-semibold text-pink-600 dark:text-pink-400">
                {t("design_beta", interfaceLanguage)}
              </span>
            </div>
            <span className="text-[10px] font-sans font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-500 text-white uppercase shadow-sm">
              New
            </span>
          </a>

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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-display text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase">
                {userName.charAt(0) || "U"}
              </div>
              <span className="text-xs font-sans font-medium text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                {userName}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-all ${showSettings ? "bg-slate-950 dark:bg-slate-850 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
                title="Astra Settings"
                id="sidebar-settings-toggle"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-y-auto max-h-[350px] space-y-3 pt-1 pb-2 border-t border-slate-100/50 dark:border-slate-800/30 pr-1 scrollbar-thin"
                id="expanded-settings"
              >
                {/* Theme Toggle Button (Request: light/dark theme toggle button should only be placed inside this Settings menu) */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{t("app_theme", interfaceLanguage)}</span>
                  <button
                    onClick={onThemeToggle}
                    className="text-[11px] font-sans font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all duration-200"
                    id="theme-toggle-btn"
                  >
                    {theme === "light" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t("light_mode", interfaceLanguage)}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{t("dark_mode", interfaceLanguage)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Capabilities Option in the Settings menu */}
                <div className="pt-2 border-t border-slate-100/30 dark:border-slate-800/30 space-y-1.5" id="capabilities-section">
                  <button
                    onClick={() => setShowCapabilities(!showCapabilities)}
                    className="w-full flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    id="capabilities-btn"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{t("capabilities", interfaceLanguage)}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${showCapabilities ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {showCapabilities && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-2 pt-1 pb-1 pl-1"
                        id="capabilities-expanded-content"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-750 dark:text-slate-200 font-medium">
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{t("web_search", interfaceLanguage)}</span>
                          </div>
                          {/* Standard high quality toggle button */}
                          <button
                            onClick={onWebSearchToggle}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              webSearchEnabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                            }`}
                            id="web-search-toggle-switch"
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                webSearchEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-[10px] leading-normal text-slate-500 dark:text-slate-400 font-sans text-left">
                          {t("web_search_desc", interfaceLanguage)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Languages Settings Section */}
                <div className="pt-2 border-t border-slate-100/30 dark:border-slate-800/30 space-y-2" id="languages-settings-section">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-slate-750 dark:text-slate-300">
                    <Languages className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{t("languages_for_speaking", interfaceLanguage)}</span>
                  </div>

                  <div className="space-y-2 pl-1" id="languages-dropdowns-container">
                    {/* V Astra Language Option */}
                    <div className="space-y-1">
                      <label htmlFor="v-astra-lang-select" className="block text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-sans text-left">
                        {t("v_astra_lang", interfaceLanguage)}
                      </label>
                      <select
                        id="v-astra-lang-select"
                        value={vAstraLanguage || "English (India)"}
                        onChange={(e) => onVAstraLanguageChange(e.target.value)}
                        className="w-full text-xs bg-indigo-50/50 dark:bg-indigo-950/20 text-slate-850 dark:text-slate-100 border border-indigo-100 dark:border-indigo-900/60 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer font-semibold"
                      >
                        {V_ASTRA_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Primary Language */}
                    <div className="space-y-1">
                      <label htmlFor="primary-lang-select" className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 font-sans text-left">
                        {t("primary_recognition", interfaceLanguage)}
                      </label>
                      <select
                        id="primary-lang-select"
                        value={primaryLanguage}
                        onChange={(e) => onLanguageChange(e.target.value, secondaryLanguage)}
                        className="w-full text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                      >
                        {PRIMARY_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Secondary Language */}
                    <div className="space-y-1">
                      <label htmlFor="secondary-lang-select" className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 font-sans text-left">
                        {t("secondary_recognition", interfaceLanguage)}
                      </label>
                      <select
                        id="secondary-lang-select"
                        value={secondaryLanguage}
                        onChange={(e) => onLanguageChange(primaryLanguage, e.target.value)}
                        className="w-full text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                      >
                        {SECONDARY_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Try our Apps Section */}
                <div className="pt-2.5 border-t border-slate-100/30 dark:border-slate-800/30 space-y-1.5" id="try-our-apps-section">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>{t("try_our_apps", interfaceLanguage)}</span>
                  </div>
                  
                  {/* V-Trans App Link */}
                  <a
                    href="https://play.google.com/store/apps/details?id=com.vastra.vtrans"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-2 rounded-xl border border-slate-100/70 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/20 hover:bg-white/85 dark:hover:bg-slate-900/40 hover:border-slate-200/60 dark:hover:border-slate-750 transition-all duration-200 cursor-pointer group shadow-sm text-left decoration-none"
                    id="app-vtrans"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {t("v_trans", interfaceLanguage)}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      {t("voice_translator_desc", interfaceLanguage)}
                    </span>
                  </a>

                  {/* Vocalix Coming Soon App */}
                  <div
                    className="flex flex-col p-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 text-left"
                    id="app-vocalix"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-slate-400 dark:text-slate-500">
                        {t("vocalix", interfaceLanguage)}
                      </span>
                      <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-medium">
                        {t("coming_soon", interfaceLanguage)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      {t("malayalam_voice_desc", interfaceLanguage)}
                    </span>
                  </div>
                </div>

                {/* Support V-Astra / Rate App Section */}
                <div className="pt-2.5 border-t border-slate-100/30 dark:border-slate-800/30 space-y-1.5" id="rate-app-section">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{t("support_v_astra", interfaceLanguage)}</span>
                  </div>
                  <button
                    onClick={() => {
                      onOpenRatingModal();
                    }}
                    className="w-full flex flex-col p-2 rounded-xl border border-slate-100/70 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/20 hover:bg-white/85 dark:hover:bg-slate-900/40 hover:border-slate-200/60 dark:hover:border-slate-750 transition-all duration-200 cursor-pointer group shadow-sm text-left"
                    id="rate-app-trigger-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {t("rate_v_astra", interfaceLanguage)}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      {t("rate_v_astra_desc", interfaceLanguage)}
                    </span>
                  </button>
                </div>

                {/* Reset User Profile Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100/30 dark:border-slate-800/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{t("reset_onboarding_name", interfaceLanguage)}</span>
                  <button
                    onClick={() => {
                      if (confirm("Reset profile name and return to the onboarding flow?")) {
                        onResetUser();
                      }
                    }}
                    className="text-[11px] font-sans font-medium text-indigo-600 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    id="reset-name-btn"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {t("reset_name", interfaceLanguage)}
                  </button>
                </div>

                {/* Clear all chats */}
                {chats.length > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100/30 dark:border-slate-800/30">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">{t("clear_all_history", interfaceLanguage)}</span>
                    <button
                      onClick={() => {
                        if (confirm("This will permanently delete all conversation history. Are you sure?")) {
                          onClearAllChats();
                        }
                      }}
                      className="text-[11px] font-sans font-medium text-rose-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                      id="clear-all-history-btn"
                    >
                      <Trash className="w-3 h-3" />
                      {t("clear_all", interfaceLanguage)}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
