"use client";
import { createClient } from "../lib/supabase/client";
export default function AuthButton({ email, next = "/" }: { email?: string | null; next?: string }) {
  const sb = createClient();
  const cls = "bg-ink text-paper px-4 py-2 font-semibold hover:bg-denim";
  if (email) return <button className={cls} onClick={async () => { await sb.auth.signOut(); location.reload(); }}>Sign out</button>;
  return <button className={cls} onClick={() => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${next}` } })}>Continue with Google</button>;
}
