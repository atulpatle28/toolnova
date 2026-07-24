import Link from "next/link";
import { createSlug, getBlogPostsByCategory } from "@/app/lib/content";

export function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  return {
    title: `${decodeURIComponent((params as unknown as { category: string }).category)} | ToolNova Blog`,
    description: `Browse ToolNova blog posts in the ${decodeURIComponent((params as unknown as { category: string }).category)} category.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getBlogPostsByCategory(decodeURIComponent(category));
  const decodedCategory = decodeURIComponent(category);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <Link href="/blog" className="text-sm font-medium text-sky-300">← Back to all posts</Link>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{decodedCategory} posts</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm text-violet-300">{post.category}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-medium text-sky-300">Read article →</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
