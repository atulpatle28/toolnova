"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  Command,
  Code2,
  Layers,
  Zap,
} from "lucide-react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800 shadow-xs"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            Tool<span className="text-blue-600 dark:text-blue-400">Nova</span>
          </span>
        </Link>

        {/* Center Quick Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Link href="/tools/pdf-merge" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            PDF Suite
          </Link>
          <Link href="/tools/image-crop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Image Studio
          </Link>
          <Link href="/tools/pdf-compressor" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Compress KB
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5" /> GitHub
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Raycast Cmd+K Quick Search Button */}
          <button
            onClick={() => {}}
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-medium hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search utilities...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/tools/image-crop"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Open Workspace
          </Link>
        </div>
      </div>
    </header>
  );
}