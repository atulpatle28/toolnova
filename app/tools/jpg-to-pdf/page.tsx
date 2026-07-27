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

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

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
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> JPG to PDF
          </span>
        </div>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Convert JPG to PDF
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Convert JPG, PNG images into a PDF document easily.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {images.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-2xl text-center cursor-pointer hover:bg-blue-500/5 transition-all space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-base font-extrabold">Select Images (JPG/PNG)</p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg, image/png"
                multiple
                className="hidden"
                onChange={(e) => handleImageSelect(e.target.files)}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((item) => (
                  <div
                    key={item.id}
                    className="relative border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950 flex flex-col items-center"
                  >
                    <button
                      onClick={() => removeImage(item.id)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <img
                      src={item.previewUrl}
                      alt="Preview"
                      className="h-28 object-contain rounded-md"
                    />
                    <p className="text-[10px] font-bold truncate w-full mt-2 text-center">
                      {item.file.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="text-xs font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Images
                </Button>

                <Button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="bg-blue-600 text-white font-bold text-xs px-6 py-2 rounded-xl"
                >
                  {isConverting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Convert to PDF"
                  )}
                </Button>
              </div>

              {pdfUrl && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <p className="text-xs font-bold text-emerald-600">
                    PDF Created Successfully!
                  </p>
                  <a
                    href={pdfUrl}
                    download="images-document.pdf"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md"
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

export default dynamic(() => Promise.resolve(JpgToPdfPage), { ssr: false });