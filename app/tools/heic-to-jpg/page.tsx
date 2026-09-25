"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileType, Download, RotateCcw, ShieldCheck, Loader2, UploadCloud } from "lucide-react";
import { triggerFileDownload, formatBytes, sanitizeFilename } from "@/lib/utils";

function HeicToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [converting, setConverting] = useState<boolean>(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const isHeic = uploadedFile.name.match(/\.(heic|heif)$/i) || uploadedFile.type === "image/heic" || uploadedFile.type === "image/heif";

    if (!isHeic) {
      setError("Please upload an Apple iPhone HEIC or HEIF photo.");
      return;
    }

    setError(null);
    setConvertedUrl(null);
    setConvertedSize(null);
    setFile(uploadedFile);
  };

  const convertImage = async () => {
    if (!file) return;

    setConverting(true);
    setError(null);

    try {
      const heic2anyModule = await import("heic2any");
      const heic2any = heic2anyModule.default || heic2anyModule;

      const conversionResult = await heic2any({
        blob: file,
        toType: outputFormat,
        quality: 0.92,
      });

      const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
      const url = URL.createObjectURL(blob);

      setConvertedUrl(url);
      setConvertedSize(blob.size);
    } catch (err: any) {
      setError("Failed to convert HEIC image. Please verify the file is not corrupted.");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const baseName = sanitizeFilename(file.name, "iphone-photo");
    const extension = outputFormat === "image/jpeg" ? "jpg" : "png";
    triggerFileDownload(convertedUrl, `${baseName}.${extension}`);
  };

  const reset = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setConvertedUrl(null);
    setConvertedSize(null);
    setError(null);
    setConverting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <FileType className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>HEIC to JPG / PNG Converter</CardTitle>
                  <CardDescription>
                    Convert iPhone HEIC photos to standard formats entirely inside your browser.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {error}
              </div>
            )}

            {!file ? (
              <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-sm font-semibold text-slate-200">
                  Upload Apple HEIC / HEIF Photo
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Converted in browser memory. No files sent to remote servers.
                </span>
                <input
                  type="file"
                  accept=".heic,.heif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex items-center gap-3 truncate">
                    <FileType className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="xs" onClick={reset}>
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Target Output Format</Label>
                  <Select
                    defaultValue="image/jpeg"
                    onValueChange={(val: any) => setOutputFormat(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/jpeg">JPG (Standard Photo)</SelectItem>
                      <SelectItem value="image/png">PNG (Lossless Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {convertedSize !== null && (
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 text-xs">
                    <div>
                      <span className="text-slate-400">Original HEIC:</span>
                      <p className="font-bold text-slate-200 mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Converted Output:</span>
                      <p className="font-bold text-emerald-400 mt-0.5">{formatBytes(convertedSize)}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!convertedUrl ? (
                    <Button
                      onClick={convertImage}
                      disabled={converting}
                      variant="default"
                      className="flex-1"
                    >
                      {converting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Converting in Browser...
                        </>
                      ) : (
                        `Convert to ${outputFormat === "image/jpeg" ? "JPG" : "PNG"}`
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleDownload} variant="default" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download {outputFormat === "image/jpeg" ? "JPG" : "PNG"}
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

export default dynamic(() => Promise.resolve(HeicToJpgPage), { ssr: false });