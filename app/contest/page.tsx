"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Smartphone, Gift, ShieldCheck, CheckCircle2, ArrowLeft, Share2, Copy, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ContestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const referralLink = "https://mytoolkraft.in/contest?ref=tk_user_" + Math.random().toString(36).substring(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.mobile) {
      setSubmitted(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Back Link */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-6 shadow-2xl"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Trophy className="w-4 h-4" /> ToolKraft Mega Giveaway 2026
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white">
            Win a Brand New <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">iPhone</span> &amp; Rewards!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Participate in our exclusive lucky draw. Entry fee is just <span className="text-emerald-400 font-bold">₹200</span>. Multiple prizes for lucky winners and 100% money-back guarantee if the contest target isn't met.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800"><Smartphone className="w-4 h-4 text-emerald-400" /> 2x iPhone Winners</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800"><Gift className="w-4 h-4 text-emerald-400" /> 5x Android Phones</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Money-Back Guarantee</span>
          </div>
        </motion.div>

        {/* Prize Pool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">1st &amp; 2nd Prize</h3>
            <p className="text-xl font-black text-emerald-400">2x iPhones</p>
            <p className="text-xs text-slate-400">Brand new latest model iPhone for top 2 lucky draw winners.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">3rd to 7th Prize</h3>
            <p className="text-xl font-black text-emerald-400">5x Android Phones</p>
            <p className="text-xs text-slate-400">Performance smartphones for next 5 lucky winners.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Special Reward</h3>
            <p className="text-xl font-black text-emerald-400">50 Free Entries</p>
            <p className="text-xs text-slate-400">50 random participants get free entry pass for the next contest.</p>
          </div>
        </div>

        {/* Registration Form & Share Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Register for Contest</h3>
              <p className="text-xs text-slate-400">Entry fee: <span className="text-emerald-400 font-bold">₹200 Only</span> (Secured &amp; Refundable if failed)</p>
            </div>

            {submitted ? (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">Registration Successful!</p>
                  <p className="text-xs text-slate-300">Complete your ₹200 payment to confirm your lucky draw ticket.</p>
                </div>
                
                {/* Referral Boost Box */}
                <div className="pt-4 border-t border-emerald-500/20 space-y-2 text-left">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> Boost Your Winning Chances!
                  </p>
                  <p className="text-[11px] text-slate-400">Share your unique link with friends. Every referral multiplies your entry weight!</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={referralLink} 
                      className="w-full h-9 bg-slate-950 border border-slate-800 rounded-lg px-3 text-xs text-slate-300 focus:outline-none" 
                    />
                    <button onClick={copyToClipboard} type="button" className="h-9 px-4 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs flex items-center gap-1">
                      {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Mobile Number (WhatsApp Preferred)</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full h-11 bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button type="submit" className="w-full h-12 font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                  Proceed to Pay ₹200 &amp; Enter Draw
                </button>
              </form>
            )}
          </div>

          {/* Guidelines & Guarantee */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Money-Back Guarantee
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We value transparency. If the contest does not reach the minimum required participant threshold before the deadline, the event will be called off, and <span className="text-white font-semibold">100% of your entry fee (₹200) will be refunded</span> directly to your payment source within 3-5 business days. No questions asked.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" /> How Sharing Boosts Chances
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When you register, you receive a unique referral link. For every friend who joins using your link, your entry gets duplicated in the random lucky draw pool, multiplying your chances of winning the iPhone!
              </p>
            </div>
          </div>

        </div>

        {/* Terms & Conditions Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4 text-xs text-slate-400">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400" /> Terms &amp; Conditions
          </h4>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li><strong>Eligibility:</strong> Open to all residents with a valid Indian mobile number and email address.</li>
            <li><strong>Entry Fee:</strong> A non-refundable fee of ₹200 applies upon successful confirmation, subject to the safety refund policy if the contest fails.</li>
            <li><strong>Winner Selection:</strong> Winners will be chosen via a transparent, randomized cryptographic draw script monitored by the ToolKraft management team.</li>
            <li><strong>Announcement:</strong> Results will be announced on our official website and communicated via email and SMS/WhatsApp to the respective winners.</li>
            <li><strong>Dispute Resolution:</strong> ToolKraft holds final authority in case of any discrepancies or fraudulent activity detected from entries.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}