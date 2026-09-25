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
  Trash2,
  MoveUp,
  MoveDown,
  Zap,
  HelpCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface PDFFile {
  id: string;
  file: File;
  sizeKB: number;
}

function PdfMergePage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedSizeBytes, setMergedSizeBytes] = useState<number | null>(null);
  const [rawMergedBytes, setRawMergedBytes] = useState<Uint8Array | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: PDFFile[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type === "application/pdf") {
        newFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          sizeKB: Math.round(file.size / 1024),
        });
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
    resetMergedState();
    e.target.value = "";
  };

  const resetMergedState = () => {
    setMergedUrl(null);
    setMergedSizeBytes(null);
    setRawMergedBytes(null);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const updated = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    resetMergedState();
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      setRawMergedBytes(mergedPdfBytes);

      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });

      setMergedSizeBytes(blob.size);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      console.error("Merge failed:", err);
    } finally {
      setIsMerging(false);
    }
  };

  const handleCompress = async () => {
    if (!rawMergedBytes) return;
    setIsCompressing(true);

    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const { PDFDocument } = await import("pdf-lib");
      const compressedPdfDoc = await PDFDocument.create();

      const loadingTask = pdfjs.getDocument({ data: rawMergedBytes });
      const pdfDoc = await loadingTask.promise;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, canvas: canvas, viewport }).promise;
          const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.5);
          const jpegImageBytes = await fetch(jpegDataUrl).then((res) =>
            res.arrayBuffer()
          );

          const embeddedImage = await compressedPdfDoc.embedJpg(jpegImageBytes);
          const newPage = compressedPdfDoc.addPage([
            viewport.width,
            viewport.height,
          ]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }
      }

      const finalCompressedBytes = await compressedPdfDoc.save();
      const blob = new Blob([finalCompressedBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });

      setMergedSizeBytes(blob.size);
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Compression error. Try again with a different PDF.");
    } finally {
      setIsCompressing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Fast &amp; Secure Client-side
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Merge PDF Files Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Combine multiple PDF files into one single document in custom page order instantly without file size limits.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {files.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-extrabold">Select PDF Files</p>
                <p className="text-xs text-slate-500">
                  Select 2 or more PDF documents to merge together
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="truncate text-xs font-bold">
                        <p className="truncate">{item.file.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.sizeKB} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFile(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(index, "down")}
                        disabled={index === files.length - 1}
                        className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-2 cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add More
                </Button>

                <Button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isMerging}
                  className="bg-blue-600 text-white font-bold text-xs px-6 py-2 rounded-xl cursor-pointer"
                >
                  {isMerging ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Merge PDFs"
                  )}
                </Button>
              </div>

              {mergedUrl && mergedSizeBytes && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs font-bold text-emerald-600">
                      PDFs Merged Successfully!
                    </p>
                    <span className="bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      Size: {formatSize(mergedSizeBytes)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <a
                      href={mergedUrl}
                      download="toolkraft-merged-document.pdf"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Download Merged PDF
                    </a>

                    <button
                      onClick={handleCompress}
                      disabled={isCompressing}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCompressing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4" /> Compress / Reduce Size
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              Fast, Secure In-Browser PDF Merger &amp; Document Binder
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              When applying for competitive civil exams, securing bank loans, or filing taxation records, administrative guidelines mandate submitting documentation in a single unified PDF rather than loose, unorganized files. The **ToolKraft PDF Merger** provides an intuitive interface to bind multiple PDF agreements, certificates, and invoices into an ordered dossier in seconds.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Powered by client-side WebAssembly and `pdf-lib` binary stream manipulators, our tool re-indexes page arrays and combines font dictionaries directly inside your computer&apos;s active memory. Because no processing occurs on third-party servers, your confidential identity documents and financial records are protected against external logging or exposure.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Combine Multiple PDFs in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select Documents</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload two or more PDF files from your desktop or phone storage. You can add extra files at any point.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Order Pages</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Use the Up and Down arrow controls to arrange your documents in the exact required reading sequence.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Merge &amp; Download</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Merge PDFs to combine the documents instantly, with an optional one-click compressor to reduce file weight.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Application Sector</th>
                    <th className="p-3 font-semibold">Typical Documents Combined</th>
                    <th className="p-3 font-semibold">Primary Administrative Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Govt &amp; Academic Admissions</td>
                    <td className="p-3">Admit card, identity card, semester marks lists</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Ensures single upload slot compliance on recruitment servers</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Banking, KYC &amp; Loans</td>
                    <td className="p-3">Salary slips, bank account statements, tax forms</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Streamlines multi-month payroll checks into a single file</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Real Estate &amp; Legal Agreements</td>
                    <td className="p-3">Sales deeds, stamp paper affidavits, annexure records</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Prevents lost attachments and preserves legal clause order</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Corporate Accounting</td>
                    <td className="p-3">Vendor receipts, GST returns, purchase orders</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Simplifies monthly reconciliation packs for auditor review</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your legal contracts, bank records, and personal certificates carry sensitive private data. Unlike cloud-based document utilities that upload files to external servers, ToolKraft processes all binary merges within your browser&apos;s isolated memory sandbox. Your original and merged files are never transmitted to external cloud systems.
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
                  Does merging multiple PDF files increase the total file size?
                </h4>
                <p className="leading-relaxed">
                  The merged PDF contains the combined binary payload of all selected documents plus minor structural indexing metadata. If the merged file exceeds your portal upload limit, click the built-in &quot;Compress / Reduce Size&quot; button to optimize page weights immediately.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Are embedded digital signatures or interactive form fields preserved?
                </h4>
                <p className="leading-relaxed">
                  The merger copies all vector layers, raster pictures, and embedded typography fonts directly. Form fields and static visual signatures are retained as flattened content across the combined document.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Is there any limit on the number of PDFs I can merge at once?
                </h4>
                <p className="leading-relaxed">
                  No artificial document caps are enforced. You can combine dozens of files in a single session, limited only by your device&apos;s available RAM.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to compress an existing heavy PDF without combining?
            </p>
            <Link
              href="/tools/pdf-compressor"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Dedicated PDF Compressor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfMergePage), { ssr: false });