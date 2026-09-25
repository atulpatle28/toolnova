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
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Share2,
} from "lucide-react";

export default function QrCodeGeneratorPage() {
  const [qrType, setQrType] = useState<"text" | "url" | "wifi">("url");
  const [textValue, setTextValue] = useState("https://toolkraft.in");
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
    return textValue || "https://toolkraft.in";
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
      downloadLink.download = "toolkraft-qrcode.svg";
      downloadLink.click();
    } else {
      const canvasElement = canvasRef.current?.querySelector("canvas");
      if (!canvasElement) return;
      const pngUrl = canvasElement.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "toolkraft-qrcode.png";
      downloadLink.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getQrData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans tracking-tight antialiased flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Online QR Code Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create high-resolution QR codes for websites, plain text, and Wi-Fi networks with customizable branding colors.
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
                  type="button"
                  onClick={() => setQrType("url")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    qrType === "url"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setQrType("text")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    qrType === "text"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Text
                </button>
                <button
                  type="button"
                  onClick={() => setQrType("wifi")}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
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
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
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
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
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
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PNG Image
                </Button>
                <Button
                  onClick={() => handleDownload("svg")}
                  variant="outline"
                  className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" /> Vector SVG
                </Button>
              </div>

              <Button
                onClick={handleCopyLink}
                variant="ghost"
                className="w-full text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Raw Payload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800/80 pt-12 space-y-12 text-slate-600 dark:text-slate-300">
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-3">
              High-Precision In-Browser QR Code Generation
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Quick Response (QR) codes are two-dimensional matrix barcodes originally developed for industrial tracking and now ubiquitous in contactless payments, digital marketing, Wi-Fi onboarding, and event ticketing. Unlike basic online generators that inject third-party redirect domains or limit scan quotas, the **ToolKraft QR Code Generator** encodes binary payloads directly into static, un-expiring QR patterns right inside your browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Leveraging Level H (High) Reed-Solomon error correction, generated codes restore up to 30% of obscured or damaged data modules. This makes them ideal for physical print materials, business cards, restaurant menus, and product packaging where minor smudges or scratches might otherwise render barcodes unreadable.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              How to Create Custom QR Codes in 3 Simple Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Select Payload Type</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose between web URLs, plain textual messages, or instant Wi-Fi network credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Customize Styling</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Input your content and pick foreground and background contrast colors to match brand aesthetics.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">Download Vector / Raster</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Export as a lightweight PNG for screen usage or infinite-scale SVG for professional commercial printing.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Applications Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Deployment Context</th>
                    <th className="p-3 font-semibold">QR Payload Standard</th>
                    <th className="p-3 font-semibold">Practical Scanning Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70 text-slate-600 dark:text-slate-400">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Cafes &amp; Hospitality</td>
                    <td className="p-3 font-mono text-xs">WIFI:S:SSID;T:WPA;P:Key;;</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Guests connect automatically without typing complex passwords</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Digital Brochures &amp; Menus</td>
                    <td className="p-3 font-mono text-xs">https://domain.com/menu.pdf</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Instant PDF retrieval on customer mobile devices</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Business Cards (vCard)</td>
                    <td className="p-3 font-mono text-xs">Direct Web Portfolio URL</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">Directs partners to LinkedIn, GitHub, or agency portfolios</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-slate-900 dark:text-white">Product Packaging</td>
                    <td className="p-3 font-mono text-xs">Serial Authentication Strings</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">High-density Level H error correction protects against print scuffs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              100% In-Browser Privacy: No Data Transmission
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Wi-Fi network passwords, confidential landing pages, and private credentials should never pass through third-party tracking services. ToolKraft generates QR code bitmaps and vector paths locally inside your browser sandbox using JavaScript matrix computations. No scanned links or payload data are logged, monitored, or transmitted to external servers.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Do the QR codes generated by ToolKraft ever expire?
                </h4>
                <p className="leading-relaxed">
                  No. These are direct, static QR codes that encode your destination address or text directly into the optical matrix. Because they do not route through intermediary redirect servers, they remain permanently functional as long as the underlying target link or Wi-Fi network exists.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Which format should I choose between PNG and SVG?
                </h4>
                <p className="leading-relaxed">
                  Choose PNG for digital publishing, websites, presentations, and email signatures. Choose SVG (Scalable Vector Graphics) for physical printing on large posters, business stationery, or product packaging because vectors scale infinitely without pixelation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">
                  Can I change the pattern and background colors safely?
                </h4>
                <p className="leading-relaxed">
                  Yes, but always maintain high contrast between the pattern and the background (such as a dark foreground on a light background). Smartphone camera sensors require strong optical contrast to read module positions quickly.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Need to compress image assets before publishing to your website?
            </p>
            <Link
              href="/tools/image-compressor"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Bulk Image Compressor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}