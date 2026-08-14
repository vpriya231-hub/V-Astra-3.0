import React from "react";
import { motion } from "motion/react";
import { User, Sparkles } from "lucide-react";

export interface AiResponseLoaderProps {
  /**
   * The text prompt entered by the user
   */
  userPrompt?: string;
  /**
   * Optional image attached by the user with their prompt
   */
  userImage?: string;
  /**
   * The user's display name
   */
  userName?: string;
  /**
   * Custom status text next to the rotating logo
   * @default "AI is thinking..."
   */
  statusText?: string;
  /**
   * Path or URL to the logo image
   * @default "/logo.svg"
   */
  logoSrc?: string;
  /**
   * Timestamp string for the user message
   */
  timestamp?: string;
  /**
   * Custom CSS class for the container
   */
  className?: string;
}

/**
 * Modern AI Chat Response Loader Component
 * Renders user prompt in a chat bubble, followed directly below on the bottom left
 * by a circular container with a smoothly rotating AI logo and thinking status.
 */
export const AiResponseLoader: React.FC<AiResponseLoaderProps> = ({
  userPrompt = "Can you summarize the key takeaways and design a strategic roadmap for our next sprint?",
  userImage,
  userName = "You",
  statusText = "AI is thinking...",
  logoSrc = "/logo.svg",
  timestamp,
  className = "",
}) => {
  const formattedTime = timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-4 my-4 font-sans ${className}`} id="ai-response-loader-container">
      {/* 1. User Prompt Chat Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-start gap-3 justify-end"
        id="user-prompt-row"
      >
        {/* Chat Bubble Container */}
        <div className="max-w-[85%] sm:max-w-[78%] flex flex-col items-end">
          <div
            className="bg-slate-950 dark:bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm leading-relaxed shadow-sm border border-slate-900 dark:border-indigo-500/80"
            id="user-prompt-bubble"
          >
            {userImage && (
              <div className="mb-2 max-w-xs overflow-hidden rounded-xl border border-white/20">
                <img
                  src={userImage}
                  alt="User attachment"
                  className="w-full h-auto object-cover max-h-48"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <p className="whitespace-pre-wrap font-medium">{userPrompt}</p>

            <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-slate-400 dark:text-indigo-200 select-none">
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* User Avatar */}
        <div
          className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 shadow-2xs mt-0.5"
          id="user-avatar-badge"
          title={userName}
        >
          <User className="w-4 h-4" />
        </div>
      </motion.div>

      {/* 2. Directly Below User Prompt - AI Loader (Bottom-Left Aligned) */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="flex items-center gap-3 justify-start pl-0 sm:pl-1 pt-1"
        id="ai-processing-status-row"
      >
        {/* Small Circular Container with Continuously Rotating Logo */}
        <div className="relative group">
          {/* Subtle glowing ring behind circular logo container */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 opacity-40 blur-xs animate-pulse" />

          <div
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden p-1.5 shrink-0"
            id="logo-circle-container"
          >
            {/* Smoothly Rotating AI Logo */}
            <motion.img
              src={logoSrc}
              alt="AI Processing Logo"
              className="w-full h-full object-contain select-none pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              onError={(e) => {
                // Inline SVG fallback if logoSrc fails to load
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback = target.nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = "block";
              }}
            />
            {/* Fallback Swirl SVG if image file missing */}
            <svg
              className="w-full h-full hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                className="text-slate-900 dark:text-white"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* AI Thinking Status Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md shadow-2xs"
          id="ai-thinking-badge"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide font-sans flex items-center gap-1">
            {statusText}
          </span>

          {/* Animated Thinking Wave Dots */}
          <div className="flex items-center gap-1 ml-0.5" id="thinking-dots">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
            />
          </div>

          <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400 animate-pulse ml-0.5" />
        </div>
      </motion.div>
    </div>
  );
};

export default AiResponseLoader;
