"use client";
import { useEffect } from "react";
import { createClient } from "../lib/supabase/client";
export default function CartSync() {
  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data } = await sb.from("cart_items").select("product_id");
      const remote = (data ?? []).map((r) => r.product_id as string);
      let local: string[] = [];
      try { local = JSON.parse(localStorage.getItem("a94cart") || "[]"); } catch {}
      const all = [...new Set([...remote, ...local])];
      const missing = all.filter((id) => !remote.includes(id));
      if (missing.length) await sb.from("cart_items").insert(missing.map((product_id) => ({ product_id })));
      localStorage.setItem("a94cart", JSON.stringify(all));
    })();
  }, []);
  return null;
}
