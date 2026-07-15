import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service role key, which bypasses Row Level Security —
// only ever import this file from API routes / server actions, never from
// client components. Requires SUPABASE_SERVICE_ROLE_KEY in your environment
// (found in Supabase dashboard: Project Settings → API → service_role key).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  serviceRoleKey || "placeholder-service-key"
);
