import { Fragment } from "react";
import Link from "next/link";
import FadeImage from "../../../components/FadeImage";
import { notFound } from "next/navigation";
import AddButton from "../../../components/AddButton";
import { supabaseServer } from "../../../lib/supabase/server";
import { no, naira } from "../../../lib/format";
export const dynamic = "force-dynamic";
export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: p } = await (await supabaseServer()).from("products").select("*").eq("id", id).maybeSingle();
  if (!p) notFound();
  const imgs: string[] = p.images ?? [];
  const m = Object.entries((p.measurements ?? {}) as Record<string, number>);
  return (
    <main className="px-5 py-8 max-w-6xl mx-auto">
      <Link href="/" className="underline font-semibold">Back to the archive</Link>
      <div className="grid gap-8 mt-6 md:grid-cols-2">
        <div className="grid gap-3 content-start">
          {imgs.length
            ? imgs.map((s, i) => <div key={s} className="relative w-full aspect-[4/5]"><FadeImage src={s} alt={p.name} priority={i === 0} sizes="(min-width:768px) 50vw, 100vw" /></div>)
            : <div className="aspect-[4/5] bg-denim text-paper flex items-end p-4"><span className="text-7xl font-black tracking-tighter">{no(p.catalog_no)}</span></div>}
        </div>
        <div>
          <p className="font-bold">No. {no(p.catalog_no)}</p>
          <h1 className="text-4xl font-black leading-tight mt-1">{p.name}</h1>
          <p className="text-2xl font-bold mt-3">{naira(p.price)}</p>
          <p className="mt-4">{p.description}</p>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-t-2 border-ink pt-4">
           {([["Era", p.era], ["Size", p.size], ["Condition", p.condition], ["Category", p.category]] as const).map(([k, v]) => (
  <Fragment key={k}><dt className="font-bold">{k}</dt><dd>{v}</dd></Fragment>
))}
          </dl>
          {m.length > 0 && (
            <table className="mt-6 w-full border-t-2 border-ink text-left">
              <caption className="text-left font-bold pt-4 pb-2">Measurements (flat, cm)</caption>
              <tbody>{m.map(([k, v]) => <tr key={k} className="border-b border-ink/30"><th className="py-2 font-normal capitalize">{k.replace("_cm", "").replace("_", " ")}</th><td className="py-2 text-right font-bold">{v}</td></tr>)}</tbody>
            </table>
          )}
          <div className="mt-8">{p.stock > 0 ? <AddButton id={p.id} /> : <span className="bg-tag px-3 py-2 font-semibold">Archived. This piece has sold.</span>}</div>
        </div>
      </div>
    </main>
  );
}
