import { supabaseAdmin } from "./supabase/admin";
// Fixed-window limiter backed by the rate_limits table. Fails open if the check itself errors.
export async function allow(key: string, limit: number, windowSeconds: number) {
  const { data, error } = await supabaseAdmin().rpc("rate_limit_hit", { p_key: key, p_limit: limit, p_window: windowSeconds });
  if (error) { console.error("Rate limit check failed:", error.message); return true; }
  return data === true;
}
