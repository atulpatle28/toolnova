"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  Table,
  Sparkles,
  ArrowRight,
  FileCheck
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPdfUrl(null);
      setErrorMsg(null);
    }
  };

  const convertExcelToPdf = async () => {
    if (!file) return;

    setIsConverting(true);
    setErrorMsg(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Read binary excel file (.xls / .xlsx)
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No sheets found in this Excel file.");
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet data to 2D array matrix
      const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        raw: false, // Formatting intact
      });

      if (rawData.length === 0) {
        throw new Error("The selected Excel spreadsheet is empty.");
      }

      // Initialize PDF (Landscape A4)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Header text
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Document: ${file.name}`, 40, 30);

      // Separate header and rows safely
      const tableHead = rawData[0] ? [rawData[0].map((cell) => String(cell ?? ""))] : [];
      const tableBody = rawData.slice(1).map((row) => row.map((cell) => String(cell ?? "")));

      // Render vector autoTable
      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY: 45,
        margin: { top: 40, right: 30, bottom: 40, left: 30 },
        styles: {
          fontSize: 8,
          cellPadding: 4,
          textColor: [30, 41, 59],
          overflow: "linebreak",
          lineWidth: 0.5,
          lineColor: [226, 232, 240],
        },
        headStyles: {
          fillColor: [16, 185, 129], // Emerald
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        theme: "grid",
      });

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error("Excel Conversion Error:", err);
      setErrorMsg("Failed to convert Excel file. Please ensure it is a valid .xlsx or .xls file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl tracking-wide text-white">
            Tool<span className="text-emerald-400">Kraft</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-emerald-400 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back to Tools
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" /> Client-Side Vector Engine
          </div>
          <h1 className="text-3xl font-black text-white">EXCEL to PDF Converter</h1>
          <p className="text-slate-400 text-sm mt-2">
            Convert Excel spreadsheets (.xlsx, .xls) into crisp, printable PDF documents.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {!file ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/50 rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center block">
              <FileSpreadsheet className="w-12 h-12 text-emerald-400 mb-3" />
              <span className="text-base font-bold text-white">Select Excel File</span>
              <span className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls formats</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-200">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <label className="text-xs text-emerald-400 hover:underline cursor-pointer">
                  Change
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {!pdfUrl ? (
                <button
                  onClick={convertExcelToPdf}
                  disabled={isConverting}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {isConverting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    "Convert to PDF Now"
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold">
                    Conversion Completed Successfully!
                  </div>
                  <a
                    href={pdfUrl}
                    download={`${file.name.replace(/\.[^/.]+$/, "")}.pdf`}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO & AdSense Compliant In-Depth Guide Section */}
        <section className="space-y-12 text-slate-300 border-t border-slate-800/80 pt-10">
          
          {/* Overview Section */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Fast, Private Excel to PDF Table Conversion
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Spreadsheet documents created in Microsoft Excel or Google Sheets are ideal for computational modeling, accounting sheets, and roster records. However, when sharing financial statements, quotation summaries, or student grade sheets, sending unformatted spreadsheet files can result in distorted table views, missing cell borders, or unauthorized formula alterations. The **ToolKraft Excel to PDF Converter** transforms your tabular records into standard landscape A4 PDF documents while maintaining neat grid layouts.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Using direct client-side parsing libraries (`xlsx` and `jspdf-autotable`), this tool parses structured cell matrices and generates vector-based table borders and text layers on the fly. Cell values, dates, headers, and numeric entries are converted into printable documents without requiring server uploads.
            </p>
          </div>

          {/* How It Works Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-400" />
              How to Convert an Excel Sheet to PDF
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Workbook</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any `.xlsx` or legacy `.xls` document directly from your desktop or phone storage.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Vector Generation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The client engine reads workbook matrix rows, extracts primary headers, and arranges cells into a structured landscape table.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download Instantly</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Download the generated PDF document, formatted for standard printing and digital record archiving.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits & Professional Use Cases */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Key Applications for Spreadsheet to PDF Transformation
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Financial Invoicing & Salary Registers:</strong> Convert monthly payroll rosters, GST breakdown spreadsheets, and expense logs into non-editable PDF records for stakeholders.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Academic Marks Sheets & Candidate Lists:</strong> Educational institutes and training centers can generate clean student attendance registers or score cards ready for notice boards.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Inventory & Supply Chain Manifests:</strong> Prevent inadvertent column shifting or formula recalculations when emailing product stock sheets to external vendors.
                </span>
              </li>
            </ul>
          </div>

          {/* Data Security Callout */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Zero Cloud Uploads: Complete Client-Side Security
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Confidential business sheets, accounting figures, and customer registries should never be uploaded to public conversion services. ToolKraft parses the spreadsheet binary stream entirely inside your web browser’s memory. No workbook entries, phone numbers, or corporate formulas are sent to any remote server.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions (FAQs)
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm">
                  Why does the converter use Landscape mode by default?
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Excel files typically contain wide horizontal columns. Landscape A4 orientation provides broader horizontal layout space, helping prevent cramped cells or clipped text.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm">
                  Which sheet from the workbook is converted?
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  The tool automatically identifies and converts the first active worksheet in your workbook. Ensure your primary table or report is positioned as Sheet 1 before uploading.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm">
                  Are formulas preserved during the conversion?
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Yes, the conversion engine reads evaluated calculation results and displays the rendered values directly into the PDF table cells.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Utility Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to convert Word documents (.docx) as well?
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