"use client";

import React, { useState, useMemo } from "react";
import { ALL_TOOLS, CATEGORIES, ToolItem } from "@/lib/tools-registry";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">All ToolKraft Utilities</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore all fast, secure, browser-based tools for PDFs, images, and converters.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat.id
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md self-start border border-slate-800">
                {tool.category}
              </span>
            </a>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-base font-bold text-white">No tools found</p>
            <p className="text-xs text-slate-500">Try searching with a different keyword.</p>
          </div>
        )}

      </div>
    </div>
  );
}