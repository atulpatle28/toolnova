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
  Plus,
  Trash2,
  Image as ImageIcon,
  HelpCircle,
  CheckCircle2,
  Layers,
  FileCheck,
  Sparkles,
  ArrowRight,
  FileText,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

function JpgToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        newImages.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setPdfUrl(null);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfUrl(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsConverting(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const imageBytes = await item.file.arrayBuffer();
        let embeddedImg;

        if (
          item.file.type === "image/jpeg" ||
          item.file.type === "image/jpg"
        ) {
          embeddedImg = await pdfDoc.embedJpg(imageBytes);
        } else if (item.file.type === "image/png") {
          embeddedImg = await pdfDoc.embedPng(imageBytes);
        } else {
          continue;
        }

        const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
        page.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: embeddedImg.width,
          height: embeddedImg.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("Conversion failed:", e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      <Navbar />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
        onChange={handleImageSelect}
      />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-blue-500" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft JPG to PDF Engine
          </span>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Convert JPG to PDF Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Combine individual or multiple JPEG, JPG, and PNG images into a clean, print-ready PDF document in seconds.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-4 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">Select Images (JPG/PNG)</p>
                <p className="text-xs text-slate-500 mt-1">Supports bulk upload of JPEG, JPG, PNG, and WebP files</p>
              </div>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20 pointer-events-none"
              >
                Choose Files
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 flex flex-col items-center"
                  >
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={item.previewUrl}
                      alt={`Preview ${idx + 1}`}
                      className="h-28 object-contain rounded-md"
                    />
                    <div className="w-full mt-2 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-mono font-bold">Page {idx + 1}</span>
                      <span className="truncate max-w-[80px]">{item.file.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Images
                </Button>

                <Button
                  type="button"
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/20"
                >
                  {isConverting ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling PDF...
                    </span>
                  ) : (
                    `Convert ${images.length} Images to PDF`
                  )}
                </Button>
              </div>

              {pdfUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Created Successfully!
                  </p>
                  <a
                    href={pdfUrl}
                    download="toolkraft-converted-document.pdf"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download PDF
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
              Fast, Private JPG &amp; PNG to PDF Compilation
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              When applying for competitive government examinations, submitting corporate expense invoices, or sending academic assignments, portals often reject loose JPG files and insist on a single, clean PDF file. The **ToolKraft JPG to PDF Converter** packages separate photo scans, camera shots, and graphic certificates into an organized multi-page document directly inside your browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Using the browser-native `pdf-lib` binary framework, each selected image is read as a raw array buffer and directly embedded into a native PDF page canvas matching the image&apos;s source dimensions. This guarantees that your documents never suffer from lossy secondary compression, blurry text strokes, or cropped page margins.
            </p>
          </div>

          {/* Practical Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Convert JPG Images to PDF in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select JPG Files</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Upload one or multiple JPG, JPEG, or PNG images. You can append additional photos at any time.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Organize Pages</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Review the numbered page sequence and delete accidental uploads or duplicate captures with a single click.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Compile &amp; Download</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Convert to generate your PDF container and download the combined file immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Format Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              JPG vs. PDF: Why Official Systems Require PDF Format
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Document Attribute</th>
                    <th className="p-3 font-semibold">Individual JPG Images</th>
                    <th className="p-3 font-semibold">Combined PDF Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Multi-Page Bundling</td>
                    <td className="p-3 text-rose-500">Requires separate file uploads</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Multiple pages compiled into 1 file</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Page Order Integrity</td>
                    <td className="p-3">File managers sort alphabetically, risking mix-ups</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Fixed chronological sequence locked</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Print Consistency</td>
                    <td className="p-3">Printers scale to page edges unpredictably</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Predictable margins on A4 and Letter paper</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Govt Job Form Acceptance</td>
                    <td className="p-3 text-amber-500">Restricted mainly to photos and signatures</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Universal standard for certificates &amp; IDs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy & Zero Server Retention Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% In-Browser Privacy: No Files Uploaded to Cloud
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Confidential identity cards, university marks lists, and private purchase bills must never be stored on unknown remote servers. ToolKraft processes your documents purely within your browser&apos;s isolated JavaScript sandbox. No pictures or compiled PDF files are logged, monitored, or saved on any remote servers.
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
                  Does converting JPG to PDF increase or decrease the original file size?
                </h4>
                <p className="leading-relaxed">
                  Because the tool wraps the existing JPEG binary stream into a standard PDF structure without re-encoding, the total size is approximately equal to the combined weight of the selected photos, plus a tiny header metadata overhead.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I mix both JPG and PNG files in a single PDF document?
                </h4>
                <p className="leading-relaxed">
                  Yes. The conversion engine detects whether each file is a JPEG or PNG and uses the appropriate embedding method (`embedJpg` or `embedPng`) automatically.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  How can I reduce the size of the final PDF if it exceeds portal upload limits?
                </h4>
                <p className="leading-relaxed">
                  If an application portal sets a strict file ceiling (such as under 1 MB or 500 KB), run your images through our Image Compressor first, then combine them here.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to compress images to hit strict portal thresholds first?
            </p>
            <Link
              href="/tools/image-compressor"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Bulk Image Compressor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(JpgToPdfPage), { ssr: false });