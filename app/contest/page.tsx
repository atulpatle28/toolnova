"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { 
  Trophy, 
  Smartphone, 
  ShieldCheck, 
  Gift, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function ContestPage() {
  // Cashfree verified form link
  const CASHFREE_FORM_URL = "https://payments.cashfree.com/forms/mytoolkraft";

  const handleJoin = () => {
    window.location.href = CASHFREE_FORM_URL;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to ToolKraft
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" /> 100% Money-Back Guarantee
        </span>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" /> Season 1 Mega Giveaway
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Win Brand New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">iPhone &amp; Android Phones</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ToolKraft ke verified lucky draw mein hissa lein. Sirf <strong className="text-emerald-400">₹49</strong> mein apni entry secure karein. 50,000 entries poori hone par transparent lucky draw khulega!
          </p>
        </div>

        {/* Prizes Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Top 2 Winners</h3>
            <p className="text-xl font-black text-emerald-400">Brand New iPhone</p>
            <p className="text-[11px] text-slate-400">Direct aapke ghar delivery with official brand warranty.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Top 5 Winners</h3>
            <p className="text-xl font-black text-cyan-400">Android Flagship</p>
            <p className="text-[11px] text-slate-400">Top performance gaming &amp; camera smartphones.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
            <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Next 50 People</h3>
            <p className="text-xl font-black text-violet-400">₹1,000 Per Person</p>
            <p className="text-[11px] text-slate-400">Direct cash reward transferred via UPI.</p>
          </div>
        </div>

        {/* Direct Action Card */}
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Join Season 1 Giveaway</h2>
            <p className="text-xs text-slate-400">
              Entry Fee: <span className="text-emerald-400 font-bold text-base">₹49</span> only
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl text-left space-y-2 text-xs text-slate-300">
            <p>✅ Payment karte waqt apna <strong>Naam, Email aur WhatsApp Number</strong> bharein.</p>
            <p>✅ Aapka contact number hi aapka lucky draw ticket banega.</p>
            <p>✅ 100% Money-Back Guarantee agar target pura nahi hota.</p>
          </div>

          <Button
            onClick={handleJoin}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-4 rounded-xl text-base transition cursor-pointer shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            Pay ₹49 &amp; Enter Contest <ExternalLink className="w-4 h-4" />
          </Button>

          <p className="text-[10px] text-slate-500">
            🔒 100% Safe &amp; Verified by Cashfree Payments Gateway.
          </p>
        </div>

        {/* Terms & Conditions */}
        <section className="space-y-4 pt-6 border-t border-slate-800 text-slate-400 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Terms &amp; 100% Refund Policy
          </h3>
          <p className="leading-relaxed">
            Contest target 50,000 entries ka hai. Jaise hi entries complete hongi, sabhi participants ke beech se live transparent draw nikaal kar winners announce kiye jayenge. Agar target complete nahi hua, toh sabhi ke ₹49 unke original bank account mein 100% refund kar diye jayenge.
          </p>
        </section>

      </main>
    </div>
  );
}