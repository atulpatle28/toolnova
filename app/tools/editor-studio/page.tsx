"use client";

import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import Link from "next/link";
import { ArrowLeft, Upload, Type, Download, Loader2, Sparkles } from "lucide-react";

export default function EditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [ocrData, setOcrData] = useState<any[]>([]);
  const [selectedFont, setSelectedFont] = useState("'Mukta', sans-serif");

  // Marathi and English Font Options
  const fontOptions = [
    { name: "Mukta (Marathi/Devanagari)", value: "'Mukta', sans-serif" },
    { name: "Baloo 2 (Marathi/Devanagari)", value: "'Baloo 2', cursive" },
    { name: "Poppins (English/Hindi)", value: "'Poppins', sans-serif" },
    { name: "Arial / Sans-serif", value: "Arial, sans-serif" },
  ];

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setOcrData([]);
        setStatus("");
      };
      reader.readAsDataURL(file);
    }
  };

  // OCR Processing for English and Marathi
  const processImageText = async () => {
    if (!image) return;
    setLoading(true);
    setStatus("Recognizing English & Marathi Text...");

    try {
      const worker = await createWorker("eng+mar");
      const ret = await worker.recognize(image);
      
      // Type safe extraction for Tesseract v5/v6/v7 data structure
      const pageData = ret.data as any;
      const extractedWords = pageData.words || pageData.blocks?.flatMap((b: any) => b.paragraphs?.flatMap((p: any) => p.lines?.flatMap((l: any) => l.words))) || [];

      setOcrData(extractedWords);
      setStatus("Text Detected Successfully!");
      await worker.terminate();
    } catch (error) {
      console.error(error);
      setStatus("Error processing image text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" /> Smart Image & Text Editor
        </h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Result
        </button>
      </header>

      {/* Editor Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Select Document / Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-sm font-medium transition-all"
            >
              <Upload className="w-4 h-4 text-blue-400" /> Choose File
            </label>
          </div>

          {image && (
            <button
              onClick={processImageText}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Type className="w-4 h-4" />}
              Auto-Detect Text (EN + MAR)
            </button>
          )}

          {/* Font Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Font Matching Options</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
            >
              {fontOptions.map((font) => (
                <option key={font.name} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {status && (
            <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-blue-400 border border-slate-700">
              {status}
            </div>
          )}
        </div>

        {/* Workspace Canvas Area */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[500px]">
          {image ? (
            <div className="relative border border-slate-700 rounded-lg overflow-hidden max-w-full">
              <img src={image} alt="Upload preview" className="max-w-full max-h-[70vh] object-contain" />
              {/* Overlay Detected Text Boxes */}
              {ocrData.map((word, idx) => (
                word.bbox ? (
                  <div
                    key={idx}
                    contentEditable
                    suppressContentEditableWarning
                    className="absolute bg-slate-950/90 text-white border border-blue-500/50 rounded px-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
                    style={{
                      left: `${word.bbox.x0}px`,
                      top: `${word.bbox.y0}px`,
                      fontFamily: selectedFont,
                    }}
                  >
                    {word.text}
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload an image file to start editing English or Marathi text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}