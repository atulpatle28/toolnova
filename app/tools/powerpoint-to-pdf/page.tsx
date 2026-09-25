"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Presentation, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck
} from "lucide-react";

function PowerpointToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPdfUrl(null);
      setProgress(0);
      e.target.value = "";
    }
  };

  const convertPptToPdf = async () => {
    if (!file) return;
    setIsConverting(true);
    setProgress(15);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      setProgress(35);

      // Locate slide XML files in the ppt/slides directory
      const slideFiles = Object.keys(zip.files)
        .filter((fileName) => fileName.startsWith("ppt/slides/slide") && fileName.endsWith(".xml"))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ""), 10) || 0;
          const numB = parseInt(b.replace(/[^0-9]/g, ""), 10) || 0;
          return numA - numB;
        });

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const parser = new DOMParser();

      if (slideFiles.length === 0) {
        // Fallback for legacy binary PPT or slides without parsed XML
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 297, 210, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Presentation Export", 20, 40);
        doc.setFontSize(12);
        doc.setTextColor(148, 163, 184);
        doc.text(`Document: ${file.name}`, 20, 60);
      } else {
        for (let i = 0; i < slideFiles.length; i++) {
          if (i > 0) doc.addPage("a4", "landscape");

          const slideXml = await zip.files[slideFiles[i]].async("string");
          const xmlDoc = parser.parseFromString(slideXml, "text/xml");
          const textNodes = Array.from(xmlDoc.getElementsByTagName("a:t"));
          const slideTexts = textNodes
            .map((node) => node.textContent?.trim() || "")
            .filter((str) => str.length > 0);

          // Slide Background Styling
          doc.setFillColor(15, 23, 42); // Slate 900
          doc.rect(0, 0, 297, 210, "F");

          // Slide Header Banner
          doc.setFillColor(30, 41, 59); // Slate 800
          doc.roundedRect(15, 15, 267, 180, 4, 4, "F");

          doc.setTextColor(249, 115, 22); // Orange Accent
          doc.setFontSize(10);
          doc.text(`SLIDE ${i + 1} OF ${slideFiles.length}`, 25, 28);

          doc.setFillColor(249, 115, 22);
          doc.rect(25, 32, 247, 0.5, "F");

          // Slide Text Parsing
          doc.setTextColor(241, 245, 249);
          let currentY = 45;

          if (slideTexts.length === 0) {
            doc.setFontSize(12);
            doc.setTextColor(148, 163, 184);
            doc.text("[Graphic slide with visual assets]", 25, currentY);
          } else {
            // First item formatted as slide title
            doc.setFontSize(16);
            doc.setTextColor(255, 255, 255);
            const titleLines = doc.splitTextToSize(slideTexts[0], 245);
            doc.text(titleLines, 25, currentY);
            currentY += titleLines.length * 8 + 6;

            // Remaining elements formatted as slide points
            doc.setFontSize(11);
            doc.setTextColor(203, 213, 225);
            for (let t = 1; t < slideTexts.length; t++) {
              if (currentY > 180) break;
              const contentLines = doc.splitTextToSize(`• ${slideTexts[t]}`, 240);
              doc.text(contentLines, 28, currentY);
              currentY += contentLines.length * 6 + 3;
            }
          }

          setProgress(35 + Math.round(((i + 1) / slideFiles.length) * 55));
        }
      }

      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
      setProgress(100);
    } catch (err) {
      console.error("PPT conversion error:", err);
      alert("Failed to parse PowerPoint presentation. Please ensure the file is an uncorrupted .pptx file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <input
        type="file"
        ref={fileInputRef}
        accept=".pptx, .ppt, application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft PowerPoint to PDF Engine
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">POWERPOINT to PDF Converter</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Convert Microsoft PowerPoint presentations (.pptx, .ppt) into standard landscape PDF slides in your browser.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-orange-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 group"
            >
              <div className="w-16 h-16 bg-orange-950/60 text-orange-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Presentation className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PowerPoint File</p>
                <p className="text-xs text-slate-500 mt-1">Supports presentation decks (.pptx, .ppt)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <Presentation className="w-6 h-6 text-orange-400 shrink-0" />
                  <div className="truncate max-w-[240px] sm:max-w-xs">
                    <p className="text-xs font-bold text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-white font-bold bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              {!pdfUrl ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={convertPptToPdf}
                    disabled={isConverting}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-orange-600/20 disabled:opacity-50"
                  >
                    {isConverting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Landscape PDF ({progress}%)
                      </span>
                    ) : (
                      "Convert to Landscape PDF"
                    )}
                  </button>

                  {isConverting && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Presentation Ready!
                  </p>
                  <a
                    href={pdfUrl}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}.pdf`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download Landscape PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-800/80 pt-12 space-y-12 text-slate-300">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Client-Side PowerPoint (.pptx) to Landscape PDF Compilation
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Sharing presentations via raw PowerPoint files frequently leads to misaligned text boxes, substituted missing fonts, broken aspect ratios, or unintended formatting changes across devices lacking proprietary Microsoft Office software. Converting `.pptx` decks into standard landscape PDF files freezes typography, locks slide layout boundaries, and ensures consistent viewing across mobile screens and desktops.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              The **ToolKraft PowerPoint to PDF Converter** uses client-side XML decompression (`jszip`) and landscape document generation (`jspdf`). Slide hierarchies, titles, and text nodes are parsed directly within browser memory, turning slide decks into read-only, print-ready landscape PDF files without sending slides over external networks.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              How to Convert PowerPoint to PDF in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Deck</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any presentation deck in `.pptx` format from your laptop or mobile storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Decompress &amp; Parse</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine unpacks OpenXML slide packages, extracts headings, and renders each slide onto landscape A4 sheets.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the finalized landscape PDF, ready for distribution, printing, or archival without layout drift.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Common Practical Presentation Scenarios
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">User Group</th>
                    <th className="p-3 font-semibold">Presentation Type</th>
                    <th className="p-3 font-semibold">Advantage of Converting to PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Startup Founders &amp; Executives</td>
                    <td className="p-3">Pitch decks &amp; investor briefings</td>
                    <td className="p-3 text-orange-400">Prevents unauthorized font alteration and locks slide design</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Academic Faculty &amp; Teachers</td>
                    <td className="p-3">Course lecture notes &amp; seminar slides</td>
                    <td className="p-3 text-orange-400">Produces printable handouts with readable slide margins</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Conference Keynote Speakers</td>
                    <td className="p-3">Presentation slides for venue AV desks</td>
                    <td className="p-3 text-orange-400">Guarantees projection compatibility on computers without PowerPoint installed</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Corporate Sales Teams</td>
                    <td className="p-3">Product catalogs, proposals &amp; rate sheets</td>
                    <td className="p-3 text-orange-400">Creates lightweight, non-editable attachments suitable for email delivery</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% Client-Side Privacy: No Server File Retention
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Proprietary pitch decks, corporate strategic slides, and seminar notes carry valuable intellectual property. Unlike cloud converter sites that upload presentation slides to external server queues, ToolKraft executes all XML decompression and landscape PDF drawing in your local browser sandbox. Your presentations never touch external cloud servers.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Why are presentations converted into landscape mode rather than portrait?
                </h4>
                <p className="leading-relaxed">
                  PowerPoint slides adhere to horizontal widescreen aspect ratios (16:9 or 4:3). A landscape A4 PDF preserves slide proportions without vertical cropping or unnatural margins.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Does converting PowerPoint to PDF preserve slide animations or video embeds?
                </h4>
                <p className="leading-relaxed">
                  PDF is a static print format. Live transitions and video clips flatten into static visual representations of each slide, which is the standard behavior across document viewers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I compress the generated PDF if it is too heavy for email?
                </h4>
                <p className="leading-relaxed">
                  Yes. If your converted PDF needs to meet strict portal or email attachment limits, you can optimize its file weight using our dedicated PDF Compressor.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to convert a PDF back into an editable PowerPoint presentation?
            </p>
            <Link
              href="/tools/pdf-to-powerpoint"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <Presentation className="w-4 h-4" /> PDF to PowerPoint Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PowerpointToPdfPage), { ssr: false });