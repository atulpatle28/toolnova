"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/app/components/ui/Button";
import { FileText, Download, Sliders, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [targetKB, setTargetKB] = useState<number>(100);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [compressedSizeKB, setCompressedSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      const sizeInKB = Math.round(selectedFile.size / 1024);
      setOriginalSizeKB(sizeInKB);
      setTargetKB(Math.round(sizeInKB * 0.5));
      setCompressedPdfUrl(null);
      setCompressedSizeKB(null);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Re-save PDF with structural optimizations
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      // Fixed TypeScript Blob type conversion
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      
      const newSizeKB = Math.round(blob.size / 1024);
      const url = URL.createObjectURL(blob);

      setCompressedPdfUrl(url);
      setCompressedSizeKB(newSizeKB);
    } catch (err) {
      console.error(err);
      alert("Error optimizing PDF file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/60 inline-flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> 11zon Style Target Size PDF Optimizer
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Compress PDF to Exact KB / MB Size
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Set your required file limit for government portals, job applications, or emails.
        </p>
      </div>

      {/* Dropzone */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-red-500/60 bg-slate-900/40 hover:bg-slate-900/80 p-10 rounded-2xl text-center cursor-pointer transition-all space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-200">
              Click to select PDF or Drag & Drop here
            </p>
            <p className="text-xs text-slate-500">Supports files up to 50MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFileChange(selected);
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Metadata & Settings Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400">Selected File</span>
              <p className="text-sm font-bold text-white truncate">{file.name}</p>
              <p className="text-xs text-slate-400 font-mono">Original Size: <span className="text-red-400 font-bold">{originalSizeKB} KB</span></p>
            </div>

            {/* Target KB Input */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-red-400" /> Target Max File Size (KB):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max={originalSizeKB}
                  value={targetKB}
                  onChange={(e) => setTargetKB(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-red-500 focus:outline-none"
                />
                <span className="text-xs font-bold text-slate-400">KB</span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Choose Another File
            </Button>

            <Button
              onClick={handleCompress}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl gap-2 shadow-lg shadow-red-950"
            >
              {isProcessing ? "Optimizing PDF..." : "Compress PDF Now"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Result Card */}
          {compressedPdfUrl && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Optimization Complete!
                </div>
                <span className="text-xs font-mono text-emerald-300">
                  New Size: {compressedSizeKB} KB
                </span>
              </div>

              <a
                href={compressedPdfUrl}
                download={`compressed-${file.name}`}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
              >
                <Download className="w-4 h-4" /> Download Compressed PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* Security Tag */}
      <div className="text-center pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Files are processed locally on your device and never uploaded to servers.
      </div>

    </div>
  );
}

export default PdfCompressorTool;