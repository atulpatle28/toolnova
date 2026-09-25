"use client";

import React from "react";
import Link from "next/link";
import EditorMain from "@/app/components/editor/EditorMain";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Crop,
  Layers,
  FileCheck,
  Sliders,
  ArrowRight,
  Maximize2,
  Printer,
} from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.15),_transparent_35%),linear-gradient(135deg,_#050816_0%,_#0f172a_50%,_#020617_100%)] text-slate-100 p-4 md:p-8 flex flex-col items-center font-sans">
      
      {/* Header Bar */}
      <header className="w-full max-w-7xl mb-6 flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to ToolKraft
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Client-Side GPU Accelerated
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              Image Studio &amp; Passport Creator
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl flex-1 flex flex-col mb-12">
        <EditorMain />
      </div>

      {/* SEO & AdSense Compliant In-Depth Technical Guide */}
      <section className="w-full max-w-7xl border-t border-white/10 pt-12 space-y-12 text-slate-300">
        
        {/* Studio Overview */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
            Professional Online Passport Photo Maker &amp; Image Studio
          </h2>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Obtaining compliant biometric passport photos for national passports, international travel visas, driving licenses, and corporate identity cards often involves expensive photography studios or cumbersome software. The **ToolKraft Image Studio &amp; Passport Creator** delivers a complete workstation directly inside your web browser. Crop, align, enhance contrast, adjust background fills, and generate print-ready photo grids with sub-millimeter precision.
          </p>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Powered by hardware-accelerated HTML5 Canvas routines, every layer adjustment, aspect ratio crop, and lighting modification happens entirely inside your local device memory. Your personal portraits never leave your computer, guaranteeing total biometric data privacy without cloud retention risks.
          </p>
        </div>

        {/* Global Passport & Visa Dimension Standards */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-cyan-400" />
            Standard Passport &amp; Visa Photo Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
              <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Country / Document Type</th>
                  <th className="p-3 font-semibold">Physical Dimensions</th>
                  <th className="p-3 font-semibold">Head Size (Chin to Crown)</th>
                  <th className="p-3 font-semibold">Required Background</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-400">
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">India Passport &amp; OCI</td>
                  <td className="p-3">3.5 cm x 4.5 cm (or 2 x 2 inches)</td>
                  <td className="p-3">70% to 80% of image height</td>
                  <td className="p-3 text-cyan-400">Plain white or light off-white</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">United States (US Visa &amp; Passport)</td>
                  <td className="p-3">2 x 2 inches (51 x 51 mm)</td>
                  <td className="p-3">1 inch to 1 3/8 inches (25 - 35 mm)</td>
                  <td className="p-3 text-cyan-400">Pure white only</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">Schengen Visa (Europe)</td>
                  <td className="p-3">35 mm x 45 mm</td>
                  <td className="p-3">32 mm to 36 mm (70-80%)</td>
                  <td className="p-3 text-cyan-400">Plain light grey or white</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">United Kingdom (UK Passport)</td>
                  <td className="p-3">35 mm x 45 mm</td>
                  <td className="p-3">29 mm to 34 mm</td>
                  <td className="p-3 text-cyan-400">Plain light grey or cream</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">Canada Passport</td>
                  <td className="p-3">50 mm x 70 mm</td>
                  <td className="p-3">31 mm to 36 mm</td>
                  <td className="p-3 text-cyan-400">Pure white or light-coloured</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            How to Create Compliant Passport Photos in 3 Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Upload Portrait</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Import any standard smartphone portrait or digital photo taken in natural lighting facing forward.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Crop &amp; Align</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use built-in aspect ratio presets (35x45 mm, 2x2 in) and position facial markers to match official composition bounds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Generate Printable Grid</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export single passport images or tile multiple copies across standard 4x6 inch or A4 photo sheets for quick printing.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Features Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Advanced Editing Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Crop className="w-4 h-4 text-cyan-400" /> Biometric Face Alignment
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual guide overlays ensure eye height and head coverage remain within mandated 70-80% height parameters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-cyan-400" /> Multi-Copy Print Layouts
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically generate 4x6 inch photographic paper sheets with 6 or 8 tiled passport cut-outs to minimize printing costs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" /> Contrast &amp; Tone Correction
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fine-tune exposure, shadows, and color temperature to eliminate harsh flash glare or underexposed backgrounds.
              </p>
            </div>
          </div>
        </div>

        {/* Client Side Privacy Guarantee */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            100% In-Browser Privacy Protection
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your personal portraits, biometric captures, and family visa photos should never be stored on third-party cloud servers. ToolKraft processes all canvas rendering, aspect cropping, and pixel manipulations client-side in your browser. No files are saved or transmitted to external databases.
          </p>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-slate-400">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                Can I print the 4x6 inch passport sheet at a local photo lab?
              </h4>
              <p className="leading-relaxed">
                Yes. Save the generated 4x6 inch image to a USB drive or your phone and take it to any standard photo lab or pharmacy kiosk. Print it on glossy photo paper as an ordinary 4x6 print, then cut out the individual photos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                Can I wear glasses or headwear in my passport photo?
              </h4>
              <p className="leading-relaxed">
                Most international passport authorities (including US Dept of State and Indian Passport Seva) strictly prohibit eyeglasses to prevent flash reflections. Headwear is generally permitted only for documented religious or medical reasons, provided full facial features from forehead to chin remain visible.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                How is this different from the Govt Job Photo Resizer?
              </h4>
              <p className="leading-relaxed">
                The Govt Job Resizer is tailored specifically for Indian recruitment portals (MPSC, SSC, UPSC) with exact pixel dimensions and strict KB weight limits. The Image Studio &amp; Passport Creator is built for physical and digital visa/passport documentation, featuring printable multi-grid sheets, aspect ratio cropping, and tone corrections.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Utility Link */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need to adjust images strictly for competitive exam recruitment portals?
          </p>
          <Link
            href="/tools/govt-job-photo-resizer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Govt Exam Photo &amp; Signature Resizer <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>
    </main>
  );
}