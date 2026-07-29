"use client";

import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import Link from "next/link";
import { ArrowLeft, Upload, Download, Sparkles, Plus, Loader2 } from "lucide-react";

interface EditableBox {
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
  const [boxes, setBoxes] = useState<EditableBox[]>([]);
  const [selectedFont, setSelectedFont] = useState("'Mukta', sans-serif");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const fontOptions = [
    { name: "Mukta (Marathi/Devanagari)", value: "'Mukta', sans-serif" },
    { name: "Baloo 2 (Marathi/Devanagari)", value: "'Baloo 2', cursive" },
    { name: "Poppins (English/Hindi)", value: "'Poppins', sans-serif" },
    { name: "Arial / Sans-serif", value: "Arial, sans-serif" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setBoxes([]);
        setStatus("Document loaded. Click anywhere on the image to edit text!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto OCR Detection
  const autoDetectText = async () => {
    if (!image || !imgRef.current) return;
    setLoading(true);
    setStatus("Auto-scanning text...");

    try {
      const worker = await createWorker("eng+mar");
      const ret = await worker.recognize(image);
      const pageData = ret.data as any;

      const naturalWidth = imgRef.current.naturalWidth || 1;
      const naturalHeight = imgRef.current.naturalHeight || 1;
      const displayWidth = imgRef.current.clientWidth || 1;
      const displayHeight = imgRef.current.clientHeight || 1;

      const scaleX = displayWidth / naturalWidth;
      const scaleY = displayHeight / naturalHeight;

      const rawWords = pageData.words || pageData.blocks?.flatMap((b: any) => b.paragraphs?.flatMap((p: any) => p.lines?.flatMap((l: any) => l.words))) || [];

      const detectedBoxes: EditableBox[] = rawWords
        .filter((w: any) => w && w.text && w.text.trim().length > 0 && w.bbox)
        .slice(0, 30)
        .map((w: any, index: number) => ({
          id: Date.now() + index,
          text: w.text,
          x: w.bbox.x0 * scaleX,
          y: w.bbox.y0 * scaleY,
          width: Math.max((w.bbox.x1 - w.bbox.x0) * scaleX, 60),
          height: Math.max((w.bbox.y1 - w.bbox.y0) * scaleY, 24),
          font: selectedFont,
        }));

      if (detectedBoxes.length > 0) {
        setBoxes(detectedBoxes);
        setStatus(`Auto-detected ${detectedBoxes.length} text blocks! Click any to edit.`);
      } else {
        setStatus("OCR couldn't auto-read blurred text. Click directly on the image where you want to edit!");
      }
      await worker.terminate();
    } catch (err) {
      setStatus("Click anywhere on the image to place editable text box manually.");
    } finally {
      setLoading(false);
    }
  };

  // Manual Click-To-Edit Box Creator
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newBox: EditableBox = {
      id: Date.now(),
      text: "नवा मजकूर / Edit",
      x: clickX - 30,
      y: clickY - 12,
      width: 120,
      height: 28,
      font: selectedFont,
    };

    setBoxes((prev) => [...prev, newBox]);
  };

  const updateBoxText = (id: number, newText: string) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, text: newText } : b)));
  };

  const deleteBox = (id: number) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" /> Document Text Editor
        </h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Download className="w-4 h-4" /> Save Result
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Select Document Image</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-sm font-medium transition-all"
            >
              <Upload className="w-4 h-4 text-blue-400" /> Choose Image
            </label>
          </div>

          {image && (
            <>
              <button
                onClick={autoDetectText}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Auto-Scan Document
              </button>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Matching Font Style</label>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    setSelectedFont(e.target.value);
                    setBoxes((prev) => prev.map((b) => ({ ...b, font: e.target.value })));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                >
                  {fontOptions.map((f) => (
                    <option key={f.name} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-300">
                👉 {status}
              </div>
            </>
          )}
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[550px]">
          {image ? (
            <div
              onClick={handleImageClick}
              className="relative inline-block border border-slate-700 rounded-lg overflow-hidden cursor-crosshair"
            >
              <img
                ref={imgRef}
                src={image}
                alt="Document preview"
                className="max-w-full max-h-[75vh] object-contain block select-none"
              />

              {/* Direct Overlay Editable Text Input Boxes */}
              {boxes.map((box) => (
                <div
                  key={box.id}
                  onClick={(e) => e.stopPropagation()} // Don't trigger new box creation on click
                  className="absolute bg-white text-black border border-blue-500 rounded px-1 flex items-center shadow-md z-30"
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    minWidth: `${box.width}px`,
                    height: `${box.height}px`,
                  }}
                >
                  <input
                    type="text"
                    value={box.text}
                    onChange={(e) => updateBoxText(box.id, e.target.value)}
                    className="w-full bg-white text-black text-xs font-semibold focus:outline-none px-1"
                    style={{ fontFamily: box.font }}
                  />
                  <button
                    onClick={() => deleteBox(box.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs px-1 ml-1"
                    title="Remove Box"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload a document image to start editing text directly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}