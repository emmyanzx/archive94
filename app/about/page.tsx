import { Fragment } from "react";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { site } from "../../lib/site";
const steps = [
  ["Sourced", "Every piece is picked by hand, from the 70s through the 2000s."],
  ["Graded", "Condition is marked Excellent, Good or Fair, with notes on the product page."],
  ["Measured", "Flat measurements in cm on every piece, so you can check the fit before you buy."],
  ["One of one", "There is only one of each. When it sells, it goes in the archive."],
];
const grades = [["Excellent", "Little to no wear."], ["Good", "Normal signs of age that suit the piece."], ["Fair", "Visible wear, always described on the page."]];
export default function About() {
  return (
    <main className="px-5 py-10 max-w-4xl mx-auto grid gap-14">
      <Reveal><h1 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight">Archive94 is a vintage menswear archive.</h1>
        <p className="mt-5 text-lg max-w-2xl">We collect clothes that were made to last and give them a second life. Each one gets a catalog number, an honest grade and real measurements.</p></Reveal>
      <section><Reveal><h2 className="text-2xl font-black">How it works</h2></Reveal>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {steps.map(([t, d], i) => <li key={t}><Reveal delay={i * 80} className="border-2 border-ink p-4 h-full"><p className="text-4xl font-black text-denim">{String(i + 1).padStart(2, "0")}</p><h3 className="mt-1 font-bold">{t}</h3><p>{d}</p></Reveal></li>)}
        </ol></section>
      <section><Reveal><h2 className="text-2xl font-black">Condition guide</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
          {grades.map(([g, d]) => <Fragment key={g}><dt className="font-bold">{g}</dt><dd>{d}</dd></Fragment>)}
        </dl></Reveal></section>
      <Reveal className="bg-tag p-6"><h2 className="text-2xl font-black">Questions about a piece?</h2>
        <p className="mt-2">Message us at <a className="underline font-semibold" href={`mailto:${site.email}`}>{site.email}</a> or on Instagram <a className="underline font-semibold" href={`https://instagram.com/${site.instagram}`}>@{site.instagram}</a>.</p>
        <Link href="/" className="inline-block mt-4 bg-ink text-paper px-4 py-2 font-semibold hover:bg-denim transition-colors">Browse the archive</Link></Reveal>
    </main>
  );
}
