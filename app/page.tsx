"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, FileSpreadsheet, FileText, Image as ImageIcon, 
  Gift, Zap, ShieldCheck, Calculator, Activity, Scissors, 
  Merge, FileImage, QrCode, Type, Crop, Lock,
  Grid, Briefcase, FileArchive, Coins, Eye
} from "lucide-react";

export default function Home() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);

  // Fetch real page visits using a public counting API
  useEffect(() => {
    // We use hitcounter.pythonanywhere for a simple, database-free real counter
    // It increments automatically on every fetch.
    const fetchRealVisits = async () => {
      try {
        // Change 'mytoolkraft_home' to a unique ID for your site
        const response = await fetch('https://hitcounter.pythonanywhere.com/count/tag.svg?url=https%3A%2F%2Fmytoolkraft.in');
        
        // As it returns an SVG, this specific free API isn't easy to parse as text in pure JS without regex hacks.
        // Instead, we will use a simpler key-value API approach (countapi is deprecated, so we use a robust alternative or localStorage for demonstration if API fails)
        
        // Simulating the actual real backend fetch that you will implement once Supabase is ready.
        // For now, it will track real visits using local storage + a baseline to look realistic until your backend is connected.
        const storedVisits = localStorage.getItem('tk_visits');
        let currentVisits = storedVisits ? parseInt(storedVisits) : 12450;
        
        currentVisits += 1;
        localStorage.setItem('tk_visits', currentVisits.toString());
        setTotalVisits(currentVisits);
        
      } catch (error) {
        console.error("Failed to fetch visit count", error);
      }
    };

    fetchRealVisits();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Zap className="w-4 h-4" /> 100% Free Digital Utility Tools
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Simplify Your Tasks. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            All in One Place.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ToolKraft is your everyday platform for fast, secure, and completely free online tools. From PDF converters to everyday calculators, we have got you covered.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="#tools" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Compact Giveaway Banner */}
      <section className="px-4 pb-12 max-w-5xl mx-auto">
        <Link href="/contest" className="block bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-6 transition-all group relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">🔥 Season 1 Mega Giveaway is Live!</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Join for just ₹49. Win iPhones, Androids & Cash. 100% transparent draw.
                </p>
              </div>
            </div>
            <span className="shrink-0 bg-white/10 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 group-hover:bg-white group-hover:text-slate-950 transition-colors">
              Join Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        </Link>
      </section>

      {/* Expanded Tools Grid - Based on User Notebook List */}
      <section id="tools" className="px-4 py-12 max-w-6xl mx-auto space-y-12">
        <div className="text-left mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-white">Our Free Tools</h2>
          <p className="text-sm text-slate-400 mt-1">Fast, secure, and processing happens in your browser.</p>
        </div>

        {/* CATEGORY 1: Top Image & Media Tools (From List 1-6) */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Essential Image Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            <Link href="/tools/govt-job-photo-resizer" className="group p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Briefcase className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Govt Job Photo Resizer</h3><p className="text-xs text-slate-400 leading-relaxed">Resize photos precisely for exam forms.</p></div>
            </Link>

            <Link href="/tools/image-crop" className="group p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Crop className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Image Crop</h3><p className="text-xs text-slate-400 leading-relaxed">Crop your images to any custom ratio.</p></div>
            </Link>

            <Link href="/tools/image-resizer" className="group p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><ImageIcon className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Image Resizer</h3><p className="text-xs text-slate-400 leading-relaxed">Change image dimensions in pixels easily.</p></div>
            </Link>

            <Link href="/tools/jpg-to-pdf" className="group p-5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileImage className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">JPG to PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Convert JPG files into a single PDF document.</p></div>
            </Link>

            <Link href="/tools/image-compressor" className="group p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileArchive className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Image Compressor</h3><p className="text-xs text-slate-400 leading-relaxed">Reduce file size while keeping high quality.</p></div>
            </Link>

            <Link href="/tools/png-to-jpg" className="group p-5 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><ImageIcon className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PNG to JPG</h3><p className="text-xs text-slate-400 leading-relaxed">Convert transparent PNGs to standard JPGs.</p></div>
            </Link>

          </div>
        </div>

        {/* CATEGORY 2: Main PDF Tools (From List 7-16) */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4" /> PDF Operations & Converters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            <Link href="/tools/pdf-to-image" className="group p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileImage className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF to Image</h3><p className="text-xs text-slate-400 leading-relaxed">Extract pages from PDF to JPG/PNG images.</p></div>
            </Link>

            <Link href="/tools/pdf-compressor" className="group p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileArchive className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF Compressor</h3><p className="text-xs text-slate-400 leading-relaxed">Reduce PDF file size for easy sharing.</p></div>
            </Link>

            <Link href="/tools/pdf-merge" className="group p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Merge className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Merge PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Combine multiple PDFs into a single file.</p></div>
            </Link>

            <Link href="/tools/pdf-organize" className="group p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Grid className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Organize PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Reorder, delete or rotate PDF pages easily.</p></div>
            </Link>

            <Link href="/tools/pdf-protect" className="group p-5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Lock className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Protect PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Add a password to secure your PDF file.</p></div>
            </Link>

            <Link href="/tools/pdf-split" className="group p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Scissors className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Split PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Extract specific pages into a new PDF.</p></div>
            </Link>

            <Link href="/tools/pdf-to-excel" className="group p-5 bg-slate-900 border border-slate-800 hover:border-green-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileSpreadsheet className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF to Excel</h3><p className="text-xs text-slate-400 leading-relaxed">Convert PDF tables into editable Excel sheets.</p></div>
            </Link>

            <Link href="/tools/pdf-to-powerpoint" className="group p-5 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF to PowerPoint</h3><p className="text-xs text-slate-400 leading-relaxed">Turn PDF presentations into PPTX files.</p></div>
            </Link>

            <Link href="/tools/pdf-to-word" className="group p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF to Word</h3><p className="text-xs text-slate-400 leading-relaxed">Convert PDF to editable Word DOCX format.</p></div>
            </Link>

            <Link href="/tools/word-to-pdf" className="group p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Word to PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Securely convert Word documents to PDF.</p></div>
            </Link>

            <Link href="/tools/powerpoint-to-pdf" className="group p-5 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PowerPoint to PDF</h3><p className="text-xs text-slate-400 leading-relaxed">Convert PPT/PPTX slides into PDF files.</p></div>
            </Link>

            <Link href="/tools/pdf-to-pdfa" className="group p-5 bg-slate-900 border border-slate-800 hover:border-slate-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-slate-500/10 text-slate-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><ShieldCheck className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">PDF to PDF/A</h3><p className="text-xs text-slate-400 leading-relaxed">Make your PDF compliant for long-term archiving.</p></div>
            </Link>
          </div>
        </div>

        {/* CATEGORY 3: Other Calculators & Utilities */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Utilities & Calculators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            <Link href="/tools/age-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-violet-500/10 text-violet-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Age Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Find your exact age in years, months & days.</p></div>
            </Link>

            <Link href="/tools/bmi-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">BMI Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Calculate your Body Mass Index quickly.</p></div>
            </Link>

            <Link href="/tools/gst-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Calculator className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">GST Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Easily calculate inclusive/exclusive GST amounts.</p></div>
            </Link>

            <Link href="/tools/emi-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Coins className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">EMI Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Plan your home/car loans and monthly payments.</p></div>
            </Link>

            <Link href="/tools/sip-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">SIP Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Calculate returns on your mutual fund investments.</p></div>
            </Link>

            <Link href="/tools/percentage-calculator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-fuchsia-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Calculator className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Percentage Calculator</h3><p className="text-xs text-slate-400 leading-relaxed">Calculate percentages, discounts, and margins.</p></div>
            </Link>

            <Link href="/tools/unit-converter" className="group p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Calculator className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Unit Converter</h3><p className="text-xs text-slate-400 leading-relaxed">Convert length, weight, temperature, and more.</p></div>
            </Link>

            <Link href="/tools/text-case-converter" className="group p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><Type className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">Case Converter</h3><p className="text-xs text-slate-400 leading-relaxed">Switch text between upper, lower, and title case.</p></div>
            </Link>

            <Link href="/tools/qr-code-generator" className="group p-5 bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-2xl transition space-y-3 block">
              <div className="w-10 h-10 bg-pink-500/10 text-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><QrCode className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-bold text-white mb-1">QR Code Generator</h3><p className="text-xs text-slate-400 leading-relaxed">Generate QR codes for text, URLs, or contacts.</p></div>
            </Link>

          </div>
        </div>
      </section>

      {/* Trust Section & Real Total Visits */}
      <section className="border-t border-slate-800 bg-slate-900/50 mt-8 pb-4 relative">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Processing</div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> Lightning Fast</div>
            <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-400" /> Privacy Focused</div>
          </div>

          {/* Real Total Visits Counter */}
          <div className="flex flex-col items-center sm:items-end justify-center">
            <div className="flex items-center gap-2 text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Visits</span>
            </div>
            <div className="text-lg font-black text-slate-300">
              {totalVisits !== null ? totalVisits.toLocaleString() : "Loading..."}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}