import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, RotateCw, Save, Loader2 } from "lucide-react";
import { VFlowTask } from "../lib/supabase";

interface VFlowEditModalProps {
  isOpen: boolean;
  task: VFlowTask | null;
  onClose: () => void;
  onSave: (updatedTask: Partial<VFlowTask>) => Promise<void>;
}

export const VFlowEditModal: React.FC<VFlowEditModalProps> = ({
  isOpen,
  task,
  onClose,
  onSave,
}) => {
  const [prompt, setPrompt] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [frequency, setFrequency] = useState<"One-time" | "Daily">("One-time");
  const [status, setStatus] = useState<"scheduled" | "completed">("scheduled");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setPrompt(task.prompt || "");
      // Convert ISO string to datetime-local format YYYY-MM-THH:mm if possible
      try {
        const d = new Date(task.scheduled_time);
        if (!isNaN(d.getTime())) {
          const tzOffset = d.getTimezoneOffset() * 60000;
          const localIso = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
          setScheduledTime(localIso);
        } else {
          setScheduledTime(task.scheduled_time);
        }
      } catch {
        setScheduledTime(task.scheduled_time);
      }
      setFrequency((task.frequency as "One-time" | "Daily") || (task.schedule_type as "One-time" | "Daily") || "One-time");
      setStatus((task.status as "scheduled" | "completed") || "scheduled");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    try {
      // Save scheduled time as ISO string
      let formattedScheduledTime = scheduledTime;
      const parsedDate = new Date(scheduledTime);
      if (!isNaN(parsedDate.getTime())) {
        formattedScheduledTime = parsedDate.toISOString();
      }

      await onSave({
        prompt: prompt.trim(),
        scheduled_time: formattedScheduledTime,
        frequency,
        status,
      });
      onClose();
    } catch (err) {
      console.error("Error saving task edit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          id="v-flow-edit-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <span>Edit V Flow Task</span>
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Prompt Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Task Description / Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your V Flow task..."
                required
                className="w-full px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Date & Time Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Scheduled Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            {/* Frequency Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency("One-time")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    frequency === "One-time"
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>One-time</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFrequency("Daily")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    frequency === "Daily"
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Daily</span>
                </button>
              </div>
            </div>

            {/* Status Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-sans">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "scheduled" | "completed")}
                className="w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-sans"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
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

export default VFlowEditModal;
