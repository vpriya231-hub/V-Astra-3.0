import { useEffect, useRef } from "react";
import { supabase, VFlowTask } from "../lib/supabase";
import { executeVFlowAutonomousTask } from "../lib/vflowAutonomousExecutor";

export interface VFlowSchedulerOptions {
  userName?: string;
  onTaskExecuted?: (task: VFlowTask, resultText: string) => void;
}

export function useVFlowScheduler({ userName, onTaskExecuted }: VFlowSchedulerOptions) {
  const isExecutingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const checkAndExecuteScheduledTasks = async () => {
      try {
        const now = new Date();

        // 1. Fetch scheduled tasks from Supabase
        const { data: scheduledTasks, error } = await supabase
          .from("v_flow_tasks")
          .select("*")
          .eq("status", "scheduled");

        if (error || !scheduledTasks || scheduledTasks.length === 0) {
          return;
        }

        for (const task of scheduledTasks as VFlowTask[]) {
          if (!task.id) continue;
          if (isExecutingRef.current.has(task.id)) continue;

          // Check if task scheduled_time is reached or passed
          const taskDate = new Date(task.scheduled_time);
          if (isNaN(taskDate.getTime())) continue;

          // If current time >= task scheduled time
          if (now >= taskDate) {
            isExecutingRef.current.add(task.id);

            try {
              console.log(`Executing V Flow Autonomous Task [${task.id}]: "${task.prompt}"`);

              // Execute autonomous task (handles Webhooks, Data Analysis, Content Gen, Supabase update)
              const { resultText } = await executeVFlowAutonomousTask(task, userName);

              const lastExecutedAt = new Date().toISOString();
              const isDaily = task.frequency === "Daily" || task.schedule_type === "Daily";

              if (isDaily) {
                // Calculate next day's time
                const nextRunDate = new Date(taskDate);
                nextRunDate.setDate(nextRunDate.getDate() + 1);

                // If nextRunDate is still in the past, advance to tomorrow from now
                if (nextRunDate <= now) {
                  nextRunDate.setTime(now.getTime() + 24 * 60 * 60 * 1000);
                }

                await supabase
                  .from("v_flow_tasks")
                  .update({
                    scheduled_time: nextRunDate.toISOString(),
                    last_executed_at: lastExecutedAt,
                    last_result: resultText,
                    response: resultText,
                    status: "scheduled",
                  })
                  .eq("id", task.id);
              }

              if (onTaskExecuted) {
                onTaskExecuted(task, resultText);
              }
            } catch (execErr) {
              console.error("Error executing scheduled V Flow task:", execErr);
            } finally {
              isExecutingRef.current.delete(task.id);
            }
          }
        }
      } catch (err) {
        console.error("V Flow Scheduler check error:", err);
      }
    };

    // Run immediate check on mount
    checkAndExecuteScheduledTasks();

    // Run background timer check every 12 seconds (10-15s interval requirement)
    const interval = setInterval(checkAndExecuteScheduledTasks, 12000);

    return () => clearInterval(interval);
  }, [userName, onTaskExecuted]);
}
