"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft, Download, ShieldCheck, Code, RefreshCw, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft HTML to PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">HTML to PDF Converter</h1>
          <p className="text-xs text-slate-400">Paste raw HTML code or markup to generate a rendered PDF file.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
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
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Generate PDF"}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
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
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-12">Click "Generate PDF" to create download link.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HtmlToPdfPage), { ssr: false });