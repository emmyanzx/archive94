import Link from "next/link";
import { confirmPayment } from "../../../lib/paystack";
export const dynamic = "force-dynamic";
export default async function Callback({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) {
  const q = await searchParams;
  const ref = q.reference ?? q.trxref;
  const ok = ref ? await confirmPayment(ref) : false;
  return (
    <main className="px-5 py-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-black">{ok ? `Payment received. Order ${ref} is confirmed.` : "We could not confirm your payment."}</h1>
      <p className="mt-2">{ok ? "A confirmation email is on its way." : "If you were charged, it will be confirmed automatically within a few minutes. Check My Orders."}</p>
      <Link href="/orders" className="underline font-semibold mt-4 inline-block">My orders</Link>
    </main>
  );
}
