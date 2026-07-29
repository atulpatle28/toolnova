"use client";

import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import Link from "next/link";
import { ArrowLeft, Upload, Type, Download, Loader2, Sparkles, Edit3 } from "lucide-react";

interface DetectedText {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
}

export default function EditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [textItems, setTextItems] = useState<DetectedText[]>([]);
  const [selectedFont, setSelectedFont] = useState("'Baloo 2', cursive");
  const [activeTextId, setActiveTextId] = useState<number | null>(null);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fontOptions = [
    { name: "Baloo 2 (Marathi/Devanagari)", value: "'Baloo 2', cursive" },
    { name: "Mukta (Marathi/Devanagari)", value: "'Mukta', sans-serif" },
    { name: "Poppins (English/Hindi)", value: "'Poppins', sans-serif" },
    { name: "Arial / Sans-serif", value: "Arial, sans-serif" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setTextItems([]);
        setStatus("");
        setActiveTextId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageText = async () => {
    if (!image || !imgRef.current) return;
    setLoading(true);
    setStatus("Scanning Marathi & English Text...");

    try {
      const worker = await createWorker("eng+mar");
      const ret = await worker.recognize(image);
      const pageData = ret.data as any;

      // Calculate Scaling Ratio between original image size and display size
      const naturalWidth = imgRef.current.naturalWidth || 1;
      const naturalHeight = imgRef.current.naturalHeight || 1;
      const displayWidth = imgRef.current.clientWidth || 1;
      const displayHeight = imgRef.current.clientHeight || 1;

      const scaleX = displayWidth / naturalWidth;
      const scaleY = displayHeight / naturalHeight;

      const rawWords = pageData.words || pageData.blocks?.flatMap((b: any) => b.paragraphs?.flatMap((p: any) => p.lines?.flatMap((l: any) => l.words))) || [];

      const parsedItems: DetectedText[] = rawWords
        .filter((w: any) => w && w.text && w.text.trim().length > 0 && w.bbox)
        .slice(0, 40) // Process top detected words for smooth performance
        .map((w: any, index: number) => ({
          id: index,
          text: w.text,
          x: w.bbox.x0 * scaleX,
          y: w.bbox.y0 * scaleY,
          width: (w.bbox.x1 - w.bbox.x0) * scaleX,
          height: (w.bbox.y1 - w.bbox.y0) * scaleY,
          font: selectedFont,
        }));

      setTextItems(parsedItems);
      setStatus(`Detected ${parsedItems.length} Editable Text Elements!`);
      await worker.terminate();
    } catch (error) {
      console.error(error);
      setStatus("Error running OCR on image.");
    } finally {
      setLoading(false);
    }
  };

  const updateTextValue = (id: number, newText: string) => {
    setTextItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: newText } : item))
    );
  };

  const updateFontForSelected = (fontValue: string) => {
    setSelectedFont(fontValue);
    if (activeTextId !== null) {
      setTextItems((prev) =>
        prev.map((item) => (item.id === activeTextId ? { ...item, font: fontValue } : item))
      );
    } else {
      // Apply to all if none selected
      setTextItems((prev) => prev.map((item) => ({ ...item, font: fontValue })));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Left Sidebar Controls */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Choose Image / Form</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
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

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Select Active Font Family</label>
            <select
              value={selectedFont}
              onChange={(e) => updateFontForSelected(e.target.value)}
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

          {/* Editable Items List View */}
          {textItems.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold text-slate-400">3. Detected Editable Text Items ({textItems.length}):</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {textItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveTextId(item.id)}
                    className={`p-2 rounded-lg border text-xs flex flex-col gap-1 cursor-pointer transition-all ${
                      activeTextId === item.id
                        ? "bg-blue-900/40 border-blue-500"
                        : "bg-slate-800/40 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Item #{item.id + 1}</span>
                      <span className="text-blue-400">{item.font.split(",")[0]}</span>
                    </div>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateTextValue(item.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-blue-400"
                      style={{ fontFamily: item.font }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Canvas Display */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[550px]">
          {image ? (
            <div ref={containerRef} className="relative inline-block border border-slate-700 rounded-lg overflow-hidden max-w-full">
              <img
                ref={imgRef}
                src={image}
                alt="Document preview"
                className="max-w-full max-h-[75vh] object-contain block"
              />

              {/* Direct Overlay Editable Text Boxes */}
              {textItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTextId(item.id)}
                  className={`absolute rounded px-1 flex items-center shadow-lg transition-all ${
                    activeTextId === item.id
                      ? "ring-2 ring-blue-400 bg-slate-950 text-white z-30"
                      : "bg-slate-950/90 text-yellow-300 border border-blue-500/80 z-20 hover:scale-105"
                  }`}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    minWidth: `${Math.max(item.width, 40)}px`,
                    minHeight: `${Math.max(item.height, 20)}px`,
                  }}
                >
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateTextValue(item.id, e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none font-bold"
                    style={{ fontFamily: item.font }}
                  />
                  <Edit3 className="w-3 h-3 text-blue-400 ml-1 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload an image or form document to start editing text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}