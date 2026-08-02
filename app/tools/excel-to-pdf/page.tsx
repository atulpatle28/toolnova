"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft, Download, ShieldCheck, Upload, Table, RefreshCw, CheckCircle2 } from "lucide-react";

function ExcelToPdfPage() {
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

  const convertExcelToPdf = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const doc = new jsPDF();

      workbook.SheetNames.forEach((sheetName, index) => {
        if (index > 0) doc.addPage();
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          const head = jsonData[0];
          const body = jsonData.slice(1);

          doc.text(`Sheet: ${sheetName}`, 14, 10);
          autoTable(doc, {
            head: [head],
            body: body,
            startY: 15,
            styles: { fontSize: 8 },
            theme: "grid",
          });
        }
      });

      const pdfBlob = doc.output("blob");
      setPdfUrl(URL.createObjectURL(pdfBlob));
    } catch (err) {
      console.error("Excel conversion error:", err);
      alert("Failed to convert Excel file. Make sure it's a valid .xlsx or .xls file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> ToolKraft Excel to PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">EXCEL to PDF Converter</h1>
          <p className="text-xs text-slate-400">Convert Excel spreadsheets (.xlsx, .xls) into PDF documents easily.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <Table className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select Excel File</p>
                <p className="text-xs text-slate-500 mt-1">Supports .xlsx and .xls files</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Table className="w-6 h-6 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-200">{file.name}</p>
                    <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-400 hover:text-white font-bold bg-slate-800 px-3 py-1.5 rounded-lg"
                >
                  Change
                </button>
              </div>

              {!pdfUrl ? (
                <button
                  onClick={convertExcelToPdf}
                  disabled={isConverting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  {isConverting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Convert to PDF"}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Generated Successfully!
                  </p>
                  <a
                    href={pdfUrl}
                    download="toolkraft-excel-document.pdf"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ExcelToPdfPage), { ssr: false });