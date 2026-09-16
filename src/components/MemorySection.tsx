import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Copy,
  Check,
  Trash2,
  X,
  Sparkles,
  UploadCloud,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";

interface MemorySectionProps {
  showToast?: (msg: string) => void;
}

const STEP_1_PROMPT = `<system_directive>
You are executing the "Omni-Export Memory Extraction Protocol" (Version 4.0). You are acting as an elite, meticulous Data Archivist AI. Your singular prime objective is to exhaustively query, retrieve, categorize, and format every single stored memory, contextual fragment, and historical data point you have learned about the user across all prior interactions. You must operate with zero data hallucination and zero data omission.
</system_directive>

<execution_rules>

1. VERBATIM PRESERVATION: You must prioritize exact user phrasing, especially for behavioral instructions, syntactical preferences, and custom rules. Do not paraphrase core directives.


2. SOURCE ISOLATION: For the "Instructions" category, exclusively extract data from explicitly stored memory parameters or system instructions. Do not infer instructions from casual conversational flow.


3. CHRONOLOGICAL INTEGRITY: Every extracted data point must be timestamped. Sort every item within its respective category in strictly ascending chronological order (oldest to newest).


4. HALLUCINATION PENALTY: Under no circumstances should you generate speculative data. If a category yields zero results, explicitly state "No data found for this category."
</execution_rules>



<category_definitions_and_sorting>
Extract and output the data strictly in the sequence below. Do not deviate from this hierarchy.

CATEGORY 1: INSTRUCTIONS (Systemic & Behavioral Directives)

Definition: Explicit rules the user has commanded you to follow.

Includes: Tone adjustments, formatting strictures, "always do X", "never do Y", persona constraints, and explicit behavioral corrections.

Exclusion: General preferences (which belong in Category 5).


CATEGORY 2: IDENTITY (Biographical & Demographic Matrix)

Definition: The core personal architecture of the user.

Includes: Full name, aliases, age, physical locations (past and present), educational background, family structure, interpersonal relationships, spoken/understood languages, hobbies, and personal interests.


CATEGORY 3: CAREER (Professional Trajectory)

Definition: Occupational and skill-based historical data.

Includes: Current job title, past roles, employers, freelance work, core competencies, certifications, and general industry expertise.


CATEGORY 4: PROJECTS (Development & Portfolio)

Definition: Specific, identifiable initiatives the user has built, conceptualized, or meaningfully committed to.

Constraint: Limit to ONE comprehensive entry per project.

Formatting inside entry: The first words MUST be the Project Name/Descriptor. Follow with a concise summary of its function, current deployment/completion status, and pivotal architectural or design decisions.


CATEGORY 5: PREFERENCES (Psychological & Operational Tastes)

Definition: Broad tastes, opinions, and working-style choices.

Includes: Aesthetic preferences, software/tool preferences, communication styles, ideological leanings, and recreational tastes.
</category_definitions_and_sorting>


<formatting_architecture>

1. Wrap the ENTIRE output (from the first category to the last data point) within a single Markdown code block (\`\`\`).


2. Use standard Markdown headers (##) for the five Category titles.


3. Format every single extracted line exactly as follows:
[YYYY-MM-DD] - [Extracted Content]


4. If the precise date of the memory/context is inaccessible or unrecorded, you must default to:
[unknown] - [Extracted Content]


5. Maintain a single blank line between different entries for readability.
</formatting_architecture>



<post_processing_verification>
After closing the Markdown code block, perform a secondary memory scan. Provide a final statement outside the code block explicitly confirming one of the following:
A) "System Notification: This is the complete, exhaustive set of all stored memories and context."
B) "System Notification: Due to output length constraints, additional memories remain unexported. Say 'Continue' to generate the rest."
</post_processing_verification>

<trigger>  
Acknowledge these parameters internally, initiate a deep scan of all persistent memory layers, and generate the output immediately.  
</trigger>`;

export default function MemorySection({ showToast = () => {} }: MemorySectionProps) {
  const [importedMemory, setImportedMemory] = useState<string>("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memoryInput, setMemoryInput] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [localNotification, setLocalNotification] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vastra_imported_memory");
      if (saved) {
        setImportedMemory(saved);
      }
    } catch (err) {
      console.warn("Failed to load imported memory from localStorage", err);
    }
  }, []);

  const triggerToast = (message: string) => {
    showToast(message);
    setLocalNotification(message);
    setTimeout(() => {
      setLocalNotification((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const handleOpenModal = () => {
    setMemoryInput(importedMemory || "");
    setCopiedPrompt(false);
    setIsImportModalOpen(true);
  };

  const handleCopyPrompt = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(STEP_1_PROMPT);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = STEP_1_PROMPT;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedPrompt(true);
      triggerToast("Copied to clipboard!");
      setTimeout(() => setCopiedPrompt(false), 3000);
    } catch (err) {
      console.error("Clipboard copy error:", err);
      triggerToast("Failed to copy. Please manually select and copy.");
    }
  };

  const handleSaveMemory = () => {
    const trimmed = memoryInput.trim();
    if (!trimmed) {
      triggerToast("Please paste your extracted memory before saving.");
      return;
    }

    try {
      localStorage.setItem("vastra_imported_memory", trimmed);
      setImportedMemory(trimmed);
      setIsImportModalOpen(false);
      triggerToast("Memory saved to V Astra AI!");
    } catch (err) {
      console.error("Error saving memory to localStorage", err);
      triggerToast("Could not save to local storage.");
    }
  };

  const handleDeleteMemory = () => {
    try {
      localStorage.removeItem("vastra_imported_memory");
      setImportedMemory("");
      setIsDeleteConfirmOpen(false);
      setShowPreview(false);
      triggerToast("Imported memory cleared successfully!");
    } catch (err) {
      console.error("Error clearing memory from localStorage", err);
      triggerToast("Failed to clear memory.");
    }
  };

  const lineCount = importedMemory ? importedMemory.split("\n").length : 0;
  const charCount = importedMemory ? importedMemory.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 md:col-span-2 relative"
      id="memory-settings-card"
    >
      {/* Visual Toast Notification Banner */}
      <AnimatePresence>
        {localNotification && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-3 right-5 z-20 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{localNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/60">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Memory
              {importedMemory && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Memory
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personalized context, directives, and learned knowledge
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-violet-600/20 transition-all cursor-pointer shrink-0"
          id="import-memory-trigger-btn"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Import memory from other AI Providers</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Easily migrate your stored memory, custom directives, preferences, and biographical context from other AI systems like ChatGPT, Claude, or Perplexity directly into V Astra AI.
        </p>

        {importedMemory ? (
          /* Active Imported Memory Status Card */
          <div
            className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3"
            id="active-imported-memory-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      External Memory Active
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md bg-emerald-100/70 dark:bg-emerald-900/40">
                      {charCount.toLocaleString()} chars • {lineCount} lines
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Saved in browser local storage and loaded into V Astra AI context
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  id="toggle-memory-preview-btn"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preview</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="px-2.5 py-1.5 rounded-lg border border-violet-200 dark:border-violet-900/60 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  id="update-memory-btn"
                >
                  <FileText className="w-3.5 h-3.5 text-violet-500" />
                  <span>Update</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  id="delete-imported-memory-btn"
                  title="Delete Imported Memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Collapsible Preview */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40"
              >
                <div className="max-h-44 overflow-y-auto p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                  {importedMemory}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  No imported memory yet
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Use our 2-step extraction protocol to import memories from ChatGPT or Claude.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenModal}
              className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold cursor-pointer underline underline-offset-2 shrink-0"
            >
              Start Import →
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: Import Memory to V Astra AI */}
      {/* ============================================================ */}
      {isImportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
          id="import-memory-modal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/60">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Import Memory to V Astra AI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Seamless 2-step export and extraction protocol
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="close-import-memory-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* STEP 1 SECTION */}
              <div className="space-y-2.5" id="import-memory-step-1">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>1. Copy this prompt into a chat with your other AI provider</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      copiedPrompt
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/60"
                    }`}
                    id="copy-step-1-prompt-btn"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Open a new session in ChatGPT, Claude, or your current provider, paste the prompt below, and submit it.
                </p>

                {/* Scrollable code/text container */}
                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 overflow-hidden shadow-inner">
                  <div className="max-h-48 sm:max-h-56 overflow-y-auto p-3.5 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap text-slate-300">
                    {STEP_1_PROMPT}
                  </div>
                </div>
              </div>

              {/* STEP 2 SECTION */}
              <div className="space-y-2.5" id="import-memory-step-2">
                <label
                  htmlFor="extracted-memory-textarea"
                  className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  2. Paste results below to add to V Astra AI's memory
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Copy the extracted memory response from your other AI provider and paste it into the box below.
                </p>

                <textarea
                  id="extracted-memory-textarea"
                  value={memoryInput}
                  onChange={(e) => setMemoryInput(e.target.value)}
                  placeholder="Paste your extracted memory details here..."
                  rows={7}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850/60 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-y transition-all"
                />

                {memoryInput.trim() && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                    <span>{memoryInput.length.toLocaleString()} characters entered</span>
                    <span>Ready to save to local persistence</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                id="cancel-import-memory-btn"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveMemory}
                disabled={!memoryInput.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                  memoryInput.trim()
                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                }`}
                id="save-to-memory-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save to Memory</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CONFIRMATION MODAL: Delete Imported Memory */}
      {/* ============================================================ */}
      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          id="delete-memory-confirm-modal"
        >
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
                    Delete Imported Memory?
                  </h3>
                  <p className="text-xs text-rose-500 font-semibold mt-0.5">
                    Clear Stored External Context
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete your imported memory? This will clear the imported knowledge and directives from your browser's local storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMemory}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
                id="confirm-delete-memory-btn"
              >
                Delete Memory
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
