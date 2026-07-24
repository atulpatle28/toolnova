"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createSlug, defaultBlogPosts, defaultTools, loadBlogs, loadTools, saveBlogs, saveTools, type BlogEntry, type ToolEntry } from "@/app/lib/content";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function AdminPanel() {
  const [tools, setTools] = useState<ToolEntry[]>(defaultTools);
  const [blogs, setBlogs] = useState<BlogEntry[]>(defaultBlogPosts);
  const [toolForm, setToolForm] = useState({ title: "", description: "", category: "", href: "", accent: "from-violet-500 to-indigo-500" });
  const [blogForm, setBlogForm] = useState({ title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10) });
  const [status, setStatus] = useState("Manage your content from here.");

  useEffect(() => {
    setTools(loadTools());
    setBlogs(loadBlogs());
  }, []);

  const activeTools = useMemo(() => tools.slice(0, 8), [tools]);

  const addTool = () => {
    if (!toolForm.title || !toolForm.description) {
      setStatus("Please provide a title and description for the tool.");
      return;
    }

    const slug = toolForm.href ? toolForm.href.replace(/^\//, "").replace(/\//g, "-") : createSlug(toolForm.title);
    const nextTool: ToolEntry = {
      id: `${Date.now()}`,
      title: toolForm.title,
      description: toolForm.description,
      href: toolForm.href || `/tools/${slug}`,
      accent: toolForm.accent,
      slug,
      category: toolForm.category || "General",
    };

    const updatedTools = [nextTool, ...tools];
    setTools(updatedTools);
    saveTools(updatedTools);
    setToolForm({ title: "", description: "", category: "", href: "", accent: "from-violet-500 to-indigo-500" });
    setStatus(`Added tool “${nextTool.title}”. It is now available on the homepage.`);
  };

  const addBlog = () => {
    if (!blogForm.title || !blogForm.content) {
      setStatus("Please provide a title and content for the blog post.");
      return;
    }

    const slug = createSlug(blogForm.title);
    const nextPost: BlogEntry = {
      id: `${Date.now()}`,
      title: blogForm.title,
      slug,
      excerpt: blogForm.excerpt || blogForm.content.slice(0, 120),
      content: blogForm.content,
      category: blogForm.category || "General",
      date: blogForm.date,
    };

    const updatedBlogs = [nextPost, ...blogs];
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
    setBlogForm({ title: "", excerpt: "", content: "", category: "", date: new Date().toISOString().slice(0, 10) });
    setStatus(`Saved blog post “${nextPost.title}”.`);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#0f172a_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Create content without editing code</h1>
          </div>
          <Link href="/" className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">Back to site</Link>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{status}</div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card title="Add a new tool">
            <div className="space-y-3">
              <input value={toolForm.title} onChange={(event) => setToolForm({ ...toolForm, title: event.target.value })} placeholder="Tool title" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <textarea value={toolForm.description} onChange={(event) => setToolForm({ ...toolForm, description: event.target.value })} placeholder="Short description" className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <input value={toolForm.category} onChange={(event) => setToolForm({ ...toolForm, category: event.target.value })} placeholder="Category" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <input value={toolForm.href} onChange={(event) => setToolForm({ ...toolForm, href: event.target.value })} placeholder="/tools/custom-slug" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <input value={toolForm.accent} onChange={(event) => setToolForm({ ...toolForm, accent: event.target.value })} placeholder="Tailwind gradient class" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <button onClick={addTool} className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">Save tool</button>
            </div>
          </Card>

          <Card title="Add a blog post">
            <div className="space-y-3">
              <input value={blogForm.title} onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })} placeholder="Post title" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <input value={blogForm.category} onChange={(event) => setBlogForm({ ...blogForm, category: event.target.value })} placeholder="Category" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <input value={blogForm.date} onChange={(event) => setBlogForm({ ...blogForm, date: event.target.value })} type="date" className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <textarea value={blogForm.excerpt} onChange={(event) => setBlogForm({ ...blogForm, excerpt: event.target.value })} placeholder="Short excerpt" className="min-h-20 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <textarea value={blogForm.content} onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })} placeholder="Full article content" className="min-h-36 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white" />
              <button onClick={addBlog} className="rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-200">Publish post</button>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card title="Recent tools">
            <ul className="space-y-3 text-sm text-slate-300">
              {activeTools.map((tool) => (
                <li key={tool.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="font-semibold text-white">{tool.title}</p>
                  <p className="mt-1">{tool.description}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Recent posts">
            <ul className="space-y-3 text-sm text-slate-300">
              {blogs.slice(0, 4).map((post) => (
                <li key={post.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <p className="font-semibold text-white">{post.title}</p>
                  <p className="mt-1">{post.excerpt}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
