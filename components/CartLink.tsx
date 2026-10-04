"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
const count = () => { try { return JSON.parse(localStorage.getItem("a94cart") || "[]").length as number; } catch { return 0; } };
export default function CartLink() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const u = () => setN(count());
    u();
    window.addEventListener("a94cart", u);
    window.addEventListener("storage", u);
    return () => { window.removeEventListener("a94cart", u); window.removeEventListener("storage", u); };
  }, []);
  return (
    <>
      <Link href="/checkout" className="flex items-center gap-2 p-2 font-semibold hover:text-denim transition-colors">
        <span className="relative">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 7H6" />
          </svg>
          {n > 0 && <span key={n} aria-hidden="true" className="pop absolute -top-2 -right-2 min-w-5 h-5 px-1 grid place-items-center bg-tag text-ink text-xs font-black">{n}</span>}
        </span>
        Cart
      </Link>
      <span role="status" aria-atomic="true" className="sr-only">{n} {n === 1 ? "item" : "items"} in cart</span>
    </>
  );
}
