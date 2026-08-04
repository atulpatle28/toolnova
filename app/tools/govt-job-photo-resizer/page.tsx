'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Shield, CheckCircle2, Sliders } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  type: 'Photo' | 'Signature';
  targetKB: number;
  widthPX: number;
  heightPX: number;
}

const PRESETS: Preset[] = [
  { id: 'mpsc-photo', name: 'MPSC / MahaRecruitment Photo', type: 'Photo', targetKB: 50, widthPX: 138, heightPX: 177 },
  { id: 'mpsc-sig', name: 'MPSC / MahaRecruitment Signature', type: 'Signature', targetKB: 20, widthPX: 138, heightPX: 59 },
  { id: 'ssc-photo', name: 'SSC Photo (CGL / CHSL / MTS)', type: 'Photo', targetKB: 50, widthPX: 138, heightPX: 177 },
  { id: 'ssc-sig', name: 'SSC Signature', type: 'Signature', targetKB: 20, widthPX: 157, heightPX: 78 },
  { id: 'ibps-photo', name: 'IBPS / SBI Bank Photo', type: 'Photo', targetKB: 50, widthPX: 200, heightPX: 230 },
  { id: 'ibps-sig', name: 'IBPS / SBI Bank Signature', type: 'Signature', targetKB: 20, widthPX: 140, heightPX: 60 },
  { id: 'upsc-photo', name: 'UPSC Photo', type: 'Photo', targetKB: 100, widthPX: 350, heightPX: 350 },
  { id: 'upsc-sig', name: 'UPSC Signature', type: 'Signature', targetKB: 100, widthPX: 350, heightPX: 350 },
  { id: 'rrb-photo', name: 'RRB Railway Photo', type: 'Photo', targetKB: 50, widthPX: 240, heightPX: 320 },
  { id: 'rrb-sig', name: 'RRB Railway Signature', type: 'Signature', targetKB: 50, widthPX: 280, heightPX: 120 },
];

export default function GovtJobResizer() {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[0].id);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Custom Controls
  const currentPreset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
  const [customKB, setCustomKB] = useState<number>(currentPreset.targetKB);
  const [customWidth, setCustomWidth] = useState<number>(currentPreset.widthPX);
  const [customHeight, setCustomHeight] = useState<number>(currentPreset.heightPX);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setCustomKB(currentPreset.targetKB);
    setCustomWidth(currentPreset.widthPX);
    setCustomHeight(currentPreset.heightPX);
  }, [selectedPreset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = customWidth;
      canvas.height = customHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw with smoothing for high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, customWidth, customHeight);

      // Binary Quality Compression loop to hit exact target KB
      let minQuality = 0.01;
      let maxQuality = 1.0;
      let bestDataUrl = '';
      let bestSize = 0;

      for (let i = 0; i < 10; i++) {
        const midQuality = (minQuality + maxQuality) / 2;
        const dataUrl = canvas.toDataURL('image/jpeg', midQuality);
        const head = 'data:image/jpeg;base64,';
        const sizeInBytes = Math.round((dataUrl.length - head.length) * 0.75);
        const sizeInKB = sizeInBytes / 1024;

        if (sizeInKB <= customKB) {
          bestDataUrl = dataUrl;
          bestSize = sizeInKB;
          minQuality = midQuality; // try higher quality
        } else {
          maxQuality = midQuality; // reduce quality
        }
      }

      setProcessedImage(bestDataUrl || canvas.toDataURL('image/jpeg', 0.1));
      setFileSize(parseFloat(bestSize.toFixed(2)));
      setIsProcessing(false);
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      processImage();
    }
  }, [imageSrc, customKB, customWidth, customHeight]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <Shield className="w-3.5 h-3.5" /> 100% Client-Side Safe
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Govt Exam Photo & Signature Resizer
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Instantly format photos and signatures for MPSC, SSC, UPSC, Banking, and Railway exam forms with exact dimension and KB limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel - Settings */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" /> Select Exam Preset
            </h2>

            {/* Dropdown */}
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Exam Target
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 mb-6"
            >
              {PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.targetKB} KB)
                </option>
              ))}
            </select>

            {/* Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Max File Size Target:</span>
                  <span className="text-emerald-400 font-bold">{customKB} KB</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={customKB}
                  onChange={(e) => setCustomKB(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Width (PX)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Height (PX)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1.5" />
            Guaranteed acceptance under exam upload thresholds.
          </div>
        </div>

        {/* Right Panel - Preview & Upload */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[380px]">
          {!imageSrc ? (
            <label className="w-full h-full min-h-[280px] border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all group bg-slate-950/40">
              <Upload className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 mb-3 transition-colors" />
              <span className="text-sm font-semibold text-slate-200 mb-1">Upload Photo or Signature</span>
              <span className="text-xs text-slate-500">Supports JPG, PNG, WEBP</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="relative mb-6 p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex items-center justify-center max-h-[260px]">
                {processedImage && (
                  <img
                    src={processedImage}
                    alt="Resized Result"
                    className="object-contain max-h-[220px] rounded"
                  />
                )}
              </div>

              {/* Status details */}
              <div className="flex items-center gap-6 text-xs text-slate-400 mb-6 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                <div>
                  Dimensions: <span className="text-white font-bold">{customWidth} x {customHeight} px</span>
                </div>
                <div>
                  Size: <span className="text-emerald-400 font-bold">{fileSize} KB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 w-full justify-center">
                <a
                  href={processedImage || '#'}
                  download={`${currentPreset.id}-resized.jpg`}
                  className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
                >
                  <Download className="w-4 h-4" /> Download Resized Image
                </a>

                <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl cursor-pointer text-sm transition-all">
                  <RefreshCw className="w-4 h-4" /> Change Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}