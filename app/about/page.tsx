import Link from "next/link";
import { ArrowLeft, Users, Zap, ShieldCheck } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">About ToolKraft</h1>
          <p className="text-sm text-slate-400">Simplifying digital tasks and rewarding our community.</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to <strong>ToolKraft</strong>! We started this platform with a simple mission: to provide everyday internet users with fast, free, and secure digital utility tools (like document converters) without the clutter of annoying ads or hidden fees.
          </p>

          <p>
            But we didn&apos;t want to stop at just being a utility website. We wanted to build a community. That&apos;s why we introduced the <strong>ToolKraft Mega Giveaway</strong> — a 100% transparent, milestone-based lucky draw system where our users can win premium smartphones and cash rewards fairly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white">Fast Tools</h3>
              <p className="text-xs text-slate-400">No wait times. Get your digital tasks done in seconds.</p>
            </div>
            
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-white">Transparent</h3>
              <p className="text-xs text-slate-400">100% money-back guarantee on our giveaways if targets aren&apos;t met.</p>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <Users className="w-6 h-6 text-violet-400" />
              <h3 className="font-bold text-white">Community First</h3>
              <p className="text-xs text-slate-400">Built for users in India, providing real value everyday.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}