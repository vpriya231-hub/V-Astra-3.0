import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, MessageSquare, Edit2, Trash2, Check, X, Settings, 
  Sparkles, ChevronDown, Trash, RefreshCw, Sun, Moon, ExternalLink
} from "lucide-react";
import { ChatHistoryItem } from "../types";

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
}: SidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);

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

    chats.forEach(chat => {
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
        <div className="p-5 flex items-center justify-between border-b border-slate-100/40 dark:border-slate-800/30" id="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-slate-950/10">
              <Sparkles className="w-5 h-5 text-indigo-300 dark:text-indigo-100" />
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
        <div className="p-4" id="sidebar-actions">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full bg-slate-950 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white font-sans font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 group shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-slate-950/15 cursor-pointer transition-all duration-300"
            id="new-chat-btn"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            New Conversation
          </button>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6" id="chat-history-scroll-container">
          {chats.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No conversation history yet</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Start chatting to record your trace.</p>
            </div>
          ) : (
            groups.map(([groupName, items]) => (
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
            ))
          )}
        </div>

        {/* Sidebar Footer with interactive Gemini API Key Secret Box */}
        <div className="p-4 border-t border-slate-100/40 dark:border-slate-800/40 bg-white/35 dark:bg-slate-900/35 backdrop-blur-md" id="sidebar-footer">
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
                className="overflow-hidden space-y-3 pt-1 pb-2 border-t border-slate-100/50 dark:border-slate-800/30"
                id="expanded-settings"
              >
                {/* Theme Toggle Button (Request: light/dark theme toggle button should only be placed inside this Settings menu) */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">App Theme</span>
                  <button
                    onClick={onThemeToggle}
                    className="text-[11px] font-sans font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all duration-200"
                    id="theme-toggle-btn"
                  >
                    {theme === "light" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Try our Apps Section */}
                <div className="pt-2.5 border-t border-slate-100/30 dark:border-slate-800/30 space-y-1.5" id="try-our-apps-section">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Try our Apps</span>
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
                        V-Trans
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                      Voice & Text Translator
                    </span>
                  </a>

                  {/* Vocalix Coming Soon App */}
                  <div
                    className="flex flex-col p-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 text-left"
                    id="app-vocalix"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-slate-400 dark:text-slate-500">
                        Vocalix
                      </span>
                      <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-medium">
                        Coming Soon
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                      Malayalam AI Voice Over
                    </span>
                  </div>
                </div>

                {/* Reset User Profile Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100/30 dark:border-slate-800/30">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Reset onboarding name</span>
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
                    Reset Name
                  </button>
                </div>

                {/* Clear all chats */}
                {chats.length > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100/30 dark:border-slate-800/30">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">Clear all history</span>
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
                      Clear All
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
