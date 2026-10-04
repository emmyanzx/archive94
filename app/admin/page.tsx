import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "../../lib/supabase/server";
import { naira, no } from "../../lib/format";
import { saveProduct, setStatus } from "./actions";
export const dynamic = "force-dynamic";
const f = "w-full border-2 border-ink bg-transparent px-3 py-2";
const btn = "bg-ink text-paper px-4 py-2 font-semibold hover:bg-denim";
export default async function Admin({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/");
  const { data: me } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) redirect("/");
  const { data: products } = await sb.from("products").select("*").order("catalog_no", { ascending: false });
  const { data: orders } = await sb.from("orders").select("*, order_items(name,size,price)").order("created_at", { ascending: false });
  const cur = products?.find((p) => p.id === edit);
  const meas = Object.entries(cur?.measurements ?? {}).map(([k, v]) => `${k}=${v}`).join("\n");
  return (
    <main className="px-5 py-8 max-w-6xl mx-auto grid gap-12">
      <section>
        <h1 className="text-3xl font-black">{cur ? `Edit ${no(cur.catalog_no)}` : "Add a piece"}</h1>
        <form key={cur?.id ?? "new"} action={saveProduct} className="mt-4 grid gap-3 max-w-xl">
          <input type="hidden" name="id" defaultValue={cur?.id ?? ""} />
          <input name="name" required placeholder="Name" defaultValue={cur?.name} className={f} />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" min="0" required placeholder="Price (₦)" defaultValue={cur?.price} className={f} />
            <input name="stock" type="number" min="0" required placeholder="Stock (1 for one-of-one)" defaultValue={cur?.stock ?? 1} className={f} />
            <input name="era" placeholder="Era, e.g. 1990s" defaultValue={cur?.era} className={f} />
            <input name="size" placeholder="Size" defaultValue={cur?.size} className={f} />
            <input name="category" placeholder="Category" defaultValue={cur?.category} className={f} />
            <select name="condition" defaultValue={cur?.condition ?? "Good"} className={f}><option>Excellent</option><option>Good</option><option>Fair</option></select>
          </div>
          <textarea name="description" placeholder="Description" defaultValue={cur?.description} className={f} />
          <textarea name="measurements" rows={4} placeholder={"One per line, in cm:\nchest_cm=56\nlength_cm=64"} defaultValue={meas} className={f} />
          {cur?.images?.length > 0 && <div className="flex flex-wrap gap-3">{cur.images.map((s: string) => (
            <label key={s} className="text-sm"><img src={s} alt="" className="w-20 h-24 object-cover" /><input type="checkbox" name="keep" value={s} defaultChecked /> keep</label>))}</div>}
          <label className="font-semibold">Photos<input name="photos" type="file" accept="image/*" multiple className={f} /></label>
          <div className="flex gap-4 items-center"><button className={btn}>{cur ? "Save changes" : "Add piece"}</button>{cur && <Link href="/admin" className="underline font-semibold">Cancel</Link>}</div>
        </form>
      </section>
      <section>
        <h2 className="text-2xl font-black">Pieces</h2>
        <ul className="mt-3 divide-y divide-ink/30 border-y-2 border-ink">
          {products?.map((p) => <li key={p.id} className="flex items-center justify-between py-2 gap-3">
            <span>{no(p.catalog_no)} {p.name} ({naira(p.price)}) {p.stock === 0 && <b className="bg-tag px-2">Archived</b>}</span>
            <Link href={`/admin?edit=${p.id}`} className="underline font-semibold">Edit</Link></li>)}
        </ul>
        <p className="text-sm mt-2">To archive a piece, edit it and set stock to 0.</p>
      </section>
      <section>
        <h2 className="text-2xl font-black">Orders</h2>
        {!orders?.length && <p className="mt-3">No orders yet.</p>}
        <ul className="mt-3 grid gap-4">
          {orders?.map((o) => <li key={o.id} className="border-2 border-ink p-4">
            <p className="font-bold">{o.number}, {naira(o.total)}</p>
            <p className="text-sm">{o.name}, {o.phone}, {o.address}{o.notes ? `. Note: ${o.notes}` : ""}</p>
            <p className="text-sm mt-1">{o.order_items?.map((i: { name: string; size: string }) => `${i.name} (${i.size})`).join(", ")}</p>
            <form action={setStatus} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="border-2 border-ink bg-transparent px-2 py-1"><option>pending</option><option>confirmed</option><option>shipped</option><option>delivered</option></select>
              <button className={btn}>Update</button>
            </form></li>)}
        </ul>
      </section>
    </main>
  );
}
