"use client";

import React, { useState, useRef } from "react";
import mammoth from "mammoth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, RotateCcw, ShieldCheck, Loader2, UploadCloud, CheckCircle2, Zap, Lock } from "lucide-react";
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
      console.error(err);
      setError("Failed to read Word document. Please ensure it is a valid .docx file.");
    }
  };

  const convertToPdf = async () => {
    if (!previewRef.current || !file) return;

    setConverting(true);
    setError(null);

    try {
      // 1. Scroll fix: html2canvas sometimes fails if page is scrolled
      const element = previewRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgWidth = 210; // A4 size in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // First Page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if document is long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: any) {
      console.error("PDF Generation Error: ", err);
      setError("Failed to generate PDF due to document complexity. Please try again.");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Tool Header Card */}
        <Card className="border-slate-800 bg-slate-900/60 shadow-2xl max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white font-black">Word to PDF</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    Convert your DOCX files to PDF securely in your browser.
                  </CardDescription>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" /> 100% Private
              </span>
            </div>
          </CardHeader>