import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Contact Us</h1>
          <p className="text-sm text-slate-400">We are here to help. Reach out to us for any queries regarding your contest entry, refunds, or general support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Email Support</h3>
              <p className="text-sm mt-1">workformoney28@gmail.com</p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Response Time</h3>
              <p className="text-sm mt-1">Monday - Saturday<br/>24 to 48 Hours</p>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 md:col-span-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Office Address</h3>
              <p className="text-sm mt-1">404/1 Shriram Nagar, Tumsar, Bhandara<br/>Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}