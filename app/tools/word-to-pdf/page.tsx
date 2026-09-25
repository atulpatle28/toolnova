"use client";

import React, { useState, useRef } from "react";
import mammoth from "mammoth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, RotateCcw, ShieldCheck, Loader2, UploadCloud } from "lucide-react";
import { triggerFileDownload, sanitizeFilename } from "@/lib/utils";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [converting, setConverting] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(docx)$/i)) {
      setError("Please upload a valid .docx Word document.");
      return;
    }

    setError(null);
    setPdfUrl(null);
    setFile(uploadedFile);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (err: any) {
      setError("Failed to read Word document. Please ensure it is a valid .docx file.");
    }
  };

  const convertToPdf = async () => {
    if (!previewRef.current || !file) return;

    setConverting(true);
    setError(null);

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210; // A4 size in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl || !file) return;
    const cleanName = sanitizeFilename(file.name, "converted-document");
    triggerFileDownload(pdfUrl, `${cleanName}.pdf`);
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setHtmlContent("");
    setPdfUrl(null);
    setError(null);
    setConverting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Tool Header Card */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>Word to PDF Converter</CardTitle>
                  <CardDescription>
                    Convert DOCX documents to vector PDF instantly inside your browser.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Private
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                {error}
              </div>
            )}

            {!file ? (
              <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/40">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-sm font-semibold text-slate-200">
                  Click or drag Word file (.docx) here
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Files are processed in-browser. Zero server upload.
                </span>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="xs" onClick={reset}>
                    Change
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!pdfUrl ? (
                    <Button
                      onClick={convertToPdf}
                      disabled={converting}
                      variant="default"
                      className="flex-1"
                    >
                      {converting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Converting Document...
                        </>
                      ) : (
                        "Convert to PDF"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleDownload} variant="default" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}

                  <Button variant="outline" onClick={reset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden Preview Container for Canvas Rendering */}
        {htmlContent && (
          <div className="p-8 rounded-2xl border border-slate-800 bg-white text-slate-950 overflow-x-auto shadow-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">
              Document Preview
            </p>
            <div
              ref={previewRef}
              className="prose max-w-none text-slate-900 leading-relaxed text-sm"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
}