import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { 
  Menu, Send, Sparkles, User, AlertCircle, HelpCircle, 
  ArrowUpRight, Bot, Compass, MessageSquare, CornerDownLeft
} from "lucide-react";
import { Message } from "../types";

interface ChatAreaProps {
  messages: Message[];
  activeChatTitle: string;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  userName: string;
  isReturningUser: boolean;
}

const STARTER_PROMPTS = [
  {
    icon: Compass,
    title: "Weekend Escapes",
    description: "Plan a slow-travel weekend in a coastal town",
    prompt: "Design a slow-travel 2-day weekend itinerary for a peaceful coastal getaway with local food spots."
  },
  {
    icon: Sparkles,
    title: "Brand Name Crafting",
    description: "Brainstorm elegant, modern startup names",
    prompt: "I need 5 elegant, futuristic, and highly memorable names for an AI-powered design studio. Please include the branding vibe for each."
  },
  {
    icon: Bot,
    title: "Email Refinement",
    description: "Politely negotiate a timeline extension",
    prompt: "Draft an elegant and highly professional email to a client explaining that we need a 4-day extension to deliver pristine visual quality."
  },
  {
    icon: HelpCircle,
    title: "Analogy Explainer",
    description: "Explain APIs using standard cooking analogies",
    prompt: "Explain how APIs and servers work using a clean kitchen/cooking analogy so a beginner can grasp it instantly."
  }
];

export default function ChatArea({
  messages,
  activeChatTitle,
  onSendMessage,
  isLoading,
  onToggleSidebar,
  userName,
  isReturningUser,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-slate-950 relative overflow-hidden" id="chat-area-root">
      
      {/* Top Navigation Bar */}
      <header 
        className="h-16 shrink-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/50 flex items-center justify-between px-4 z-30"
        id="chat-header"
      >
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            aria-label="Open navigation sidebar"
            id="sidebar-toggle-btn"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            {/* Request: "display that name at the very top of the app in bold, along with a time-based greeting according to their local time" */}
            <div className="text-[10px] sm:text-xs font-sans text-slate-500 dark:text-slate-400 leading-none mb-0.5">
              {isReturningUser ? (
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">{userName}</strong> Returns!
                </span>
              ) : (
                (() => {
                  const hours = new Date().getHours();
                  let salutation = "Good Morning";
                  if (hours >= 12 && hours < 18) {
                    salutation = "Good Afternoon";
                  } else if (hours >= 18 && hours < 22) {
                    salutation = "Good Evening";
                  } else if (hours >= 22 || hours < 5) {
                    salutation = "Good Night";
                  }
                  return (
                    <span>
                      {salutation}, <strong className="font-bold text-slate-900 dark:text-white">{userName}</strong>
                    </span>
                  );
                })()
              )}
            </div>
            <h1 className="font-display font-semibold text-xs text-slate-400 dark:text-slate-500 truncate max-w-[150px] sm:max-w-[180px] md:max-w-[300px]">
              {messages.length > 0 ? activeChatTitle : "Astra Playground"}
            </h1>
          </div>
        </div>

        {/* Premium Badge indicating system status */}
        <div className="flex items-center gap-2" id="chat-header-badge">
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/40 px-2 py-1 rounded-md">
            gemini-2.5-flash
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="System online" />
        </div>
      </header>

      {/* Main Container: Chat Stream or Welcoming Dashboard */}
      <div className="flex-1 overflow-y-auto bg-slate-50/20 dark:bg-slate-950/20 px-4 py-6" id="chat-stream-viewport">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          
          {messages.length === 0 ? (
            /* Pristine Welcoming Dashboard (Empty State) */
            <div className="my-auto flex flex-col justify-center py-8" id="empty-dashboard">
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                {/* Floating Aesthetic Brand Sparkle */}
                <div className="w-12 h-12 rounded-xl bg-slate-950/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800/50 animate-float">
                  <Sparkles className="w-6 h-6 text-slate-850 dark:text-indigo-400" />
                </div>
                
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Welcome to Astra, <span className="text-slate-600 dark:text-slate-400 font-normal">{userName}</span>
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm max-w-sm mx-auto mt-2 font-sans leading-relaxed">
                  How can your neural companion assist your thoughts or optimize your daily creations today?
                </p>
              </motion.div>

              {/* Bento Grid Capsule Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="starter-prompts-grid">
                {STARTER_PROMPTS.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      onClick={() => onSendMessage(item.prompt)}
                      className="group p-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl cursor-pointer hover:shadow-md dark:hover:shadow-none hover:shadow-slate-100/40 transition-all duration-300"
                      id={`starter-card-${idx}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl group-hover:bg-slate-100 dark:group-hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h3 className="font-display font-medium text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            {item.title}
                            <ArrowUpRight className="w-3 h-3 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                          </h3>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-sans truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Active Message Stream */
            <div className="space-y-6 pb-24" id="message-bubbles-list">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
                    id={`message-row-${message.id}`}
                  >
                    {/* Bot Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm border border-slate-900/10 dark:border-indigo-500/20">
                        <Bot className="w-4 h-4 text-indigo-300 dark:text-indigo-100" />
                      </div>
                    )}

                    {/* Message Bubble Container */}
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm font-sans ${
                        isUser 
                          ? "bg-slate-950 dark:bg-indigo-600 text-white rounded-tr-none border border-slate-900 dark:border-indigo-500" 
                          : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-800"
                      }`}
                      id={`bubble-${message.id}`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="markdown-body prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-100 text-sm prose-p:leading-relaxed prose-pre:bg-slate-50 dark:prose-pre:bg-slate-950 prose-pre:border dark:prose-pre:border-slate-800 prose-pre:border-slate-100 prose-pre:rounded-xl">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      )}
                      
                      <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 select-none">
                        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200/40 dark:border-slate-700">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Server-Side Fetching Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3.5 justify-start"
                  id="chat-loading-indicator"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-950 dark:bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm border border-slate-900/10 dark:border-indigo-500/20">
                    <Bot className="w-4 h-4 text-indigo-300 dark:text-indigo-100" />
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/50 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

        </div>
      </div>

      {/* Message Input Area */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent pt-8 pb-4 px-4 z-20"
        id="chat-input-bar-container"
      >
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none rounded-2xl p-1.5 flex items-end gap-1 focus-within:ring-2 focus-within:ring-slate-950/20 dark:focus-within:ring-indigo-500/20 focus-within:border-slate-950 dark:focus-within:border-indigo-500 transition-all duration-300"
            id="chat-input-form"
          >
            <textarea
              id="chat-message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Astra anything..."
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none text-sm px-3.5 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans resize-none max-h-32 min-h-[44px] focus:ring-0 focus:outline-none"
            />
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${
                input.trim() && !isLoading
                  ? "bg-slate-950 dark:bg-indigo-600 text-white shadow-md hover:bg-slate-900 dark:hover:bg-indigo-500 hover:shadow-lg"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800/50"
              }`}
              title="Send Message"
              id="message-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick tips label */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5" id="input-help-tips">
            <CornerDownLeft className="w-3 h-3 text-slate-450 dark:text-slate-500" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans text-center">
              Press <kbd className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">Shift+Enter</kbd> for new line.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
