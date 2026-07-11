import React from "react";
import { motion } from "motion/react";
import VTransLogo from "./VTransLogo";

interface TranslationTransitionProps {
  isVisible: boolean;
  targetLanguage: string;
}

export default function TranslationTransition({
  isVisible,
  targetLanguage,
}: TranslationTransitionProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md overflow-hidden"
      id="translation-transition-overlay"
    >
      {/* Decorative Wave Waveforms / Ripple circles in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Soft orange background waves */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 2.5, 4], opacity: [0.35, 0.15, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 blur-xl"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 2.2, 3.5], opacity: [0.3, 0.1, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.6,
            ease: "easeOut",
          }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 blur-xl"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.8, 2.8], opacity: [0.25, 0.05, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 1.2,
            ease: "easeOut",
          }}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-orange-600 to-red-500 blur-xl"
        />

        {/* Diagonal Wave Wavebars passing from left to right */}
        <motion.div
          initial={{ x: "-100%", skewX: -15 }}
          animate={{ x: "120%" }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 bottom-0 w-[45%] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent pointer-events-none"
        />
        <motion.div
          initial={{ x: "-120%", skewX: -15 }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2.0,
            repeat: Infinity,
            delay: 0.3,
            ease: "easeInOut",
          }}
          className="absolute top-0 bottom-0 w-[35%] bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none"
        />
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 5, 0], opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 relative"
        >
          {/* Pulsing Orange Border Ring */}
          <div className="absolute inset-0 rounded-full border border-orange-500/40 animate-ping pointer-events-none" />
          
          <div className="w-24 h-24 bg-white/5 rounded-3xl p-3 border border-orange-500/30 shadow-[0_0_40px_rgba(251,146,60,0.25)] flex items-center justify-center backdrop-blur-sm">
            <VTransLogo className="w-18 h-18 text-orange-500" />
          </div>
        </motion.div>

        {/* Loading Spinner ring around logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 mb-6"
        />

        <motion.h3
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-display font-bold text-2xl tracking-tight text-white mb-2"
        >
          Applying V-Trans
        </motion.h3>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-sans text-sm text-orange-400 font-semibold"
        >
          Translating interface to {targetLanguage}...
        </motion.p>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-sans text-[11px] text-slate-400 mt-4 tracking-wide max-w-xs leading-relaxed"
        >
          Please wait while we adapt textual UI elements for the chosen dialect.
        </motion.p>
      </div>
    </motion.div>
  );
}
