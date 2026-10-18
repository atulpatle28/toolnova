"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Flame, 
  Gift, 
  Smartphone, 
  ShieldCheck,
  Send
} from "lucide-react";

export default function ContestSuccessPage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://mytoolkraft.in/contest";

  const shareText = "🔥 Maine ToolKraft Mega Giveaway (₹49) me iPhone aur Android jeetne ke liye register kiya hai! Tum bhi abhi join karo aur jeeto: " + shareUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <header className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to ToolKraft
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" /> Entry Confirmed
        </span>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Success Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Entry Successfully Confirmed!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Aap Lucky Draw Me Shaamil Ho Chuke Hain!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Aapka payment verify ho gaya hai. Aapka registered phone number hamare database mein contest ticket ke roop mein save ho chuka hai.
            </p>
          </div>

          {/* Boost Chances Highlight Box */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/40 border-2 border-emerald-500/40 rounded-2xl text-left space-y-4">
            
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-amber-400">
              <Flame className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Winning Chances 3X Se 5X Kaise Badhayein?</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Jitna zyada aap is contest ko doston aur groups me share karenge, aapke jeetne ke chances utne hi zyada badhenge!</strong> Har ek share se aap contest me priority active participant ban jate hain.
            </p>

            {/* Share Link Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400">Aapka Share Link:</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={shareUrl}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* WhatsApp Direct Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-slate-950" /> WhatsApp Par Share Karein (Fast Boost)
            </button>

          </div>

          {/* Quick Prize Reminder */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Smartphone className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="font-bold text-white text-[11px]">iPhone 15</p>
              <p className="text-[10px] text-slate-500">Top 2</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Gift className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="font-bold text-white text-[11px]">Android</p>
              <p className="text-[10px] text-slate-500">Top 5</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <Sparkles className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <p className="font-bold text-white text-[11px]">₹1,000</p>
              <p className="text-[10px] text-slate-500">50 People</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs transition"
          >
            ToolKraft Home Page Par Jayein
          </Link>

        </div>

      </main>
    </div>
  );
}