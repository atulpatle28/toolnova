"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Scissors,
  Download,
  ShieldCheck,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
  FileText,
  Sliders,
} from "lucide-react";

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>("1");
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setSplitPdfUrl(null);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setPageRange(`1-${Math.min(count, 3)}`); // Default first 3 pages or 1
      } catch (err) {
        console.error("Error reading PDF:", err);
        alert("Failed to read PDF page count.");
      }
    } else if (selectedFile) {
      alert("Please select a valid PDF file.");
    }
  };

  // Helper to parse page range strings like "1-3, 5, 7-9"
  const parsePageNumbers = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",");

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((num) => parseInt(num.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          pages.add(pageNum - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!file || totalPages === 0) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      const pageIndices = parsePageNumbers(pageRange, totalPages);

      if (pageIndices.length === 0) {
        alert("Please enter a valid page range within the PDF page limits.");
        setIsProcessing(false);
        return;
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      setSplitPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Error splitting PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Processing
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5" /> Page Extractor Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            PDF Splitter & Page Extractor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Extract custom page numbers or ranges (e.g. 1-3, 5, 7) into a new PDF document.
          </p>
        </div>

        {/* Workstation Container */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-500/60 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-purple-500/5 p-10 sm:p-14 rounded-2xl text-center cursor-pointer transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Select PDF File to Split
                </p>
                <p className="text-xs text-slate-500">
                  Click to browse or drag & drop PDF here
                </p>
              </div>

              <Button
                type="button"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-purple-600/20 pointer-events-none"
              >
                Choose PDF
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* PDF Info & Page Range Input */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Loaded Document
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold font-mono">
                    Total Pages: {totalPages}
                  </p>
                </div>

                {/* Range Input */}
                <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-500" /> Pages to Extract:
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-600"
                  />
                  <p className="text-[10px] text-slate-400">Example: 1-5 extracts first 5 pages.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Select Another PDF
                </Button>

                <Button
                  onClick={handleSplitPdf}
                  disabled={isProcessing}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md shadow-purple-600/20"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Extracting Pages...
                    </>
                  ) : (
                    "Extract Selected Pages"
                  )}
                </Button>
              </div>

              {/* Download Card */}
              {splitPdfUrl && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" /> Pages Extracted Successfully!
                  </div>

                  <a
                    href={splitPdfUrl}
                    download={`extracted-${file.name}`}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download Extracted PDF
                  </a>
                </div>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}