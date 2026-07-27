"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Type,
  Copy,
  CheckCircle2,
  Trash2,
  Sparkles,
  ShieldCheck,
  Clock,
  FileText,
  AlignLeft,
} from "lucide-react";

export default function TextConverterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Stats Calculations
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, "").length;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // Average 200 wpm

  // Handlers
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toSentenceCase = () => {
    setText(
      text.toLowerCase().replace(/(^\s*|\.\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    );
  };
  const toTitleCase = () => {
    setText(
      text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };
  const toCamelCase = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    );
  };
  const removeExtraSpaces = () => {
    setText(text.replace(/\s+/g, " ").trim());
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Private
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Text Utility Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Word Counter & Case Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time word analytics, case conversions, and formatting cleanup for documents & social media.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Words</span>
            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{wordCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Characters</span>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{charCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">No Spaces</span>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{charCountNoSpaces}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Sentences</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{sentenceCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Paragraphs</span>
            <p className="text-xl font-extrabold text-pink-600 dark:text-pink-400">{paragraphCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400">Read Time</span>
            <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">{readingTime}m</p>
          </div>
        </div>

        {/* Main Editor Workstation */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={toUpperCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
              >
                UPPERCASE
              </button>
              <button
                onClick={toLowerCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
              >
                lowercase
              </button>
              <button
                onClick={toTitleCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
              >
                Title Case
              </button>
              <button
                onClick={toSentenceCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
              >
                Sentence case
              </button>
              <button
                onClick={toCamelCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
              >
                camelCase
              </button>
              <button
                onClick={removeExtraSpaces}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-600 hover:text-white transition-all"
              >
                Clean Spaces
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setText("")}
                className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </Button>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your content here..."
              rows={10}
              className="w-full p-4 text-sm font-mono rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none"
            />
          </div>

          {/* Bottom Copy Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Auto-saved locally in your browser memory.
            </span>

            <Button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Copied Text
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Modified Text
                </>
              )}
            </Button>
          </div>

        </div>

      </main>
    </div>
  );
}