import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kahjspfnkectfnmxvtom.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rLuDN18TNGsKEMjUuPeOZA__7f9Q5WJ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface VFlowTask {
  id?: string;
  prompt: string;
  scheduled_time: string; // ISO string e.g. "2026-08-10T10:00:00.000Z"
  frequency?: "One-time" | "Daily" | string;
  schedule_type?: string;
  status: "scheduled" | "completed" | string;
  created_at?: string;
  user_name?: string;
  last_executed_at?: string;
  last_result?: string;
  response?: string;
}
