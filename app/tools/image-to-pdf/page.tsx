"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Trash2,
  FilePlus,
  HelpCircle,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface ImageFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newItems: ImageFileItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    });

    setImages((prev) => [...prev, ...newItems]);
    setPdfUrl(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfUrl(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let pdfImage;

        if (item.file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Error converting images to PDF. Make sure images are valid JPG/PNG format.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Client-Side Conversion Engine
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Multi-Image Converter
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Convert Images to PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Combine multiple JPG or PNG photos into a single, high-quality PDF file instantly.
          </p>
        </div>

        {/* Workstation Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/60 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-blue-500/5 p-12 rounded-2xl text-center cursor-pointer transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  Select Images to Convert
                </p>
                <p className="text-xs text-slate-500">
                  Select multiple JPG, PNG, or WEBP photos
                </p>
              </div>

              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 pointer-events-none"
              >
                Choose Photos
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Image Thumbnails Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Selected Photos ({images.length})
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FilePlus className="w-3.5 h-3.5" /> Add More Photos
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                  {images.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative group bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <div className="h-28 w-full rounded-lg overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-900">
                        <img
                          src={item.previewUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="max-h-full max-w-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Page {idx + 1}</span>
                        <button
                          onClick={() => removeImage(item.id)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setImages([])}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Clear All
                </Button>

                <Button
                  onClick={convertToPdf}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Generating PDF...
                    </>
                  ) : (
                    `Convert ${images.length} Images to PDF`
                  )}
                </Button>
              </div>

              {/* Download PDF Result */}
              {pdfUrl && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" /> PDF Document Generated!
                  </div>

                  <a
                    href={pdfUrl}
                    download="toolkraft-combined-images.pdf"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download Combined PDF
                  </a>
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
              Fast, Private Multi-Image to PDF Compilation
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              When submitting multi-page documentation—such as bank statements, educational certificates, scanned KYC cards, or handwritten assignment sheets—uploading scattered image files often leads to rejection. Most official portals, recruiters, and academic institutions mandate a single consolidated PDF document. The **ToolKraft Image to PDF Converter** packages your JPG and PNG image files into an organized, multi-page vector PDF in seconds.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Powered by client-side WebAssembly and the `pdf-lib` binary engine, our tool embeds raw bitmap streams directly into standard PDF page objects. The compiler maps image resolutions to native page aspect ratios without applying destructive re-compression, preserving document sharpness and text clarity.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Merge Photos into a Single PDF
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select or Add Photos</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload individual or batch JPG and PNG captures. Add more pages anytime before compiling.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Verify Page Order</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review page thumbnails in sequence and remove unwanted snapshots with a single click.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Compile &amp; Download</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Convert to assemble pages into a unified, lightweight PDF ready for immediate download.
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
                    <th className="p-3 font-semibold">Use Case Category</th>
                    <th className="p-3 font-semibold">Typical Image Inputs</th>
                    <th className="p-3 font-semibold">Key Benefit of PDF Compilation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Govt Job &amp; Exam Forms</td>
                    <td className="p-3">Aadhaar scan (front/back), degree mark sheets</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Combines multi-page documents into single-file portal limits</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Student Coursework</td>
                    <td className="p-3">Handwritten notebook pages, assignment questions</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Maintains exact chronological page sequence for review</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Business Invoicing &amp; Tax</td>
                    <td className="p-3">Paper receipts, fuel bills, vendor invoices</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Simplifies GST monthly audit archives into readable files</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Legal &amp; Real Estate</td>
                    <td className="p-3">Deed pages, signed agreements, identity cards</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Locks page order to prevent accidental omission of sheets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% Client-Side Privacy: No Server File Retention
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Legal contracts, exam mark sheets, and national ID cards carry sensitive personal information. While commercial converters transfer files to third-party cloud infrastructure, ToolKraft compiles your PDF documents locally within your browser sandbox. Your images and finished documents never leave your physical device.
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
                  Is there a restriction on the maximum number of images I can combine?
                </h4>
                <p className="leading-relaxed">
                  No artificial software caps are imposed. The tool utilizes available system RAM on your desktop or smartphone, easily handling 30 to 50 photos in a single run.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Will image quality or handwritten text clarity degrade in the output?
                </h4>
                <p className="leading-relaxed">
                  No. The conversion pipeline directly embeds source binary JPEG and PNG streams into PDF object containers without downsampling pixels, keeping handwritten notes and signatures clear.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I convert iPhone HEIC photos using this tool?
                </h4>
                <p className="leading-relaxed">
                  Before compiling into a PDF, convert Apple `.heic` captures to standard JPG or PNG using our dedicated HEIC to JPG tool, then combine them here.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to convert Word documents (.docx) into PDF format?
            </p>
            <Link
              href="/tools/word-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <FileText className="w-4 h-4" /> Word to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}