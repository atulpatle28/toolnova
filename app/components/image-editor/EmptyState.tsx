"use client";

import React, { useState } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, Zap, ShieldCheck } from "lucide-react";

export interface EmptyStateProps {
  onUploadClick: () => void;
  onFileSelect: (file: File) => void;
}

export default function EmptyState({ onUploadClick, onFileSelect }: EmptyStateProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6">
      
      {/* Header Badge & Title */}
      <div className="text-center mb-8 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 shadow-lg shadow-cyan-950/50">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          ToolNova AI Image Studio
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          Transform Your Photos in Seconds
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto">
          Crop documents, make official passport photos, and adjust colors with professional precision right in your browser.
        </p>
      </div>

      {/* Main Drag and Drop Upload Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onUploadClick}
        className={`group relative w-full max-w-2xl p-10 md:p-14 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden backdrop-blur-xl ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/40 scale-[1.02] shadow-2xl shadow-cyan-500/20"
            : "border-slate-800/90 bg-slate-900/40 hover:border-cyan-500/60 hover:bg-slate-900/70 shadow-2xl shadow-slate-950"
        }`}
      >
        {/* Ambient Glow Gradient inside dropzone */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Floating Upload Icon */}
        <div className="relative mb-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300 shadow-xl shadow-slate-950">
          <UploadCloud className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </div>

        {/* Primary Call to Action */}
        <div className="space-y-2 relative z-10">
          <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
            Drop your image here, or <span className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-4">browse</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Supports PNG, JPG, WEBP or HEIC (Up to 25MB)
          </p>
        </div>

        {/* Feature Tags */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 relative z-10 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Fast Client-Side Processing
          </span>
          <span className="flex items-center gap-1 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Secure
          </span>
        </div>
      </div>

    </div>
  );
}