"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Menu, 
  X, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Calculator,
  ArrowRight
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-white font-extrabold text-2xl tracking-wide">
            Tool<span className="text-emerald-400">Kraft</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <Link 
            href="/tools" 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" /> All Tools
          </Link>
          <Link 
            href="/tools/pdf-compressor" 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> PDF Tools
          </Link>
          <Link 
            href="/tools/heic-to-jpg" 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Image Studio
          </Link>
          <Link 
            href="/tools/percentage-calculator" 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-400" /> Calculators
          </Link>
        </nav>

        {/* Status Badge & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
          </span>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-400/20 transition-all cursor-pointer"
          >
            Explore <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800/80 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-400" /> All Tools Directory
            </Link>
            <Link
              href="/tools/pdf-compressor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> PDF Suite
            </Link>
            <Link
              href="/tools/heic-to-jpg"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" /> Image Studio
            </Link>
            <Link
              href="/tools/percentage-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900 hover:text-emerald-400 transition-colors"
            >
              <Calculator className="w-4 h-4 text-emerald-400" /> Calculators &amp; Utilities
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between px-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Client-Side Privacy
            </span>
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-950 bg-emerald-400 px-3 py-1.5 rounded-lg"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;