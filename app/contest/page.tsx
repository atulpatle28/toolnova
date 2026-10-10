"use client";

import React, { useState, useEffect } from "react";
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
  Users,
  Flame,
  Award,
  Sparkle
} from "lucide-react";

export default function ContestPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winners, setWinners] = useState<{
    iphoneWinners: any[];
    androidWinners: any[];
    cashWinners: any[];
  } | null>(null);

  const TARGET_ENTRIES = 50000;
  const CASHFREE_PAYMENT_URL = "https://payments.cashfree.com/forms/mytoolkraft";

  // Real-time live entries count fetch karna
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/api/contest");
        const data = await res.json();
        if (typeof data.totalEntries === "number") {
          setTotalEntries(data.totalEntries);
        }
      } catch (err) {
        console.error("Failed to fetch entries count", err);
      }
    };

    fetchEntries();
    const interval = setInterval(fetchEntries, 8000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(
    Math.round((totalEntries / TARGET_ENTRIES) * 100),
    100
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Kripya apna Naam, Email aur Phone Number bharein!");
      return;
    }

    setLoading(true);

    try {
      // 1. Supabase mein database entry record create karna
      const res = await fetch("/api/contest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.ticketId) {
        formData.phone = `${formData.phone} (Ticket: ${data.ticketId})`;
      }

      localStorage.setItem("contest_user", JSON.stringify(formData));

      // 2. Direct Cashfree verified reusable payment form par bhejna
      window.location.href = CASHFREE_PAYMENT_URL;
    } catch (err: any) {
      console.error("Payment redirect error:", err);
      // Agar backend delay ho tab bhi payment link smoothly open ho jaye
      window.location.href = CASHFREE_PAYMENT_URL;
    }
  };

  // Live lucky draw trigger function (transparent verifiable generator)
  const handleTriggerDraw = async () => {
    setIsDrawing(true);
    try {
      const res = await fetch("/api/contest/draw", { method: "POST" });
      const data = await res.json();
      if (data.iphoneWinners) {
        setTimeout(() => {
          setWinners(data);
          setIsDrawing(false);
        }, 2500);
      } else {
        alert(data.error || "Draw trigger failed");
        setIsDrawing(false);
      }
    } catch (err) {
      console.error("Draw failed", err);
      setIsDrawing(false);
    }
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
            Participate in ToolKraft&apos;s verified lucky draw. Secure your slot for just <strong className="text-emerald-400">₹49</strong>. The lucky draw automatically unlocks once the milestone of <strong className="text-emerald-400">50,000 total entries</strong> is reached!
          </p>
        </div>

        {/* Live Entries Milestone Tracker Card */}
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" /> Live Registered Entries:
              </span>
            </div>
            <div className="font-mono text-emerald-400 font-black text-lg">
              {totalEntries.toLocaleString()} <span className="text-xs text-slate-500">/ {TARGET_ENTRIES.toLocaleString()}</span>
            </div>
          </div>

          {/* Animated Gradient Bar */}
          <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(progressPercent, 1)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5" /> Fast Filling Pool
            </span>
            <span>{progressPercent}% target completed</span>
          </div>
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
            <p className="text-[11px] text-slate-400">Cash reward distributed directly to UPI bank accounts.</p>
          </div>
        </div>

        {/* Registration Form Box */}
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Recording Entry &amp; Redirecting...
                </>
              ) : (
                "Pay ₹49 & Join Lucky Draw"
              )}
            </Button>

            <p className="text-[10px] text-center text-slate-500 mt-2">
              🔒 Entries registered transparently in database &amp; secured by Cashfree Payments.
            </p>
          </form>
        </div>

        {/* Live Verifiable Draw Arena */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" /> Transparent Live Lucky Draw Arena
              </h3>
              <p className="text-xs text-slate-400">
                All winners are selected live on this screen using a cryptographically secure randomizer once 50,000 entries are fulfilled.
              </p>
            </div>
            {totalEntries >= TARGET_ENTRIES && !winners && (
              <Button
                onClick={handleTriggerDraw}
                disabled={isDrawing}
                className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs shrink-0"
              >
                {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Roll Live Lucky Draw Now"}
              </Button>
            )}
          </div>

          {/* Winner Showcase State */}
          {winners && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-center space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Official Draw Results</span>
                <h4 className="text-lg font-black text-white">🎉 Congratulations to the Winners! 🎉</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-amber-400">📱 iPhone Winners (2 Slots)</span>
                  {winners.iphoneWinners.map((w, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded-lg">
                      <span className="font-semibold text-white">{w.name} ({w.ticket_id})</span>
                      <span className="text-slate-400 font-mono">{w.phone ? w.phone.slice(0, 4) + 'XXXX' : 'VERIFIED'}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-cyan-400">🚀 Flagship Android Winners (5 Slots)</span>
                  {winners.androidWinners.map((w, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-900 rounded-lg">
                      <span className="font-semibold text-white">{w.name} ({w.ticket_id})</span>
                      <span className="text-slate-400 font-mono">{w.phone ? w.phone.slice(0, 4) + 'XXXX' : 'VERIFIED'}</span>
                    </div>
                  ))}
                </div>
              </div>
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