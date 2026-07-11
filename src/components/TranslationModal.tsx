import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Globe, Sparkles } from "lucide-react";
import { LANGUAGES, Language } from "../translations";
import VTransLogo from "./VTransLogo";

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  currentLanguage: string;
}

export default function TranslationModal({
  isOpen,
  onClose,
  onSelectLanguage,
  currentLanguage,
}: TranslationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter languages by search query
  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group languages into Indian and Global
  const indianLanguages = filteredLanguages.filter((lang) => lang.isIndian);
  const globalLanguages = filteredLanguages.filter((lang) => !lang.isIndian);

  // Determine if active language match
  const isActive = (langName: string) => {
    // Exact match or contains
    return (
      currentLanguage.toLowerCase().includes(langName.toLowerCase()) ||
      langName.toLowerCase().includes(currentLanguage.toLowerCase())
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="translation-modal-overlay">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal card content */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl h-[85vh] sm:h-[75vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
          id="translation-modal-card"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                <VTransLogo className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                  Translate V-Astra Interface
                  <span className="text-[10px] font-sans font-bold text-orange-600 dark:text-orange-400 border border-orange-500/30 bg-orange-500/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    V-Trans
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  Select a language to translate all static textual UI elements.
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl transition-all cursor-pointer"
              aria-label="Close translation menu"
              id="translation-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-5 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800/40 bg-white dark:bg-slate-900 flex items-center gap-2.5">
            <div className="flex-1 flex items-center gap-2 bg-slate-50/80 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl px-3.5 py-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/80 transition-all duration-300">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search major Indian or global languages..."
                className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-sans focus:ring-0 focus:outline-none"
                id="language-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages Grid Section */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800" id="languages-scrollable-area">
            
            {/* 1. Indian Languages Section */}
            {indianLanguages.length > 0 && (
              <div className="space-y-3" id="indian-languages-grid-section">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h4 className="font-sans font-bold text-xs text-orange-600 dark:text-orange-400 uppercase tracking-widest text-left">
                    Major Indian Languages
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {indianLanguages.map((lang) => {
                    const active = isActive(lang.name);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => onSelectLanguage(lang)}
                        className={`group p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[76px] ${
                          active
                            ? "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/80 shadow-[0_4px_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/40"
                            : "bg-slate-50/40 dark:bg-slate-950/10 border-slate-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-850 hover:border-orange-500/30 hover:shadow-md hover:shadow-slate-100/30 dark:hover:shadow-none hover:translate-y-[-1px]"
                        }`}
                        id={`lang-btn-${lang.code}`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                            {lang.code.toUpperCase()}
                          </span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                          )}
                        </div>
                        <div className="mt-1">
                          <p className={`text-xs font-semibold ${active ? "text-orange-600 dark:text-orange-400" : "text-slate-500 dark:text-slate-400"}`}>
                            {lang.name}
                          </p>
                          <p className={`text-xs font-display font-bold leading-tight ${active ? "text-orange-600 dark:text-orange-300" : "text-slate-800 dark:text-slate-200"}`}>
                            {lang.nativeName}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Global Languages A-Z Section */}
            {globalLanguages.length > 0 && (
              <div className="space-y-3" id="global-languages-grid-section">
                <div className="flex items-center gap-2 px-1 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <Globe className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <h4 className="font-sans font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-left">
                    Global Languages (A-Z)
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {globalLanguages.map((lang) => {
                    const active = isActive(lang.name);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => onSelectLanguage(lang)}
                        className={`group p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[76px] ${
                          active
                            ? "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/80 shadow-[0_4px_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/40"
                            : "bg-slate-50/40 dark:bg-slate-950/10 border-slate-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-850 hover:border-orange-500/30 hover:shadow-md hover:shadow-slate-100/30 dark:hover:shadow-none hover:translate-y-[-1px]"
                        }`}
                        id={`lang-btn-${lang.code}`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500">
                            {lang.code.toUpperCase()}
                          </span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                          )}
                        </div>
                        <div className="mt-1">
                          <p className={`text-xs font-semibold ${active ? "text-orange-600 dark:text-orange-400" : "text-slate-500 dark:text-slate-400"}`}>
                            {lang.name}
                          </p>
                          <p className={`text-xs font-display font-bold leading-tight ${active ? "text-orange-600 dark:text-orange-300" : "text-slate-800 dark:text-slate-200"}`}>
                            {lang.nativeName}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="text-center py-16 px-4" id="language-search-empty">
                <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-sans font-semibold text-slate-600 dark:text-slate-400">
                  No languages match "{searchQuery}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try checking your spelling or searching for a different language.
                </p>
              </div>
            )}
          </div>

          {/* Footer details */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal font-sans">
              Powered by V-Trans Engine • Translating layout files in real time.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
