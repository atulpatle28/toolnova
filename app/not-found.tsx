import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
        <Search className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
        404 <span className="text-slate-700">|</span> Not Found
      </h1>
      
      <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
        Oops! Jis page ko aap dhoondh rahe hain, wo exist nahi karta ya move ho chuka hai.
      </p>
      
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Homepage
      </Link>
    </div>
  );
}