import Link from "next/link";
import { defaultTools } from "@/app/lib/content";

export const metadata = {
  title: "Search Tools | ToolNova",
  description: "Search ToolNova tools by keyword, task or format.",
};

export default function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.2),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">ToolNova</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Search tools</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Back home</Link>
        </div>
        <form action="/search" method="get" className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 sm:flex-row">
          <input name="query" placeholder="Search tools by keyword" defaultValue={""} className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none" />
          <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-3 font-semibold text-white">Search</button>
        </form>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {defaultTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:-translate-y-1 hover:border-violet-400/40">
              <p className="text-sm font-semibold text-white">{tool.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
