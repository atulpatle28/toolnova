"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  QrCode,
  Copy,
  CheckCircle2,
  Palette,
  Link2,
  Wifi,
  Type,
} from "lucide-react";

export default function QrCodeGeneratorPage() {
  const [qrType, setQrType] = useState<"text" | "url" | "wifi">("url");
  const [textValue, setTextValue] = useState("https://toolnova.com");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate QR string based on selected type
  const getQrData = () => {
    if (qrType === "wifi") {
      return `WIFI:S:${wifiSsid};T:WPA;P:${wifiPassword};;`;
    }
    return textValue || "https://toolnova.com";
  };

  const handleDownload = (format: "png" | "svg") => {
    if (format === "svg") {
      const svgElement = canvasRef.current?.querySelector("svg");
      if (!svgElement) return;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "toolnova-qrcode.svg";
      downloadLink.click();
    } else {
      const canvasElement = canvasRef.current?.querySelector("canvas");
      if (!canvasElement) return;
      const pngUrl = canvasElement.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "toolnova-qrcode.png";
      downloadLink.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getQrData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Client-Side Generation
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5" /> Vector QR Studio
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            QR Code Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create high-resolution QR codes for websites, text, and Wi-Fi credentials with custom branding colors.
          </p>
        </div>

        {/* Workstation Container */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="space-y-6">
            
            {/* Type Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select QR Type:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setQrType("url")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    qrType === "url"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" /> URL
                </button>
                <button
                  onClick={() => setQrType("text")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    qrType === "text"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text
                </button>
                <button
                  onClick={() => setQrType("wifi")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    qrType === "wifi"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" /> Wi-Fi
                </button>
              </div>
            </div>

            {/* Input Fields */}
            {qrType !== "wifi" ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {qrType === "url" ? "Enter Web URL:" : "Enter Text Content:"}
                </label>
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={qrType === "url" ? "https://example.com" : "Type your text here..."}
                  className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Network Name (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="My Home WiFi"
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password:</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="WiFi Password"
                    className="w-full px-4 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Color Customization */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-500" /> Color Settings:
              </label>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Pattern Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{fgColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500">Background</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Preview & Download Panel */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-6 text-center">
            
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Preview</span>

            {/* QR Canvas Container */}
            <div
              ref={canvasRef}
              className="p-6 rounded-2xl bg-white border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center"
            >
              <QRCodeCanvas
                value={getQrData()}
                size={200}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
              />
              <div className="hidden">
                <QRCodeSVG
                  value={getQrData()}
                  size={200}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleDownload("png")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> PNG
                </Button>
                <Button
                  onClick={() => handleDownload("svg")}
                  variant="outline"
                  className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> SVG
                </Button>
              </div>

              <Button
                onClick={handleCopyLink}
                variant="ghost"
                className="w-full text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Data Link
                  </>
                )}
              </Button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}