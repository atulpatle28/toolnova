"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, Download, ShieldCheck, RefreshCw, Upload, 
  Crop as CropIcon, Sliders, User, Wand2, RotateCcw 
} from "lucide-react";

type ActiveTab = "crop" | "adjustments" | "passport" | "filters";

function ImageCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("crop");
  
  // Crop states
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  
  // Adjustment states
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  
  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePassportPreset = (ratio: number) => {
    if (!imgRef.current) return;
    const { width, height } = imgRef.current;
    
    // Set aspect ratio for Passport Photos (e.g. 3.5cm x 4.5cm -> ~0.77 ratio)
    const cropWidth = Math.min(width, height * ratio);
    const cropHeight = cropWidth / ratio;
    
    setCrop({
      unit: "px",
      width: cropWidth * 0.8,
      height: cropHeight * 0.8,
      x: (width - cropWidth * 0.8) / 2,
      y: (height - cropHeight * 0.8) / 2,
    });
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSelectedFilter("none");
    setCrop({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  };

  const handleDownload = () => {
    if (!imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cropToUse = completedCrop || {
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = cropToUse.width * scaleX;
    canvas.height = cropToUse.height * scaleY;

    // Apply Filter & Adjustments to Canvas
    let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (selectedFilter === "grayscale") filterString += " grayscale(100%)";
    if (selectedFilter === "sepia") filterString += " sepia(100%)";
    if (selectedFilter === "vintage") filterString += " sepia(50%) hue-rotate(-30deg)";
    
    ctx.filter = filterString;

    ctx.drawImage(
      image,
      cropToUse.x * scaleX,
      cropToUse.y * scaleY,
      cropToUse.width * scaleX,
      cropToUse.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // 🟢 Fixed: Download as toolkraft-edited-image.jpg
    const link = document.createElement("a");
    link.download = `toolkraft-edited-image.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const getImageStyle = () => {
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (selectedFilter === "grayscale") filterStr += " grayscale(100%)";
    if (selectedFilter === "sepia") filterStr += " sepia(100%)";
    if (selectedFilter === "vintage") filterStr += " sepia(50%) hue-rotate(-30deg)";
    return { filter: filterStr };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> ToolKraft Workspace
            </span>
          </div>

          {/* Feature Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("crop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "crop" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <CropIcon className="w-3.5 h-3.5" /> Crop V2
            </button>
            <button
              onClick={() => setActiveTab("adjustments")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "adjustments" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Adjustments
            </button>
            <button
              onClick={() => setActiveTab("passport")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "passport" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Passport Photo
            </button>
            <button
              onClick={() => setActiveTab("filters")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "filters" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={!imageSrc}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl disabled:opacity-50 transition"
            >
              <Download className="w-4 h-4" /> Export Image
            </button>
          </div>
        </div>

        {/* Workspace Canvas Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[550px]">
          {/* Main Image Display Box */}
          <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex items-center justify-center relative overflow-hidden">
            {!imageSrc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-emerald-500 bg-slate-900 p-12 rounded-2xl text-center cursor-pointer transition space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-200">Select Image to Edit</p>
                  <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP files</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="max-h-[500px] flex items-center justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Target Image"
                    style={getImageStyle()}
                    className="max-h-[480px] object-contain rounded-lg"
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* Active Tool Sidebar Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
              {activeTab === "crop" && "Crop & Resize"}
              {activeTab === "adjustments" && "Image Adjustments"}
              {activeTab === "passport" && "Passport Size Presets"}
              {activeTab === "filters" && "Color Filters"}
            </h3>

            {/* CROP OPTIONS */}
            {activeTab === "crop" && (
              <div className="space-y-4 text-xs text-slate-400">
                <p>Drag on the image to crop manually or choose standard aspect ratio.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCrop({ unit: "%", width: 50, height: 50, x: 25, y: 25 })}
                    className="p-2 bg-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-700"
                  >
                    Free Form
                  </button>
                  <button
                    onClick={() => setCrop({ unit: "%", width: 50, height: 50, aspect: 1, x: 25, y: 25 })}
                    className="p-2 bg-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-700"
                  >
                    1 : 1 (Square)
                  </button>
                  <button
                    onClick={() => setCrop({ unit: "%", width: 60, height: 40, aspect: 16 / 9, x: 20, y: 30 })}
                    className="p-2 bg-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-700"
                  >
                    16 : 9 (Landscape)
                  </button>
                  <button
                    onClick={() => setCrop({ unit: "%", width: 40, height: 60, aspect: 9 / 16, x: 30, y: 20 })}
                    className="p-2 bg-slate-800 rounded-lg text-slate-200 font-bold hover:bg-slate-700"
                  >
                    9 : 16 (Reel/Story)
                  </button>
                </div>
              </div>
            )}

            {/* ADJUSTMENT SLIDERS */}
            {activeTab === "adjustments" && (
              <div className="space-y-5 text-xs text-slate-300">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Brightness</span>
                    <span className="text-emerald-400 font-bold">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Contrast</span>
                    <span className="text-emerald-400 font-bold">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Saturation</span>
                    <span className="text-emerald-400 font-bold">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* PASSPORT PHOTO PRESETS */}
            {activeTab === "passport" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">Quickly crop photos for official document standards:</p>
                <button
                  onClick={() => handlePassportPreset(3.5 / 4.5)}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-slate-200 font-bold flex justify-between items-center"
                >
                  <span>Indian Passport (3.5 x 4.5 cm)</span>
                  <span className="text-emerald-400">35:45</span>
                </button>
                <button
                  onClick={() => handlePassportPreset(2 / 2)}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-left rounded-xl text-slate-200 font-bold flex justify-between items-center"
                >
                  <span>US Visa / Stamp (2 x 2 inch)</span>
                  <span className="text-emerald-400">1:1</span>
                </button>
              </div>
            )}

            {/* FILTERS */}
            {activeTab === "filters" && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["none", "grayscale", "sepia", "vintage"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`p-3 rounded-xl font-bold capitalize transition border ${
                      selectedFilter === f
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImageCropPage), { ssr: false });