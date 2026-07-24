import Link from "next/link";
import { AdSlot } from "./AdSlot";

type ToolLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3 shadow-lg shadow-slate-950/20 backdrop-blur md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 font-semibold text-white">
              T
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">ToolNova</p>
              <p className="text-xs text-slate-300">Production-ready online tools</p>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <Link href="/tools" className="transition hover:text-white">Tools</Link>
            <Link href="/search" className="transition hover:text-white">Search</Link>
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <Link href="/privacy-policy" className="transition hover:text-white">Privacy</Link>
          </nav>
        </header>

        <main className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.3fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">ToolNova</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{description}</p>
            <div className="mt-8">{children}</div>
          </section>

          <aside className="space-y-4">
            <AdSlot />
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Why choose ToolNova?</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>• Fast and accurate calculations</li>
                <li>• Mobile-friendly and modern UI</li>
                <li>• Privacy-first experience</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
