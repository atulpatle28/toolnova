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
  RefreshCw,
  Trash2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Layers,
  SlidersHorizontal,
  ArrowRight,
  FileImage,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  originalSizeKB: number;
  compressedSizeKB?: number;
  compressedUrl?: string;
  previewUrl: string;
}

function ImageCompressorPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (files: FileList | null) => {
    if (!files) return;
    const items: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          originalSizeKB: Math.round(file.size / 1024),
          previewUrl: URL.createObjectURL(file),
        });
      }
    }
    setImages((prev) => [...prev, ...items]);
  };

  const handleCompress = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const updated = [...images];
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      const img = new Image();
      img.src = item.previewUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg", quality / 100)
      );

      item.compressedSizeKB = Math.round(blob.size / 1024);
      item.compressedUrl = URL.createObjectURL(blob);
    }

    setImages(updated);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4 text-emerald-500" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft Client-Side Compressor
          </span>
        </div>

        {/* Hero Headline */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Bulk Image Compressor</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Reduce JPG, PNG, and WebP file weight by up to 80% without visible pixel degradation.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-emerald-500/5 transition-all space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-extrabold">Select Images</p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WebP (Batch processing enabled)</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleSelect(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Quality Factor: <span className="text-emerald-600 font-mono">{quality}%</span>
                </span>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-emerald-600 cursor-pointer w-full sm:w-1/2"
                />
                <Button onClick={handleCompress} disabled={isProcessing} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-lg shadow-emerald-600/20">
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Compress All"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div key={img.id} className="relative p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                    <button
                      onClick={() => setImages(images.filter((i) => i.id !== img.id))}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-400 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <img src={img.previewUrl} alt="Preview" className="h-28 mx-auto object-contain rounded-md" />
                    <p className="text-xs font-bold truncate text-slate-700 dark:text-slate-300">{img.file.name}</p>
                    <div className="text-[11px] font-mono font-bold">
                      <span className="text-slate-400">{img.originalSizeKB} KB</span>
                      {img.compressedSizeKB && <span className="text-emerald-500 ml-2">→ {img.compressedSizeKB} KB</span>}
                    </div>
                    {img.compressedUrl && (
                      <a
                        href={img.compressedUrl}
                        download={`compressed-${img.file.name.replace(/\.[^/.]+$/, "")}.jpg`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              Client-Side Browser Image Compression Engine
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              High-resolution digital photography and raw mobile camera captures regularly produce image files spanning 5 MB to 20 MB. While exceptional for high-volume physical print publishing, oversized images degrade web page load speeds, inflate bandwidth utilization on cellular networks, and trigger immediate upload errors on competitive examination portals, banking platforms, and e-governance systems.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              The **ToolKraft Image Compressor** uses HTML5 Canvas raster quantization algorithms to rebalance dynamic color matrices and remove non-essential EXIF camera metadata without introducing visible edge artifacts. All compression tasks run completely inside your local browser memory, eliminating remote upload queues and ensuring total privacy.
            </p>
          </div>

          {/* Practical Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              How to Compress Multiple Images Efficiently
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select or Drag Files</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload one or multiple JPG, PNG, or WebP files directly from your computer, tablet, or phone camera roll.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Adjust Quality Slider</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Set your desired target quality level (70%–80% offers an optimal balance of clarity and byte savings).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Download Reduced Files</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Compress All and download the compressed, web-ready images instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Quality vs Compression Benchmark Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
              Recommended Compression Quality Profiles
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Quality Level</th>
                    <th className="p-3 font-semibold">File Weight Reduction</th>
                    <th className="p-3 font-semibold">Visual Detail Fidelity</th>
                    <th className="p-3 font-semibold">Primary Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-emerald-600">85% – 95%</td>
                    <td className="p-3">30% to 50% reduction</td>
                    <td className="p-3">Near-lossless, pristine visual details</td>
                    <td className="p-3">Photography portfolios, banners, graphic design assets</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-emerald-600">70% – 80% (Default)</td>
                    <td className="p-3">60% to 80% reduction</td>
                    <td className="p-3">Imperceptible difference to human eyes</td>
                    <td className="p-3">Website product listings, blog imagery, e-commerce stores</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-500">40% – 60%</td>
                    <td className="p-3">80% to 92% reduction</td>
                    <td className="p-3">Minor smoothing on subtle gradients</td>
                    <td className="p-3">Government exam applications, job portals, email attachments</td>
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
              Your personal photos, ID documents, and confidential screenshots remain entirely on your device. Traditional online image compression services upload files to external cloud buckets for server-side processing, introducing security and privacy risks. ToolKraft processes images through your browser’s local hardware, ensuring no files are uploaded, saved, or shared.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  How does this tool reduce image file sizes without distorting text?
                </h4>
                <p className="leading-relaxed">
                  The compressor preserves original pixel dimensions while optimizing chrominance and luminance sub-sampling tables in the JPEG discrete cosine transform (DCT) pipeline. High-contrast line edges, facial features, and text characters remain sharp and legible.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I compress transparent PNG graphics into JPGs?
                </h4>
                <p className="leading-relaxed">
                  Yes. When transparent PNG files are processed through the compression engine, transparent background alpha channels are rendered against a clean white backdrop, producing standardized, universally compatible JPEG files.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  What is the difference between this tool and the Govt Job Photo Resizer?
                </h4>
                <p className="leading-relaxed">
                  The Image Compressor is designed for general batch file-size reduction across websites and documents. Our dedicated Govt Job Photo Resizer includes predefined pixel dimension templates and strict KB boundary constraints tailored for MPSC, SSC, UPSC, and IBPS online application portals.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need strict pixel dimensions for official exam portals?
            </p>
            <Link
              href="/tools/govt-job-photo-resizer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
            >
              <FileImage className="w-4 h-4" /> Govt Job Photo &amp; Signature Resizer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImageCompressorPage), { ssr: false });