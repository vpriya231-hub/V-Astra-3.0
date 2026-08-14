import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsUp, ThumbsDown, X, Send, Loader2 } from "lucide-react";
import { sendFeedbackToWebhook } from "../utils/feedbackUtils";

interface FeedbackModalProps {
  isOpen: boolean;
  initialType: "Liked" | "Disliked";
  onClose: () => void;
  onSubmitted: (toastMessage: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  initialType,
  onClose,
  onSubmitted,
}) => {
  const [feedbackType, setFeedbackType] = useState<"Liked" | "Disliked">(initialType);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setFeedbackType(initialType);
      setFeedbackText("");
      setIsSubmitting(false);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const nowFormatted = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const success = await sendFeedbackToWebhook({
      status: feedbackType,
      message: feedbackText.trim() || (feedbackType === "Liked" ? "User liked the response." : "User disliked the response."),
      timestamp: nowFormatted,
    });

    setIsSubmitting(false);

    if (success) {
      onSubmitted("Feedback submitted, thank you!");
      onClose();
    } else {
      onSubmitted("Failed to send feedback. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          id="feedback-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white font-sans">
                Send Feedback
              </h3>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Feedback Type Toggle (Liked vs Disliked) */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Response Quality:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackType("Liked")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    feedbackType === "Liked"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedbackType("Disliked")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    feedbackType === "Disliked"
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Needs Improvement</span>
                </button>
              </div>
            </div>

            {/* Text Area */}
            <div>
              <label htmlFor="feedback-text" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Your Feedback <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="feedback-text"
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, suggestions, or details to help us improve..."
                className="w-full px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
