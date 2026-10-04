"use client";
import { useEffect, useState } from "react";
import AuthButton from "../../components/AuthButton";
import { createClient } from "../../lib/supabase/client";
type P = { id: string; name: string; size: string; price: number };
const field = "w-full border-2 border-ink bg-transparent px-3 py-2";
export default function Checkout() {
  const [items, setItems] = useState<P[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  useEffect(() => {
    const sb = createClient();
    const ids: string[] = JSON.parse(localStorage.getItem("a94cart") || "[]");
    if (ids.length) sb.from("products").select("id,name,size,price").in("id", ids).gt("stock", 0).then(({ data }) => setItems(data ?? []));
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);
  const total = items.reduce((s, i) => s + i.price, 0);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: items.map((i) => i.id), name: f.get("name"), phone: f.get("phone"), address: f.get("address"), notes: f.get("notes") || undefined, method: f.get("method") }) });
    const j = await res.json(); setBusy(false);
    if (!res.ok) return setErr(j.error);
    localStorage.removeItem("a94cart"); if (j.url) { location.href = j.url; return; } setDone(j.number);
  }
  if (done) return <main className="px-5 py-8 max-w-xl mx-auto"><h1 className="text-3xl font-black">Order {done} placed</h1><p className="mt-2">We emailed your confirmation. You pay on delivery.</p></main>;
  if (!items.length) return <main className="px-5 py-8 max-w-xl mx-auto"><h1 className="text-3xl font-black">Your cart is empty</h1><p className="mt-2">Pick a piece from the archive.</p></main>;
  return (
    <main className="px-5 py-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-black">Checkout</h1>
      <ul className="mt-4 border-y-2 border-ink divide-y divide-ink/30">{items.map((i) => <li key={i.id} className="flex justify-between py-2"><span>{i.name} (size {i.size})</span><span>₦{i.price.toLocaleString("en-NG")}</span></li>)}
        <li className="flex justify-between py-2 font-bold"><span>Total</span><span>₦{total.toLocaleString("en-NG")}</span></li></ul>
      {signedIn === false ? <div className="mt-6"><p className="mb-3">Sign in to place your order.</p><AuthButton next="/checkout" /></div> : (
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <input name="name" required placeholder="Full name" className={field} />
          <input name="phone" required placeholder="Phone number" className={field} />
          <textarea name="address" required placeholder="Delivery address" className={field} />
          <textarea name="notes" placeholder="Notes (optional)" className={field} />
          <fieldset className="grid gap-2"><legend className="font-bold">Payment</legend>
            <label><input type="radio" name="method" value="paystack" defaultChecked /> Pay online now (card, bank transfer, USSD via Paystack)</label>
            <label><input type="radio" name="method" value="cod" /> Pay on delivery</label></fieldset>
          {err && <p role="alert" className="font-semibold text-red-700">{err}</p>}
          <button disabled={busy} className="bg-ink text-paper py-3 font-bold hover:bg-denim disabled:opacity-50">{busy ? "Placing order" : "Place order"}</button>
        </form>)}
    </main>
  );
}
