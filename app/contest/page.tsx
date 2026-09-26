"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Trophy, CheckCircle2, Loader2 } from "lucide-react";

export default function ContestRegistrationPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Kripya saari details bharein!");
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK load nahi ho paya. Internet connection check karein.");
      setLoading(false);
      return;
    }

    try {
      // 1. Order create karein (₹199 = 19900 paise)
      const response = await fetch("/api/contest-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: 199 }),
      });

      const data = await response.json();
      if (!data.success) {
        alert(data.error || "Order create karne me error aayi. API route check karein.");
        setLoading(false);
        return;
      }

      // 2. Razorpay Popup kholen
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "ToolKraft Contest",
        description: "Contest Registration Entry Fees",
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/verify-contest-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              ...formData,
              amount: 199,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSuccessId(verifyData.entryId);
          } else {
            alert("Payment verification fail ho gayi!");
          }
          setLoading(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert("Kuch technical error aayi: " + (err.message || err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Contest Entry Form</h1>
          <p className="text-xs text-slate-400">Register karke apna participation secure karein. Entry Fee: <span className="text-emerald-400 font-bold">₹199</span></p>
        </div>

        {successId ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h2 className="text-sm font-bold text-emerald-400">Registration Successful!</h2>
            <p className="text-xs text-slate-300">Aapki entry successfully record ho chuki hai.</p>
            <div className="p-2 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-400">
              Entry ID: {successId}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Full Name</label>
              <input
                type="text"
                placeholder="Apna naam likhein"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Email Address</label>
              <input
                type="email"
                placeholder="apna@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Pay ₹199 & Register Now"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}