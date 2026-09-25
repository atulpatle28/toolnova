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
  HelpCircle,
  Layers,
  BookOpen,
  ArrowRight,
  Code2,
  Scissors,
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
  const readingTime = Math.ceil(wordCount / 200); // Standard 200 WPM

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
      text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
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
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    );
  };
  const removeExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim());
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Private
          </span>
        </div>

        {/* Title Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Text Utility Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Word Counter &amp; Case Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time character metrics, case conversions, and typography whitespace cleanup for writers, developers, and students.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <AlignLeft className="w-3 h-3" /> Words
            </span>
            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{wordCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <Type className="w-3 h-3" /> Characters
            </span>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{charCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <Scissors className="w-3 h-3" /> No Spaces
            </span>
            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{charCountNoSpaces}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" /> Sentences
            </span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{sentenceCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <Layers className="w-3 h-3" /> Paragraphs
            </span>
            <p className="text-xl font-extrabold text-pink-600 dark:text-pink-400">{paragraphCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Read Time
            </span>
            <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">{readingTime}m</p>
          </div>
        </div>

        {/* Main Editor Workstation */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={toUpperCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                UPPERCASE
              </button>
              <button
                type="button"
                onClick={toLowerCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                lowercase
              </button>
              <button
                type="button"
                onClick={toTitleCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={toSentenceCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                Sentence case
              </button>
              <button
                type="button"
                onClick={toCamelCase}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                camelCase
              </button>
              <button
                type="button"
                onClick={removeExtraSpaces}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-600 hover:text-white transition-all cursor-pointer"
              >
                Clean Spaces
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setText("")}
                className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
              </Button>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your content here to inspect analytics and convert casing..."
              rows={10}
              className="w-full p-4 text-sm font-mono rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none"
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400">
              Evaluated strictly inside client memory. Zero cloud data storage.
            </span>

            <Button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              Real-Time Word Counter &amp; Typography Transformation Engine
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Meeting exact length requirements is an essential part of publishing across digital platforms—from strict 280-character micro-posts and 160-character meta descriptions to 500-word university admissions essays and 2,000-word editorial articles. The **ToolKraft Word Counter &amp; Case Converter** computes live statistical metrics as you type, while offering one-click normalization routines for fixing accidental Caps Lock typing, removing redundant whitespace, and transforming text case.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Unlike web utilities that send keystrokes to remote servers for server-side processing, this tool executes all regular expression string operations locally within your device&apos;s browser sandbox. Your draft essays, sensitive corporate proposals, and private notes never leave your personal computer or phone.
            </p>
          </div>

          {/* Character & Word Limit Reference Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Standard Platform Character &amp; Word Limits
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Publishing Platform / Document Type</th>
                    <th className="p-3 font-semibold">Recommended / Max Constraint</th>
                    <th className="p-3 font-semibold">Standard Casing Convention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Google Search Meta Title</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-mono font-semibold">50 – 60 characters</td>
                    <td className="p-3">Title Case or Sentence case</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Google Search Meta Description</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-mono font-semibold">150 – 160 characters</td>
                    <td className="p-3">Sentence case with actionable verbs</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">X (formerly Twitter) Post</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-mono font-semibold">280 characters</td>
                    <td className="p-3">Sentence case with lowercase hashtags</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">LinkedIn Article / Update</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-mono font-semibold">3,000 characters (posts)</td>
                    <td className="p-3">Standard grammatical Sentence case</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">College SOP / Personal Statement</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400 font-mono font-semibold">500 – 1,000 words</td>
                    <td className="p-3">Formal grammatical prose &amp; Title Case headings</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Analyze &amp; Transform Text in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Paste Your Content</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your draft or code snippet into the editor. Metrics like word and character counts update live in real time.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Apply Formatting</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Use the toolbar buttons to switch between UPPERCASE, Title Case, Sentence case, camelCase, or clean up whitespace.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Copy Clean Output</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click &quot;Copy Modified Text&quot; to transfer the formatted content directly into your CMS, document editor, or IDE.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% In-Browser Privacy: No Data Logging
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Confidential manuscripts, legal statements, and proprietary code must remain private. Unlike web counting tools that log keystrokes or submit text blocks to third-party tracking APIs, ToolKraft runs its regex parsing and tokenization routines locally inside your browser. No strings are stored or sent to external servers.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  How is average reading time computed?
                </h4>
                <p className="leading-relaxed">
                  The reading time calculation assumes an average adult reading speed of 200 words per minute (WPM). The total word count is divided by 200 and rounded up to the nearest full minute.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  What does the &quot;Clean Spaces&quot; button do?
                </h4>
                <p className="leading-relaxed">
                  The clean spaces utility consolidates multiple repeated spaces or tabs into a single space, removes trailing line spaces, and condenses multiple empty lines into clean paragraph breaks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Does this tool count hyphenated compound words as one word or two?
                </h4>
                <p className="leading-relaxed">
                  The word counter splits strings based on whitespace sequences (`\s+`). Hyphenated words (such as &quot;client-side&quot;) are counted as a single word token, matching standard Microsoft Word and Google Docs metrics.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to convert text strings or URLs into scannable vector QR codes?
            </p>
            <Link
              href="/tools/qr-code-generator"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <Sparkles className="w-4 h-4" /> QR Code Generator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}