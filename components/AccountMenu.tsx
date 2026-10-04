"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client";
const row = "flex items-center w-full min-h-11 px-4 text-left font-semibold hover:bg-tag transition-colors";
export default function AccountMenu({ email, isAdmin }: { email?: string | null; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);
  const sb = createClient();
  const close = () => setOpen(false);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Account menu"
        className="flex items-center gap-2 min-h-11 px-3 border-2 border-ink font-semibold hover:bg-tag transition-colors">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>
        <span className="hidden min-[420px]:inline">Account</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="page-in absolute right-0 mt-2 w-64 bg-paper border-2 border-ink z-50">
          {email ? (
            <>
              <p className="px-4 py-3 text-sm border-b-2 border-ink truncate" title={email}>Signed in as <b>{email}</b></p>
              <Link href="/orders" onClick={close} className={row}>My orders</Link>
              {isAdmin && <Link href="/admin" onClick={close} className={row}>Admin</Link>}
              <button onClick={async () => { await sb.auth.signOut(); location.reload(); }} className={`${row} border-t-2 border-ink`}>Sign out</button>
            </>
          ) : (
            <div className="p-4 grid gap-3">
              <p className="text-sm">Sign in to place orders and track your pieces.</p>
              <button onClick={() => sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(location.pathname)}` } })}
                className="bg-ink text-paper min-h-11 px-4 font-semibold hover:bg-denim transition-colors">Continue with Google</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
