"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Download,
  Sparkles,
  Type,
  Sliders,
  Trash2,
} from "lucide-react";
import * as fabric from "fabric";

export default function FabricStudioEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [zoom, setZoom] = useState<number>(1);

  // Property Panel State
  const [fontFamily, setFontFamily] = useState<string>("'Mukta', sans-serif");
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [hasBackgroundFill, setHasBackgroundFill] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<fabric.IText | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fontOptions = [
    { name: "Mukta (Marathi/Devanagari)", value: "'Mukta', sans-serif" },
    { name: "Baloo 2 (Devanagari/Marathi Bold)", value: "'Baloo 2', cursive" },
    { name: "Poppins (English/Hindi)", value: "'Poppins', sans-serif" },
    { name: "Roboto (Standard)", value: "'Roboto', sans-serif" },
    { name: "Arial / Sans-serif", value: "Arial, sans-serif" },
  ];

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1,
      height: 1,
      backgroundColor: "#030712",
      preserveObjectStacking: true,
    });

    canvas.on("selection:created", (options) => handleSelection(options));
    canvas.on("selection:updated", (options) => handleSelection(options));
    canvas.on("selection:cleared", () => handleDeselection());

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleSelection = (options: any) => {
    const selectedObject = options.selected?.[0];
    if (selectedObject && selectedObject.type === "i-text") {
      const itext = selectedObject as fabric.IText;
      setSelectedText(itext);
      setFontFamily(itext.fontFamily || "'Mukta', sans-serif");
      setFontSize(Math.round(itext.fontSize || 18));
      setTextColor((itext.fill as string) || "#000000");
      setBgColor((itext.backgroundColor as string) || "#FFFFFF");
      setHasBackgroundFill(
        !!itext.backgroundColor && itext.backgroundColor !== "transparent"
      );
    } else {
      handleDeselection();
    }
  };

  const handleDeselection = () => {
    setSelectedText(null);
  };

  // 1. File Upload Handler (Fabric v6 Promise Syntax)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      try {
        const img = await fabric.FabricImage.fromURL(dataUrl, {
          crossOrigin: "anonymous",
        });

        const maxWidth = 1000;
        let renderWidth = img.width || 1;
        let renderHeight = img.height || 1;

        if (renderWidth > maxWidth) {
          const ratio = maxWidth / renderWidth;
          renderWidth = maxWidth;
          renderHeight *= ratio;
          img.scale(ratio);
        }

        fabricCanvas.setDimensions({
          width: renderWidth,
          height: renderHeight,
        });

        // Set backgroundImage in Fabric v6
        fabricCanvas.backgroundImage = img;
        fabricCanvas.requestRenderAll();

        setImage(dataUrl);
        setZoom(1);
      } catch (err) {
        console.error("Error loading image:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Add New Text Layer
  const addNewTextLayer = () => {
    if (!fabricCanvas || !image) return;

    const textSample = new fabric.IText("नवा मजकूर", {
      left: fabricCanvas.getWidth() / 2 - 50,
      top: fabricCanvas.getHeight() / 2 - 15,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: textColor,
      backgroundColor: hasBackgroundFill ? bgColor : "transparent",
      borderColor: "#3b82f6",
      cornerColor: "#3b82f6",
      cornerSize: 10,
      transparentCorners: false,
      padding: 6,
      cursorColor: textColor,
    });

    fabricCanvas.add(textSample);
    fabricCanvas.setActiveObject(textSample);
    textSample.enterEditing();
    fabricCanvas.requestRenderAll();
    setSelectedText(textSample);
  };

  const updateSelectedProperty = (key: string, value: any) => {
    if (selectedText && fabricCanvas) {
      selectedText.set(key as any, value);
      fabricCanvas.requestRenderAll();
    }
  };

  // 3. Export Image Function
  const saveEditedDocument = () => {
    if (!fabricCanvas || !image) return;

    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();

    const exportUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = `ToolKraft-Fabric-${Date.now()}.png`;
    link.href = exportUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none font-sans">
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Studio
        </Link>
        <h1 className="font-black text-xl flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" /> ToolKraft Advanced
          Fabric Studio
        </h1>
        <button
          onClick={saveEditedDocument}
          disabled={!image}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Download className="w-4 h-4" /> Save Final Image
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Workspace Canvas */}
        <div
          ref={containerRef}
          className="lg:col-span-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-center relative overflow-auto min-h-[550px]"
        >
          {image ? (
            <div
              className="relative border border-slate-700/80 rounded-lg overflow-hidden shadow-2xl origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <canvas ref={canvasRef} />
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              Upload a document image to start editing and patching text directly.
            </div>
          )}
        </div>

        {/* Right Controls Panel */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">
              1. Open Document Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="fabric-upload"
            />
            <label
              htmlFor="fabric-upload"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 hover:bg-slate-800 cursor-pointer text-sm font-medium transition-all"
            >
              <Upload className="w-4 h-4 text-blue-400" /> Choose File
            </label>
          </div>

          {image && (
            <>
              <button
                onClick={addNewTextLayer}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Type className="w-4 h-4 text-blue-400" /> Insert Advanced Text Layer
              </button>

              <div className="border-t border-slate-800 pt-5">
                <label className="text-sm font-bold flex items-center gap-2 text-white mb-4">
                  <Sliders className="w-5 h-5 text-blue-500" /> Font & Layer
                  Properties
                </label>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                      Font Family
                    </label>
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFontFamily(val);
                        updateSelectedProperty("fontFamily", val);
                      }}
                      disabled={!selectedText}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      {fontOptions.map((f) => (
                        <option key={f.name} value={f.value}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        Font Size
                      </label>
                      <span className="text-xs font-mono text-blue-400">
                        {fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="54"
                      value={fontSize}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFontSize(val);
                        updateSelectedProperty("fontSize", val);
                      }}
                      disabled={!selectedText}
                      className="w-full accent-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTextColor(val);
                          updateSelectedProperty("fill", val);
                        }}
                        disabled={!selectedText}
                        className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                        Redaction Patch Color
                      </label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBgColor(val);
                          updateSelectedProperty(
                            "backgroundColor",
                            hasBackgroundFill ? val : "transparent"
                          );
                        }}
                        disabled={!selectedText || !hasBackgroundFill}
                        className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block">
                        Solid Background Redaction
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Hide background text with solid fill
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        if (!selectedText) return;
                        const val = !hasBackgroundFill;
                        setHasBackgroundFill(val);
                        updateSelectedProperty(
                          "backgroundColor",
                          val ? bgColor : "transparent"
                        );
                      }}
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                        hasBackgroundFill ? "bg-emerald-600" : "bg-slate-700"
                      } ${!selectedText ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          hasBackgroundFill ? "translate-x-6" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {selectedText && (
                <button
                  onClick={() => {
                    if (fabricCanvas && selectedText) {
                      fabricCanvas.remove(selectedText);
                      handleDeselection();
                    }
                  }}
                  className="w-full py-2.5 bg-red-950/60 hover:bg-red-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-800"
                >
                  <Trash2 className="w-4 h-4" /> Remove Selected Layer
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}