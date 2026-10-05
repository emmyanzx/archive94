// After your build finishes, paste the link from EAS here.
const APK_URL = "https://drive.google.com/file/d/1B9H9dgdROOxy5Xr-XzjFymDT-xOhPXzo/view?usp=sharing";
export const metadata = { title: "Get the app | Archive94" };
export default function Download() {
  const ready = APK_URL.startsWith("http");
  return (
    <main className="px-5 py-10 max-w-2xl mx-auto grid gap-6">
      <h1 className="text-5xl sm:text-6xl font-black leading-[0.95] tracking-tight">Get the Archive94 app.</h1>
      <p className="text-lg">Same account and same cart as the website. Android only for now.</p>
      {ready
        ? <a href={APK_URL} className="justify-self-start bg-ink text-paper px-6 min-h-11 leading-[44px] font-semibold hover:bg-denim transition-colors">Download for Android</a>
        : <p className="font-semibold">The download link isn&apos;t ready yet.</p>}
      <ol className="list-decimal pl-5 grid gap-2">
        <li>Open this page on your Android phone and tap Download.</li>
        <li>Open the downloaded file. If Android asks, allow installs from your browser.</li>
        <li>If Play Protect warns about an unrecognised app, choose to install anyway.</li>
        <li>Sign in with the same Google account you use on the website.</li>
      </ol>
    </main>
  );
}
