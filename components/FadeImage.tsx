"use client";
import Image from "next/image";
import { useState } from "react";
export default function FadeImage({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span className="absolute inset-0 shimmer" aria-hidden />}
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onLoad={() => setLoaded(true)}
        className={`object-cover transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-105 ${loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-md"}`} />
    </>
  );
}
