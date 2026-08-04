"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Upload,
  Download,
  RotateCw,
  RefreshCw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  FileImage,
} from "lucide-react";

type ExamPreset = {
  id: string;
  name: string;
  category: "MPSC" | "SSC" | "UPSC" | "Banking" | "Railway" | "Custom";
  maxKb: number;
  minKb?: number;
  widthPx: number;
  heightPx: number;
  format: "jpeg" | "jpg" | "png";
  type: "photo" | "signature";
};

const EXAM_PRESETS: ExamPreset[] = [
  { id: "mpsc-photo", name: "MPSC Photo (50 KB, 138x177 px)", category: "MPSC", maxKb: 50, minKb: 15, widthPx: 138, heightPx: 177, format: "jpg", type: "photo" },
  { id: "mpsc-sig", name: "MPSC Signature (50 KB, 177x67 px)", category: "MPSC", maxKb: 50, minKb: 10, widthPx: 177, heightPx: 67, format: "jpg", type: "signature" },
  { id: "ssc-photo", name: "SSC Photo (20-50 KB, 3.5x4.5 cm / 138x177 px)", category: "SSC", maxKb: 50, minKb: 20, widthPx: 138, heightPx: 177, format: "jpg", type: "photo" },
  { id: "ssc-sig", name: "SSC Signature (10-20 KB, 4.0x2.0 cm / 150x75 px)", category: "SSC", maxKb: 20, minKb: 10, widthPx: 150, heightPx: 75, format: "jpg", type: "signature" },
  { id: "upsc-photo", name: "UPSC Photo (20-300 KB, 350x350 px)", category: "UPSC", maxKb: 300, minKb: 20, widthPx: 350, heightPx: 350, format: "jpg", type: "photo" },
  { id: "upsc-sig", name: "UPSC Signature (20-300 KB, 350x350 px)", category: "UPSC", maxKb: 300, minKb: 20, widthPx: 350, heightPx: 350, format: "jpg", type: "signature" },
  { id: "ibps-photo", name: "Banking / IBPS Photo (20-50 KB, 200x230 px)", category: "Banking", maxKb: 50, minKb: 20, widthPx: 200, heightPx: 230, format: "jpg", type: "photo" },
  { id: "ibps-sig", name: "Banking / IBPS Signature (10-20 KB, 140x60 px)", category: "Banking", maxKb: 20, minKb: 10, widthPx: 140, heightPx: 60, format: "jpg", type: "signature" },
  { id: "rrb-photo", name: "Railway / RRB Photo (20-50 KB, 320x240 px)", category: "Railway", maxKb: 50, minKb: 20, widthPx: 320, heightPx: 240, format: "jpg", type: "photo" },
  { id: "rrb-sig", name: "Railway / RRB Signature (10-20 KB, 140x60 px)", category: "Railway", maxKb: 20, minKb: 10, widthPx: 140, heightPx: 60, format: "jpg", type: "signature" },
];

export default function GovtJobPhotoResizer() {
  const [selectedPreset, setSelectedPreset] = useState<ExamPreset>(EXAM_PRESETS[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSizeKb, setProcessedSizeKb] = useState<number>(0);
  const [targetKb, setTargetKb] = useState<number>(EXAM_PRESETS[0].maxKb);
  const [width, setWidth] = useState<number>(EXAM_PRESETS[0].widthPx);
  const [height, setHeight] = useState<number>(EXAM_PRESETS[0].heightPx);
  const [quality, setQuality] = useState<number>(0.9);
  const [rotation, setRotation] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setTargetKb(selectedPreset.maxKb);
    setWidth(selectedPreset.widthPx);
    setHeight(selectedPreset.heightPx);
  }, [selectedPreset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRotation(0);
    }
  };

  useEffect(() => {
    if (!imageFile || !previewUrl) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);

      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();

      let currentQuality = quality;
      let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
      let head = "data:image/jpeg;base64,";
      let sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      let sizeInKb = sizeInBytes / 1024;

      let attempts = 0;
      while (sizeInKb > targetKb && currentQuality > 0.1 && attempts < 15) {
        currentQuality -= 0.05;
        dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
        sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
        sizeInKb = sizeInBytes / 1024;
        attempts++;
      }

      setProcessedUrl(dataUrl);
      setProcessedSizeKb(parseFloat(sizeInKb.toFixed(2)));
    };
  }, [imageFile, previewUrl, width, height, targetKb, quality, rotation]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Background Accent Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-600/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Global Navigation Header */}
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

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Home / Tools / Govt Exam Resizer
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Safe
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
            Govt Exam Photo & Signature Resizer
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Instantly format photos and signatures for MPSC, SSC, UPSC, Banking, and Railway exam forms with exact dimension and KB limits.
          </p>
        </div>

        {/* Tool Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Preset Controls */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" /> Select Exam Preset
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Exam Target
                </label>
                <select
                  value={selectedPreset.id}
                  onChange={(e) => {
                    const found = EXAM_PRESETS.find((p) => p.id === e.target.value);
                    if (found) setSelectedPreset(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                >
                  {EXAM_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target File Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Max File Size Target
                  </label>
                  <span className="text-sm font-bold text-emerald-400">{targetKb} KB</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>

              {/* Dimension Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Width (PX)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Height (PX)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Guaranteed acceptance under exam upload thresholds.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Upload & Live Result Preview */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[380px]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/50 rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Upload Photo or Signature
                </h3>
                <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {/* Image Output Canvas Preview */}
                <div className="relative border border-slate-800 rounded-xl p-4 bg-slate-950/80 flex items-center justify-center mb-6 max-w-sm w-full overflow-hidden">
                  {processedUrl ? (
                    <img
                      src={processedUrl}
                      alt="Processed Output"
                      className="max-h-60 object-contain rounded border border-slate-800 shadow-md"
                    />
                  ) : (
                    <FileImage className="w-16 h-16 text-slate-600 animate-pulse" />
                  )}
                </div>

                {/* File Statistics Banner */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs text-slate-300 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                  <span>
                    Output Size:{" "}
                    <strong
                      className={
                        processedSizeKb <= targetKb ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"
                      }
                    >
                      {processedSizeKb} KB
                    </strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>Dimensions: <strong>{width} x {height} px</strong></span>
                </div>

                {/* Actions Button Row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCw className="w-4 h-4" /> Rotate
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Change Image
                  </button>
                  {processedUrl && (
                    <a
                      href={processedUrl}
                      download={`govt-exam-${selectedPreset.type}-${width}x${height}.jpg`}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download Photo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#070a11]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ToolKraft. Client-side browser utilities.</p>
        </div>
      </footer>
    </div>
  );
}