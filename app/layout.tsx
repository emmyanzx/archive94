import "./globals.css";
import { Archivo } from "next/font/google";
import Link from "next/link";
import AuthButton from "../components/AuthButton";
import CartLink from "../components/CartLink";
import Footer from "../components/Footer";
import CartSync from "../components/CartSync";
import { supabaseServer } from "../lib/supabase/server";
const font = Archivo({ subsets: ["latin"] });
export const metadata = { title: "Archive94", description: "Vintage menswear. One of one." };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  const { data: me } = user ? await sb.from("profiles").select("is_admin").eq("id", user.id).single() : { data: null };
  return (
    <html lang="en" data-scroll-behavior="smooth"><body className={`${font.className} min-h-screen flex flex-col`}>
      {user && <CartSync />}
     <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b-2 border-ink">
        <Link href="/" className="text-2xl font-black tracking-tight">Archive94</Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/about" className="font-semibold underline">About</Link>
          <CartLink />
          {user && <Link href="/orders" className="font-semibold underline">My orders</Link>}
          {me?.is_admin && <Link href="/admin" className="font-semibold underline">Admin</Link>}
          <AuthButton email={user?.email} />
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </body></html>
  );
}
