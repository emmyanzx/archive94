import crypto from "crypto";
import { confirmPayment } from "../../../../lib/paystack";
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(raw).digest("hex");
  if (sig !== req.headers.get("x-paystack-signature")) return new Response("bad signature", { status: 401 });
  const e = JSON.parse(raw);
  if (e.event === "charge.success") await confirmPayment(e.data.reference);
  return new Response("ok");
}
