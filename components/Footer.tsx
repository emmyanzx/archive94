import Link from "next/link";
import { site } from "../lib/site";
export default function Footer() {
  const a = "underline hover:text-tag transition-colors";
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-5 py-12 grid gap-10 sm:grid-cols-3">
        <div><p className="text-2xl font-black">Archive94</p><p className="mt-2 max-w-xs">{site.tagline}</p></div>
        <nav aria-label="Footer" className="grid gap-2 content-start font-semibold">
          <Link href="/" className={a}>The archive</Link>
          <Link href="/about" className={a}>About</Link>
          <Link href="/orders" className={a}>My orders</Link>
          <Link href="/checkout" className={a}>Cart</Link>
          <Link href="/download" className={a}>Get the app</Link>
        </nav>
        <div className="grid gap-2 content-start">
          <p className="font-bold">Contact</p>
          <a href={`mailto:${site.email}`} className={a}>{site.email}</a>
          <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`} className={a}>WhatsApp {site.whatsapp}</a>
          <a href={`https://instagram.com/${site.instagram}`} className={a}>Instagram @{site.instagram}</a>
          <p>{site.city}</p>
          <p className="text-sm mt-2">Pay online with Paystack, or pay on delivery.</p>
        </div>
      </div>
      <p className="border-t border-paper/20 px-5 py-4 text-sm text-center">© {new Date().getFullYear()} Archive94. When it sells, it goes in the archive.</p>
    </footer>
  );
}
