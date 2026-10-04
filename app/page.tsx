import Link from "next/link";
import FadeImage from "../components/FadeImage";
import Reveal from "../components/Reveal";
import AddButton from "../components/AddButton";
import { supabaseServer } from "../lib/supabase/server";
import { no, naira } from "../lib/format";
export const dynamic = "force-dynamic";
const uniq = (a: (string | null)[]) => [...new Set(a.filter(Boolean) as string[])].sort();
const sel = "min-h-11 border-2 border-ink bg-transparent px-2";
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const { data, error } = await (await supabaseServer()).from("products").select("*").order("created_at", { ascending: false });
  const all = data ?? [];
  let list = all.filter((p) => (!q.era || p.era === q.era) && (!q.category || p.category === q.category) && (!q.size || p.size === q.size));
  if (q.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (q.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  const live = all.filter((p) => p.stock > 0).length;
  const Sel = ({ name, label, opts }: { name: string; label: string; opts: string[] }) => (
    <select name={name} defaultValue={q[name] ?? ""} aria-label={label} className={sel}>
      <option value="">{label}</option>{opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-5 py-10 grid gap-8 md:grid-cols-[1fr_auto] items-end">
          <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight">One of one.<br />Then it&apos;s archived.</h1>
          <div className="bg-tag p-4 font-bold"><p className="text-6xl font-black leading-none">{live}</p><p>pieces in the archive right now</p></div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-5 py-6">
        <form className="flex flex-wrap gap-3 items-center">
          <Sel name="era" label="All eras" opts={uniq(all.map((p) => p.era))} />
          <Sel name="category" label="All categories" opts={uniq(all.map((p) => p.category))} />
          <Sel name="size" label="All sizes" opts={uniq(all.map((p) => p.size))} />
          <select name="sort" defaultValue={q.sort ?? ""} aria-label="Sort" className={sel}>
            <option value="">Newest</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option>
          </select>
          <button className="bg-ink text-paper px-4 min-h-11 font-semibold hover:bg-denim">Filter</button>
          <Link href="/" className="underline font-semibold">Clear</Link>
        </form>
        {error && <p className="mt-4 font-bold text-red-700">{error.message}</p>}
        {!list.length && !error && <p className="mt-8 font-semibold">Nothing matches those filters.</p>}
        <ul className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.id}><Reveal delay={(i % 3) * 80}>
              <Link href={`/product/${p.id}`} className="block group">
                <div className="relative aspect-[4/5] bg-denim text-paper overflow-hidden">
                  {p.images?.[0]
                    ? <><FadeImage src={p.images[0]} alt={p.name} priority={i < 3} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" /><span className="absolute top-3 left-3 bg-ink text-paper px-2 py-1 text-sm font-bold">{no(p.catalog_no)}</span></>
                    : <span className="absolute bottom-4 left-4 text-6xl font-black tracking-tighter">{no(p.catalog_no)}</span>}
                  {p.stock === 0 && <span className="absolute top-3 right-3 bg-tag text-ink px-2 py-1 text-sm font-bold">Archived</span>}
                </div>
                <h2 className="mt-3 text-lg font-bold">{p.name}</h2>
              </Link>
              <p className="text-sm">{p.era}, size {p.size}, {p.condition}</p>
              <div className="mt-2 flex items-center justify-between"><span className="font-bold">{naira(p.price)}</span>{p.stock > 0 && <AddButton id={p.id} />}</div>
            </Reveal></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
