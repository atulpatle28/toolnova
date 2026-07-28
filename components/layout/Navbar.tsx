"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            ToolKraft
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            All Tools
          </Link>
          <Link href="/#pdf-tools" className="hover:text-white transition-colors">
            PDF Utilities
          </Link>
          <Link href="/#image-tools" className="hover:text-white transition-colors">
            Image Studio
          </Link>
        </nav>
      </div>
    </header>
  );
}