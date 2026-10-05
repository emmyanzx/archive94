import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "../../../lib/supabase/server";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { sendOrderEmail } from "../../../lib/mailgun";
import { allow } from "../../../lib/ratelimit";
const Body = z.object({
  ids: z.array(z.string().uuid()).min(1).max(20),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(8).max(300),
  notes: z.string().trim().max(500).optional(),
  method: z.enum(["cod", "paystack"]).default("cod"),
});
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the form fields and try again." }, { status: 400 });
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const sb = token
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: { Authorization: `Bearer ${token}` } } })
    : await supabaseServer();
  const { data: { user } } = token ? await sb.auth.getUser(token) : await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to place an order." }, { status: 401 });
  if (!(await allow(`checkout:${user.id}`, 5, 600)))
    return NextResponse.json({ error: "Too many order attempts. Try again in a few minutes." }, { status: 429, headers: { "Retry-After": "600" } });
  const b = parsed.data;
  const { data, error } = await sb.rpc("place_order", { p_ids: b.ids, p_name: b.name, p_phone: b.phone, p_address: b.address, p_notes: b.notes ?? null });
  if (error) {
    const sold = error.message.includes("sold_out");
    return NextResponse.json({ error: sold ? "A piece in your cart was just bought. Remove it and try again." : "Could not place the order." }, { status: sold ? 409 : 500 });
  }
  await sb.from("cart_items").delete().in("product_id", b.ids);
  if (b.method === "paystack") {
    await supabaseAdmin().from("orders").update({ payment_method: "paystack" }).eq("number", data.number);
    const r = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, amount: data.total * 100, currency: "NGN", reference: data.number, callback_url: `${new URL(req.url).origin}/payment/callback` }),
    });
    const j = await r.json();
    if (!j.status) return NextResponse.json({ error: "Could not start payment. Check your orders page." }, { status: 502 });
    return NextResponse.json({ number: data.number, url: j.data.authorization_url });
  }
  try { await sendOrderEmail(user.email!, { ...data, name: b.name, address: b.address }); } catch (e) { console.error("Mailgun failed", e); }
  return NextResponse.json({ number: data.number });
}
