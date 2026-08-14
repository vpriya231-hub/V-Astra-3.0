import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import {
  Calendar,
  Clock,
  RotateCw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock3,
  Sparkles,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Zap,
  Terminal,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import { supabase, VFlowTask } from "../lib/supabase";
import { executeVFlowAutonomousTask } from "../lib/vflowAutonomousExecutor";
import VFlowEditModal from "./VFlowEditModal";

interface VFlowPageProps {
  onBackToChat: () => void;
  userName?: string;
  showToast: (msg: string) => void;
}

export const VFlowPage: React.FC<VFlowPageProps> = ({
  onBackToChat,
  userName = "User",
  showToast,
}) => {
  const [tasks, setTasks] = useState<VFlowTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [prompt, setPrompt] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    // Default to +1 hour from now formatted for datetime-local
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  });
  const [frequency, setFrequency] = useState<"One-time" | "Daily">("One-time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal
  const [editingTask, setEditingTask] = useState<VFlowTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Output Modal state
  const [outputModalTask, setOutputModalTask] = useState<VFlowTask | null>(null);
  const [isGeneratingLiveResponse, setIsGeneratingLiveResponse] = useState(false);
  const resolvingTaskIdsRef = useRef<Set<string>>(new Set());

  // Helper: check if a task's response is unresolved, empty, or equal to the prompt text
  const isResponseUnresolved = useCallback((t: VFlowTask) => {
    if (t.status !== "completed") return false;
    const resp = (t.response || t.last_result || "").trim();
    const promptText = (t.prompt || "").trim();
    if (!resp) return true;
    if (resp === promptText) return true;
    if (resp.includes("Processing background task") || resp === "Task pending...") return true;
    return false;
  }, []);

  // Helper: get clean non-prompt answer text
  const getCleanResult = useCallback((t: VFlowTask) => {
    const resp = (t.response || t.last_result || "").trim();
    const promptText = (t.prompt || "").trim();
    if (!resp || resp === promptText || resp.includes("Processing background task") || resp === "Task pending...") {
      return null;
    }
    return resp;
  }, []);

  // Helper: detect autonomous action intent
  const getTaskIntentInfo = useCallback((promptText: string) => {
    const urlMatches = promptText.match(/https?:\/\/[^\s"'\(\)<>]+/gi);
    if (urlMatches && urlMatches.length > 0) {
      return {
        label: "Webhook / API Action",
        badgeClass: "bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
        icon: Zap,
        targetUrl: urlMatches[0],
      };
    }
    if (
      /analyze|analysis|summary|summarize|report|data|csv|json|metrics|calculate|rows|dataset|table|statistics/i.test(promptText) ||
      (promptText.includes("\n") && promptText.length > 100)
    ) {
      return {
        label: "Data Analysis",
        badgeClass: "bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800",
        icon: FileText,
        targetUrl: null,
      };
    }
    return {
      label: "Content Generation",
      badgeClass: "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      icon: Sparkles,
      targetUrl: null,
    };
  }, []);

  // Auto-resolve task response with Gemini AI & Autonomous Action Engine
  const resolveTaskResponse = useCallback(
    async (task: VFlowTask) => {
      const taskId = String(task.id);
      if (!task.id || resolvingTaskIdsRef.current.has(taskId)) return;
      resolvingTaskIdsRef.current.add(taskId);

      try {
        console.log(`Auto-resolving response for task [${taskId}] via V-Astra Autonomous Agent...`);
        setIsGeneratingLiveResponse(true);

        const { resultText } = await executeVFlowAutonomousTask(task, userName);

        const lastExecutedAt = new Date().toISOString();

        // Update local tasks state
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  response: resultText,
                  last_result: resultText,
                  status: "completed",
                  last_executed_at: lastExecutedAt,
                }
              : t
          )
        );

        // Update modal task if open
        setOutputModalTask((prevModal) => {
          if (prevModal && prevModal.id === task.id) {
            return {
              ...prevModal,
              response: resultText,
              last_result: resultText,
              status: "completed",
              last_executed_at: lastExecutedAt,
            };
          }
          return prevModal;
        });
      } catch (err) {
        console.error(`Error auto-generating response for task [${taskId}]:`, err);
      } finally {
        resolvingTaskIdsRef.current.delete(taskId);
        setIsGeneratingLiveResponse(false);
      }
    },
    [userName]
  );

  // Fetch tasks from Supabase and trigger auto-resolution for completed tasks with unresolved responses
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("v_flow_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching v_flow_tasks from Supabase:", error);
      } else if (data) {
        const fetchedTasks = data as VFlowTask[];
        setTasks(fetchedTasks);

        // Check if any completed task has unresolved response and trigger Gemini
        fetchedTasks.forEach((t) => {
          if (isResponseUnresolved(t)) {
            resolveTaskResponse(t);
          }
        });
      }
    } catch (err) {
      console.error("Failed to connect to Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, [isResponseUnresolved, resolveTaskResponse]);

  // Effect to continuously check tasks state and resolve any pending completed task
  useEffect(() => {
    tasks.forEach((t) => {
      if (isResponseUnresolved(t)) {
        resolveTaskResponse(t);
      }
    });
  }, [tasks, isResponseUnresolved, resolveTaskResponse]);

  // Effect to resolve when modal is opened for an unresolved task
  useEffect(() => {
    if (outputModalTask && isResponseUnresolved(outputModalTask)) {
      resolveTaskResponse(outputModalTask);
    }
  }, [outputModalTask, isResponseUnresolved, resolveTaskResponse]);

  // Expandable logs state & copy state
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  const toggleExpandTask = (id: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyResult = (text: string, taskId: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedTaskId(taskId);
      showToast("Output copied to clipboard");
      setTimeout(() => {
        setCopiedTaskId((prev) => (prev === taskId ? null : prev));
      }, 2500);
    } catch (err) {
      console.error("Failed to copy output:", err);
      showToast("Failed to copy output");
    }
  };

  useEffect(() => {
    fetchTasks();

    // Subscribe to Supabase Realtime changes for v_flow_tasks
    const channel = supabase
      .channel("v_flow_tasks_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "v_flow_tasks",
        },
        (payload) => {
          fetchTasks();
          if (payload.eventType === "UPDATE" && payload.new?.status === "completed") {
            showToast("V Flow task executed by Gemini!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  // Format schedule text e.g., 'One-time at 10:00 AM' or 'Daily at 8:00 AM'
  const formatScheduleDetails = (task: VFlowTask) => {
    try {
      const d = new Date(task.scheduled_time);
      if (isNaN(d.getTime())) {
        return `${task.frequency} at ${task.scheduled_time}`;
      }
      const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
      
      if (task.frequency === "Daily") {
        return `Daily at ${timeStr}`;
      }
      return `One-time on ${dateStr} at ${timeStr}`;
    } catch {
      return `${task.frequency} at ${task.scheduled_time}`;
    }
  };

  // Submit Handler with 3-Task Limit Enforcer
  const handleSubmitNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Check current scheduled tasks count in Supabase
      const { data: scheduledTasks, error: countErr } = await supabase
        .from("v_flow_tasks")
        .select("id")
        .eq("status", "scheduled");

      if (countErr) {
        console.error("Error querying active tasks count:", countErr);
      }

      const activeCount = scheduledTasks ? scheduledTasks.length : tasks.filter(t => t.status === "scheduled").length;

      // 2. Enforce 3-Task Limit
      if (activeCount >= 3) {
        showToast("Active task limit reached (3/3). Please delete an existing active task to schedule a new one.");
        setIsSubmitting(false);
        return;
      }

      // 3. Format timestamp
      let formattedTime = scheduledDateTime;
      const parsedDate = new Date(scheduledDateTime);
      if (!isNaN(parsedDate.getTime())) {
        formattedTime = parsedDate.toISOString();
      }

      // 4. Insert task into Supabase with multi-tier column fallback
      const primaryPayload: Record<string, any> = {
        prompt: prompt.trim(),
        scheduled_time: formattedTime,
        frequency: frequency,
        schedule_type: frequency,
        status: "scheduled",
        user_name: userName,
        created_at: new Date().toISOString(),
      };

      let insertError: any = null;
      let { error: err1 } = await supabase.from("v_flow_tasks").insert([primaryPayload]);

      if (err1) {
        console.warn("Primary insertion attempt failed, retrying fallback payload without schedule_type & user_name:", err1);
        const fallback1 = {
          prompt: prompt.trim(),
          scheduled_time: formattedTime,
          frequency: frequency,
          status: "scheduled",
        };
        let { error: err2 } = await supabase.from("v_flow_tasks").insert([fallback1]);

        if (err2) {
          console.warn("Fallback 1 failed, retrying with schedule_type instead of frequency:", err2);
          const fallback2 = {
            prompt: prompt.trim(),
            scheduled_time: formattedTime,
            schedule_type: frequency,
            status: "scheduled",
          };
          let { error: err3 } = await supabase.from("v_flow_tasks").insert([fallback2]);

          if (err3) {
            console.warn("Fallback 2 failed, trying absolute minimal payload:", err3);
            const minimalPayload = {
              prompt: prompt.trim(),
              scheduled_time: formattedTime,
              status: "scheduled",
            };
            let { error: err4 } = await supabase.from("v_flow_tasks").insert([minimalPayload]);
            insertError = err4;
          }
        }
      }

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        showToast(`Error creating task: ${insertError.message || "Database insert failed"}`);
      } else {
        showToast("V Flow task scheduled successfully!");
        setPrompt("");
        await fetchTasks();
      }
    } catch (err: any) {
      console.error("Failed to submit task:", err);
      showToast("Failed to schedule V Flow task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (id?: string) => {
    if (!id) return;

    // Immediately remove deleted task from local UI state
    setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)));

    try {
      const { error } = await supabase
        .from("v_flow_tasks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting task from Supabase:", error);
        showToast("Failed to delete task.");
        // Refetch to restore state if delete failed
        await fetchTasks();
      } else {
        showToast("Task deleted successfully.");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      showToast("Failed to delete task.");
      await fetchTasks();
    }
  };

  // Edit Task Handler
  const handleSaveEditedTask = async (updatedFields: Partial<VFlowTask>) => {
    if (!editingTask?.id) return;

    try {
      const { error } = await supabase
        .from("v_flow_tasks")
        .update(updatedFields)
        .eq("id", editingTask.id);

      if (error) {
        console.error("Error updating task in Supabase:", error);
        showToast("Failed to update task.");
      } else {
        showToast("Task updated successfully!");
        await fetchTasks();
      }
    } catch (err) {
      console.error("Failed to save edited task:", err);
    }
  };

  const scheduledCount = tasks.filter((t) => t.status === "scheduled").length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans" id="v-flow-page-root">
      {/* Top Bar Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <span>V Flow Task Scheduler</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Supabase Powered
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated AI task execution pipeline (Max 3 active tasks)
              </p>
            </div>
          </div>
        </div>

        {/* Active Task Limit Status */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            scheduledCount >= 3
              ? "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold shadow-xs"
              : "bg-slate-100 dark:bg-slate-850 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          }`}
          id="active-task-counter-badge"
        >
          <Clock3 className={`w-4 h-4 ${scheduledCount >= 3 ? "text-rose-500 animate-pulse" : "text-indigo-500"}`} />
          <span className="text-xs font-semibold">
            Active: <span className={scheduledCount >= 3 ? "text-rose-600 dark:text-rose-400 font-extrabold" : "text-indigo-600 dark:text-indigo-400 font-bold"}>{scheduledCount}</span> / 3
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Header Banner / Info */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-white">
              Scheduled AI Automation
            </p>
            <p>
              V Flow continuously monitors your schedule every minute. When your scheduled time arrives, V Astra will execute your prompt in the background and notify you with the generated output.
            </p>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Your Scheduled V Flow Tasks
            </h2>
            <button
              onClick={fetchTasks}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="ml-2 text-xs text-slate-500">Loading V Flow tasks from Supabase...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-slate-900/40">
              <Zap className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No V Flow Tasks Scheduled</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Use the form below to describe and schedule up to 3 active automated tasks.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {tasks.map((task) => {
                const isScheduled = task.status === "scheduled";
                const taskIdKey = task.id || task.prompt;
                const isExpanded = !!expandedTaskIds[taskIdKey];
                const cleanResult = getCleanResult(task);
                const isPendingResolution = isResponseUnresolved(task);

                return (
                  <motion.div
                    key={taskIdKey}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 ${
                      !isScheduled ? "cursor-pointer hover:border-indigo-500/50" : ""
                    }`}
                    onClick={(e) => {
                      // If target is a button or input, don't trigger modal
                      const target = e.target as HTMLElement;
                      if (target.closest("button") || target.closest("input") || target.closest("textarea")) return;
                      if (!isScheduled) {
                        setOutputModalTask(task);
                      }
                    }}
                  >
                    {/* Header Row: Badges & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isScheduled
                              ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                              : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {isScheduled ? (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Scheduled</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </>
                          )}
                        </span>

                        {/* Intent Badge */}
                        {(() => {
                          const intentInfo = getTaskIntentInfo(task.prompt);
                          const IntentIcon = intentInfo.icon;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${intentInfo.badgeClass}`}
                            >
                              <IntentIcon className="w-2.5 h-2.5 shrink-0" />
                              <span>{intentInfo.label}</span>
                            </span>
                          );
                        })()}

                        {/* Frequency Tag */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                          {task.frequency === "Daily" || task.schedule_type === "Daily" ? (
                            <RotateCw className="w-2.5 h-2.5" />
                          ) : (
                            <Calendar className="w-2.5 h-2.5" />
                          )}
                          {task.frequency || task.schedule_type || "One-time"}
                        </span>

                        {/* Schedule Time */}
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {formatScheduleDetails(task)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {!isScheduled && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOutputModalTask(task);
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                            id={`view-response-btn-${taskIdKey}`}
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>View Response</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTask(task);
                            setIsEditModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Task Description / Prompt */}
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                        {task.prompt}
                      </p>
                    </div>

                    {/* Output / Response Section preview on card */}
                    {!isScheduled && (
                      <div className="mt-1 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all">
                        {/* Result Header Bar */}
                        <div className="px-3.5 py-2 bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
                              Execution Output
                            </span>
                            {task.last_executed_at && (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                ({new Date(task.last_executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {cleanResult && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyResult(cleanResult, taskIdKey);
                                }}
                                className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                                title="Copy execution output"
                              >
                                {copiedTaskId === taskIdKey ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-semibold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-400" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandTask(taskIdKey);
                              }}
                              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>{isExpanded ? "Collapse" : "Expand Inline"}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Result Body */}
                        <div className="p-3.5">
                          {isPendingResolution ? (
                            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 py-1 font-medium">
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>Generating AI response with Gemini...</span>
                            </div>
                          ) : isExpanded ? (
                            <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans prose dark:prose-invert max-w-none">
                              {cleanResult ? (
                                <Markdown>{cleanResult}</Markdown>
                              ) : (
                                <p className="italic text-slate-400">Task completed with no output recorded.</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                              {cleanResult || "Task marked as completed."}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: 'Describe V Flow' Input & 3-Task Limit Enforcer Form */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shrink-0">
        <form onSubmit={handleSubmitNewTask} className="max-w-4xl mx-auto space-y-3" id="v-flow-submission-form">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Describe V Flow</span>
            </label>

            {scheduledCount >= 3 && (
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                Limit Reached (3/3)
              </span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe V Flow..."
            required
            className="w-full px-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-sans resize-none"
          />

          {/* Schedule Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              {/* Date / Time Picker */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5">
                <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  required
                  className="bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-200 font-sans focus:ring-0"
                />
              </div>

              {/* Frequency Toggle */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setFrequency("One-time")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    frequency === "One-time"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  One-time
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("Daily")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    frequency === "Daily"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Schedule V Flow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Modal */}
      <VFlowEditModal
        isOpen={isEditModalOpen}
        task={editingTask}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEditedTask}
      />

      {/* Output Response Modal */}
      <AnimatePresence>
        {outputModalTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
              id="v-flow-output-modal"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                      <span>V Flow Task Output</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono">
                        Completed
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans line-clamp-1 max-w-md">
                      Prompt: "{outputModalTask.prompt}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(outputModalTask.response || outputModalTask.last_result) && (
                    <button
                      type="button"
                      onClick={() => handleCopyResult(outputModalTask.response || outputModalTask.last_result || "", outputModalTask.id || "modal")}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
                    >
                      {copiedTaskId === (outputModalTask.id || "modal") ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Output</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setOutputModalTask(null)}
                    type="button"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 font-sans flex-1">
                {/* Intent Badge */}
                {(() => {
                  const modalIntent = getTaskIntentInfo(outputModalTask.prompt);
                  const IntentIcon = modalIntent.icon;
                  return (
                    <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">Intent Detected:</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${modalIntent.badgeClass}`}>
                          <IntentIcon className="w-3 h-3" />
                          <span>{modalIntent.label}</span>
                        </span>
                      </div>
                      {modalIntent.targetUrl && (
                        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 truncate max-w-[200px] sm:max-w-xs" title={modalIntent.targetUrl}>
                          {modalIntent.targetUrl}
                        </span>
                      )}
                    </div>
                  );
                })()}

                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold block mb-1">Task Prompt:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{outputModalTask.prompt}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Autonomous Output & Execution Logs:</span>
                    </span>
                    {outputModalTask.last_executed_at && (
                      <span className="text-[11px] font-mono text-slate-400">
                        Executed: {new Date(outputModalTask.last_executed_at).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-100 prose dark:prose-invert max-w-none font-sans">
                    {(() => {
                      const cleanModalResult = getCleanResult(outputModalTask);
                      const isModalUnresolved = isResponseUnresolved(outputModalTask);

                      if (isGeneratingLiveResponse || isModalUnresolved) {
                        return (
                          <div className="flex items-center gap-3 py-2 text-indigo-600 dark:text-indigo-400">
                            <Loader2 className="w-5 h-5 animate-spin shrink-0 text-indigo-600 dark:text-indigo-400" />
                            <div>
                              <p className="font-bold text-xs">Executing Autonomous Action with Gemini AI & Tool Calling...</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Processing task intent, dispatching tools, and updating database...</p>
                            </div>
                          </div>
                        );
                      }

                      if (cleanModalResult) {
                        return <Markdown>{cleanModalResult}</Markdown>;
                      }

                      if (outputModalTask.status === "scheduled") {
                        return (
                          <p className="italic text-slate-500">
                            This task is scheduled to run on {formatScheduleDetails(outputModalTask)}. The autonomous execution result and webhook status logs will be available here once executed.
                          </p>
                        );
                      }

                      return <p className="italic text-slate-400">No output recorded for this task.</p>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setOutputModalTask(null)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Close Output
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VFlowPage;
