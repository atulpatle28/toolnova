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
      // Dynamic import to prevent SSR/build crashes with pdfjs
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
          // Downscale quality to 50% JPEG image to reduce heavy MB sizes
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
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Fast & Secure Client-side
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Merge PDF Files
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Combine multiple PDFs into a single document in custom order.
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
                  Select 2 or more files to merge
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
                        className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(index, "down")}
                        disabled={index === files.length - 1}
                        className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-2"
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
                  className="text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add More
                </Button>

                <Button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isMerging}
                  className="bg-blue-600 text-white font-bold text-xs px-6 py-2 rounded-xl"
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
                      download="merged-document.pdf"
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Download Merged PDF
                    </a>

                    <button
                      onClick={handleCompress}
                      disabled={isCompressing}
                      className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
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
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfMergePage), { ssr: false });