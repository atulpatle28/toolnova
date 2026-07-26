"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import PdfCompressorTool from "@/app/components/tools/PdfCompressorTool";

export default function PdfCompressorPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-6 flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to ToolNova
        </Link>
        <div className="flex items-center gap-2 text-red-400 font-semibold text-xs md:text-sm">
          <FileText className="w-4 h-4" /> 11zon Target Size PDF Optimizer
        </div>
      </header>

      <div className="w-full max-w-4xl">
        <PdfCompressorTool />
      </div>
    </main>
  );
}