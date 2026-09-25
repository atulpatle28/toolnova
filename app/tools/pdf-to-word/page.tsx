"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Document, Paragraph, Packer, TextRun } from "docx";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  FileText, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck
} from "lucide-react";

function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [docBlob, setDocBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDocBlob(null);
      e.target.value = "";
    }
  };

  const convertPdfToWord = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const paragraphs: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group extracted tokens by vertical baseline coordinate to preserve natural paragraphs
        const lineMap: { [key: number]: string[] } = {};
        textContent.items.forEach((item: any) => {
          const y = Math.round(item.transform[5]);
          if (!lineMap[y]) lineMap[y] = [];
          lineMap[y].push(item.str);
        });

        const sortedYs = Object.keys(lineMap)
          .map(Number)
          .sort((a, b) => b - a);

        sortedYs.forEach((y) => {
          const lineText = lineMap[y].join(" ").trim();
          if (lineText) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: lineText,
                    font: "Calibri",
                    size: 22, // 11pt
                  }),
                ],
                spacing: { after: 120 },
              })
            );
          }
        });

        // Add page break indicator between document pages except the last one
        if (i < pdf.numPages) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `--- Page Break (End of Page ${i}) ---`,
                  color: "888888",
                  size: 16,
                  italics: true,
                }),
              ],
              spacing: { before: 200, after: 200 },
            })
          );
        }
      }

      const doc = new Document({
        creator: "ToolKraft PDF to Word Engine",
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "Converted client-side using ToolKraft document tools",
        sections: [{ children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      setDocBlob(blob);
    } catch (err) {
      console.error("PDF to Word conversion error:", err);
      alert("Failed to convert PDF to Word document. Ensure the PDF contains readable text layers.");
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
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft PDF to Word Engine
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">PDF to WORD Converter (.docx)</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Extract text layers, maintain natural paragraph breaks, and convert read-only PDFs into editable Microsoft Word (.docx) documents in your browser.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 group"
            >
              <div className="w-16 h-16 bg-red-950/60 text-red-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Extract text into native Microsoft Word (.docx) format</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <FileText className="w-6 h-6 text-red-400 shrink-0" />
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

              {!docBlob ? (
                <button
                  type="button"
                  onClick={convertPdfToWord}
                  disabled={isConverting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isConverting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Word Structure...
                    </span>
                  ) : (
                    "Convert to Word (.docx)"
                  )}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Word Document Ready!
                  </p>
                  <a
                    href={URL.createObjectURL(docBlob)}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}.docx`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download DOCX Document
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
              Client-Side PDF to Word (.docx) Extraction Engine
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              When working with agreements, university research papers, curriculum vitae (CVs), or government notifications distributed in locked PDF formats, copying text manually often results in disrupted line wrapping, lost paragraphs, and unwanted hyphenation breaks. The **ToolKraft PDF to Word Converter** parses text coordinates and synthesizes authentic OpenXML Microsoft Word (.docx) documents directly inside your browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Utilizing `pdfjs-dist` text stream extraction along with the `docx` binary document compiler, individual font runs are reconstructed into structured paragraphs with natural paragraph margins and page breaks. The converted file opens natively in Microsoft Word, Google Docs, LibreOffice Writer, and Apple Pages.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              How to Convert PDF into Word in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any digital PDF document from your laptop, mobile phone, or desktop storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Reconstruct Text</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine calculates vertical baselines, sorts reading order, and arranges text into cohesive Word paragraphs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download .DOCX</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the editable Word file, ready for spell checking, typography restyling, or collaborative team review.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Use Cases Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">User Sector</th>
                    <th className="p-3 font-semibold">Input PDF Document</th>
                    <th className="p-3 font-semibold">Primary Benefit in Microsoft Word (.docx)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Job Seekers &amp; Recruiters</td>
                    <td className="p-3">Resumes, Curriculum Vitae (CVs)</td>
                    <td className="p-3 text-emerald-400">Allows instant updates to career history, contact info, and skills</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Legal &amp; Real Estate</td>
                    <td className="p-3">Contracts, lease agreements, affidavits</td>
                    <td className="p-3 text-emerald-400">Enables redlining, tracked changes, and legal clause modifications</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Academic Scholars</td>
                    <td className="p-3">Research reports, reference journals, dissertations</td>
                    <td className="p-3 text-emerald-400">Facilitates excerpt citations without retyping complex paragraphs</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Business Administration</td>
                    <td className="p-3">Corporate proposals, meeting minutes, policy briefs</td>
                    <td className="p-3 text-emerald-400">Permits custom company branding, header updates, and reformatting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% In-Browser Privacy: No Remote Server File Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Employment agreements, personal resumes, and proprietary manuscripts contain confidential details. While third-party web utilities send your uploaded PDFs to remote cloud storage where documents risk unintended logging, ToolKraft synthesizes all DOCX containers directly inside your browser&apos;s sandboxed memory. Your files never leave your device.
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
                  Can this tool convert scanned paper copies into editable Word text?
                </h4>
                <p className="leading-relaxed">
                  This converter extracts digital text layers present in PDFs created from Word, Google Docs, or desktop export tools. Pure scanned PDFs (raster photos of paper) require optical character recognition (OCR) before character glyphs can be extracted into editable Word paragraphs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Is the downloaded document compatible with Google Docs and LibreOffice?
                </h4>
                <p className="leading-relaxed">
                  Yes. The generated `.docx` file follows the standardized Office Open XML specifications, ensuring compatibility across Microsoft Word, Google Docs, LibreOffice Writer, and WPS Office.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I convert the edited Word document back into a PDF?
                </h4>
                <p className="leading-relaxed">
                  Yes. Once you have finished editing your document, you can convert it back into a standard PDF using our dedicated Word to PDF converter tool.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to convert Word documents back to PDF after editing?
            </p>
            <Link
              href="/tools/word-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Word to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToWordPage), { ssr: false });