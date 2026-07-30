"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  FileText,
  Download,
  ShieldCheck,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";

// Helper function to dynamically load PDF.js only on the client side
const getPdfJs = async () => {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  return pdfjsLib;
};

interface PDFItem {
  id: string;
  file: File;
  originalSizeKB: number;
  compressedSizeKB: number | null;
  compressedUrl: string | null;
  thumbnail: string | null;
  isProcessing: boolean;
}

function ElevenZonPdfCompressorPage() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<number>(70); // Default 70% compression
  const [isCompressingAll, setIsCompressingAll] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate thumbnail preview for loaded PDF
  const renderThumbnail = async (file: File): Promise<string | null> => {
    try {
      const pdfjsLib = await getPdfJs();
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas: canvas as any,
        } as any).promise;
        return canvas.toDataURL("image/jpeg", 0.7);
      }
    } catch (e) {
      console.error("Thumbnail error:", e);
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: PDFItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf") {
        const id = Math.random().toString(36).substring(2, 9);
        const thumb = await renderThumbnail(file);
        newItems.push({
          id,
          file,
          originalSizeKB: Math.round(file.size / 1024),
          compressedSizeKB: null,
          compressedUrl: null,
          thumbnail: thumb,
          isProcessing: false,
        });
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    // Reset input value so same files can be re-selected if needed
    e.target.value = "";
  };

  // 11zon Style Dynamic Compression Engine
  const compressSinglePdf = async (item: PDFItem, level: number): Promise<{ url: string; sizeKB: number }> => {
    const pdfjsLib = await getPdfJs();
    const arrayBuffer = await item.file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const newPdfDoc = await PDFDocument.create();

    // Calculate quality and resolution scale based on Compression Level (0-100%)
    const quality = Math.max(0.1, (100 - level) / 100);
    const scale = Math.max(0.4, 1.2 - (level / 100) * 0.6);

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas: canvas as any,
        } as any).promise;
      }

      const imgDataUrl = canvas.toDataURL("image/jpeg", quality);
      const imgBytes = await fetch(imgDataUrl).then((r) => r.arrayBuffer());
      const embeddedImg = await newPdfDoc.embedJpg(imgBytes);

      const pdfPage = newPdfDoc.addPage([viewport.width, viewport.height]);
      pdfPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
    }

    const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const sizeKB = Math.round(blob.size / 1024);
    const url = URL.createObjectURL(blob);

    return { url, sizeKB };
  };

  const handleCompressAll = async () => {
    if (items.length === 0) return;
    setIsCompressingAll(true);

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      updatedItems[i].isProcessing = true;
      setItems([...updatedItems]);

      try {
        const { url, sizeKB } = await compressSinglePdf(updatedItems[i], compressionLevel);
        updatedItems[i].compressedUrl = url;
        updatedItems[i].compressedSizeKB = sizeKB;
      } catch (err) {
        console.error("Compression error:", err);
      } finally {
        updatedItems[i].isProcessing = false;
        setItems([...updatedItems]);
      }
    }

    setIsCompressingAll(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      {/* Global Hidden File Input - Placed outside conditionals to maintain ref */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 11zon Mode Optimizer
          </span>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> 11zon Mode Optimizer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Target Size PDF Compressor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Shrink PDFs to custom KB/MB file size limits for official portals, job applications, or email attachments.
          </p>
        </div>

        {/* Workstation Outer Box */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Compression Level Slider Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Compression Level</span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto flex-1 max-w-md px-2">
              <input
                type="range"
                min="10"
                max="95"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 bg-white dark:bg-slate-900 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                {compressionLevel} <span className="text-slate-400 ml-0.5">%</span>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleCompressAll}
                disabled={items.length === 0 || isCompressingAll}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 w-full sm:w-auto"
              >
                {isCompressingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compressing...
                  </>
                ) : (
                  "Compress"
                )}
              </Button>

              {items.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  Delete All
                </Button>
              )}
            </div>
          </div>

          {/* Cards Grid / Empty Dropzone */}
          {items.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/60 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-blue-500/5 p-12 rounded-2xl text-center cursor-pointer transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Select PDF Documents
                </p>
                <p className="text-xs text-slate-500">
                  Click to select single or multiple PDF files
                </p>
              </div>

              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md pointer-events-none"
              >
                Select PDF
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                
                {/* File Cards */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 group shadow-xs hover:border-blue-500/40 transition-all"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* File Title & Original KB */}
                    <div className="space-y-0.5 w-full pr-4 text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.file.name}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.originalSizeKB} KB
                      </p>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-full h-44 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 flex items-center justify-center p-2 shadow-inner">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt="PDF Preview"
                          className="max-h-full max-w-full object-contain border border-slate-100 dark:border-slate-800 rounded shadow-xs"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-slate-300" />
                      )}
                    </div>

                    {/* Result / Download Section */}
                    {item.isProcessing ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 py-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                      </div>
                    ) : item.compressedSizeKB ? (
                      <div className="w-full space-y-2 pt-1">
                        <p className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                          New Size: {item.compressedSizeKB} KB
                        </p>

                        <a
                          href={item.compressedUrl || "#"}
                          download={`compressed-${item.file.name}`}
                          className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 pt-1">Ready to compress</p>
                    )}
                  </div>
                ))}

                {/* Add PDF Card Button */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full min-h-[260px] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Add PDF Files</span>
                </div>

              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  Select PDF
                </Button>
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ElevenZonPdfCompressorPage), {
  ssr: false,
});