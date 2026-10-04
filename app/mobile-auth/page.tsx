"use client";
import { useEffect, useRef, useState } from "react";
export default function MobileAuth() {
  // Capture the login tokens before anything else can clear them from the address bar.
  const hash = useRef(typeof window === "undefined" ? "" : window.location.hash);
  const [link, setLink] = useState("");
  useEffect(() => {
    const app = new URLSearchParams(window.location.search).get("app") ?? "";
    if (!/^(exp|archive94):\/\//.test(app)) return;
    const url = app + hash.current;
    setLink(url);
    window.location.href = url;
  }, []);
  return (
    <main className="px-5 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-black">Returning to the app...</h1>
      {link && <a href={link} className="inline-block mt-4 bg-ink text-paper px-4 min-h-11 leading-[44px] font-semibold">Open the Archive94 app</a>}
    </main>
  );
}
