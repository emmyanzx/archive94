import { supabaseAdmin } from "./supabase/admin";
import { sendOrderEmail } from "./mailgun";
export async function confirmPayment(ref: string) {
  const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }, cache: "no-store" });
  const j = await r.json();
  const db = supabaseAdmin();
  const { data: o } = await db.from("orders").select("*, order_items(name,size,price), profiles(email)").eq("number", ref).maybeSingle();
  if (!o || !j.status || j.data.status !== "success" || j.data.amount !== o.total * 100) return false;
  const { data: upd } = await db.from("orders").update({ payment_status: "paid", status: "confirmed" }).eq("number", ref).eq("payment_status", "unpaid").select("id");
  if (upd?.length && o.profiles?.email) {
    try { await sendOrderEmail(o.profiles.email, { number: o.number, total: o.total, name: o.name, address: o.address, items: o.order_items, paid: true }); }
    catch (e) { console.error("Mailgun failed", e); }
  }
  return true;
}
