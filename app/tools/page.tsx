"use client";

import React, { useState, useMemo } from "react";
import { ALL_TOOLS, CATEGORIES, ToolItem } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ui/tool-card";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool: ToolItem) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Zero-Server Uploads &bull; 100% Client-Side
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore All <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">ToolKraft</span> Utilities
          </h1>

          <p className="text-sm sm:text-base text-slate-400">
            Fast, browser-based web tools for PDFs, images, document conversions, and calculations. Privacy-first, free, and watermark-free.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search tools (e.g., PDF, HEIC, Resizer, EMI, Word)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 shadow-xl"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Tools Results Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool: ToolItem, index: number) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 max-w-md mx-auto space-y-3">
            <Zap className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-base font-semibold text-slate-200">No matching tools found</p>
            <p className="text-xs text-slate-400">
              Try searching with another keyword like &quot;pdf&quot;, &quot;image&quot;, or clear filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer pt-2"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bottom Trust & Compliance Guarantee */}
        <div className="pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/60">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-100">Zero Server Storage</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your files never touch external storage servers; processing happens via WebAssembly and HTML5 APIs.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/60">
            <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-100">Lightning Fast Speed</h3>
            <p className="text-xs text-slate-400 mt-1">
              No upload waiting times or download bandwidth limits. Instant generation in your browser RAM.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-slate-900 bg-slate-950/60">
            <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-100">Unlimited &amp; Free</h3>
            <p className="text-xs text-slate-400 mt-1">
              No registration walls, no daily conversion limits, and no watermark stamps on your output files.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}