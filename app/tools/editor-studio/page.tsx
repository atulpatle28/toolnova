"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Download,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Type,
  Move,
  Trash2,
  Sliders,
} from "lucide-react";

interface EditableBox {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  font: string;
  bgColor: string;
  textColor: string;
}

export default function EditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<EditableBox[]>([]);
  const [zoom, setZoom] = useState<number>(1); // Zoom level 0.5x to 2x

  // Extended Font Collection for English and Marathi / Devanagari
  const [selectedFont, setSelectedFont] = useState("'Mukta', sans-serif");
  const [fontSize, setFontSize] = useState<number>(14);
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [textColor, setTextColor] = useState<string>("#000000");
  const [activeBoxId, setActiveBoxId] = useState<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fontOptions = [
    // Marathi / Devanagari Fonts
    { name: "Mukta (Marathi Regular)", value: "'Mukta', sans-serif" },
    { name: "Baloo 2 (Marathi Bold/Stylized)", value: "'Baloo 2', cursive" },
    { name: "Yatra One (Marathi Vintage)", value: "'Yatra One', cursive" },
    { name: "Rozha One (Marathi Serif/Bold)", value: "'Rozha One', serif" },
    { name: "Gotu (Marathi Modern)", value: "'Gotu', sans-serif" },

    // English & Standard Fonts
    { name: "Poppins (Clean Modern)", value: "'Poppins', sans-serif" },
    { name: "Inter (Corporate)", value: "'Inter', sans-serif" },
    { name: "Roboto (Standard)", value: "'Roboto', sans-serif" },
    { name: "Times / Serif (Official)", value: "Georgia, serif" },
    { name: "Monospace (Typewriter)", value: "monospace" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setBoxes([]);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => setZoom(1);

  // Add Box on Image Click
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Adjust coordinates according to zoom level
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    const newBox: EditableBox = {
      id: Date.now(),
      text: "नवा मजकूर",
      x: Math.max(0, clickX - 40),
      y: Math.max(0, clickY - 12),
      fontSize: fontSize,
      font: selectedFont,
      bgColor: bgColor,
      textColor: textColor,
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
        x: (e.clientX / zoom) - box.x,
        y: (e.clientY / zoom) - box.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeBoxId === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

    setBoxes((prev) =>
      prev.map((b) =>
        b.id === activeBoxId
          ? { ...b, x: Math.max(0, newX), y: Math.max(0, newY) }
          : b
      )
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

  // Canvas High-Res Export Engine
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

      // Draw original background image
      ctx.drawImage(img, 0, 0);

      // Scaling relative to display image natural bounds
      const scaleX = img.naturalWidth / imgRef.current!.clientWidth;
      const scaleY = img.naturalHeight / imgRef.current!.clientHeight;

      boxes.forEach((box) => {
        const renderX = box.x * scaleX;
        const renderY = box.y * scaleY;
        const renderFontSize = box.fontSize * scaleY;

        ctx.font = `${renderFontSize}px ${box.font.split(",")[0].replace(/'/g, "")}, sans-serif`;
        const textMetrics = ctx.measureText(box.text);
        const renderWidth = textMetrics.width + 16 * scaleX;
        const renderHeight = (box.fontSize + 10) * scaleY;

        // Solid Whiteout background patch
        ctx.fillStyle = box.bgColor;
        ctx.fillRect(renderX, renderY, renderWidth, renderHeight);

        // Render custom colored text
        ctx.fillStyle = box.textColor;
        ctx.textBaseline = "top";
        ctx.fillText(box.text, renderX + 6 * scaleX, renderY + 4 * scaleY);
      });

      const link = document.createElement("a");
      link.download = `Edited-Document-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 px-6 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Exit Studio
        </Link>
        <h1 className="font-bold text-sm sm:text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" /> Paint 3D Studio & Document Editor
        </h1>
        <button
          onClick={exportDocument}
          disabled={!image}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" /> Save Final Image
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Left Toolbar */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 h-fit">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Open Form / Certificate</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-xs font-semibold transition-all"
            >
              <Upload className="w-4 h-4 text-blue-400" /> Upload Document
            </label>
          </div>

          {image && (
            <>
              {/* Zoom Controls Bar */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Canvas Zoom ({Math.round(zoom * 100)}%)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-1"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 100%
                  </button>
                </div>
              </div>

              {/* Comprehensive Font Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">3. Font Style Suite</label>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    setSelectedFont(e.target.value);
                    if (activeBoxId !== null) {
                      setBoxes((prev) =>
                        prev.map((b) => (b.id === activeBoxId ? { ...b, font: e.target.value } : b))
                      );
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {fontOptions.map((f) => (
                    <option key={f.name} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size and Color Customization */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    value={fontSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value);
                      setFontSize(newSize);
                      if (activeBoxId !== null) {
                        setBoxes((prev) =>
                          prev.map((b) => (b.id === activeBoxId ? { ...b, fontSize: newSize } : b))
                        );
                      }
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Patch Fill Color</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        if (activeBoxId !== null) {
                          setBoxes((prev) =>
                            prev.map((b) => (b.id === activeBoxId ? { ...b, bgColor: e.target.value } : b))
                          );
                        }
                      }}
                      className="w-full h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Text Color</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => {
                        setTextColor(e.target.value);
                        if (activeBoxId !== null) {
                          setBoxes((prev) =>
                            prev.map((b) => (b.id === activeBoxId ? { ...b, textColor: e.target.value } : b))
                          );
                        }
                      }}
                      className="w-full h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Canvas Editor Workspace */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[600px] max-h-[80vh]">
          {image ? (
            <div
              ref={containerRef}
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative inline-block border border-slate-700/80 rounded-lg overflow-visible cursor-crosshair origin-top-left transition-transform duration-100"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                ref={imgRef}
                src={image}
                alt="Document preview"
                className="max-w-full max-h-[70vh] object-contain block select-none pointer-events-none"
              />

              {/* Editable Text Patches */}
              {boxes.map((box) => (
                <div
                  key={box.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBoxId(box.id);
                  }}
                  className={`absolute shadow-md flex items-center rounded px-1 transition-all ${
                    activeBoxId === box.id
                      ? "ring-2 ring-blue-500 border border-blue-500 z-30"
                      : "border border-slate-300 z-20"
                  }`}
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    backgroundColor: box.bgColor,
                  }}
                >
                  {/* Drag Handle */}
                  <span
                    onMouseDown={(e) => handleMouseDown(e, box.id)}
                    className="cursor-move text-slate-400 hover:text-black pr-1 select-none text-xs"
                    title="Drag to position"
                  >
                    ⠿
                  </span>

                  {/* Input Box */}
                  <input
                    type="text"
                    value={box.text}
                    onChange={(e) => updateBoxText(box.id, e.target.value)}
                    className="bg-transparent focus:outline-none font-medium px-1 min-w-[60px]"
                    style={{
                      fontFamily: box.font,
                      fontSize: `${box.fontSize}px`,
                      color: box.textColor,
                    }}
                  />

                  {/* Delete Patch Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBox(box.id);
                    }}
                    className="text-slate-400 hover:text-red-600 font-bold text-xs px-1"
                    title="Remove Patch"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload a document image to start editing and patching text.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}