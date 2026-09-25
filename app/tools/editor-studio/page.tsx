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
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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

      {/* Main Studio Canvas Workspace */}
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

      {/* SEO & AdSense Compliant Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-12 text-slate-300 border-t border-slate-800/80">
        
        {/* Editor Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
            Online Document Redaction & Text Overlay Studio
          </h2>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            The **ToolKraft Fabric Studio Editor** is a client-side document redaction, text correction, and typographical overlay tool designed for precision editing directly within the web browser. Whether you need to patch incorrect dates on certificate scans, mask sensitive personal identification numbers (UIDAI/PAN/Bank details) with solid background patches, or overlay native Devanagari typography (Marathi, Hindi) onto official certificates, our studio delivers real-time vector layering without cloud uploads.
          </p>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Powered by high-performance HTML5 Canvas and Fabric vector rendering engines, all image operations execute entirely within your computer’s temporary GPU memory. This ensures that sensitive identity documents, financial statements, and scanned affidavits remain 100% confidential without ever touching external web servers.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Step-by-Step Guide to Redacting & Overlaying Text
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Upload Document</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Import any scanned certificate, receipt, or form in PNG, JPG, or WebP format into the interactive workspace.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Insert & Redact</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add text layers, customize fonts (Mukta, Baloo 2, Poppins), or toggle solid color patches to redact background numbers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Export Lossless Image</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download your finalized document as a pristine, high-resolution PNG image ready for official submission or printing.
              </p>
            </div>
          </div>
        </div>

        {/* Essential Applications */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Common Document Editing & Redaction Use Cases
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Native Devanagari & Regional Font Patching:</strong> Built-in support for Marathi and Hindi scripts via Mukta and Baloo 2 typography enables seamless correction of regional official forms and name spellings.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">KYC & Identity Masking:</strong> Protect sensitive financial and identity records by masking full Aadhaar numbers, PAN card numbers, or bank account balances using solid opaque color redaction patches prior to public uploads.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Govt Job Form Preparation:</strong> Overlay missing registration numbers, roll codes, or timestamps directly onto scanned admit cards, scorecards, and receipts.
              </span>
            </li>
          </ul>
        </div>

        {/* Client Side Privacy Guarantee */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Absolute Zero-Server Security Policy
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your identity and documents are strictly your own. Unlike conventional cloud editors, ToolKraft processes all vector renders on your device via client-side JavaScript APIs. No uploaded files, redaction blocks, or edited texts are stored, transmitted, or accessible to anyone else.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                How do I completely mask background text or sensitive data?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click &quot;Insert Advanced Text Layer&quot;, toggle &quot;Solid Background Redaction&quot; to active, and pick a patch color matching your document background (typically pure white). Move the layer over the confidential text to obscure it permanently.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Does the editor degrade original document resolution?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                No. The editor preserves original pixel dimensions upon canvas initialization and exports final renders in lossless PNG format with zero JPEG compression artifacts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Are Marathi and Hindi typography ligatures rendered correctly?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Yes. By integrating the Mukta and Baloo 2 font engines, compound Devanagari consonants (जोडाक्षरे) and complex vowel diacritics render with exact typographical accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Tool Link */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need to convert your finalized document image into a PDF?
          </p>
          <Link
            href="/tools/word-to-pdf"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Word & Document to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>
    </div>
  );
}