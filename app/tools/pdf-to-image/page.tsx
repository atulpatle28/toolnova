"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  Upload,
  HelpCircle,
  CheckCircle2,
  FileImage,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText
} from "lucide-react";

function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setImages([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const buffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      const extractedImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport } as any).promise;
          extractedImages.push(canvas.toDataURL("image/jpeg", 0.9));
        }
      }

      setImages(extractedImages);
    } catch (e) {
      console.error("PDF Conversion Error:", e);
      alert("Error processing PDF file. Please try another PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setImages([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col pb-12">
      <Navbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Client-Side Raster Engine
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Extract PDF Pages as High-Quality Images
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Convert individual PDF pages into crisp, high-resolution JPG photos directly inside your browser.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-12 rounded-2xl text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition space-y-4 group"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Click to Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Upload any PDF document to extract pages into JPGs</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleConvert(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="truncate max-w-xs sm:max-w-md">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={resetAll}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg hover:bg-red-100 transition cursor-pointer"
                >
                  Choose Different File
                </button>
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Extracting Pages into High-DPI JPG...</p>
                  <p className="text-xs text-slate-400">Rendering visual layers off-screen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3 shadow-sm"
                    >
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-lg">
                        <img
                          src={imgUrl}
                          alt={`Page ${index + 1}`}
                          className="h-44 w-full object-contain rounded"
                        />
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Page {index + 1}</p>
                      <a
                        href={imgUrl}
                        download={`${file.name.replace(/\.[^/.]+$/, "")}-page-${index + 1}.jpg`}
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20"
                      >
                        <Download className="w-3.5 h-3.5" /> Download JPG
                      </a>
                    </div>
                  ))}
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
              High-Resolution PDF to Image Rendering Architecture
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Embedding visual proofs into online forms, slide decks, social platforms, and digital portfolios often requires converting document pages into standard image formats. While portable documents guarantee structured cross-platform viewing, extracting individual pages as clear JPG photos usually requires third-party desktop editors or paid services. The **ToolKraft PDF to Image Converter** processes document pages directly inside your web browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Using the client-side `pdfjs-dist` rendering pipeline, the tool renders each PDF page onto an HTML5 Canvas at a 2.0x retina scale factor. Before the text vectors and embedded graphics are drawn, the canvas background is flooded with solid white to eliminate the transparency artifacts and black boxes that often occur when rendering transparent PDF backgrounds.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              How to Convert PDF Pages to JPG in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload any digital or scanned PDF document from your phone, laptop, or desktop file manager.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Retina Vector Raster</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The client engine renders every page off-screen at double resolution (2.0x) over an opaque white backdrop.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Download Images</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Preview individual page snapshots and download the generated JPG files with a single click.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">User Scenario</th>
                    <th className="p-3 font-semibold">Input PDF Type</th>
                    <th className="p-3 font-semibold">Primary Workflow Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Govt Examination Portals</td>
                    <td className="p-3">Scorecards, hall tickets, caste validity certificates</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Converts PDF certificates to JPG format required by portals</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Social Media &amp; Presentations</td>
                    <td className="p-3">Infographics, slide exports, corporate brochures</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Enables image posting on LinkedIn, X, and PowerPoint slides</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">E-Commerce &amp; Invoicing</td>
                    <td className="p-3">Order packing slips, delivery receipts</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Permits visual image uploads into merchant inventory software</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Graphic Design &amp; Archiving</td>
                    <td className="p-3">Print layouts, vector artwork previews</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Generates lossless raster previews without specialized desktop apps</td>
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
              Personal scorecards, identity scans, and corporate agreements contain sensitive private data. While external converters transmit uploaded files to third-party cloud servers, ToolKraft processes all vector-to-raster conversions locally using web workers within your browser sandbox. Your PDF files and converted images are never saved, tracked, or stored remotely.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Why do converted PDF pages look blurry on some online converters?
                </h4>
                <p className="leading-relaxed">
                  Many basic online tools render canvases at standard 72 DPI screen scale (1.0x), which causes small text to become pixelated. ToolKraft uses an enhanced 2.0x retina multiplier alongside high-quality JPEG quantization (0.9 factor) to preserve sharp line edges and readable text.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Why do transparent PDF pages sometimes export with black backgrounds?
                </h4>
                <p className="leading-relaxed">
                  In many software pipelines, transparent PDF vector canvases convert to solid black when saved to the JPEG format, which lacks an alpha transparency channel. Our tool pre-fills the canvas with a solid white base before rendering, guaranteeing clean white paper backgrounds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I convert the generated JPG images back into a PDF?
                </h4>
                <p className="leading-relaxed">
                  Yes. If you need to reassemble, reorder, or package your images back into a standardized document, you can use our dedicated JPG to PDF converter.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to combine your exported images back into a single PDF?
            </p>
            <Link
              href="/tools/jpg-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
            >
              <FileImage className="w-4 h-4" /> JPG to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToImagePage), { ssr: false });