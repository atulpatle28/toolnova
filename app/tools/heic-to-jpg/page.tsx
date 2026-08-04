"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Upload,
  Download,
  RefreshCw,
  ShieldCheck,
  FileImage,
  FileType,
} from "lucide-react";

export default function HeicToJpgConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<"jpeg" | "png">("jpeg");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setIsProcessing(true);

      try {
        // Dynamic import for client-side HEIC library
        const heic2any = (await import("heic2any")).default;
        const conversionResult = await heic2any({
          blob: file,
          toType: `image/${targetFormat}`,
          quality: 0.9,
        });

        const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
        setConvertedUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("HEIC conversion error:", error);
        // Fallback for native images if non-HEIC uploaded
        setConvertedUrl(URL.createObjectURL(file));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-600/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Global Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Wrench className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-extrabold text-2xl tracking-wide">
              Tool<span className="text-emerald-400">Kraft</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Tools
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Home / Converters / HEIC to JPG
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" /> Fast & 100% Private (Runs in Browser)
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
            HEIC to JPG / PNG Converter
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Convert iPhone `.heic` photos to JPG or PNG instantly without uploading files to any server.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Format Selector */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase text-slate-400">Target Format:</span>
            <button
              onClick={() => setTargetFormat("jpeg")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                targetFormat === "jpeg"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              JPG / JPEG
            </button>
            <button
              onClick={() => setTargetFormat("png")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                targetFormat === "png"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 border border-slate-800"
              }`}
            >
              PNG
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".heic,.heif,image/*"
            className="hidden"
          />

          {!convertedUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/50 rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Select HEIC Image
              </h3>
              <p className="text-xs text-slate-400">Click to upload iPhone photos (.HEIC / .HEIF)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              {isProcessing ? (
                <div className="p-8 text-emerald-400 animate-pulse text-sm font-semibold">
                  Converting HEIC Image...
                </div>
              ) : (
                <>
                  <div className="relative border border-slate-800 rounded-xl p-3 bg-slate-950 mb-6 max-w-sm w-full">
                    <img src={convertedUrl} alt="Converted output" className="max-h-64 mx-auto rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setConvertedUrl(null);
                        setImageFile(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> Convert Another
                    </button>
                    <a
                      href={convertedUrl}
                      download={`toolkraft-converted.${targetFormat}`}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download {targetFormat.toUpperCase()}
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#070a11]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToolKraft. Client-side browser utilities.</p>
        </div>
      </footer>
    </div>
  );
}