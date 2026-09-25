"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  FileImage,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Image as ImageIcon
} from "lucide-react";

function PngToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jpgUrl, setJpgUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !selectedFiles[0]) return;
    const f = selectedFiles[0];
    setFile(f);
    setIsConverting(true);
    setJpgUrl(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(f);
    img.src = objectUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Flood background with solid white to eliminate PNG transparency blackouts
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setJpgUrl(URL.createObjectURL(blob));
          }
          setIsConverting(false);
          URL.revokeObjectURL(objectUrl);
        },
        "image/jpeg",
        0.92
      );
    };

    img.onerror = () => {
      setIsConverting(false);
      URL.revokeObjectURL(objectUrl);
      alert("Failed to load PNG image. Please ensure the file is a valid image.");
    };
  };

  const resetAll = () => {
    setFile(null);
    setJpgUrl(null);
    setIsConverting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> In-Browser Quantization Engine
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Convert PNG to JPG Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Convert transparent or high-res PNG images into standard, lightweight JPG files with a clean white background.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all space-y-4 group"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileImage className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">Select PNG Image</p>
                <p className="text-xs text-slate-500">Click to choose a .png file from your device</p>
              </div>
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md pointer-events-none"
              >
                Choose File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png"
                className="hidden"
                onChange={(e) => handleConvert(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="truncate max-w-xs sm:max-w-sm text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {isConverting ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <RefreshCw className="w-7 h-7 text-emerald-600 animate-spin" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Rendering &amp; Flattening Image...</p>
                </div>
              ) : jpgUrl ? (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-4">
                  <div className="border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-3 rounded-xl max-h-56 flex items-center justify-center overflow-hidden">
                    <img src={jpgUrl} alt="Converted JPG Preview" className="max-h-48 object-contain rounded" />
                  </div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Converted to High-Quality JPG!
                  </p>
                  <a
                    href={jpgUrl}
                    download={`converted-${file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download JPG
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              Understanding PNG to JPG Transcoding &amp; Background Flattening
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Portable Network Graphics (PNG) is the default image standard for digital graphics, product logos, and web assets due to its lossless compression and transparent alpha channel support. However, PNG files tend to be substantially heavier than equivalent JPEG files. In addition, competitive exam portals, corporate HR systems, and banking gateways strictly reject transparent PNGs or convert transparent backgrounds into solid black silhouettes.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              The **ToolKraft PNG to JPG Converter** solves transparency issues by pre-flooding the canvas with an opaque white baseline before rendering pixel matrices. This ensures clean white backdrops and converts losslessly compressed PNG files into compact, universally accepted JPEGs without third-party server uploads.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              How to Convert PNG to JPG in 3 Simple Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select PNG</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload any graphic, digital signature, or photo in `.png` format from your local storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Canvas Rasterization</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The client engine fills transparent regions with pure white and encodes the image into standard JPEG DCT blocks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Download File</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download the finalized `.jpg` file, ready for official online form submissions, email attachments, and web publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Technical Format Comparison: PNG vs. JPG
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Technical Feature</th>
                    <th className="p-3 font-semibold">PNG Format (.png)</th>
                    <th className="p-3 font-semibold">JPG / JPEG Format (.jpg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Compression Architecture</td>
                    <td className="p-3">Lossless (Deflate algorithm)</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Lossy (Discrete Cosine Transform)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Relative File Weight</td>
                    <td className="p-3 text-rose-500">Heavy (3x to 5x larger file sizes)</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Lightweight (up to 70% reduction)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Background Transparency</td>
                    <td className="p-3">Supports 8-bit or 16-bit Alpha channel</td>
                    <td className="p-3">No alpha channel (solid white backdrop)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Govt Application Acceptance</td>
                    <td className="p-3 text-amber-500">Frequently rejected on upload checks</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Mandatory standard across all exam portals</td>
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
              Personal photographs, official signature scans, and identity card crops contain private biometric details. While external converter sites upload images to remote cloud servers, ToolKraft performs all raster flattening and compression locally inside your browser sandbox. Your pictures are never transferred, tracked, or stored remotely.
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
                  Why do transparent PNGs turn black when converted on basic software?
                </h4>
                <p className="leading-relaxed">
                  The JPEG format does not support an alpha transparency channel. If a conversion engine does not explicitly render a white background layer first, transparent pixels default to empty zero-byte values (solid black). Our tool applies a solid white baseline to guarantee natural, clean backgrounds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Will converting from PNG to JPG reduce image sharpness?
                </h4>
                <p className="leading-relaxed">
                  The conversion engine utilizes a high quality threshold (0.92 factor), retaining sharp edges and crisp text contrast so that any visual difference is imperceptible to the human eye.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  How can I convert Apple iPhone photos (.heic) into JPG format?
                </h4>
                <p className="leading-relaxed">
                  If you are working with iOS photos taken in High Efficiency format, use our dedicated HEIC to JPG converter, which decodes Apple image containers directly.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to convert your finalized JPG images into a single PDF?
            </p>
            <Link
              href="/tools/jpg-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
            >
              <ImageIcon className="w-4 h-4" /> JPG to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PngToJpgPage), { ssr: false });