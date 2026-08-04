import Link from "next/link";
import type { Metadata } from "next";
import { defaultTools } from "@/app/lib/content";

export const metadata: Metadata = {
  title: "ToolKraft - Free Online PDF & Image Utility Tools",
  description:
    "Explore ToolKraft's complete browser-based utility suite. Compress PDFs, resize images for govt forms, and convert files with 100% privacy.",
  keywords: [
    "ToolKraft",
    "ToolKraft PDF",
    "mytoolkraft",
    "ToolKraft image resizer",
    "ToolKraft tools",
  ],
  alternates: {
    canonical: "https://mytoolkraft.in",
  },
};

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ToolKraft",
    "url": "https://mytoolkraft.in",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "description": "Private, browser-based PDF and image processing tools.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.2),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      {/* Schema Markup for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
              ToolKraft
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">All tools</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/20 transition"
          >
            Back home
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {defaultTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:-translate-y-1 hover:border-violet-400/40"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-white">
                ✦
              </div>
              <p className="text-lg font-semibold text-white">{tool.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}