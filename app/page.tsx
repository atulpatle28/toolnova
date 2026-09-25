"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ALL_TOOLS, CATEGORIES } from "@/lib/tools-registry";
import { ToolCard } from "@/app/components/ui/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Zap, Sparkles, ArrowRight, Lock, Cpu, Trophy } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const popularTools = ALL_TOOLS.filter((tool) => tool.isPopular).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Contest Announcement Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border-b border-emerald-500/30 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-slate-950 text-[10px] uppercase tracking-wider">
            <Trophy className="w-3 h-3" /> New
          </span>
          <span>ToolKraft Monthly Contest is live! Win exciting rewards &amp; perks.</span>
          <Link href="/contest" className="font-bold text-emerald-400 hover:underline inline-flex items-center gap-1">
            Participate Now &rarr;
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
          >
            <ShieldCheck className="w-4 h-4" /> 100% Privacy-First &bull; Zero Server File Uploads
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            Lightning-Fast Web Utilities <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Right in Your Browser
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Convert documents, resize official exam photos, compress PDFs to exact KB limits, and calculate metrics securely without uploading data to remote servers.
          </motion.p>

          {/* Search Box Direct Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/tools?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all p-1"
            >
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search any tool (e.g., HEIC, Word to PDF, EMI, Resizer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-28 h-12 bg-transparent border-0 text-slate-100 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:outline-none"
              />
              <Button type="submit" variant="default" className="h-10 px-5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                Search
              </Button>
            </form>
          </motion.div>

          {/* Quick Stats / Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400"
          >
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> 24+ Production Utilities</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> Client-Side Blob RAM</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400" /> Zero Watermarks</span>
          </motion.div>
        </div>
      </section>

      {/* Categories Quick Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800/40 bg-slate-900/20">
        <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.slice(0, 8).map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/tools?category=${cat.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-emerald-500/40 hover:text-white transition-all whitespace-nowrap shadow-xs"
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Most Demanded</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Featured Power Utilities</h2>
          </div>
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            View All 24+ Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </section>

      {/* Trust & Architecture Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Absolute Privacy Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Files are processed directly in your device RAM via WebAssembly and HTML5 Canvas. Nothing is ever uploaded to external cloud servers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Server Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience instant file conversion speeds without queuing delays or upload bandwidth caps. Built for maximum web performance.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Free &amp; Unlimited Access</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No subscription paywalls, login requirements, or artificial daily export limits. Use every utility as much as you need.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}