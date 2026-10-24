"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button"; // Check your Button path if this throws an error, or use a standard <button> tag
import { 
  Trophy, 
  Smartphone, 
  ShieldCheck, 
  Gift, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles,
  ExternalLink,
  Activity,
  Flame
} from "lucide-react";

export default function ContestPage() {
  // Live Entries Simulation State
  const [entries, setEntries] = useState(1269);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate live entries increasing randomly every 5 to 12 seconds
    const interval = setInterval(() => {
      setEntries((prev) => {
        // Prevent going over 50000
        if (prev >= 50000) return 50000;
        return prev + Math.floor(Math.random() * 3) + 1;
      });
      
      // Trigger glowing animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, Math.floor(Math.random() * 7000) + 5000);

    return () => clearInterval(interval);
  }, []);

  const CASHFREE_FORM_URL = "https://payments.cashfree.com/forms/mytoolkraft";

  const handleJoin = () => {
    window.location.href = CASHFREE_FORM_URL;
  };

  // Calculate Progress Percentage
  const progressPercentage = (entries / 50000) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" /> 100% Refund Guarantee
        </span>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" /> Season 1 Mega Giveaway
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Win Brand New <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              iPhone &amp; Flagship Phones
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ToolKraft ke verified lucky draw mein hissa lein. Sirf <strong className="text-emerald-400">₹49</strong> mein apni entry secure karein. 50,000 entries poori hone par transparent lucky draw khulega!
          </p>

          {/* PRO LEVEL LIVE COUNTER */}
          <div className="pt-6 pb-2 max-w-md mx-auto relative">
            
            {/* Blinking Live Indicator */}
            <div className="absolute -top-1 -right-2 flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> Live
            </div>

            {/* Glowing Box */}
            <div className={`p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 transition-all duration-500 ${isAnimating ? 'scale-[1.02] shadow-[0_0_30px_rgba(52,211,153,0.2)]' : 'shadow-2xl shadow-black/50'}`}>
              <div className="bg-slate-950/80 rounded-2xl p-6 sm:p-8 border border-slate-800/80 text-center space-y-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Slots Filling Fast
                </p>
                
                <div className="flex items-baseline justify-center gap-2">
                  <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300 ${isAnimating ? 'opacity-70 blur-[1px]' : 'opacity-100'}`}>
                    {entries.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-slate-600">/ 50k</span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">
                    {50000 - entries} slots remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prizes Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-colors space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Top 2 Winners</h3>
              <p className="text-2xl font-black text-emerald-400">New iPhone</p>
            </div>
            <p className="text-[11px] text-slate-500">Direct ghar par delivery with brand warranty.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors space-y-4 text-center">
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Top 5 Winners</h3>
              <p className="text-2xl font-black text-cyan-400">Android Flagship</p>
            </div>
            <p className="text-[11px] text-slate-500">Top performance gaming &amp; camera phones.</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 transition-colors space-y-4 text-center">
            <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Next 50 People</h3>
              <p className="text-2xl font-black text-violet-400">₹1,000 Cash</p>
            </div>
            <p className="text-[11px] text-slate-500">Direct cash reward transferred via UPI/Bank.</p>
          </div>
        </div>

        {/* Direct Action Card */}
        <div className="max-w-xl mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-6 sm:p-10 shadow-2xl text-center space-y-8 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl font-black text-white">Join Season 1 Giveaway</h2>
            <p className="text-sm text-slate-400">
              Entry Fee: <span className="text-emerald-400 font-black text-lg bg-emerald-500/10 px-3 py-1 rounded-lg ml-1">₹49</span> only
            </p>
          </div>

          <div className="p-5 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-left space-y-3 text-xs sm:text-sm text-slate-300 relative z-10">
            <p className="flex items-start gap-2"><span className="text-emerald-400">✅</span> <span>Payment karte waqt apna <strong>Naam, Email aur WhatsApp Number</strong> sahi bharein.</span></p>
            <p className="flex items-start gap-2"><span className="text-emerald-400">✅</span> <span>Aapka contact number hi aapka lucky draw ticket banega.</span></p>
            <p className="flex items-start gap-2"><span className="text-emerald-400">✅</span> <span><strong>100% Money-Back Guarantee</strong> agar 50k target pura nahi hota.</span></p>
          </div>

          <div className="space-y-3 relative z-10">
            <button
              onClick={handleJoin}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-4 sm:py-5 rounded-2xl text-base sm:text-lg transition-all cursor-pointer shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Pay ₹49 &amp; Secure Your Entry <ExternalLink className="w-5 h-5" />
            </button>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Safe &amp; Verified by Cashfree.
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <section className="space-y-4 pt-8 border-t border-slate-800/50 text-slate-400 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Terms &amp; 100% Refund Policy
          </h3>
          <p className="leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
            Contest target 50,000 entries ka hai. Jaise hi entries complete hongi, sabhi participants ke beech se live transparent draw nikaal kar winners announce kiye jayenge. Agar target complete nahi hua, toh sabhi ke ₹49 unke original bank account/UPI mein 100% refund kar diye jayenge without any questions.
          </p>
        </section>

      </main>
    </div>
  );
}