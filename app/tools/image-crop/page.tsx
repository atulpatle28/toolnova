"use client";

import React from "react";
import Link from "next/link";
import EditorMain from "@/app/components/editor/EditorMain";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.15),_transparent_35%),linear-gradient(135deg,_#050816_0%,_#0f172a_50%,_#020617_100%)] text-slate-100 p-4 md:p-8 flex flex-col items-center">
      
      {/* Header Bar */}
      <header className="w-full max-w-7xl mb-6 flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to ToolNova
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            Image Studio & Passport Creator
          </span>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl flex-1 flex flex-col">
        <EditorMain />
      </div>

    </main>
  );
}