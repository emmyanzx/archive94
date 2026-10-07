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
         <div className="flex gap-3 mt-1">
  {[
    { label: "Email us", href: `mailto:${site.email}`, icon: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></> },
    { label: "Chat on WhatsApp", href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`, icon: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /> },
    { label: `Instagram @${site.instagram}`, href: `https://instagram.com/${site.instagram}`, icon: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></> },
  ].map((c) => (
    <a key={c.label} href={c.href} aria-label={c.label} title={c.label}
      target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
      className="grid place-items-center w-11 h-11 border-2 border-paper hover:bg-tag hover:text-ink hover:border-tag transition-colors">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{c.icon}</svg>
    </a>
  ))}
</div>
          <p>{site.city}</p>
          <p className="text-sm mt-2">Pay online with Paystack, or pay on delivery.</p>
        </div>
      </div>
      <p className="border-t border-paper/20 px-5 py-4 text-sm text-center">© {new Date().getFullYear()} Archive94. When it sells, it goes in the archive.</p>
    </footer>
  );
}
