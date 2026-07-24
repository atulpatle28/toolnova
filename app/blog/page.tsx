import Link from "next/link";
import { createSlug, getBlogCategories, loadBlogs } from "@/app/lib/content";

export const metadata = {
  title: "Blog | ToolNova",
  description: "Read the latest articles and product updates from ToolNova.",
};

export default function BlogPage() {
  const posts = loadBlogs();
  const categories = getBlogCategories();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Blog</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Fresh articles and product notes</h1>
          </div>
          <Link href="/admin" className="rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-200">Open admin</Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category} href={`/blog/category/${createSlug(category)}`} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/40 hover:text-white">
              {category}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-violet-300">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{post.date}</p>
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-sky-300">Read article →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
