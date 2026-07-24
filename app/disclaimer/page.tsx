import Link from "next/link";

export const metadata = {
  title: "Disclaimer | ToolNova",
  description: "Review ToolNova's disclaimer for informational and utility-based content.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Disclaimer</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Informational use only</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          ToolNova tools are provided for general informational and educational purposes. Results may vary based on input quality and user calculation criteria. Please verify important decisions independently.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">Back home</Link>
        </div>
      </div>
    </main>
  );
}
