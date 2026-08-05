"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSpreadsheet, Printer, ShieldCheck } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [tableHtml, setTableHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setTableHtml(null);
      setErrorMsg(null);

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // Convert sheet to exact styled HTML
          const html = XLSX.utils.sheet_to_html(ws, { id: "excel-table" });
          setTableHtml(html);
        } catch (err) {
          setErrorMsg("Could not parse Excel file. Please try another .xlsx or .xls file.");
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handlePrintPdf = () => {
    if (!tableHtml) return;

    // Open print window with clean A4 landscape CSS styles
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${file?.name || "Excel Document"}</title>
          <style>
            @page { size: A4 landscape; margin: 15mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; color: #000; }
            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
            td, th { border: 1px solid #777; padding: 6px 8px; text-align: left; font-size: 11px; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>${file?.name}</h2>
          ${tableHtml}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-2xl text-white">
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
            <ShieldCheck className="w-4 h-4" /> Instant & Free Browser Engine
          </div>
          <h1 className="text-3xl font-black text-white">EXCEL to PDF Converter</h1>
          <p className="text-slate-400 text-sm mt-2">
            Convert Excel spreadsheets (.xlsx, .xls) into exact formatted PDF documents.
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
              <span className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls</span>
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

              <button
                onClick={handlePrintPdf}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Printer className="w-5 h-5" /> Download / Print PDF
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}