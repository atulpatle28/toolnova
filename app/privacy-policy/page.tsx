import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>At ToolKraft, we only collect the information necessary to provide you with our services and facilitate contest entries. This includes your Name, Email Address, and Phone Number (for WhatsApp communication and draw verification).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Payment Security</h2>
            <p>We do not store or process your credit card, debit card, or UPI details on our servers. All transactions are securely processed through our RBI-compliant payment gateway partner, Cashfree Payments.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. How We Use Your Data</h2>
            <p>Your contact details are strictly used to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Register your unique entry into the lucky draw.</li>
              <li>Notify you regarding your payment status or contest results.</li>
              <li>Provide customer support.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third-party marketing companies.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Contact Us</h2>
            <p>If you have any questions regarding how we handle your data, please write to us at <strong className="text-emerald-400">workformoney28@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}