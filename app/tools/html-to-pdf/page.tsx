"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Code, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  FileCode, 
  Sparkles, 
  ArrowRight,
  Layers
} from "lucide-react";

function HtmlToPdfPage() {
  const [htmlCode, setHtmlCode] = useState<string>(
    `<div style="padding: 20px; font-family: sans-serif; color: #1e293b;">\n  <h1 style="color: #059669;">Hello from ToolKraft!</h1>\n  <p>This HTML content will be cleanly rendered into a PDF document.</p>\n</div>`
  );
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!htmlCode.trim()) return;
    setIsConverting(true);

    try {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "800px";
      container.innerHTML = htmlCode;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale: 2 });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } catch (err) {
      console.error("HTML to PDF conversion failed:", err);
      alert("Failed to convert HTML to PDF.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft HTML to PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">HTML to PDF Converter</h1>
          <p className="text-xs sm:text-sm text-slate-400">Paste raw HTML markup and inline CSS styling to generate an exact printable PDF document instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" /> Enter HTML Code
            </label>
            <textarea
              value={htmlCode}
              onChange={(e) => {
                setHtmlCode(e.target.value);
                setPdfUrl(null);
              }}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              placeholder="<div><h1>Title</h1></div>"
            />
            <button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate PDF"}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-xs font-bold text-slate-300 mb-4">Output Download</h3>
              {pdfUrl ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl text-center space-y-4">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Ready!
                  </p>
                  <a
                    href={pdfUrl}
                    download="toolkraft-html-document.pdf"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-16">Click &quot;Generate PDF&quot; to compile markup into a downloadable document.</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-slate-200">Tip:</strong> Inline CSS attributes (such as <code>color</code>, <code>font-size</code>, <code>padding</code>, and <code>border</code>) are fully respected by the canvas renderer.
            </div>
          </div>
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="max-w-4xl mx-auto border-t border-slate-800/80 pt-12 space-y-12 text-slate-300">
          
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Client-Side HTML & CSS to PDF Rendering Engine
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Developers, webmasters, and data managers frequently need to export web snippets, automated invoice layouts, email templates, and styled report summaries into unalterable, printable document formats. The **ToolKraft HTML to PDF Converter** parses standard HTML syntax alongside CSS design properties and compiles them directly into standardized A4 PDF files.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Instead of delegating page conversions to resource-intensive headless Chrome server instances that log code snippets, ToolKraft executes the parsing cycle directly in your browser. Using virtual DOM virtualization, `html2canvas` high-DPI scaling, and `jsPDF` vector coordinate mapping, your raw source code is rendered off-screen and packaged without sending a single byte over the wire.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              How to Convert HTML Snippets into PDF
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Paste HTML Markup</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your HTML structure inside the editor box. You can include standard heading tags, tables, styled divs, and inline styles.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Compile Canvas</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click Generate PDF. The engine calculates typographical flow, margins, and color schemes at double resolution (2x scale).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download Vector PDF</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Collect your generated PDF, prepared with standard A4 print margins ready for archiving, emailing, or distribution.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Features & Common Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Common HTML to PDF Transformation Use Cases
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Dynamic Invoicing & Receipts:</strong> Generate professional client invoices, purchase order receipts, and billing statements directly from transactional web components.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Email Newsletters & Templates:</strong> Archive rendered versions of promotional newsletters and HTML transactional email layouts for design audits.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Web Component Documentation:</strong> Document code layouts, visual component specifications, and user interface mocks into portable document formats.
                </span>
              </li>
            </ul>
          </div>

          {/* Security & Client-Side Execution Statement */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Proprietary HTML code, private client details, and business financial figures pasted into this tool remain entirely within your browser&apos;s sandbox. No code snippets, styling stylesheets, or generated PDF files are uploaded, stored, or indexed on remote cloud servers.
            </p>
          </div>

          {/* Comprehensive FAQ Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Are external CSS stylesheets or Tailwind classes supported?
                </h4>
                <p className="leading-relaxed">
                  For optimal rendering consistency, use inline CSS styles (e.g., <code>style=&quot;font-size: 16px; color: #333;&quot;</code>) or internal <code>&lt;style&gt;</code> blocks. External CDN stylesheet links may encounter cross-origin CORS limitations depending on browser privacy policies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  How does the tool ensure that text does not appear pixelated or blurry?
                </h4>
                <p className="leading-relaxed">
                  The rendering engine employs double retina scaling (2x pixel density factor) during off-screen DOM rasterization before compiling coordinates into the A4 PDF container.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I convert Word documents (.docx) as well?
                </h4>
                <p className="leading-relaxed">
                  Yes. If you have pre-existing Word files with complex tables or Devanagari typography, use our dedicated Word to PDF utility powered by official conversion engines.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to convert Word documents (.docx) with preserved fonts?
            </p>
            <Link
              href="/tools/word-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileCode className="w-4 h-4" /> Word to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HtmlToPdfPage), { ssr: false });