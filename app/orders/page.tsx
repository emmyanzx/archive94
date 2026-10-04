import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "../../lib/supabase/server";
import { naira } from "../../lib/format";
export const dynamic = "force-dynamic";
export default async function Orders() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/");
  const { data: orders } = await sb.from("orders").select("*, order_items(name,size,price)").eq("user_id", user.id).order("created_at", { ascending: false });
  return (
    <main className="px-5 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-black">My orders</h1>
      {!orders?.length && <p className="mt-4">No orders yet. <Link href="/" className="underline font-semibold">Browse the archive</Link></p>}
      <ul className="mt-4 grid gap-4">
        {orders?.map((o) => (
          <li key={o.id} className="border-2 border-ink p-4">
            <p className="font-bold">{o.number}, {naira(o.total)}</p>
            <p className="text-sm">{new Date(o.created_at).toLocaleDateString("en-NG")}, status: {o.status}, {o.payment_method === "paystack" ? (o.payment_status === "paid" ? "paid online" : "awaiting payment") : "pay on delivery"}</p>
            <p className="text-sm mt-1">{o.order_items?.map((i: { name: string; size: string }) => `${i.name} (${i.size})`).join(", ")}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
