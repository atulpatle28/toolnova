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
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Split PDF
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Split PDF Pages</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Extract specific pages or page ranges from your PDF document.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <p className="text-base font-extrabold">Select Single PDF File</p>
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
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold truncate max-w-[200px]">
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
                  className="text-xs"
                >
                  Change
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Page Selection Range (e.g. 1-3, 5, 8-10):
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent font-mono"
                  placeholder="e.g. 1-3, 5"
                />
              </div>

              <Button
                onClick={handleSplit}
                disabled={isSplitting}
                className="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                {isSplitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Extract Selected Pages"
                )}
              </Button>

              {downloadUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <p className="text-xs font-bold text-emerald-600">
                    PDF Split Complete!
                  </p>
                  <a
                    href={downloadUrl}
                    download={`extracted-${file.name}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
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

export default dynamic(() => Promise.resolve(PdfSplitPage), { ssr: false });