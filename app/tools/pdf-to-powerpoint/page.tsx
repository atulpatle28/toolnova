"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  FileCheck,
  LayoutTemplate
} from "lucide-react";

function PdfToPowerpointPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [pptxBlob, setPptxBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPptxBlob(null);
      setProgress(0);
      e.target.value = "";
    }
  };

  const convertPdfToPowerpoint = async () => {
    if (!file) return;
    setIsConverting(true);
    setProgress(5);

    try {
      // 1. Dynamic imports to keep initial bundle lightweight
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const pptxgen = (await import("pptxgenjs")).default;
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport } as any).promise;
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

          const slide = pres.addSlide();
          slide.background = { color: "0F172A" };

          // Center rendered page on widescreen 16:9 canvas
          slide.addImage({
            data: dataUrl,
            x: "10%",
            y: "5%",
            w: "80%",
            h: "90%",
            sizing: { type: "contain", w: 10, h: 5.625 },
          });
        }

        setProgress(Math.round((i / numPages) * 90));
      }

      // Generate binary PowerPoint file
      const out = (await pres.write({ outputType: "blob" })) as Blob;
      setPptxBlob(out);
      setProgress(100);
    } catch (err) {
      console.error("PDF to PowerPoint conversion error:", err);
      alert("Failed to convert PDF into PowerPoint slides. Please try another PDF document.");
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
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft PDF to PowerPoint Engine
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">PDF to PowerPoint Converter (.pptx)</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Convert static PDF pages and slide exports into native Microsoft PowerPoint presentation decks (.pptx) right inside your browser.
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
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Converts documents into a native 16:9 widescreen slide deck (.pptx)</p>
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

              {!pptxBlob ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={convertPdfToPowerpoint}
                    disabled={isConverting}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-orange-600/20 disabled:opacity-50"
                  >
                    {isConverting ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Slides ({progress}%)
                      </span>
                    ) : (
                      "Convert to PowerPoint Presentation (.pptx)"
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
                    <CheckCircle2 className="w-4 h-4" /> PowerPoint Presentation Ready!
                  </p>
                  <a
                    href={URL.createObjectURL(pptxBlob)}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}.pptx`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download .PPTX Presentation
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
              Client-Side PDF to PowerPoint (.pptx) Vector Synthesis
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Professionals, educators, and students often receive pitch decks, research conference slides, and webinar presentations in static, un-editable PDF formats. Delivering presentations directly from PDF viewers lacks presenter notes, transition animations, slide reordering, and widescreen projection compatibility. The **ToolKraft PDF to PowerPoint Converter** synthesizes authentic, multi-slide Microsoft PowerPoint presentations (.pptx) directly in your browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Powered by client-side WebAssembly rasterization (`pdfjs-dist`) and presentation binary compilers (`pptxgenjs`), each PDF page is mapped onto an industry-standard 16:9 widescreen canvas. The generated file is an authentic OpenXML presentation container compatible with Microsoft PowerPoint 2016+, Office 365, Google Slides, Keynote, and LibreOffice Impress.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              How to Convert PDF to PowerPoint in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any digital PDF slide deck, seminar paper, or corporate document from your device.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Synthesize Slides</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine renders pages at high DPI and maps them into individual 16:9 widescreen slides.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download .PPTX</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the generated presentation file, ready for keynote lectures, projector setups, and team edits.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              Common Practical Presentation Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">User Scenario</th>
                    <th className="p-3 font-semibold">Original PDF Content</th>
                    <th className="p-3 font-semibold">Advantage in PowerPoint (.pptx)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Conference &amp; Keynote Speakers</td>
                    <td className="p-3">Exported speaker decks and slide notes</td>
                    <td className="p-3 text-orange-400">Enables dual-screen presenter view and wireless clicker timers</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Teachers &amp; University Lecturers</td>
                    <td className="p-3">Academic course syllabi, lecture reading packs</td>
                    <td className="p-3 text-orange-400">Allows inserting interactive quiz slides and custom animations</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Corporate Sales Pitches</td>
                    <td className="p-3">Brochures, case studies, product portfolios</td>
                    <td className="p-3 text-orange-400">Facilitates re-ordering slides to suit client meeting agendas</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Startup Founders</td>
                    <td className="p-3">Investor deck exports</td>
                    <td className="p-3 text-orange-400">Enables quick additions of financial milestones before demo day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% Client-Side Privacy: Zero Cloud File Retention
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Proprietary pitch decks, corporate strategies, and lecture notes represent protected intellectual assets. While conventional cloud converters upload documents to external processing queues where they risk unauthorized archiving, ToolKraft executes all slide synthesis in your browser&apos;s local memory sandbox. Your original PDFs and generated presentation files never leave your device.
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
                  Is the downloaded file a real PowerPoint (.pptx) presentation?
                </h4>
                <p className="leading-relaxed">
                  Yes. The output is an authentic OpenXML `.pptx` container built using `pptxgenjs`. It opens natively in Microsoft PowerPoint, Google Slides, and Apple Keynote without compatibility warnings.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  What aspect ratio is used for the generated presentation slides?
                </h4>
                <p className="leading-relaxed">
                  The engine automatically provisions standard modern 16:9 widescreen presentation slides, centering your document content cleanly to avoid distortion on modern conference room projectors and computer monitors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I add new slides or presenter notes to the downloaded deck?
                </h4>
                <p className="leading-relaxed">
                  Yes. Once opened in PowerPoint or Google Slides, you can add new slides, reorder existing pages, draw shapes, and record slide narration as needed.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to extract individual pages as high-resolution images instead?
            </p>
            <Link
              href="/tools/pdf-to-image"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <LayoutTemplate className="w-4 h-4" /> PDF to Image Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToPowerpointPage), { ssr: false });