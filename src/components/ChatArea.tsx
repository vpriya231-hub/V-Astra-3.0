import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { 
  Menu, Send, Sparkles, User, AlertCircle, HelpCircle, 
  ArrowUpRight, Bot, Compass, MessageSquare, CornerDownLeft,
  ChevronDown, Plus, Mic, X, Image, Camera, Upload
} from "lucide-react";
import { Message } from "../types";

interface ChatAreaProps {
  messages: Message[];
  activeChatTitle: string;
  onSendMessage: (content: string, image?: { mimeType: string; data: string }) => void;
  isLoading: boolean;
  onToggleSidebar: () => void;
  userName: string;
  isReturningUser: boolean;
  aiMode: "standard" | "medium" | "thinking";
  onAiModeChange: (mode: "standard" | "medium" | "thinking") => void;
  vAstraLanguage: string;
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

const LANGUAGE_CODES: Record<string, { recognition: string; synthesis: string }> = {
  "English (India)": { recognition: "en-IN", synthesis: "en-IN" },
  "Malayalam (മലയാളം)": { recognition: "ml-IN", synthesis: "ml-IN" },
  "Hindi (हिंदी)": { recognition: "hi-IN", synthesis: "hi-IN" },
  "Tamil (தமிழ்)": { recognition: "ta-IN", synthesis: "ta-IN" },
  "Telugu (తెలుగు)": { recognition: "te-IN", synthesis: "te-IN" },
  "Bengali (বাংলা)": { recognition: "bn-IN", synthesis: "bn-IN" },
  "Spanish (Español)": { recognition: "es-ES", synthesis: "es-ES" },
  "French (Français)": { recognition: "fr-FR", synthesis: "fr-FR" },
  "German (Deutsch)": { recognition: "de-DE", synthesis: "de-DE" },
  "Japanese (日本語)": { recognition: "ja-JP", synthesis: "ja-JP" },
  "Korean (한국어)": { recognition: "ko-KR", synthesis: "ko-KR" },
  "Russian (Русский)": { recognition: "ru-RU", synthesis: "ru-RU" },
  "Arabic (العربية)": { recognition: "ar-AE", synthesis: "ar-AE" },
};

const detectVoiceLanguage = (text: string, defaultLang: string): string => {
  if (/[\u0d00-\u0d7f]/.test(text)) return "Malayalam (മലയാളം)";
  if (/[\u0900-\u097f]/.test(text)) return "Hindi (हिंदी)";
  if (/[\u0b80-\u0bff]/.test(text)) return "Tamil (தமிழ்)";
  if (/[\u0c00-\u0c7f]/.test(text)) return "Telugu (తెలుగు)";
  if (/[\u0980-\u09ff]/.test(text)) return "Bengali (বাংলা)";
  if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(text)) return "Japanese (日本語)";
  if (/[\uac00-\ud7af\u1100-\u11ff]/.test(text)) return "Korean (한국어)";
  if (/[\u0400-\u04ff]/.test(text)) return "Russian (Русский)";
  if (/[\u0600-\u06ff]/.test(text)) return "Arabic (العربية)";
  return defaultLang;
};

const WaveformBars = ({ state }: { state: "idle" | "listening" | "thinking" | "speaking" }) => {
  const barsCount = 15;
  const bars = Array.from({ length: barsCount });

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 w-full">
      {bars.map((_, i) => {
        let baseHeight = "h-2";
        let animateProps = {};

        if (state === "listening") {
          animateProps = {
            scaleY: [1, 2.5, 1, 3.2, 1],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut"
            }
          };
        } else if (state === "speaking") {
          animateProps = {
            scaleY: [1, 3.5, 1, 4.5, 1],
            transition: {
              duration: 1.1,
              repeat: Infinity,
              delay: i * 0.07,
              ease: "easeInOut"
            }
          };
        } else if (state === "thinking") {
          animateProps = {
            scaleY: [1, 1.8, 1],
            opacity: [0.4, 1, 0.4],
            transition: {
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }
          };
        } else {
          animateProps = {
            scaleY: [1, 1.3, 1],
            transition: {
              duration: 2.0,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }
          };
        }

        return (
          <motion.div
            key={i}
            animate={animateProps}
            style={{ transformOrigin: "center" }}
            className={`w-[3px] rounded-full transition-colors duration-300 ${
              state === "listening"
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : state === "speaking"
                ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                : state === "thinking"
                ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                : "bg-slate-300 dark:bg-slate-650"
            } ${baseHeight}`}
          />
        );
      })}
    </div>
  );
};

export default function ChatArea({
  messages,
  activeChatTitle,
  onSendMessage,
  isLoading,
  onToggleSidebar,
  userName,
  isReturningUser,
  aiMode,
  onAiModeChange,
  vAstraLanguage,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<{ mimeType: string; data: string; name: string } | null>(null);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [voiceAssistantTranscript, setVoiceAssistantTranscript] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle active listening/speaking toggling based on voiceModeActive or muting state
  useEffect(() => {
    if (voiceModeActive && !isMicMuted && voiceState !== "speaking" && voiceState !== "thinking" && !isLoading) {
      setVoiceState("listening");
      startSpeechRecognition();
    } else if (!voiceModeActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setVoiceState("idle");
    }
  }, [voiceModeActive, isMicMuted]);

  // Auto speak incoming replies from Gemini when V Astra Voice Assistant is running
  useEffect(() => {
    if (messages.length === 0 || !voiceModeActive) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "assistant") {
      const detectedLang = detectVoiceLanguage(lastMessage.content, vAstraLanguage);
      speakText(lastMessage.content, detectedLang);
    }
  }, [messages, voiceModeActive]);

  // Sync state when loading from AI server
  useEffect(() => {
    if (isLoading && voiceModeActive) {
      setVoiceState("thinking");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  }, [isLoading, voiceModeActive]);

  // Component cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid PNG, JPG, or JPEG image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImage({
        mimeType: file.type,
        data: dataUrl,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;

    const targetCode = LANGUAGE_CODES[vAstraLanguage]?.recognition || "en-IN";
    recognition.lang = targetCode;

    recognition.onstart = () => {
      setVoiceState("listening");
      setVoiceAssistantTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setVoiceAssistantTranscript(finalTranscript || interimTranscript);

      if (finalTranscript.trim()) {
        onSendMessage(finalTranscript.trim());
        setVoiceState("thinking");
        recognition.stop();
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setTimeout(() => {
        if (voiceModeActive && !isMicMuted && !isLoading && !currentUtteranceRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      }, 600);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  const speakText = (text: string, languageName: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Clean Markdown characters out of speech text
    const cleanText = text
      .replace(/[*#`_~]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;
    
    const targetCode = LANGUAGE_CODES[languageName]?.synthesis || "en-IN";
    utterance.lang = targetCode;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    utterance.onstart = () => {
      setVoiceState("speaking");
    };

    utterance.onend = () => {
      currentUtteranceRef.current = null;
      if (voiceModeActive && !isMicMuted) {
        setVoiceState("listening");
        startSpeechRecognition();
      } else {
        setVoiceState("idle");
      }
    };

    utterance.onerror = () => {
      currentUtteranceRef.current = null;
      if (voiceModeActive && !isMicMuted) {
        setVoiceState("listening");
        startSpeechRecognition();
      } else {
        setVoiceState("idle");
      }
    };

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().replace("_", "-") === targetCode.toLowerCase() || v.lang.startsWith(targetCode.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), uploadedImage ? { mimeType: uploadedImage.mimeType, data: uploadedImage.data } : undefined);
    setInput("");
    handleRemoveImage();
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
                      {message.image && message.image.data && (
                        <div className="mb-2 max-w-xs overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800">
                          <img 
                            src={message.image.data} 
                            alt="Attached file" 
                            className="w-full h-auto object-cover max-h-48"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

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
          {/* Hidden Device File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            id="device-image-picker"
          />

          {/* Image Upload Thumbnail Preview */}
          <AnimatePresence>
            {uploadedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mb-2 relative inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 pr-3.5 max-w-xs shadow-sm"
                id="image-preview-thumbnail"
              >
                <img 
                  src={uploadedImage.data} 
                  alt="Uploaded Thumbnail" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-150 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-sans font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{uploadedImage.name}</p>
                  <p className="text-[9px] font-sans text-emerald-600 dark:text-emerald-400 font-medium">Ready to send</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100/50 dark:shadow-none rounded-2xl p-1.5 flex items-end gap-1 focus-within:ring-2 focus-within:ring-slate-950/20 dark:focus-within:ring-indigo-500/20 focus-within:border-slate-950 dark:focus-within:border-indigo-500 transition-all duration-300"
            id="chat-input-form"
          >
            {/* Gemini-Style Upload "+" Button on the Left */}
            <button
              type="button"
              onClick={handleTriggerFilePicker}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 mb-1 cursor-pointer"
              title="Upload Image (PNG, JPG, JPEG)"
              id="image-upload-trigger-btn"
            >
              <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            <textarea
              id="chat-message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Astra anything..."
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none text-sm px-2 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans resize-none max-h-32 min-h-[44px] focus:ring-0 focus:outline-none"
            />
            
            {/* Beautiful Voice Assistant Pulse Button */}
            <button
              type="button"
              onClick={() => setVoiceModeActive(true)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 mb-1 cursor-pointer"
              title="V Astra Voice Assistant"
              id="voice-assistant-trigger-btn"
            >
              <Mic className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
            </button>

            <button
              type="submit"
              disabled={(!input.trim() && !uploadedImage) || isLoading}
              className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer mb-1 ${
                (input.trim() || uploadedImage) && !isLoading
                  ? "bg-slate-950 dark:bg-indigo-600 text-white shadow-md hover:bg-slate-900 dark:hover:bg-indigo-500 hover:shadow-lg"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800/50"
              }`}
              title="Send Message"
              id="message-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* AI Mode Selector Dropdown */}
          <div className="mt-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5" id="ai-mode-selector-container">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Engine Mode</span>
            </span>
            <div className="relative">
              <select
                id="ai-mode-dropdown"
                value={aiMode}
                onChange={(e) => onAiModeChange(e.target.value as "standard" | "medium" | "thinking")}
                className="appearance-none bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg py-1 pl-2.5 pr-8 text-[11px] sm:text-xs font-sans font-medium text-slate-700 dark:text-slate-200 hover:border-slate-350 dark:hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-all duration-200"
              >
                <option value="standard">Standard (Normal tasks, daily problems, more fast)</option>
                <option value="medium">Medium (All rounder help)</option>
                <option value="thinking">Thinking (Advanced maths and code)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 dark:text-slate-500">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Quick tips label */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5" id="input-help-tips">
            <CornerDownLeft className="w-3 h-3 text-slate-450 dark:text-slate-500" />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans text-center">
              Press <kbd className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-[9px] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">Shift+Enter</kbd> for new line.
            </p>
          </div>
        </div>
      </div>

      {/* V Astra Voice Assistant Overlay (Drawer-style Sliding Panel) */}
      <AnimatePresence>
        {voiceModeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            id="voice-assistant-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl w-full max-w-md relative overflow-hidden"
              id="voice-assistant-card"
            >
              {/* Outer Glow Effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header Title & Close */}
              <div className="flex items-center justify-between mb-8 z-10 relative">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="font-sans font-semibold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    V Astra Voice Assistant
                  </span>
                </div>
                <button
                  onClick={() => setVoiceModeActive(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer"
                  title="Close Assistant"
                  id="voice-assistant-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Waveform Oval Container */}
              <div className="flex flex-col items-center justify-center mb-8 relative">
                <p className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-100 mb-1 capitalize">
                  {voiceState === "listening" ? "Listening to you..." : 
                   voiceState === "speaking" ? "Astra is speaking..." : 
                   voiceState === "thinking" ? "Thinking..." : "Ready"}
                </p>
                <p className="text-[11px] font-sans text-slate-400 dark:text-slate-500 mb-6 text-center max-w-[250px] truncate h-4">
                  {voiceAssistantTranscript || `Speak in your ${vAstraLanguage} preference`}
                </p>

                {/* Main Glowing Oval Waveform Window */}
                <div className="w-64 h-36 rounded-full bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/40 shadow-inner flex flex-col items-center justify-center relative overflow-hidden px-6">
                  {/* Glowing background circles */}
                  <div className={`absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 transition-opacity duration-700 ${voiceState !== "idle" ? "opacity-100 animate-pulse" : "opacity-0"}`} />
                  
                  {/* Dynamic wave visualizer */}
                  <WaveformBars state={voiceState} />
                </div>
              </div>

              {/* Assistant control bar buttons matching reference images */}
              <div className="flex items-center justify-center gap-4 z-10 relative">
                {/* Round video toggle */}
                <button
                  type="button"
                  className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250 cursor-pointer transition-all"
                  title="Video Stream"
                >
                  <Camera className="w-5 h-5" />
                </button>

                {/* Round upload icon */}
                <button
                  type="button"
                  onClick={() => {
                    handleTriggerFilePicker();
                  }}
                  className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250 cursor-pointer transition-all"
                  title="Upload Attachment"
                >
                  <Upload className="w-5 h-5" />
                </button>

                {/* Microphone toggle icon (Mute) */}
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-4 rounded-full border shadow-md transition-all cursor-pointer ${
                    isMicMuted
                      ? "bg-rose-550 dark:bg-rose-600 text-white border-rose-650 hover:bg-rose-600 dark:hover:bg-rose-500"
                      : "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-400"
                  }`}
                  title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                  id="voice-mic-mute-btn"
                >
                  {isMicMuted ? (
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
