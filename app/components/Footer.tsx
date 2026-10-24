import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/60 pt-10 pb-6 text-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-slate-400">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-white tracking-tight">ToolKraft</h3>
            <p className="text-xs leading-relaxed max-w-xs">
              Your trusted platform for everyday digital tools and transparent online giveaways. We believe in delivering value and fair opportunities to everyone.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 pt-2">
              <ShieldCheck className="w-4 h-4" /> Secure & Verified Platform
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold mb-2">Legal & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-emerald-400 transition">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-400 transition">Refund & Cancellation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold mb-2">Reach Out</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>support@mytoolkraft.in<br/>(Response time: 24-48 hours)</span>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Maharashtra, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {currentYear} ToolKraft (mytoolkraft.in). All rights reserved.</p>
          <p>Secured by Cashfree Payments.</p>
        </div>
      </div>
    </footer>
  );
}