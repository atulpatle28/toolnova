"use client";

import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crop, Download, RotateCcw } from "lucide-react";
import { triggerFileDownload } from "@/lib/utils";

export default function ImageResizerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>("image.png");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageSrc(url);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const downloadResizedImage = () => {
    if (!imageSrc || !width || !height) return;

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      triggerFileDownload(dataUrl, `resized-${fileName}`);
    };
  };

  const reset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setWidth(0);
    setHeight(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Image Resizer</CardTitle>
                <CardDescription>
                  Resize images by pixel dimensions entirely inside your browser.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!imageSrc ? (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center hover:border-slate-700 transition-colors">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer file:cursor-pointer"
                />
                <p className="text-xs text-slate-400 mt-2">Upload JPG, PNG, or WebP</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width || ""}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height || ""}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aspect"
                    checked={lockAspect}
                    onChange={(e) => setLockAspect(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <Label htmlFor="aspect" className="cursor-pointer text-xs">
                    Lock aspect ratio
                  </Label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={downloadResizedImage} variant="default" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resized Image
                  </Button>
                  <Button onClick={reset} variant="outline">
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