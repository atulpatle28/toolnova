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
  FolderOpen,
} from "lucide-react";

interface FileSlot {
  id: string;
  file: File | null;
  rotateDeg: number;
}

export default function PdfMergePage() {
  const [slots, setSlots] = useState<FileSlot[]>([
    { id: "1", file: null, rotateDeg: 0 },
    { id: "2", file: null, rotateDeg: 0 },
    { id: "3", file: null, rotateDeg: 0 },
    { id: "4", file: null, rotateDeg: 0 },
  ]);

  const [convertFormat, setConvertFormat] = useState<string>("pdf-retained");
  const [outputFilename, setOutputFilename] = useState<string>("DisplayRajpatra (3 files merged)");
  const [activeTab, setActiveTab] = useState<string>("compression");
  
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [pdfPassword, setPdfPassword] = useState<string>("");
  const [headerText, setHeaderText] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (slotId: string, newFile: File | null) => {
    if (!newFile) return;
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, file: newFile } : slot))
    );
    setResultUrl(null);
  };

  const handleRemoveFile = (slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, file: null, rotateDeg: 0 } : slot
      )
    );
    setResultUrl(null);
  };

  const handleRotateFile = (slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, rotateDeg: (slot.rotateDeg + 90) % 360 } : slot
      )
    );
  };

  const addMoreSlot = () => {
    setSlots((prev) => [
      ...prev,
      { id: String(prev.length + 1), file: null, rotateDeg: 0 },
    ]);
  };

  const handleResetAll = () => {
    setSlots([
      { id: "1", file: null, rotateDeg: 0 },
      { id: "2", file: null, rotateDeg: 0 },
      { id: "3", file: null, rotateDeg: 0 },
      { id: "4", file: null, rotateDeg: 0 },
    ]);
    setOutputFilename("DisplayRajpatra (3 files merged)");
    setResultUrl(null);
  };

  const handleConvert = async () => {
    const activeFiles = slots.filter((s) => s.file !== null);
    if (activeFiles.length === 0) {
      alert("Please select at least one PDF file.");
      return;
    }

    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const slot of activeFiles) {
        if (!slot.file) continue;
        const arrayBuffer = await slot.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);

        const pageIndices = srcPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);

        copiedPages.forEach((page) => {
          if (slot.rotateDeg !== 0) {
            const currentRotation = page.getRotation().angle;
            page.setRotation({ angle: (currentRotation + slot.rotateDeg) % 360 } as any);
          }
          mergedPdf.addPage(page);
        });
      }

      // Save PDF with optimization flags
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
      
      {/* Top Bar Navigation */}
      <header className="w-full max-w-5xl mb-6 flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to ToolNova
        </Link>
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs md:text-sm">
          <FileText className="w-4 h-4" /> Online PDF Converter & Merger
        </div>
      </header>

      {/* Main Workspace */}
      <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* FILE QUEUE LIST */}
        <div className="space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Selected PDF Files:
          </h3>

          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              {/* Left Slot Details */}
              <div className="flex items-center gap-3 min-w-[280px] flex-1">
                <span className="text-xs font-bold text-slate-400 font-mono w-14">
                  File {index + 1}:
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  ref={(el) => {
                    fileInputRefs.current[slot.id] = el;
                  }}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileChange(slot.id, f);
                  }}
                />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                  className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-200 hover:text-white gap-1.5"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-red-400" />
                  {slot.file ? "Change..." : index === 3 ? "Browse... (optional)" : "Browse..."}
                </Button>

                {slot.file ? (
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-xs font-semibold text-white truncate max-w-[220px]">
                      {slot.file.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({Math.round(slot.file.size / 1024)} KB)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No file selected</span>
                )}
              </div>

              {/* Action Toolbar */}
              {slot.file && (
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => handleRotateFile(slot.id)}
                    className={`p-1.5 rounded text-xs transition-colors ${
                      slot.rotateDeg > 0 ? "text-cyan-400 bg-slate-900" : "text-slate-400 hover:text-white"
                    }`}
                    title={`Rotate (${slot.rotateDeg}°)`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRemoveFile(slot.id)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addMoreSlot}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 pt-1 inline-block"
          >
            + Add more file rows
          </button>
        </div>

        {/* MODE & CONVERT TO SELECTION */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            Mode: <span className="text-red-400 font-mono uppercase bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">Merge Files</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-300">convert to:</label>
            <select
              value={convertFormat}
              onChange={(e) => setConvertFormat(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="pdf-retained">PDF (file format is retained)</option>
              <option value="searchable-pdf">Searchable PDF (only for scans)</option>
              <option value="image-pdf">Image-PDF (each page as an image)</option>
            </select>
          </div>
        </div>

        {/* TABBED OPTIONS */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
            {[
              { id: "compression", label: "Compression" },
              { id: "protection", label: "Protection" },
              { id: "header", label: "Header / footer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            {activeTab === "compression" && (
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">Quality & Compression:</span>
                <select
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium"
                >
                  <option value="high">Standard Compression (Recommended)</option>
                  <option value="medium">Medium Compression</option>
                  <option value="low">High Quality (Low compression)</option>
                </select>
              </div>
            )}

            {activeTab === "protection" && (
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">PDF Protection Password:</span>
                <input
                  type="password"
                  placeholder="Set PDF password..."
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono w-60 focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            {activeTab === "header" && (
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">Header Text:</span>
                <input
                  type="text"
                  placeholder="Enter custom header title..."
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white w-72 focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* FILENAME AFTER CONVERSION */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-400" /> Filename after conversion:
          </label>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => setOutputFilename(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
            />
            <span className="text-xs font-bold text-slate-400">.pdf</span>
          </div>
        </div>

        {/* CONVERT & RESET BUTTONS */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-12 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-950 transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResetAll}
            className="px-6 py-3.5 rounded-2xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Reset
          </Button>
        </div>

        {/* DOWNLOAD SECTION */}
        {resultUrl && (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" /> Conversion finished!
            </div>

            <a
              href={resultUrl}
              download={`${outputFilename || "ToolNova_Merged"}.pdf`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950 transition-all"
            >
              <Download className="w-4 h-4" /> Download File
            </a>
          </div>
        )}

        {/* Security Footer */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Uploaded files are processed 100% locally and never saved on servers.
        </div>

      </div>
    </main>
  );
}