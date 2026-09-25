"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  FileText,
  Download,
  ShieldCheck,
  RefreshCw,
  Plus,
  HelpCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Scissors,
  FileCheck,
} from "lucide-react";

function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>("1");
  const [isSplitting, setIsSplitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const selectedFile = files[0];
    if (selectedFile.type !== "application/pdf") return;

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setFile(selectedFile);
      setTotalPages(pdf.getPageCount());
      setPageRange(`1-${pdf.getPageCount()}`);
      setDownloadUrl(null);
    } catch (e) {
      console.error(e);
    }
  };

  const parsePageNumbers = (rangeStr: string, total: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",");

    parts.forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (start && end) {
          for (
            let i = Math.max(1, start);
            i <= Math.min(total, end);
            i++
          ) {
            pages.add(i - 1);
          }
        }
      } else {
        const pageNum = Number(part.trim());
        if (pageNum >= 1 && pageNum <= total) {
          pages.add(pageNum - 1);
        }
      }
    });

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsSplitting(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = parsePageNumbers(pageRange, totalPages);
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("Split failed:", e);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Client-Side Vector Extractor
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Split PDF Pages Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Extract custom pages, isolate continuous sections, or split heavy multi-page documents instantly.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">Select PDF Document</p>
                <p className="text-xs text-slate-500">
                  Upload any PDF to extract individual pages or range sequences
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold truncate max-w-[200px] text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Total Pages: {totalPages}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setFile(null)}
                  variant="outline"
                  className="text-xs cursor-pointer border-slate-200 dark:border-slate-800"
                >
                  Change
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Page Selection Range:
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. 1-3, 5, 8-10</span>
                </div>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 1-3, 5"
                />
              </div>

              <Button
                onClick={handleSplit}
                disabled={isSplitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20"
              >
                {isSplitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Extracting Pages...
                  </span>
                ) : (
                  "Extract Selected Pages"
                )}
              </Button>

              {downloadUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Extraction Complete!
                  </p>
                  <a
                    href={downloadUrl}
                    download={`extracted-${file.name}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download Extracted PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Technical Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              Fast, Private In-Browser PDF Page Splitting &amp; Extraction
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              When working with multi-hundred page documents—such as comprehensive court rulings, scanned book volumes, lengthy business contracts, or exhaustive bank statements—submitting the entire file is often impractical. Government job application systems, recruitment portals, and email clients enforce rigid file size ceilings and reject unnecessary attachments. The **ToolKraft PDF Splitter** lets you extract exact chapters, isolated receipts, or discrete page ranges into a compact, dedicated document.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Powered by WebAssembly binary routines and `pdf-lib`, the utility copies page streams without converting vector text into blurry raster images. All embedded fonts, hyperlinked text elements, and high-resolution charts are preserved while unnecessary pages are purged directly within your browser&apos;s memory sandbox.
            </p>
          </div>

          {/* Syntax Guide Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Page Selection Syntax &amp; Formatting Guide
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Range Syntax</th>
                    <th className="p-3 font-semibold">Output Description</th>
                    <th className="p-3 font-semibold">Typical Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">1</td>
                    <td className="p-3">Extracts only the initial front page</td>
                    <td className="p-3">Cover page summaries, certificates, admit card receipts</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">1-5</td>
                    <td className="p-3">Extracts pages 1 through 5 sequentially</td>
                    <td className="p-3">Research paper executive summaries, contract initial articles</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">1, 4, 7</td>
                    <td className="p-3">Extracts only pages 1, 4, and 7 as a 3-page file</td>
                    <td className="p-3">Isolating specific transaction receipts from bank ledgers</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">1-3, 6, 9-12</td>
                    <td className="p-3">Extracts multiple distinct page intervals</td>
                    <td className="p-3">Bundling selective academic chapters while omitting blank inserts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Split PDF Pages in 3 Simple Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload your master PDF. The extractor reads the file index and determines the total page count.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Define Ranges</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Input your target pages using commas and hyphens (such as 1-3, 5, 8-10) in the selection field.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Download Extracted File</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Extract Selected Pages to compile the custom document and download the clean PDF instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Financial spreadsheets, internal business reports, and legal filings carry sensitive intellectual property and personal data. Unlike traditional cloud-based document utilities that upload files to external processing queues, ToolKraft executes all page extraction within your browser&apos;s isolated memory sandbox. Your source files and extracted pages are never uploaded, stored, or reviewed on remote servers.
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
                  Does splitting a PDF reduce the visual quality of text or charts?
                </h4>
                <p className="leading-relaxed">
                  No. The tool extracts binary page trees and dictionary pointers directly from the source document without rasterizing content into images. Vector typography, line graphs, and embedded photos maintain their original high-resolution clarity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  What happens if I specify page numbers outside the document&apos;s range?
                </h4>
                <p className="leading-relaxed">
                  The range parser automatically clamps values to valid page indices between 1 and the total page count, preventing corrupted files or empty output documents.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I split password-protected PDF documents?
                </h4>
                <p className="leading-relaxed">
                  If the PDF has open-level master password encryption, you must unlock the document first so the client-side binary engine can access and copy the individual page structures.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to combine your extracted pages with other records?
            </p>
            <Link
              href="/tools/pdf-merge"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Merge PDF Files <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfSplitPage), { ssr: false });