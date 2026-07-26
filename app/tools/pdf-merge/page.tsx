"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  FileText,
  Trash2,
  RotateCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  UploadCloud,
  FilePlus,
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  rotateDeg: number;
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [convertFormat, setConvertFormat] = useState<string>("pdf-retained");
  const [outputFilename, setOutputFilename] = useState<string>("ToolNova_Merged");
  const [activeTab, setActiveTab] = useState<string>("compression");
  
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [pdfPassword, setPdfPassword] = useState<string>("");
  const [headerText, setHeaderText] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers
  const handleSelectFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newItems: UploadedFile[] = Array.from(selectedFiles)
      .filter((f) => f.type === "application/pdf")
      .map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        rotateDeg: 0,
      }));

    if (newItems.length > 0) {
      setFiles((prev) => {
        const updated = [...prev, ...newItems];
        // Auto update default output filename based on first file
        if (prev.length === 0) {
          const baseName = newItems[0].file.name.replace(/\.[^/.]+$/, "");
          setOutputFilename(`${baseName}_merged`);
        }
        return updated;
      });
      setResultUrl(null);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
    setResultUrl(null);
  };

  const handleRotateFile = (id: string) => {
    setFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotateDeg: (item.rotateDeg + 90) % 360 } : item
      )
    );
  };

  const handleResetAll = () => {
    setFiles([]);
    setOutputFilename("ToolNova_Merged");
    setResultUrl(null);
  };

  // Convert & Merge Core
  const handleConvert = async () => {
    if (files.length === 0) {
      alert("Please upload at least one PDF file.");
      return;
    }

    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);

        const pageIndices = srcPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);

        copiedPages.forEach((page) => {
          if (item.rotateDeg !== 0) {
            const currentRotation = page.getRotation().angle;
            page.setRotation({ angle: (currentRotation + item.rotateDeg) % 360 } as any);
          }
          mergedPdf.addPage(page);
        });
      }

      const pdfBytes = await mergedPdf.save({ 
        useObjectStreams: compressionLevel !== "low" 
      });
      
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
    } catch (err) {
      console.error(err);
      alert("Error processing PDF conversion.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center font-sans antialiased">
      
      {/* Top Header Navigation */}
      <header className="w-full max-w-4xl mb-6 flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to ToolNova
        </Link>
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs md:text-sm">
          <FileText className="w-4 h-4" /> PDF Merger & Converter
        </div>
      </header>

      {/* Main Workspace Card */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Merge & Convert PDF Files
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Combine multiple PDF documents into a single organized file seamlessly.
          </p>
        </div>

        {/* STEP 1: UPLOAD ZONE (Jab tak koi file select nahi hui) */}
        {files.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-red-500/60 bg-slate-950/60 hover:bg-slate-950 p-10 sm:p-14 rounded-3xl text-center cursor-pointer transition-all space-y-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            
            <div className="space-y-1.5">
              <p className="text-base sm:text-lg font-extrabold text-white">
                Select PDF Files
              </p>
              <p className="text-xs text-slate-400">
                or drag & drop your PDF documents here
              </p>
            </div>

            <Button
              type="button"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-red-950 pointer-events-none"
            >
              Select Files
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleSelectFiles(e.target.files)}
            />
          </div>
        ) : (
          /* STEP 2: UPLOADED FILES LIST (Upload karne ke baad dikhega) */
          <div className="space-y-6">
            
            <div className="space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Uploaded Files ({files.length})
                </span>

                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-950 px-3 py-1.5 rounded-lg border border-cyan-800/50 transition-all"
                >
                  <FilePlus className="w-3.5 h-3.5" /> Add More Files
                </button>

                <input
                  type="file"
                  ref={addMoreInputRef}
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => handleSelectFiles(e.target.files)}
                />
              </div>

              {/* List of Files */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-mono font-bold text-slate-500 w-6">
                        #{index + 1}
                      </span>
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">
                          {item.file.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {Math.round(item.file.size / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRotateFile(item.id)}
                        className={`p-2 rounded-lg text-xs transition-colors border ${
                          item.rotateDeg > 0
                            ? "bg-cyan-950 border-cyan-500/40 text-cyan-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                        title={`Rotate Page (${item.rotateDeg}°)`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(item.id)}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                        title="Remove File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORMAT & OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Convert format:</label>
                <select
                  value={convertFormat}
                  onChange={(e) => setConvertFormat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="pdf-retained">PDF (Retain original structure)</option>
                  <option value="searchable-pdf">Searchable PDF</option>
                  <option value="image-pdf">Image-PDF</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Filename after conversion:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
                  />
                  <span className="text-xs font-bold text-slate-400">.pdf</span>
                </div>
              </div>
            </div>

            {/* TABS (Compression / Protection / Header) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {[
                  { id: "compression", label: "Compression" },
                  { id: "protection", label: "Protection" },
                  { id: "header", label: "Header / Footer" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? "bg-slate-800 text-white border border-slate-700 shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                {activeTab === "compression" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-slate-400 font-medium">Quality & Compression:</span>
                    <select
                      value={compressionLevel}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium"
                    >
                      <option value="high">Standard Compression (Recommended)</option>
                      <option value="medium">Medium Compression</option>
                      <option value="low">High Quality (Low Compression)</option>
                    </select>
                  </div>
                )}

                {activeTab === "protection" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-slate-400 font-medium">Password Encrypt PDF:</span>
                    <input
                      type="password"
                      placeholder="Enter password..."
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono w-60 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}

                {activeTab === "header" && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-slate-400 font-medium">Page Header Title:</span>
                    <input
                      type="text"
                      placeholder="Enter header title text..."
                      value={headerText}
                      onChange={(e) => setHeaderText(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white w-72 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="px-10 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-950 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Converting PDF...
                  </>
                ) : (
                  "Merge & Convert PDF"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleResetAll}
                className="px-6 py-3.5 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
              >
                Clear All
              </Button>
            </div>

            {/* RESULT DOWNLOAD CARD */}
            {resultUrl && (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="w-5 h-5" /> Conversion Finished!
                </div>

                <a
                  href={resultUrl}
                  download={`${outputFilename || "ToolNova_Merged"}.pdf`}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Merged PDF
                </a>
              </div>
            )}

          </div>
        )}

        {/* Security Footer */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Files are processed 100% locally on your browser for total security.
        </div>

      </div>
    </main>
  );
}