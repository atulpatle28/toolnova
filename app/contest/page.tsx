"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { 
  Trophy, 
  CheckCircle2, 
  Loader2, 
  Smartphone, 
  ShieldCheck, 
  Share2, 
  Gift, 
  HelpCircle, 
  ArrowLeft, 
  Sparkles,
  Copy,
  Check
} from "lucide-react";

export default function ContestPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ entryId: string; referralCode: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Kripya apna Naam, Email aur Phone Number bharein!");
      return;
    }

    setLoading(true);

    try {
      // Backend API call karke Cashfree order create karenge
      const res = await fetch("/api/create-cashfree-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Payment session create nahi ho paya.");
      }

      // User details localStorage me save kar lete hain
      localStorage.setItem("contest_user", JSON.stringify(formData));

      // Cashfree Checkout redirect URL par user ko bhej denge
      const cashfreeRedirectUrl = `https://sandbox.cashfree.com/pg/orders?payment_session_id=${data.payment_session_id}`;
      window.location.href = cashfreeRedirectUrl;

    } catch (err: any) {
      console.error("Payment error:", err);
      alert("Kuch technical error aayi: " + (err.message || err));
      setLoading(false);
    }
  };

  const referralLink = successData ? `https://mytoolkraft.in/contest?ref=${successData.referralCode}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Sparkles className="w-4 h-4" /> Season 1 Mega Giveaway (Target: 50,000 Entries)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Win Brand New <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">iPhone &amp; Android Phones</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Participate in ToolKraft&apos;s verified lucky draw. Secure your slot for just <strong className="text-emerald-400">₹49</strong>. The lucky draw will automatically unlock once the milestone of <strong className="text-emerald-400">50,000 total entries</strong> is reached!
          </p>
        </div>

        {/* Prizes Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Top 2 Winners</h3>
            <p className="text-xl font-black text-emerald-400">Brand New iPhone</p>
            <p className="text-[11px] text-slate-400">Latest model delivered directly to your doorstep with official warranty.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Top 5 Winners</h3>
            <p className="text-xl font-black text-cyan-400">Android Flagship</p>
            <p className="text-[11px] text-slate-400">High-performance smartphones for runner-up lucky draw winners.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center relative overflow-hidden group hover:border-violet-500/40 transition-all">
            <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Next 50 People</h3>
            <p className="text-xl font-black text-violet-400">₹1,000 Per Person</p>
            <p className="text-[11px] text-slate-400">Cash reward distributed as part of ToolKraft Mega Giveaway.</p>
          </div>
        </div>

        {/* Form or Success State Box */}
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {successData ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Registration Successful!</h2>
                <p className="text-xs text-slate-300">
                  Aapka payment successfully verify ho gaya hai. Aapka entry pass generate ho chuka hai.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-left">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Entry Reference ID:</span>
                  <span className="text-emerald-400 font-bold">{successData.entryId}</span>
                </div>
              </div>

              {/* Referral Share Box */}
              <div className="p-5 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Share2 className="w-4 h-4" /> Boost Winning Chances (Share Link)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Har ek friend jo aapke link se join karega, aapke winning chances 3x ho jayenge!
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <Link
                href="/"
                className="inline-block w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
              >
                Return to ToolKraft Home
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white">Secure Your Lucky Draw Slot</h2>
                <p className="text-xs text-slate-400">
                  Entry Fee: <span className="text-emerald-400 font-bold text-sm">₹49</span> (Draw unlocks at 50,000 total entries)
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Full Name (As per ID)</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition cursor-pointer shadow-lg shadow-emerald-600/20 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating Secure Order...
                    </>
                  ) : (
                    "Pay ₹49 & Join Lucky Draw"
                  )}
                </Button>

                <p className="text-[10px] text-center text-slate-500 mt-2">
                  🔒 Secured by Cashfree Payments API. Zero hidden charges.
                </p>
              </form>
            </div>
          )}

        </div>

        {/* Terms & Conditions / Money Back Guarantee Notice */}
        <section className="space-y-6 pt-6 border-t border-slate-800 text-slate-400 text-xs sm:text-sm">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Contest Terms, Conditions &amp; Guarantee Policy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm">💰 100% Money-Back Guarantee</h4>
              <p className="leading-relaxed">
                The lucky draw will officially open and winners will be announced only after reaching the target threshold of <strong className="text-emerald-400">50,000 total entries</strong>. If the target is not met within the deadline, 100% of the entry fee (₹49) will be fully refunded to your original payment source.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm">🎯 Winner Selection Algorithm</h4>
              <p className="leading-relaxed">
                Winners are chosen transparently via a cryptographically secure random number generator script as soon as 50,000 entries are completed. Sharing your unique referral link multiplies your entries in the pool.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm">📦 Prize Fulfillment</h4>
              <p className="leading-relaxed">
                All physical prizes (iPhones and Android smartphones) are brand new, sealed units. Winners will be notified via email and WhatsApp with tracking details for doorstep delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-white text-sm">🛡️ Participant Eligibility</h4>
              <p className="leading-relaxed">
                Participants must provide valid contact details (Name, Email, and Phone) during payment checkout. Providing incorrect details may disqualify you from receiving winning prizes or refunds.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}