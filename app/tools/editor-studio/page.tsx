"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Download, Sparkles, Eraser, Type, Undo, RotateCcw } from "lucide-react";

interface TextOverlay {
  id: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export default function EditorStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<"brush" | "text" | "select">("text");
  const [brushSize, setBrushSize] = useState<number>(20);
  const [selectedFont, setSelectedFont] = useState<string>("'Mukta', sans-serif");
  const [fontSize, setFontSize] = useState<number>(18);
  const [inputText, setInputText] = useState<string>("");
  const [textLayers, setTextLayers] = useState<TextOverlay[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);

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
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              saveState();
            }
          }
        };
        img.src = event.target?.result as string;
        setImage(event.target?.result as string);
        setTextLayers([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
      }
    }
  };

  const undoState = () => {
    if (history.length > 1) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const newHistory = [...history];
          newHistory.pop(); // remove current state
          const prevState = newHistory[newHistory.length - 1];
          ctx.putImageData(prevState, 0, 0);
          setHistory(newHistory);
        }
      }
    }
  };

  // Canvas Drawing / White Eraser Paint Functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "brush") return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== "brush") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.fillStyle = "#FFFFFF"; // Paint White to cover old text
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  // Add Custom Text Layer
  const addTextToCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "text" || !inputText.trim()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newLayer: TextOverlay = {
      id: Date.now(),
      text: inputText,
      x,
      y,
      fontSize,
      fontFamily: selectedFont,
      color: "#000000",
    };

    setTextLayers((prev) => [...prev, newLayer]);
    setInputText("");
  };

  // Export Combined Canvas + Text
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create export temporary canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Draw current canvas background
    ctx.drawImage(canvas, 0, 0);

    // Render all text layers
    textLayers.forEach((layer) => {
      ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
      ctx.fillStyle = layer.color;
      ctx.fillText(layer.text, layer.x, layer.y);
    });

    const link = document.createElement("a");
    link.download = "Edited-Document-ToolKraft.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" /> Paint & Document Editor Studio
        </h1>
        <button
          onClick={exportImage}
          disabled={!image}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download Edited Result
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">1. Select Document / Form</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label
              htmlFor="file-upload"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-sm font-medium transition-all"
            >
              <Upload className="w-4 h-4 text-blue-400" /> Choose Document Image
            </label>
          </div>

          {image && (
            <>
              {/* Tool Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">2. Choose Editing Tool</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTool("brush")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
                      activeTool === "brush" ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Eraser className="w-4 h-4" /> White Brush
                  </button>
                  <button
                    onClick={() => setActiveTool("text")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
                      activeTool === "text" ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Type className="w-4 h-4" /> Add Text
                  </button>
                </div>
              </div>

              {/* White Brush Size Control */}
              {activeTool === "brush" && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Whiteout Size: {brushSize}px</label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              )}

              {/* Text Layer Inputs */}
              {activeTool === "text" && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">Text To Insert (Marathi/English):</label>
                    <input
                      type="text"
                      placeholder="उदा. संतोषकुमार / Marriage Certificate"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      style={{ fontFamily: selectedFont }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">Select Font Style:</label>
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
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
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 bg-blue-900/30 p-2 rounded-lg border border-blue-800/50">
                    💡 Click anywhere on the image to place this text!
                  </p>
                </div>
              )}

              {/* Undo Actions */}
              <button
                onClick={undoState}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
              >
                <Undo className="w-4 h-4" /> Undo Last Action
              </button>
            </>
          )}
        </div>

        {/* Workspace Canvas Area */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[550px]">
          {image ? (
            <div className="relative border border-slate-700 rounded-lg overflow-hidden max-w-full">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onClick={addTextToCanvas}
                className={`max-w-full h-auto cursor-${activeTool === "brush" ? "crosshair" : "text"}`}
              />

              {/* Rendered Overlay Texts */}
              {textLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="absolute pointer-events-none text-black font-semibold"
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    fontSize: `${layer.fontSize}px`,
                    fontFamily: layer.fontFamily,
                  }}
                >
                  {layer.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload a form or document to whiteout text and insert new Marathi/English fonts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}