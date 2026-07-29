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
  Paintbrush,
  Square,
  Box,
  Sliders,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Trash2,
  Move,
} from "lucide-react";

interface TextLayer {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  isBold: boolean;
  isItalic: boolean;
  align: "left" | "center" | "right";
}

export default function Paint3DEditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "brushes" | "canvas">("text");

  // Paint 3D Canvas State
  const [zoom, setZoom] = useState<number>(1);
  const [showCanvasBg, setShowCanvasBg] = useState<boolean>(true);

  // Text Layers
  const [layers, setLayers] = useState<TextLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);

  // Active Tool Properties (Paint 3D Right Panel)
  const [fontFamily, setFontFamily] = useState<string>("'Mukta', sans-serif");
  const [fontSize, setFontSize] = useState<number>(16);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Paint 3D Font Collection (English + Complete Devanagari Suite)
  const fontSuite = [
    { group: "Marathi / Devanagari", fonts: [
      { name: "Mukta (Standard)", value: "'Mukta', sans-serif" },
      { name: "Baloo 2 (Modern Bold)", value: "'Baloo 2', cursive" },
      { name: "Yatra One (Calligraphy/Vintage)", value: "'Yatra One', cursive" },
      { name: "Rozha One (Traditional Serif)", value: "'Rozha One', serif" },
      { name: "Gotu (Clean Sans)", value: "'Gotu', sans-serif" },
    ]},
    { group: "English & Universal", fonts: [
      { name: "Poppins (Modern)", value: "'Poppins', sans-serif" },
      { name: "Inter (UI Clean)", value: "'Inter', sans-serif" },
      { name: "Arial (Standard)", value: "Arial, sans-serif" },
      { name: "Times New Roman (Official)", value: "'Times New Roman', serif" },
      { name: "Courier New (Monospace)", value: "'Courier New', monospace" },
    ]}
  ];

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setLayers([]);
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add New Text Box on Canvas Click
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !image) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom;
    const clickY = (e.clientY - rect.top) / zoom;

    const newLayer: TextLayer = {
      id: Date.now(),
      text: "नवा मजकूर / Edit Text",
      x: Math.max(10, clickX - 50),
      y: Math.max(10, clickY - 15),
      fontSize,
      fontFamily,
      textColor,
      bgColor,
      isBold,
      isItalic,
      align,
    };

    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  // Dragging Logic
  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveLayerId(id);
    setIsDragging(true);
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      setDragOffset({
        x: (e.clientX / zoom) - layer.x,
        y: (e.clientY / zoom) - layer.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeLayerId === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

    setLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId ? { ...l, x: Math.max(0, newX), y: Math.max(0, newY) } : l))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update Properties of Currently Selected Layer
  const updateActiveLayer = (key: keyof TextLayer, value: any) => {
    if (activeLayerId !== null) {
      setLayers((prev) =>
        prev.map((l) => (l.id === activeLayerId ? { ...l, [key]: value } : l))
      );
    }
  };

  const deleteLayer = (id: number) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayerId === id) setActiveLayerId(null);
  };

  // High Resolution Paint 3D Export Engine
  const exportPaint3DDocument = () => {
    if (!image || !imgRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Render background document
      ctx.drawImage(img, 0, 0);

      const scaleX = img.naturalWidth / imgRef.current!.clientWidth;
      const scaleY = img.naturalHeight / imgRef.current!.clientHeight;

      layers.forEach((layer) => {
        const renderX = layer.x * scaleX;
        const renderY = layer.y * scaleY;
        const renderFontSize = layer.fontSize * scaleY;

        const fontStyle = `${layer.isItalic ? "italic " : ""}${layer.isBold ? "bold " : ""}${renderFontSize}px ${layer.fontFamily.split(",")[0].replace(/'/g, "")}, sans-serif`;
        ctx.font = fontStyle;

        const textMetrics = ctx.measureText(layer.text);
        const renderWidth = textMetrics.width + 16 * scaleX;
        const renderHeight = (layer.fontSize + 12) * scaleY;

        // Draw solid background patch to hide original text
        ctx.fillStyle = layer.bgColor;
        ctx.fillRect(renderX, renderY, renderWidth, renderHeight);

        // Draw overlay text
        ctx.fillStyle = layer.textColor;
        ctx.textBaseline = "top";
        ctx.fillText(layer.text, renderX + 6 * scaleX, renderY + 4 * scaleY);
      });

      const link = document.createElement("a");
      link.download = `Paint3D-ToolKraft-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  };

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none font-sans">
      {/* 1. PAINT 3D TOP HEADER TABS */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "text" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Text
            </button>
            <button
              onClick={() => setActiveTab("brushes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "brushes" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" /> Brushes
            </button>
            <button
              onClick={() => setActiveTab("canvas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === "canvas" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Square className="w-3.5 h-3.5" /> Canvas
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="paint3d-upload" />
          <label
            htmlFor="paint3d-upload"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" /> Open File
          </label>
          <button
            onClick={exportPaint3DDocument}
            disabled={!image}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            <Download className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE WITH RIGHT PROPERTY PANEL */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER CANVAS VIEWPORT */}
        <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center relative overflow-auto">
          {image ? (
            <div
              ref={containerRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative inline-block border border-slate-800 rounded-lg shadow-2xl overflow-visible cursor-crosshair origin-center transition-transform duration-150"
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                ref={imgRef}
                src={image}
                alt="Paint 3D Canvas"
                className="max-w-full max-h-[72vh] object-contain block pointer-events-none select-none"
              />

              {/* RENDER ACTIVE TEXT LAYERS */}
              {layers.map((layer) => {
                const isSelected = activeLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayerId(layer.id);
                      setFontFamily(layer.fontFamily);
                      setFontSize(layer.fontSize);
                      setTextColor(layer.textColor);
                      setBgColor(layer.bgColor);
                      setIsBold(layer.isBold);
                      setIsItalic(layer.isItalic);
                    }}
                    className={`absolute shadow-lg flex items-center rounded px-1 transition-all ${
                      isSelected ? "ring-2 ring-blue-500 border border-blue-400 z-30" : "border border-slate-300 z-20"
                    }`}
                    style={{
                      left: `${layer.x}px`,
                      top: `${layer.y}px`,
                      backgroundColor: layer.bgColor,
                    }}
                  >
                    {/* Drag Handle */}
                    <span
                      onMouseDown={(e) => handleMouseDown(e, layer.id)}
                      className="cursor-move text-slate-400 hover:text-black pr-1 text-xs select-none"
                      title="Drag to Move"
                    >
                      ⠿
                    </span>

                    {/* Editable Text Input */}
                    <input
                      type="text"
                      value={layer.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLayers((prev) => prev.map((l) => (l.id === layer.id ? { ...l, text: val } : l)));
                      }}
                      className="bg-transparent focus:outline-none font-medium px-1 min-w-[50px]"
                      style={{
                        fontFamily: layer.fontFamily,
                        fontSize: `${layer.fontSize}px`,
                        color: layer.textColor,
                        fontWeight: layer.isBold ? "bold" : "normal",
                        fontStyle: layer.isItalic ? "italic" : "normal",
                        textAlign: layer.align,
                      }}
                    />

                    {/* Delete Layer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="text-slate-400 hover:text-red-600 text-xs font-bold px-1"
                      title="Remove Box"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload an image to start editing in Paint 3D Studio.
            </div>
          )}

          {/* CANVAS BOTTOM CONTROL TOOLBAR (Paint 3D Zoom Bar) */}
          {image && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl z-40">
              <button onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))} className="text-slate-400 hover:text-white">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-300 min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button onClick={() => setZoom((prev) => Math.min(2.5, prev + 0.1))} className="text-slate-400 hover:text-white">
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-4 w-[1px] bg-slate-800" />
              <button onClick={() => setZoom(1)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* 3. PAINT 3D RIGHT PROPERTY SIDEBAR */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" /> Text & Font Properties
            </h2>
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => {
                const val = e.target.value;
                setFontFamily(val);
                updateActiveLayer("fontFamily", val);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {fontSuite.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.fonts.map((f) => (
                    <option key={f.name} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-400">Font Size</label>
              <span className="text-xs font-mono text-blue-400">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="48"
              value={fontSize}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFontSize(val);
                updateActiveLayer("fontSize", val);
              }}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Formatting Controls (Bold, Italic, Alignments) */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Formatting</label>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  const val = !isBold;
                  setIsBold(val);
                  updateActiveLayer("isBold", val);
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  isBold ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const val = !isItalic;
                  setIsItalic(val);
                  updateActiveLayer("isItalic", val);
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  isItalic ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAlign("left");
                  updateActiveLayer("align", "left");
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  align === "left" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAlign("center");
                  updateActiveLayer("align", "center");
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  align === "center" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setAlign("right");
                  updateActiveLayer("align", "right");
                }}
                className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                  align === "right" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color Palettes (Paint 3D Fill & Text Color) */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTextColor(val);
                    updateActiveLayer("textColor", val);
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{textColor.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Background Patch Fill (Whiteout)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBgColor(val);
                    updateActiveLayer("bgColor", val);
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{bgColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-300">
            💡 <b>Paint 3D Tip:</b> Document image par jahan click karenge, exact usi location par text patch create ho jayega. Right panel se font, color aur background patch control kar sakte hain.
          </div>
        </div>
      </div>
    </div>
  );
}