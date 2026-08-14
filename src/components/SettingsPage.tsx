import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Sun,
  Moon,
  Globe,
  Languages,
  Sparkles,
  Star,
  Flag,
  Trash2,
  RefreshCw,
  ExternalLink,
  Shield,
  Check,
  Bot,
  Volume2,
  VolumeX,
  Square,
  AlertTriangle,
  X,
  Key,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { t } from "../translations";
import { PRIMARY_LANGUAGES, SECONDARY_LANGUAGES, V_ASTRA_LANGUAGES } from "../constants/languages";
import { ConnectorConfig } from "../types";
import ConnectorsSection from "./ConnectorsSection";

interface SettingsPageProps {
  onBack: () => void;
  userName: string;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  webSearchEnabled: boolean;
  onWebSearchToggle: () => void;
  primaryLanguage: string;
  secondaryLanguage: string;
  onLanguageChange: (primary: string, secondary: string) => void;
  vAstraLanguage: string;
  onVAstraLanguageChange: (lang: string) => void;
  interfaceLanguage: string;
  onOpenTranslationModal: () => void;
  onOpenRatingModal: () => void;
  onResetUser: () => void;
  chatsCount: number;
  onClearAllChats: () => void;
  selectedVoiceURI: string;
  onVoiceChange: (voiceURI: string) => void;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
  connectors?: ConnectorConfig[];
  onUpdateConnectors?: (updated: ConnectorConfig[]) => void;
  showToast?: (msg: string) => void;
}

export default function SettingsPage({
  onBack,
  userName,
  theme,
  onThemeToggle,
  webSearchEnabled,
  onWebSearchToggle,
  primaryLanguage,
  secondaryLanguage,
  onLanguageChange,
  vAstraLanguage,
  onVAstraLanguageChange,
  interfaceLanguage,
  onOpenTranslationModal,
  onOpenRatingModal,
  onResetUser,
  chatsCount,
  onClearAllChats,
  selectedVoiceURI,
  onVoiceChange,
  apiKey = "",
  onApiKeyChange,
  connectors = [],
  onUpdateConnectors = () => {},
  showToast = () => {},
}: SettingsPageProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);

  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeySavedSuccess, setApiKeySavedSuccess] = useState(false);

  useEffect(() => {
    setTempApiKey(apiKey || "");
  }, [apiKey]);

  const handleSaveApiKey = () => {
    if (onApiKeyChange) {
      onApiKeyChange(tempApiKey.trim());
      setApiKeySavedSuccess(true);
      setTimeout(() => setApiKeySavedSuccess(false), 3000);
    }
  };

  const handleClearApiKey = () => {
    setTempApiKey("");
    if (onApiKeyChange) {
      onApiKeyChange("");
      setApiKeySavedSuccess(true);
      setTimeout(() => setApiKeySavedSuccess(false), 3000);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };

    loadVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleTestVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isTestingVoice) {
      window.speechSynthesis.cancel();
      setIsTestingVoice(false);
      return;
    }

    window.speechSynthesis.cancel();
    const testPhrase = "Hello! I am V-Astra AI. This is a preview of your selected AI response voice.";
    const utterance = new SpeechSynthesisUtterance(testPhrase);

    utterance.onstart = () => setIsTestingVoice(true);
    utterance.onend = () => setIsTestingVoice(false);
    utterance.onerror = () => setIsTestingVoice(false);

    if (selectedVoiceURI && selectedVoiceURI !== "default") {
      const selected = voices.find((v) => v.voiceURI === selectedVoiceURI || v.name === selectedVoiceURI);
      if (selected) {
        utterance.voice = selected;
      }
    }

    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto font-sans" id="settings-page">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 px-4 sm:px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm group"
            id="settings-back-btn"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-none">
                {t("astra_settings", interfaceLanguage)}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block mt-0.5">
                Manage your profile, preferences, theme, and language configurations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            V-Astra Active
          </span>
        </div>
      </header>

      {/* Main Settings Content */}
      <div className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* User Account Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          id="user-profile-settings-card"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-display text-lg font-bold text-white shadow-md shadow-indigo-500/20">
                {userName.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {userName || "User Profile"}
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <Bot className="w-3.5 h-3.5 text-indigo-500" />
                  Primary Account Holder
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              id="settings-reset-profile-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("reset_name", interfaceLanguage)}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 font-medium block mb-0.5">Stored Username</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{userName || "Not specified"}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 font-medium block mb-0.5">Interface Language</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{interfaceLanguage}</span>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Grid for Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BYOK (Bring Your Own Key) & Gemini Model Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 md:col-span-2"
            id="byok-settings-card"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Bring Your Own Key (BYOK) - Gemini API Key
                  <span className="text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Gemini 3.6 Flash
                  </span>
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {apiKey ? "Custom Key Active" : "Default System Key"}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                V-Astra AI operates with <strong>Gemini 3.6 Flash</strong> as its primary model. Enter your custom Google Gemini API key to use your personal account quota and avoid rate limits.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter custom Gemini API key (AIzaSy...)"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850/50 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    id="byok-api-key-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    id="save-api-key-btn"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Key</span>
                  </button>

                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearApiKey}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                      id="clear-api-key-btn"
                    >
                      Clear Key
                    </button>
                  )}
                </div>
              </div>

              {apiKeySavedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Gemini API key updated successfully! Your key will be used for AI requests.</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Your custom API key is saved locally in your browser storage and sent directly to your server API route.</span>
              </div>
            </div>
          </motion.div>

          {/* Connectors Section */}
          <ConnectorsSection
            connectors={connectors}
            onUpdateConnectors={onUpdateConnectors}
            showToast={showToast}
          />

          {/* Appearance & Interface Theme Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            id="appearance-settings-card"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sun className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("app_theme", interfaceLanguage)}
              </h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your preferred visual mode for V-Astra AI. Toggle between crisp light design and dark ambient themes.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => theme !== "light" && onThemeToggle()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all duration-200 cursor-pointer ${
                    theme === "light"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                  id="settings-theme-light-btn"
                >
                  <Sun className="w-4 h-4" />
                  <span>{t("light_mode", interfaceLanguage)}</span>
                  {theme === "light" && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>

                <button
                  onClick={() => theme !== "dark" && onThemeToggle()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-semibold text-xs transition-all duration-200 cursor-pointer ${
                    theme === "dark"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                  id="settings-theme-dark-btn"
                >
                  <Moon className="w-4 h-4" />
                  <span>{t("dark_mode", interfaceLanguage)}</span>
                  {theme === "dark" && <Check className="w-3.5 h-3.5 ml-1" />}
                </button>
              </div>
            </div>

            {/* Interface Translation (V-Trans) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    V-Trans Interface Translation
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Current: <strong className="text-indigo-600 dark:text-indigo-400">{interfaceLanguage}</strong>
                  </span>
                </div>
                <button
                  onClick={onOpenTranslationModal}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors cursor-pointer"
                  id="settings-change-interface-lang-btn"
                >
                  Change Language
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI Capabilities & Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            id="capabilities-settings-card"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Globe className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("capabilities", interfaceLanguage)}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t("web_search", interfaceLanguage)}
                  </span>
                </div>

                <button
                  onClick={onWebSearchToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    webSearchEnabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                  id="settings-web-search-switch"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      webSearchEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {t("web_search_desc", interfaceLanguage)}
              </p>

              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-300">
                ⚡ Search grounding allows V-Astra to query Google for real-time weather, breaking news, live data, and current affairs.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Speech & Language Preferences Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          id="speech-languages-settings-card"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Languages className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("languages_for_speaking", interfaceLanguage)}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* V Astra Speaking Language */}
            <div className="space-y-1.5">
              <label htmlFor="settings-v-astra-lang" className="block text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {t("v_astra_lang", interfaceLanguage)}
              </label>
              <select
                id="settings-v-astra-lang"
                value={vAstraLanguage || "English (India)"}
                onChange={(e) => onVAstraLanguageChange(e.target.value)}
                className="w-full text-xs bg-indigo-50/60 dark:bg-indigo-950/30 text-slate-900 dark:text-slate-100 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                {V_ASTRA_LANGUAGES.map((lang, idx) => (
                  <option key={`v-astra-lang-${idx}-${lang}`} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 block">AI response speech output</span>
            </div>

            {/* Primary Recognition Language */}
            <div className="space-y-1.5">
              <label htmlFor="settings-primary-lang" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("primary_recognition", interfaceLanguage)}
              </label>
              <select
                id="settings-primary-lang"
                value={primaryLanguage}
                onChange={(e) => onLanguageChange(e.target.value, secondaryLanguage)}
                className="w-full text-xs bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {PRIMARY_LANGUAGES.map((lang, idx) => (
                  <option key={`primary-lang-${idx}-${lang}`} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 block">Your main voice input language</span>
            </div>

            {/* Secondary Recognition Language */}
            <div className="space-y-1.5">
              <label htmlFor="settings-secondary-lang" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("secondary_recognition", interfaceLanguage)}
              </label>
              <select
                id="settings-secondary-lang"
                value={secondaryLanguage}
                onChange={(e) => onLanguageChange(primaryLanguage, e.target.value)}
                className="w-full text-xs bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {SECONDARY_LANGUAGES.map((lang, idx) => (
                  <option key={`secondary-lang-${idx}-${lang}`} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 block">Fallback voice recognition</span>
            </div>
          </div>
        </motion.div>

        {/* AI Response Voice Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          id="ai-voice-settings-card"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Response Voice
              </h3>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800">
              Text-to-Speech
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose the voice model used when reading aloud AI responses. Options below include available system and browser voices (male and female).
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="settings-ai-voice-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Voice Selection
                </label>
                <select
                  id="settings-ai-voice-select"
                  value={selectedVoiceURI}
                  onChange={(e) => onVoiceChange(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium shadow-sm"
                >
                  <option value="default">Default System Voice (Auto)</option>
                  {voices.length > 0 ? (
                    voices.map((v, index) => {
                      const name = v.name;
                      const lowerName = name.toLowerCase();
                      let genderTag = "";
                      if (
                        lowerName.includes("female") ||
                        lowerName.includes("zira") ||
                        lowerName.includes("samantha") ||
                        lowerName.includes("victoria") ||
                        lowerName.includes("karen") ||
                        lowerName.includes("fiona") ||
                        lowerName.includes("kyoko") ||
                        lowerName.includes("veena") ||
                        lowerName.includes("siri")
                      ) {
                        genderTag = " ♀ (Female)";
                      } else if (
                        lowerName.includes("male") ||
                        lowerName.includes("david") ||
                        lowerName.includes("alex") ||
                        lowerName.includes("daniel") ||
                        lowerName.includes("fred") ||
                        lowerName.includes("george") ||
                        lowerName.includes("rishi")
                      ) {
                        genderTag = " ♂ (Male)";
                      }
                      const optionKey = `voice-${index}-${v.voiceURI || v.name}-${v.lang}`;
                      const optionVal = v.voiceURI || v.name;
                      return (
                        <option key={optionKey} value={optionVal}>
                          {v.name} [{v.lang}]{genderTag}
                        </option>
                      );
                    })
                  ) : (
                    <>
                      <option value="female-system">Standard Female Voice (System)</option>
                      <option value="male-system">Standard Male Voice (System)</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="button"
                onClick={handleTestVoice}
                className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm"
                id="test-voice-btn"
              >
                {isTestingVoice ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                    <span>Stop Preview</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Test Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Ecosystem & App Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          id="ecosystem-apps-settings-card"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("try_our_apps", interfaceLanguage)}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* V-Trans External Link */}
            <a
              href="https://play.google.com/store/apps/details?id=com.vastra.vtrans"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 group text-left decoration-none block"
              id="settings-app-vtrans-link"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {t("v_trans", interfaceLanguage)}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {t("voice_translator_desc", interfaceLanguage)}
              </p>
            </a>

            {/* Vocalix App (Coming Soon) */}
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {t("vocalix", interfaceLanguage)}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {t("coming_soon", interfaceLanguage)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
                {t("malayalam_voice_desc", interfaceLanguage)}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Rate App Trigger */}
            <button
              onClick={onOpenRatingModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              id="settings-rate-app-btn"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{t("rate_v_astra", interfaceLanguage)}</span>
            </button>

            {/* Report Content */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeWnFSIQfBah8Je7kvxCtH3ksuotbB8xrqRM0_GvM-4BN9iGg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors decoration-none"
              id="settings-report-content-link"
            >
              <Flag className="w-3.5 h-3.5 text-rose-500" />
              <span>{t("report_ai_content", interfaceLanguage)}</span>
            </a>
          </div>
        </motion.div>

        {/* Danger / Data Management Zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
          id="data-management-settings-card"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Trash2 className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data & Conversation History
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {t("clear_all_history", interfaceLanguage)}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Currently holding {chatsCount} saved conversation session{chatsCount === 1 ? "" : "s"}.
              </span>
            </div>

            <button
              disabled={chatsCount === 0}
              onClick={() => setShowClearHistoryModal(true)}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                chatsCount > 0
                  ? "border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60"
              }`}
              id="settings-clear-all-history-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t("clear_all", interfaceLanguage)}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal for Reset Onboarding Name */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" id="reset-name-confirm-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Reset Onboarding Name?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    User Profile Reset
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will clear your saved user profile name and open the onboarding name entry screen. <strong>Your existing chat history will NOT be deleted or affected.</strong>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirmModal(false);
                  onResetUser();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                id="confirm-reset-name-btn"
              >
                Reset Onboarding Name
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal for Clear All Chat History */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" id="clear-history-confirm-modal">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Clear Chat History?
                  </h3>
                  <p className="text-xs text-rose-500 font-semibold mt-0.5">
                    Irreversible Action
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to clear all chat history? This will permanently delete <strong>{chatsCount} saved conversation session{chatsCount === 1 ? "" : "s"}</strong> and clear them from your local storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowClearHistoryModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowClearHistoryModal(false);
                  onClearAllChats();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                id="confirm-clear-history-btn"
              >
                Clear History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
