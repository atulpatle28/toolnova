import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>Welcome to ToolKraft. By accessing our website (mytoolkraft.in) and participating in our contests, you agree to comply with and be bound by the following terms.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Eligibility</h2>
            <p>Participants must be at least 18 years of age and residents of India to participate in the giveaway. Valid identification may be required to claim physical prizes (such as smartphones).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Contest Rules</h2>
            <p>The entry fee of ₹49 grants you a single slot in the lucky draw pool. The draw is fully automated and cryptographically randomized to ensure absolute fairness. ToolKraft reserves the right to disqualify any participant found using bots, fake details, or fraudulent payment methods.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Prize Fulfillment</h2>
            <p>Physical prizes will be shipped directly to the winner&apos;s registered address. Cash rewards will be transferred via UPI. Prizes are non-transferable and cannot be exchanged for other items.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Maharashtra, India.</p>
          </section>
        </div>
      </div>
    </div>
  );
}