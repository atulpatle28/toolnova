import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | ToolNova",
  description: "Understand the terms of use for ToolNova's online tools and content.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Terms and Conditions</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Use of our platform</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          By using ToolNova, you agree to use the tools responsibly and not engage in unlawful or abusive activity. We may update these terms over time and advise users to review them periodically.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">Back home</Link>
        </div>
      </div>
    </main>
  );
}
