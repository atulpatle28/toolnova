"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Table, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText
} from "lucide-react";

function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExcelBlob(null);
      e.target.value = "";
    }
  };

  const convertPdfToExcel = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const rows: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
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
          rows.push(lineMap[y]);
        });
      }

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PDF Data");

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      setExcelBlob(blob);
    } catch (err) {
      console.error("PDF to Excel conversion error:", err);
      alert("Failed to convert PDF to Excel spreadsheet.");
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
            <ShieldCheck className="w-4 h-4" /> ToolKraft PDF to Excel Engine
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">PDF to EXCEL Converter Online</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Extract tabular data, ledger rows, and numeric reports from PDF documents into editable Microsoft Excel (.xlsx) workbooks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 group"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Table className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Supports bank statements, price rosters, and billing PDFs</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Table className="w-6 h-6 text-emerald-400" />
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

              {!excelBlob ? (
                <button
                  type="button"
                  onClick={convertPdfToExcel}
                  disabled={isConverting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Convert to Excel (.xlsx)"}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Excel File Ready!
                  </p>
                  <a
                    href={URL.createObjectURL(excelBlob)}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}-data.xlsx`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download Excel (.xlsx)
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
              Fast, Private In-Browser PDF to Excel Extraction Engine
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Accountants, tax auditors, corporate managers, and data analysts frequently encounter financial statements, invoices, and roster sheets locked inside read-only PDF formats. Re-entering tabular numbers manually is tedious and introduces calculation errors. The **ToolKraft PDF to Excel Converter** reconstructs visual line matrices and parses column entries into editable Microsoft Excel spreadsheets without cloud uploads.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Using client-side parsing through `pdfjs-dist` alongside vector array generation in `xlsx`, the utility maps text items according to vertical coordinate positions ($Y$-axis heights) and horizontal flow. Rows and columns are synthesized directly in browser memory, turning static text streams into dynamic `.xlsx` cells compatible with Microsoft Excel, LibreOffice Calc, and Google Sheets.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              How to Convert PDF Tables into Excel in 3 Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select PDF Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any digital PDF report, transaction ledger, or price sheet from your device.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Coordinate Parsing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine reads typography coordinates, maps parallel heights into table rows, and populates cells.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download Workbook</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the generated `.xlsx` workbook, ready for financial formulas, pivot charts, and accounting audits.
                </p>
              </div>
            </div>
          </div>

          {/* Use Case Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Common Data Extraction Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Document Category</th>
                    <th className="p-3 font-semibold">Common Table Content</th>
                    <th className="p-3 font-semibold">Primary Excel Analysis Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Bank Statements</td>
                    <td className="p-3">Dates, descriptions, withdrawals, deposits, balance</td>
                    <td className="p-3 text-emerald-400">Allows instant SUM formulas and monthly expense categorization</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Vendor Invoices &amp; Bills</td>
                    <td className="p-3">Item descriptions, unit quantities, GST slabs, totals</td>
                    <td className="p-3 text-emerald-400">Enables bulk import into Tally, Zoho Books, or ERP software</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Academic Scorecards</td>
                    <td className="p-3">Roll numbers, student names, subject grades, percentiles</td>
                    <td className="p-3 text-emerald-400">Facilitates merit list sorting and class statistical analysis</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Stock &amp; Inventory Lists</td>
                    <td className="p-3">SKU numbers, warehouse bin locations, quantities</td>
                    <td className="p-3 text-emerald-400">Simplifies VLOOKUP checks against live enterprise inventories</td>
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
              Corporate balance sheets, customer purchase orders, and bank statements contain confidential business records. While conventional online converters upload documents to external servers where they risk data scraping, ToolKraft extracts and formats data entirely inside your browser&apos;s sandboxed memory. Your files never touch external storage.
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
                  Are scanned paper documents supported for Excel conversion?
                </h4>
                <p className="leading-relaxed">
                  This tool extracts data from digitally generated PDFs containing text layers (such as exports from banks, accounting software, and billing tools). Flat scanned images without OCR layers require text recognition prior to table coordinate extraction.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  How does the tool reconstruct columns and separate cells?
                </h4>
                <p className="leading-relaxed">
                  The extraction engine groups individual text tokens sharing equivalent vertical $Y$-transform coordinates into distinct horizontal rows, ordering strings horizontally to create natural Excel spreadsheet columns.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Can I convert the final Excel spreadsheet back to PDF later?
                </h4>
                <p className="leading-relaxed">
                  Yes. Once you finish reviewing or updating data in Excel, you can use our dedicated Excel to PDF tool to generate a standardized A4 landscape report.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to convert an edited Excel sheet back into a PDF?
            </p>
            <Link
              href="/tools/excel-to-pdf"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfToExcelPage), { ssr: false });