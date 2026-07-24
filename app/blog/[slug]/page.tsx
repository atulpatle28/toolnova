import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/app/lib/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found | ToolNova",
      description: "The requested blog article could not be found.",
    };
  }

  return {
    title: `${post.title} | ToolNova Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://toolnova.dev/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://toolnova.dev/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <Link href="/blog" className="text-sm font-medium text-sky-300">← Back to blog</Link>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">{post.category}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-400">{post.date}</p>
        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-6 text-lg leading-8 text-slate-300">
          {post.content}
        </div>
      </div>
    </main>
  );
}
