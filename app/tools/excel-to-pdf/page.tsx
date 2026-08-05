"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Download, RefreshCw, ShieldCheck } from "lucide-react";
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
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
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
      // Read Excel spreadsheet (supports both .xls and .xlsx)
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No worksheets found in this Excel file.");
      }

      // Read first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON rows
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        throw new Error("The selected Excel sheet appears to be empty.");
      }

      // Initialize PDF document (Landscape mode for wider tables)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Header title in PDF
      doc.setFontSize(14);
      doc.text(`Converted Sheet: ${firstSheetName}`, 40, 30);

      // Extract headers and data rows safely
      const head = jsonData[0] ? [jsonData[0].map((cell) => String(cell ?? ""))] : [];
      const body = jsonData.slice(1).map((row) => row.map((cell) => String(cell ?? "")));

      // Render Table into PDF
      autoTable(doc, {
        head: head,
        body: body,
        startY: 45,
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, // Emerald Green
        alternateRowStyles: { fillColor: [245, 247, 250] },
        theme: "grid",
      });

      // Generate Blob URL for preview and download
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error("Excel Conversion Error:", err);
      setErrorMsg(
        err.message || "Failed to process Excel file. Please ensure it is a valid .xlsx or .xls file."
      );
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <head>
        <title>Excel to PDF Converter Online - Fast, Free & Private | ToolKraft</title>
        <meta
          name="description"
          content="Convert Excel spreadsheets (.xlsx, .xls) to PDF documents instantly in your browser without uploading files to any server. 100% free and private."
        />
      </head>

      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
        {/* Header */}
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

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" /> 100% Client-Side Privacy
            </div>
            <h1 className="text-3xl font-black text-white">EXCEL to PDF Converter</h1>
            <p className="text-slate-400 text-sm mt-2">
              Convert Excel spreadsheets (.xlsx, .xls) into formatted PDF documents easily.
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
                <span className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls (Up to 50MB)</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
        </main>
      </div>
    </>
  );
}