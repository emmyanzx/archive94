"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
const read = (): string[] => { try { return JSON.parse(localStorage.getItem("a94cart") || "[]"); } catch { return []; } };
export default function AddButton({ id }: { id: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(read().includes(id)), [id]);
  function toggle() {
    const c = read();
    localStorage.setItem("a94cart", JSON.stringify(on ? c.filter((x) => x !== id) : [...c, id]));
    const t = createClient().from("cart_items");
    (on ? t.delete().eq("product_id", id) : t.insert({ product_id: id })).then(() => {});
    setOn(!on);
    window.dispatchEvent(new Event("a94cart"));
  }
  return <button onClick={toggle} className={`px-4 min-h-11 text-sm font-semibold border-2 border-ink transition active:scale-95 motion-reduce:transition-none ${on ? "bg-ink text-paper" : "hover:bg-tag"}`}>{on ? "In your cart" : "Add to cart"}</button>;
}
