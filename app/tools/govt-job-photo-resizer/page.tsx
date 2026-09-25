"use client";

import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UserCheck, Download, RotateCcw, ShieldCheck, FileCheck } from "lucide-react";
import { triggerFileDownload, formatBytes, sanitizeFilename } from "@/lib/utils";

interface ExamPreset {
  name: string;
  width: number;
  height: number;
  targetKb: number;
}

const PRESETS: Record<string, ExamPreset> = {
  ssc_photo: { name: "SSC / CGL / CHSL Photo (3.5 x 4.5 cm)", width: 350, height: 450, targetKb: 40 },
  ssc_sign: { name: "SSC Signature (4.0 x 2.0 cm)", width: 400, height: 200, targetKb: 15 },
  upsc_photo: { name: "UPSC Photo (350 x 350 px)", width: 350, height: 350, targetKb: 75 },
  upsc_sign: { name: "UPSC Signature (350 x 350 px)", width: 350, height: 350, targetKb: 30 },
  ibps_photo: { name: "IBPS / Banking Photo (200 x 230 px)", width: 200, height: 230, targetKb: 45 },
  ibps_sign: { name: "IBPS Signature (140 x 60 px)", width: 140, height: 60, targetKb: 18 },
};

export default function GovtJobPhotoResizerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(450);
  const [targetKb, setTargetKb] = useState<number>(40);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOriginalSize(file.size);
    setProcessedUrl(null);
    setProcessedSize(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setWidth(preset.width);
    setHeight(preset.height);
    setTargetKb(preset.targetKb);
  };

  const processImage = async () => {
    if (!previewUrl || !width || !height) return;
    setLoading(true);

    const img = new Image();
    img.src = previewUrl;

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setLoading(false);
        return;
      }

      // Draw white background (prevents black backgrounds for PNG to JPG conversions)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Render resized graphic
      ctx.drawImage(img, 0, 0, width, height);

      // Binary search compression quality loop to reach exact target KB limit
      let minQuality = 0.05;
      let maxQuality = 0.98;
      let bestDataUrl = canvas.toDataURL("image/jpeg", maxQuality);
      let bestSize = Math.round((bestDataUrl.length * 3) / 4);

      for (let i = 0; i < 6; i++) {
        const midQuality = (minQuality + maxQuality) / 2;
        const currentData = canvas.toDataURL("image/jpeg", midQuality);
        const currentSizeKb = Math.round((currentData.length * 3) / 4 / 1024);

        if (currentSizeKb <= targetKb) {
          bestDataUrl = currentData;
          bestSize = Math.round((currentData.length * 3) / 4);
          minQuality = midQuality;
        } else {
          maxQuality = midQuality;
        }
      }

      setProcessedUrl(bestDataUrl);
      setProcessedSize(bestSize);
      setLoading(false);
    };
  };

  const downloadImage = () => {
    if (!processedUrl || !selectedFile) return;
    const baseName = sanitizeFilename(selectedFile.name, "govt-form-asset");
    triggerFileDownload(processedUrl, `${baseName}-resizer.jpg`);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setProcessedSize(null);
    setWidth(350);
    setHeight(450);
    setTargetKb(40);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Govt Exam Photo &amp; Signature Resizer</CardTitle>
                  <CardDescription>
                    Adjust dimension and file size for SSC, UPSC, IBPS, and State PSC submissions.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {!previewUrl ? (
              <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40">
                <UserCheck className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-sm font-semibold text-slate-200">
                  Upload Photo or Signature (JPG / PNG)
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Files are processed completely in your browser memory.
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFile}
                />
              </label>
            ) : (
              <div className="space-y-5">
                {/* Presets Selector */}
                <div className="space-y-2">
                  <Label>Quick Preset Selection</Label>
                  <Select onValueChange={applyPreset} defaultValue="ssc_photo">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam Preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRESETS).map(([key, item]) => (
                        <SelectItem key={key} value={key}>
                          {item.name} (~{item.targetKb} KB)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Dimensions & Limits */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetKb">Max Target (KB)</Label>
                    <Input
                      id="targetKb"
                      type="number"
                      value={targetKb}
                      onChange={(e) => setTargetKb(Number(e.target.value))}
                      min="5"
                    />
                  </div>
                </div>

                {/* File Details Comparison */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs">
                  <div>
                    <span className="text-slate-400">Original Size:</span>
                    <p className="font-bold text-slate-200 mt-0.5">{formatBytes(originalSize)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Target Output:</span>
                    <p className="font-bold text-emerald-400 mt-0.5">
                      {processedSize ? formatBytes(processedSize) : `≤ ${targetKb} KB`}
                    </p>
                  </div>
                </div>

                {/* Processing and Actions */}
                <div className="flex gap-3">
                  {!processedUrl ? (
                    <Button onClick={processImage} disabled={loading} variant="default" className="flex-1">
                      {loading ? "Optimizing Image..." : "Resize & Compress"}
                    </Button>
                  ) : (
                    <Button onClick={downloadImage} variant="default" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Exam-Ready JPG
                    </Button>
                  )}
                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}