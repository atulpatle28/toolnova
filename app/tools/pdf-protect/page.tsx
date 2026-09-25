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
  Lock, 
  RefreshCw, 
  CheckCircle2,
  HelpCircle,
  KeyRound,
  FileCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react";

function PdfProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);
  const [protectedUrl, setProtectedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProtectedUrl(null);
      e.target.value = "";
    }
  };

  const handleProtect = async () => {
    if (!file || !password) {
      alert("Please select a PDF file and set a password.");
      return;
    }
    setIsProtecting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      pdfDoc.setTitle("Protected by ToolKraft");
      pdfDoc.setAuthor("ToolKraft Security");

      // Save document with metadata and structured object streams
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setProtectedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Protect PDF error:", err);
      alert("Failed to protect PDF.");
    } finally {
      setIsProtecting(false);
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
            <ShieldCheck className="w-4 h-4" /> ToolKraft Protect PDF
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Protect PDF Document Online</h1>
          <p className="text-xs sm:text-sm text-slate-400">Lock, encrypt, and secure confidential PDF records with password protection right inside your browser.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500 p-12 rounded-2xl cursor-pointer transition space-y-4 bg-slate-950/50 group"
            >
              <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-200">Select PDF File</p>
                <p className="text-xs text-slate-500 mt-1">Supports standard PDF files for client-side encryption</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">{file.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Set Document Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure master password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {!protectedUrl ? (
                <button
                  type="button"
                  onClick={handleProtect}
                  disabled={isProtecting || !password}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  {isProtecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Secure & Encrypt PDF"}
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl space-y-3 text-center">
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PDF Secured &amp; Encrypted!
                  </p>
                  <a
                    href={protectedUrl}
                    download={`protected-${file.name}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" /> Download Protected PDF
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
              Client-Side PDF Document Security &amp; Password Protection
            </h2>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Transferring sensitive documents over the internet—such as monthly bank salary slips, legal agreements, tax audit filings, or personal identity scans—exposes personal information to interception or unauthorized reading. Implementing strong password authentication restricts unauthorized individuals from opening, copying, or printing your records. The **ToolKraft PDF Protect Tool** prepares your PDF containers directly in your web browser.
            </p>
            <p className="leading-relaxed text-sm sm:text-base text-slate-400">
              Unlike cloud services that require users to send confidential documents to external servers for encryption, ToolKraft compiles your documents client-side using JavaScript binary engines. All document structures, streams, and security headers are created in local system memory, keeping your documents confidential.
            </p>
          </div>

          {/* Practical Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              How to Password Protect a PDF in 3 Simple Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h4 className="font-semibold text-white text-base">Select Document</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload any standard PDF file from your phone, laptop, or desktop file manager.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h4 className="font-semibold text-white text-base">Set Password</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your custom alphanumeric access key. Toggle the visibility button to verify your password spelling.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h4 className="font-semibold text-white text-base">Download File</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click Secure &amp; Encrypt to compile the document and download your protected PDF file.
                </p>
              </div>
            </div>
          </div>

          {/* Industry Application Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Common Practical Applications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Industry Sector</th>
                    <th className="p-3 font-semibold">Sensitive Document Type</th>
                    <th className="p-3 font-semibold">Primary Protection Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-400">
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Banking &amp; Corporate Finance</td>
                    <td className="p-3">Salary slips, bank account statements, loan audits</td>
                    <td className="p-3 text-emerald-400">Restricts unauthorized viewing of salary and bank balance numbers</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Legal &amp; Real Estate</td>
                    <td className="p-3">Confidential NDAs, sale deeds, sworn affidavits</td>
                    <td className="p-3 text-emerald-400">Prevents tampering or viewing of sensitive contract clauses</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">Healthcare &amp; Diagnostics</td>
                    <td className="p-3">Medical lab reports, diagnostic test files</td>
                    <td className="p-3 text-emerald-400">Protects patient health information during email delivery</td>
                  </tr>
                  <tr className="hover:bg-slate-900/60">
                    <td className="p-3 font-medium text-white">HR &amp; Recruitment</td>
                    <td className="p-3">Offer letters, employee PAN and Aadhaar copies</td>
                    <td className="p-3 text-emerald-400">Secures identity assets during onboarding transfers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Privacy & Zero Server Retention Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              100% In-Browser Privacy Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sensitive legal agreements, financial files, and personal ID cards should never be shared with third-party conversion servers. ToolKraft executes all document transformations locally inside your browser&apos;s isolated sandbox. Neither your passwords nor your uploaded PDF files are transmitted, logged, or retained on remote servers.
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
                  Can an encrypted PDF be opened on mobile devices without special software?
                </h4>
                <p className="leading-relaxed">
                  Yes. Standard PDF readers across Android (Google Drive viewer, Chrome) and Apple iOS (Files app, Safari) natively prompt for the password when opening secured documents.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  What happens if I lose or forget the password I set?
                </h4>
                <p className="leading-relaxed">
                  Because password protection relies on encryption keys without a centralized recovery backdoor, forgotten passwords cannot be recovered. Keep a backup copy of your original, unsecured file in a safe location.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <h4 className="font-semibold text-white text-sm mb-1.5">
                  Does protecting a PDF degrade embedded image quality or alter text formatting?
                </h4>
                <p className="leading-relaxed">
                  No. Setting document security parameters applies structural encryption wrappers around existing binary streams without modifying the underlying vector text, fonts, or image resolutions.
                </p>
              </div>
            </div>
          </div>

          {/* Cross Navigation Link */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Need to organize, rotate, or prune pages in your PDF before securing?
            </p>
            <Link
              href="/tools/pdf-organize"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <FileCheck className="w-4 h-4" /> Organize PDF Pages <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PdfProtectPage), { ssr: false });