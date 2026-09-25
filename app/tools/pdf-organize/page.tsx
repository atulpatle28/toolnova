"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PDFDocument, degrees } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  LayoutGrid, 
  RotateCw, 
  Trash2, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  Layers,
  FileCheck,
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";

interface PageMeta {
  pageIndex: number;
  rotation: number;
}

function PdfOrganizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setDownloadUrl(null);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        const initialPages: PageMeta[] = Array.from({ length: count }, (_, i) => ({
          pageIndex: i,
          rotation: 0,
        }));
        setPages(initialPages);
      } catch (err) {
        console.error("PDF Load Error:", err);
        alert("Failed to load PDF file.");
      }
      e.target.value = "";
    }
  };

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const removePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrganize = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      for (const p of pages) {
        const [copiedPage] = await newDoc.copyPages(srcDoc, [p.pageIndex]);
        if (p.rotation !== 0) {
          copiedPage.setRotation(degrees(p.rotation));
        }
        newDoc.addPage(copiedPage);
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Organize PDF Error:", err);
      alert("Failed to organize PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft Organize PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Organize PDF Pages</h1>
          <p className="text-xs sm:text-sm text-slate-400">Rotate orientation, remove unnecessary pages, and restructure PDF layouts directly in your browser.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 text-center group"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Supports standard PDF documents of any page count</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-200">{file.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{pages.length} Pages Active</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pages.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-between gap-3 text-center shadow-sm"
                  >
                    <div className="w-full h-24 bg-slate-900 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-800/80">
                      Page {p.pageIndex + 1}
                      {p.rotation > 0 && <span className="text-[10px] text-emerald-400 ml-1">({p.rotation}°)</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => rotatePage(idx)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Rotate 90° Clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePage(idx)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!downloadUrl ? (
                <button
                  type="button"
                  onClick={handleOrganize}
                  disabled={isProcessing || pages.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save & Generate PDF"}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3 text-center">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Organized PDF Ready!
                  </p>
                  <a
                    href={downloadUrl}
                    download="toolkraft-organized-document.pdf"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-800/80 pt-12 space-y-12 text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Fast, Private PDF Page Organizer &amp; Orientation Manager
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Scanned multipage PDF files frequently contain upside-down receipts, sideways landscape charts, blank separator pages, or confidential annexures that need removal before publication. Submitting poorly formatted PDFs to government exam portals, bank underwriters, or legal courts causes procedural rejections. The **ToolKraft Organize PDF Tool** allows you to rotate rotated sheets, prune unwanted pages, and generate a standardized document in your browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Leveraging the binary manipulation power of `pdf-lib`, the utility executes page-level transforms natively without converting text to rasterized images. Your fonts, embedded vector graphics, and selectable text remain intact without resolution loss or bloat.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              How to Rotate and Prune PDF Pages in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Upload Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select your PDF file. The browser parses the document structure and displays every page in an interactive grid.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Rotate &amp; Remove</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click the rotate button to cycle orientation in 90-degree increments, or click the trash icon to eliminate unwanted pages.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Export Clean PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click Save &amp; Generate to compile the revised page structure into a clean, downloadable file instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Common Organizing Scenarios Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Scenario</th>
                    <th className="p-3 font-semibold">Common Issue</th>
                    <th className="p-3 font-semibold">Solution via Organize PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Govt Job Form Scans</td>
                    <td className="p-3">ID cards scanned upside-down or sideways</td>
                    <td className="p-3 text-emerald-400">Rotate individual pages to upright portrait mode</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Scanner Feeder Artifacts</td>
                    <td className="p-3">Blank pages generated by double-sided feeder passes</td>
                    <td className="p-3 text-emerald-400">Delete blank sheets to reduce document weight</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Confidential Audits</td>
                    <td className="p-3">Sensitive salary or private notes mixed in reports</td>
                    <td className="p-3 text-emerald-400">Extract public pages while purging private sheets</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Academic Theses</td>
                    <td className="p-3">Wide landscape tables inverted relative to thesis prose</td>
                    <td className="p-3 text-emerald-400">Re-orient individual charts for comfortable reading</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Zero Cloud Upload Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Legal declarations, passport copies, and property deed records contain sensitive personal data. Unlike traditional file services that upload your PDFs to remote cloud servers, ToolKraft processes all page indexing and orientation adjustments within your browser&apos;s isolated runtime. Your documents never leave your device.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Does rotating or deleting pages degrade the quality of remaining content?
                </h4>
                <p className="leading-relaxed">
                  No. The tool modifies PDF metadata dictionaries directly without re-encoding vector assets or compressed image streams. Text sharpness and image clarity remain identical to your original source file.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I rotate individual pages without changing the rest of the document?
                </h4>
                <p className="leading-relaxed">
                  Yes. Each page card features an independent rotation controller that adjusts orientation by 90 degrees per click, letting you orient landscape tables alongside portrait text seamlessly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  What happens if I accidentally delete the wrong page?
                </h4>
                <p className="leading-relaxed">
                  Changes are staged in memory only. Your source PDF remains untouched on your drive. Simply click &quot;Change File&quot; and re-select your PDF to reset all pages to their original state.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to combine multiple PDF files into one after organizing?
            </p>
            <Link
              href="/tools/pdf-merge"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Merge PDF Files <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfOrganizePage), { ssr: false });