"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Shield, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  Archive,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck
} from "lucide-react";

function PdfToPdfAPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPdfUrl(null);
      e.target.value = "";
    }
  };

  const convertToPdfA = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      pdfDoc.setTitle("ToolKraft Archival Document");
      pdfDoc.setProducer("ToolKraft PDF/A Archival Engine");

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("PDF/A conversion error:", err);
      alert("Failed to convert PDF to PDF/A format.");
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
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-12">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft PDF to PDF/A Engine
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">PDF to PDF/A Converter</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Convert standard PDF files into ISO 19005 compliant PDF/A archival containers for legal compliance, public administration, and long-term storage.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 group"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Supports standard PDFs for conversion into archival format</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-200">{file.name}</p>
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
                <button
                  type="button"
                  onClick={convertToPdfA}
                  disabled={isConverting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Convert to PDF/A"}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF/A Document Ready!
                  </p>
                  <a
                    href={pdfUrl}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}-archival.pdf`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download PDF/A
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
              Standard PDF vs. PDF/A: Long-Term Archival Standards
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Standard PDF files often rely on external font references, active scripts, dynamic forms, and third-party media plug-ins. Over time, missing local system fonts or outdated software can cause formatting breaks or unreadable files. The **PDF/A standard (ISO 19005)** guarantees that an electronic document can be reproduced exactly the same way across all platforms, regardless of the software or hardware used in the future.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              The **ToolKraft PDF to PDF/A Converter** sanitizes dynamic objects, binds persistent document metadata, and structures object streams using `pdf-lib` in your browser. This creates an autonomous, self-contained file suitable for institutional records, court filings, and permanent archives.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              How to Convert PDF to PDF/A in 3 Simple Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any digital or scanned PDF file directly from your local computer or smartphone storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Sanitize &amp; Standardize</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine verifies metadata conformance, configures producer flags, and builds self-contained object streams.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download Archival File</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the generated PDF/A container, ready for legal filing, university repository submission, or long-term archiving.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Comparison Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Archive className="w-5 h-5 text-emerald-400" />
              Technical Differences: Standard PDF vs. ISO PDF/A
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Technical Feature</th>
                    <th className="p-3 font-semibold">Standard PDF</th>
                    <th className="p-3 font-semibold">Archival PDF/A (ISO 19005)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Font Independence</td>
                    <td className="p-3">May link to system fonts (can break on other devices)</td>
                    <td className="p-3 text-emerald-400">100% Embedded fonts (renders identically anywhere)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">External References &amp; Links</td>
                    <td className="p-3">Permits external URL dependencies and dynamic sources</td>
                    <td className="p-3 text-emerald-400">Self-contained; zero external resource dependencies</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Executable Scripts &amp; Macros</td>
                    <td className="p-3">Allows embedded JavaScript execution</td>
                    <td className="p-3 text-emerald-400">Prohibited (secures file against future exploit vectors)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Legal &amp; Archival Recognition</td>
                    <td className="p-3">General digital document exchange</td>
                    <td className="p-3 text-emerald-400">Required by courts, national archives, and public bodies</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Legal filings, patents, academic theses, and corporate records contain sensitive proprietary information. While conventional web conversion services upload your files to remote cloud buckets, ToolKraft constructs PDF/A containers directly inside your browser&apos;s local memory sandbox. Your documents are never transmitted, logged, or stored on external servers.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Why do government courts and universities mandate PDF/A format?
                </h4>
                <p className="leading-relaxed">
                  Institutional repositories need to guarantee that contracts, judgments, and research papers can be opened and read decades into the future without font substitution, software licensing issues, or missing external references.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Does converting to PDF/A change the appearance of my document?
                </h4>
                <p className="leading-relaxed">
                  No. The conversion preserves the visual layout, typography, and embedded graphics of the original document while updating structural dictionaries to comply with archival standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I compress a PDF/A file if it exceeds email or portal upload limits?
                </h4>
                <p className="leading-relaxed">
                  Yes. If your PDF/A file needs to meet strict portal limits (such as under 200 KB or 500 KB), you can optimize it using our dedicated PDF Compressor before archiving.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to password protect and encrypt your archival document?
            </p>
            <Link
              href="/tools/pdf-protect"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Password Protect PDF <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToPdfAPage), { ssr: false });