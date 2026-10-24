import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>ToolKraft believes in 100% transparency. Please read our refund rules carefully before participating in any giveaway or contest.</p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. When are refunds applicable? (100% Money-Back Guarantee)</h2>
            <p>Our Season 1 Mega Giveaway has a strict milestone of 50,000 total entries. <strong>If the contest fails to reach this 50,000 entry target within the stipulated deadline, the contest will be cancelled, and 100% of your entry fee (₹49) will be automatically refunded</strong> to your original payment source (Bank Account, UPI, or Card).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. When are refunds NOT applicable?</h2>
            <p>Once the 50,000 entries milestone is reached and the live draw is successfully conducted, the ₹49 entry fee becomes entirely non-refundable. Since the service (a fair chance in the draw) has been successfully rendered, cancellation requests will not be entertained post-draw.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Failed Transactions</h2>
            <p>If your payment amount is deducted from your bank but your entry is not confirmed on our website, please do not panic. Failed transactions are usually reversed by your bank within 3-5 business days. You can also contact us for manual verification.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Contact Information</h2>
            <p>For any refund-related disputes or queries, reach out to our billing team at <strong className="text-emerald-400">support@mytoolkraft.in</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
