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
      const element = previewRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

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

          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 text-sm font-medium rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> {error}
              </div>
            )}

            {!file ? (
              <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/50 group">
                <UploadCloud className="w-12 h-12 text-slate-500 mb-4 group-hover:text-blue-400 transition-colors group-hover:scale-110 duration-300" />
                <span className="text-base font-bold text-white mb-2">
                  Drag & drop Word file (.docx) here
                </span>
                <span className="text-xs text-slate-400">
                  Maximum file size: 10MB. Processed securely on your device.
                </span>
                <div className="mt-6 bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold group-hover:bg-blue-600 transition-colors">
                  Browse Files
                </div>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-700 bg-slate-800/50">
                  <div className="flex items-center gap-3 truncate">
                    <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                    <span className="text-sm font-bold text-white truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={reset} className="hover:bg-slate-700 text-slate-300">
                    Change File
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {!pdfUrl ? (
                    <Button
                      onClick={convertToPdf}
                      disabled={converting}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-xl shadow-lg shadow-blue-600/20"
                    >
                      {converting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        "Convert to PDF Now"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleDownload} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-6 rounded-xl shadow-lg shadow-emerald-600/20">
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF Document
                    </Button>
                  )}

                  <Button variant="outline" onClick={reset} className="py-6 px-6 rounded-xl border-slate-700 hover:bg-slate-800 shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {htmlContent && (
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
              Document Preview (A4 Format)
            </p>
            <div className="p-8 sm:p-12 rounded-2xl bg-white text-slate-950 overflow-x-auto shadow-xl">
              <div
                ref={previewRef}
                className="prose max-w-none text-slate-900 leading-relaxed text-sm bg-white"
                style={{ minHeight: '297mm', padding: '10mm' }}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        )}

        <section className="border-t border-slate-800 pt-12 pb-8 mt-12 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Free Online Word to PDF Converter</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Convert your Microsoft Word documents (.docx) into professional, high-quality PDF files instantly. Our tool is designed for speed, security, and perfect formatting retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white">100% Private & Secure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your files never leave your device. The entire conversion process happens directly inside your web browser, ensuring maximum privacy for your sensitive data.
              </p>
            </div>
            
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white">Lightning Fast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No need to wait in queues or upload heavy files to a server. Convert your DOCX files to PDF in mere seconds with our optimized client-side processing.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-bold text-white">No Watermarks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We believe in providing true value. Download your converted PDF files immediately without any annoying watermarks, hidden fees, or email registrations.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 pt-6">
            <h3 className="text-xl font-bold text-white">How to convert Word to PDF online?</h3>
            <ol className="space-y-4 text-sm text-slate-300 list-decimal list-inside bg-slate-900/30 p-6 sm:p-8 rounded-3xl border border-slate-800">
              <li className="leading-relaxed pl-2"><strong>Upload your file:</strong> Click the upload area or simply drag and drop your Microsoft Word (.docx) document into the box above.</li>
              <li className="leading-relaxed pl-2"><strong>Preview the document:</strong> Once selected, you can instantly preview the contents of your file to ensure it&apos;s the right document.</li>
              <li className="leading-relaxed pl-2"><strong>Click Convert:</strong> Hit the &quot;Convert to PDF Now&quot; button. Our browser-based engine will instantly render your document into PDF format.</li>
              <li className="leading-relaxed pl-2"><strong>Download your PDF:</strong> Click the download button to save the newly created PDF directly to your computer or mobile device.</li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  );
}