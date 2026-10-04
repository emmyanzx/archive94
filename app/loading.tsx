export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[4/5] bg-ink/10 animate-pulse" />)}
    </div>
  );
}
