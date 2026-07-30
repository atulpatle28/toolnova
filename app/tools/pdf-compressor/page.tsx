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
  SlidersHorizontal,
  X,
  AlertCircle,
} from "lucide-react";

interface PDFItem {
  id: string;
  file: File;
  originalSizeKB: number;
  compressedSizeKB: number | null;
  compressedUrl: string | null;
  isProcessing: boolean;
  progressPercent?: number;
  isNotCompressible?: boolean;
}

function ElevenZonPdfCompressorPage() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<number>(70);
  const [isCompressingAll, setIsCompressingAll] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: PDFItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf") {
        const id = Math.random().toString(36).substring(2, 9);
        newItems.push({
          id,
          file,
          originalSizeKB: Math.round(file.size / 1024),
          compressedSizeKB: null,
          compressedUrl: null,
          isProcessing: false,
          isNotCompressible: false,
        });
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const compressSinglePdf = async (
    item: PDFItem,
    level: number,
    onProgress: (percent: number) => void
  ): Promise<{ url: string; sizeKB: number; notCompressible: boolean }> => {
    const { PDFDocument } = await import("pdf-lib");
    const arrayBuffer = await item.file.arrayBuffer();

    let bestBlob: Blob | null = null;

    // Attempt 1: Fast Native Stream Compression
    try {
      const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const nativeBytes = await srcDoc.save({ useObjectStreams: true });
      const nativeBlob = new Blob([nativeBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      
      if (nativeBlob.size < item.file.size) {
        bestBlob = nativeBlob;
      }
    } catch (e) {
      console.warn("Native stream check skipped");
    }

    // Attempt 2: Canvas Image Rendering (FIXED RESOLUTION & QUALITY)
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const srcPdf = await loadingTask.promise;
      const newPdfDoc = await PDFDocument.create();

      // Dynamic Scale & Quality calculation based on slider
      const renderScale = Math.max(0.5, 1.2 - (level / 100) * 0.7); // Scale ranges from ~1.2 down to 0.5
      const jpegQuality = Math.max(0.15, (100 - level) / 100);       // Quality ranges from 0.85 down to 0.15

      for (let i = 1; i <= srcPdf.numPages; i++) {
        const page = await srcPdf.getPage(i);
        
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const renderViewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = Math.floor(renderViewport.width);
        canvas.height = Math.floor(renderViewport.height);

        if (ctx) {
          await page.render({
            canvasContext: ctx,
            viewport: renderViewport,
          }).promise;

          const jpegUrl = canvas.toDataURL("image/jpeg", jpegQuality);
          const jpegBytes = await fetch(jpegUrl).then((r) => r.arrayBuffer());

          const embeddedJpg = await newPdfDoc.embedJpg(jpegBytes);
          const pdfPage = newPdfDoc.addPage([unscaledViewport.width, unscaledViewport.height]);
          pdfPage.drawImage(embeddedJpg, {
            x: 0,
            y: 0,
            width: unscaledViewport.width,
            height: unscaledViewport.height,
          });
        }

        onProgress(Math.round((i / srcPdf.numPages) * 100));
      }

      const canvasBytes = await newPdfDoc.save({ useObjectStreams: true });
      const canvasBlob = new Blob([canvasBytes.buffer as ArrayBuffer], { type: "application/pdf" });

      if (!bestBlob || canvasBlob.size < bestBlob.size) {
        bestBlob = canvasBlob;
      }
    } catch (err) {
      console.warn("Canvas compression failed", err);
    }

    // 11zon Guard Check: If output size is still bigger or equal to original, revert!
    if (!bestBlob || bestBlob.size >= item.file.size) {
      const origBlob = new Blob([arrayBuffer], { type: "application/pdf" });
      return {
        url: URL.createObjectURL(origBlob),
        sizeKB: item.originalSizeKB,
        notCompressible: true,
      };
    }

    const sizeKB = Math.round(bestBlob.size / 1024);
    const url = URL.createObjectURL(bestBlob);

    return { url, sizeKB, notCompressible: false };
  };

  const handleCompressAll = async () => {
    if (items.length === 0) return;
    setIsCompressingAll(true);

    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      updatedItems[i].isProcessing = true;
      setItems([...updatedItems]);

      try {
        const { url, sizeKB, notCompressible } = await compressSinglePdf(
          updatedItems[i],
          compressionLevel,
          (progress) => {
            updatedItems[i].progressPercent = progress;
            setItems([...updatedItems]);
          }
        );
        updatedItems[i].compressedUrl = url;
        updatedItems[i].compressedSizeKB = sizeKB;
        updatedItems[i].isNotCompressible = notCompressible;
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

      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Smart Optimizer Mode
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Target Size PDF Compressor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Shrink PDFs safely. Automatically prevents file size bloat or quality damage.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
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
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md w-full sm:w-auto"
              >
                {isCompressingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-1" /> Compressing...
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
                  Click to select PDF files to compress
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 shadow-xs hover:border-blue-500/40 transition-all"
                  >
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-0.5 w-full pr-4 text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.file.name}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.originalSizeKB} KB
                      </p>
                    </div>

                    <div className="w-full h-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-2">
                      <FileText className="w-12 h-12 text-blue-500/80 mb-1" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">PDF Document</span>
                    </div>

                    {item.isProcessing ? (
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-600">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing...
                          </span>
                          <span>{item.progressPercent || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-200"
                            style={{ width: `${item.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>
                    ) : item.isNotCompressible ? (
                      <div className="w-full space-y-2 pt-1">
                        <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Not Compressed
                        </p>
                        <p className="text-[10px] text-slate-400">
                          File is already fully optimized
                        </p>
                      </div>
                    ) : item.compressedSizeKB ? (
                      <div className="w-full space-y-2 pt-1">
                        <p className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                          New Size: {item.compressedSizeKB} KB
                        </p>

                        <a
                          href={item.compressedUrl || "#"}
                          download={`compressed-${item.file.name}`}
                          className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 pt-1">Ready to compress</p>
                    )}
                  </div>
                ))}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full min-h-[220px] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Add PDF Files</span>
                </div>
              </div>

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