"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Download, Sparkles, Move, Trash2, Plus } from "lucide-react";

interface EditableBox {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  font: string;
}

export default function EditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<EditableBox[]>([]);
  const [selectedFont, setSelectedFont] = useState("'Mukta', sans-serif");
  const [fontSize, setFontSize] = useState<number>(14);
  const [activeBoxId, setActiveBoxId] = useState<number | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Box on Click
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newBox: EditableBox = {
      id: Date.now(),
      text: "नवा मजकूर",
      x: Math.max(0, clickX - 40),
      y: Math.max(0, clickY - 12),
      width: 130,
      fontSize: fontSize,
      font: selectedFont,
    };

    setBoxes((prev) => [...prev, newBox]);
    setActiveBoxId(newBox.id);
  };

  // Dragging Logic
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveBoxId(id);
    setIsDragging(true);
    const box = boxes.find((b) => b.id === id);
    if (box) {
      setDragOffset({
        x: e.clientX - box.x,
        y: e.clientY - box.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeBoxId === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setBoxes((prev) =>
      prev.map((b) => (b.id === activeBoxId ? { ...b, x: Math.max(0, newX), y: Math.max(0, newY) } : b))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateBoxText = (id: number, text: string) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  };

  const deleteBox = (id: number) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    if (activeBoxId === id) setActiveBoxId(null);
  };

  // Export & Download High-Res Result
  const exportDocument = () => {
    if (!image || !imgRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background document
      ctx.drawImage(img, 0, 0);

      // Scale ratios
      const scaleX = img.naturalWidth / imgRef.current!.clientWidth;
      const scaleY = img.naturalHeight / imgRef.current!.clientHeight;

      // Render each box with solid whiteout background & custom font text
      boxes.forEach((box) => {
        const renderX = box.x * scaleX;
        const renderY = box.y * scaleY;
        const renderFontSize = box.fontSize * scaleY;
        const renderWidth = box.width * scaleX;
        const renderHeight = (box.fontSize + 12) * scaleY;

        // White background patch to cover original text
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(renderX, renderY, renderWidth, renderHeight);

        // Draw Text
        ctx.fillStyle = "#000000";
        ctx.font = `${renderFontSize}px ${box.font.split(",")[0].replace(/'/g, "")}, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(box.text, renderX + 4 * scaleX, renderY + 4 * scaleY);
      });

      // Download
      const link = document.createElement("a");
      link.download = `Edited-Document-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" /> Document Text Editor
        </h1>
        <button
          onClick={exportDocument}
          disabled={!image}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Save Result
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Left Sidebar Controls */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Choose Document Image</label>
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
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Text Font Style</label>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    setSelectedFont(e.target.value);
                    if (activeBoxId !== null) {
                      setBoxes((prev) => prev.map((b) => (b.id === activeBoxId ? { ...b, font: e.target.value } : b)));
                    }
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

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">3. Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="10"
                  max="32"
                  value={fontSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setFontSize(newSize);
                    if (activeBoxId !== null) {
                      setBoxes((prev) => prev.map((b) => (b.id === activeBoxId ? { ...b, fontSize: newSize } : b)));
                    }
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-300 space-y-1">
                <p>👉 <b>Click image</b> to add a text patch.</p>
                <p>👉 <b>Drag handle (⠿)</b> to move text anywhere.</p>
              </div>
            </>
          )}
        </div>

        {/* Right Workspace */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[550px]">
          {image ? (
            <div
              ref={containerRef}
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative inline-block border border-slate-700 rounded-lg overflow-hidden cursor-crosshair"
            >
              <img
                ref={imgRef}
                src={image}
                alt="Document preview"
                className="max-w-full max-h-[75vh] object-contain block select-none pointer-events-none"
              />

              {/* Editable Boxes with White Patching & Drag */}
              {boxes.map((box) => (
                <div
                  key={box.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBoxId(box.id);
                  }}
                  className={`absolute bg-white text-black border shadow-lg flex items-center rounded px-1 transition-shadow ${
                    activeBoxId === box.id ? "ring-2 ring-blue-500 border-blue-500 z-30" : "border-slate-300 z-20"
                  }`}
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    minWidth: `${box.width}px`,
                  }}
                >
                  {/* Drag Handle */}
                  <span
                    onMouseDown={(e) => handleMouseDown(e, box.id)}
                    className="cursor-move text-slate-400 hover:text-black pr-1 select-none"
                    title="Drag to move"
                  >
                    ⠿
                  </span>

                  {/* Input Box */}
                  <input
                    type="text"
                    value={box.text}
                    onChange={(e) => updateBoxText(box.id, e.target.value)}
                    className="w-full bg-white text-black focus:outline-none font-medium px-1"
                    style={{
                      fontFamily: box.font,
                      fontSize: `${box.fontSize}px`,
                    }}
                  />

                  {/* Remove Handle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBox(box.id);
                    }}
                    className="text-slate-400 hover:text-red-600 font-bold text-sm px-1"
                    title="Delete Patch"
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