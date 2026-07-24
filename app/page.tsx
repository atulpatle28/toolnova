import Link from "next/link";
import { ToolCard } from "./components/ToolComponents";
import { defaultTools } from "./lib/content";

const tools = defaultTools.map((tool) => ({
  title: tool.title,
  description: tool.description,
  href: tool.href,
  accent: tool.accent.replace("from-", "").replace(" to-", " "),
}));

export const metadata = {
  title: "ToolNova | 100+ Free Online Tools",
  description: "Explore fast and modern online tools for calculations, images, PDFs and development tasks.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),_transparent_35%),linear-gradient(135deg,_#050816_0%,_#111827_35%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/20 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 font-semibold text-white">
              T
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">ToolNova</p>
              <p className="text-xs text-slate-300">Free online utilities</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <Link href="/tools" className="transition hover:text-white">Tools</Link>
            <Link href="/search" className="transition hover:text-white">Search</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/blog" className="transition hover:text-white">Blog</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </nav>
        </header>

        <section className="mt-8 grid gap-8 rounded-[2rem] border border-white/10 bg-slate-950/50 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur xl:grid-cols-[1.2fr_0.8fr] xl:p-10">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
              Trusted by creators, students and developers
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              100+ Free Online Tools
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              Discover fast, accurate utilities for calculations, images, PDFs and development tasks in one modern workspace.
            </p>

            <form action="/search" method="get" className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg shadow-black/20 sm:flex-row">
              <input
                type="text"
                name="query"
                placeholder="Search tools, formats or tasks"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
              />
              <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-3 font-semibold text-white transition hover:opacity-90">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Calculators",
                "PDF Tools",
                "Image Tools",
                "Text Tools",
                "Developer Tools",
              ].map((category) => (
                <button key={category} className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/40 hover:text-white">
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 via-slate-900/80 to-sky-500/20 p-5">
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Popular this week</p>
              <div className="mt-4 space-y-3">
                {[
                  ["PDF Toolkit", "Merge, split and compress in one flow"],
                  ["AI Writing Assistant", "Rewrite text with cleaner structure"],
                  ["Image Resizer", "Resize for web, social and print"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm text-slate-300">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tools" className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Featured collection</p>
              <h2 className="text-2xl font-semibold text-white">Handpicked tools for everyday tasks</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/50 px-6 py-8 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">ToolNova</p>
            <p className="mt-1">Fast, polished tools for modern everyday work.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
