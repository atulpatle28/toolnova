"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Crop,
  Calculator,
  FileText,
  ArrowRight,
  Search,
  FileSpreadsheet,
  Combine,
} from "lucide-react";

const ILOVEPDF_TOOLS = [
  {
    id: "image-crop",
    title: "Image Studio & Passport Maker",
    desc: "Crop, rotate, filter, and create official passport size photos with custom background colors.",
    category: "image",
    href: "/tools/image-crop",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-400",
    badge: "Popular Studio",
    icon: Crop,
  },
  {
    id: "pdf-compressor",
    title: "PDF Compressor (Target KB)",
    desc: "11zon-style compression: Set exact target KB limit for official application forms.",
    category: "pdf",
    href: "/tools/pdf-compressor",
    color: "bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-400",
    badge: "11zon Feature",
    icon: FileText,
  },
  {
    id: "pdf-merge",
    title: "Merge PDF Files",
    desc: "Online2PDF style multi-file joiner. Combine multiple PDF documents into one.",
    category: "pdf",
    href: "/tools/pdf-merge",
    color: "bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-400",
    badge: "Online2PDF",
    icon: Combine,
  },
  {
    id: "age-calculator",
    title: "Age Calculator Pro",
    desc: "Calculate precise age in years, months, weeks, and days with birthday countdown.",
    category: "finance",
    href: "/tools/age-calculator",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-400",
    badge: "Utility",
    icon: Calculator,
  },
  {
    id: "gst-calculator",
    title: "GST Calculator India",
    desc: "Compute GST amount instantly with 5%, 12%, 18%, and 28% tax slabs.",
    category: "finance",
    href: "/tools/gst-calculator",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-400",
    badge: "Tax",
    icon: FileSpreadsheet,
  },
  {
    id: "emi-calculator",
    title: "Loan EMI Calculator",
    desc: "Calculate monthly loan EMI payments, total interest, and payback breakdown.",
    category: "finance",
    href: "/tools/emi-calculator",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:border-indigo-400",
    badge: "Finance",
    icon: Calculator,
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = ILOVEPDF_TOOLS.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || t.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white">
              Tool<span className="text-red-500">Nova</span>
            </span>
          </Link>

          <Link
            href="/tools/image-crop"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950"
          >
            Launch Image Studio
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10 pb-16 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-red-400">
            iLovePDF + 11zon + Online2PDF Super Workspace
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Every tool you need to work with <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              PDFs & Images in One Place
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            100% free, unlimited, and processed locally on your browser for ultimate privacy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto pt-2">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["all", "pdf", "image", "finance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-red-600 text-white shadow-lg shadow-red-950"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
          {filtered.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`p-6 rounded-2xl bg-slate-900/80 border transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 ${t.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 uppercase">
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-red-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-red-400">
                  <span>Open Utility</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ToolNova. Built for speed and privacy.</p>
      </footer>
    </div>
  );
}