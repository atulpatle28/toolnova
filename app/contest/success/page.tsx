"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Share2, Trophy, ArrowRight, Copy, Check, Smartphone, Gift } from "lucide-react";

export default function SuccessPage() {
  const [copied, setCopied] = useState(false);
  
  // The viral message to be shared
  const shareUrl = "https://mytoolkraft.in/contest";
  const shareText = "🔥 Maine ToolKraft ke Mega Giveaway mein hissa le liya hai aur ₹49 mein naya iPhone jeetne ki entry secure kar li hai! Slots jaldi full ho rahe hain, tum bhi abhi join karo aur jeeto! Link: " + shareUrl;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Success Confirmation Card */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-emerald-500/20 blur-[60px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shadow-inner border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Payment Successful!</h1>
              <p className="text-emerald-400 font-bold bg-emerald-500/10 inline-block px-4 py-1.5 rounded-full text-sm">
                Ticket #TK-{Math.floor(100000 + Math.random() * 900000)} Confirmed
              </p>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Badhai ho! Aapki ₹49 ki entry ToolKraft Mega Giveaway ke liye successfully secure ho chuki hai. Aapko jald hi WhatsApp par confirmation aa jayega.
            </p>
          </div>
        </div>

        {/* Viral Boost Card */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Trophy className="w-32 h-32 text-amber-500" />
          </div>

          <div className="relative z-10 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-amber-500/20">
              <Gift className="w-4 h-4" /> Secret Trick
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Increase Winning Chances by 10x! 🚀
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
              Hamara system un users ko zyada priority deta hai jo is giveaway ko apne doston ke sath share karte hain. Abhi WhatsApp status par share karein aur apne jeetne ke chances boost karein!
            </p>

            <div className="pt-4 space-y-3">
              <button 
                onClick={handleWhatsAppShare}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white font-black py-4 rounded-xl text-base transition-all shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" /> Share on WhatsApp to Boost
              </button>

              <button 
                onClick={copyLink}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Link Copied Successfully!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center pt-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            Go back to Free Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}