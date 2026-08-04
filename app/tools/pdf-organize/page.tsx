"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PDFDocument, degrees } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft, Download, ShieldCheck, LayoutGrid, RotateCw, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft Organize PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Organize PDF Pages</h1>
          <p className="text-xs text-slate-400">Rotate, delete, or rearrange pages in your PDF document.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 text-center"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <LayoutGrid className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Supports standard PDF files</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-200">{file.name}</p>
                  <p className="text-[10px] text-slate-500">{pages.length} Pages remaining</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white"
                >
                  Change File
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pages.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-between gap-3 text-center"
                  >
                    <div className="w-full h-24 bg-slate-900 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-800/80">
                      Page {p.pageIndex + 1}
                      {p.rotation > 0 && <span className="text-[10px] text-emerald-400 ml-1">({p.rotation}°)</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rotatePage(idx)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removePage(idx)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg"
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
                  onClick={handleOrganize}
                  disabled={isProcessing || pages.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
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
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    <Download className="w-4 h-4" /> Download PDF
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

export default dynamic(() => Promise.resolve(PdfOrganizePage), { ssr: false });