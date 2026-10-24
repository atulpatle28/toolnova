import Link from "next/link";
import { 
  ArrowRight, 
  FileSpreadsheet, 
  FileText, 
  Image as ImageIcon, 
  Gift, 
  Zap, 
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:pt-32 sm:pb-24 max-w-5xl mx-auto text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Zap className="w-4 h-4" /> 100% Free Digital Utility Tools
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
          Simplify Your Tasks. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Win Mega Rewards.
          </span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ToolKraft is your everyday platform for fast, secure, and completely free online tools like PDF converters. Plus, join our verified community giveaways to win flagship smartphones!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="#tools" 
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
          >
            Explore Free Tools
          </Link>
          <Link 
            href="/contest" 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Gift className="w-5 h-5" /> Join ₹49 Mega Giveaway
          </Link>
        </div>
      </section>

      {/* Featured Giveaway Banner */}
      <section className="px-4 py-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-cyan-950/50 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 z-10 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Season 1 Mega Giveaway is Live!</h2>
            <p className="text-sm text-slate-300 max-w-lg">
              Secure your slot for just ₹49. Win brand new iPhones, Android flagships, and cash rewards. 100% transparent draw with a money-back guarantee.
            </p>
          </div>
          <Link 
            href="/contest" 
            className="z-10 shrink-0 bg-white text-emerald-950 hover:bg-slate-200 font-black px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm"
          >
            Participate Now <ArrowRight className="w-4 h-4" />
          </Link>
          
          {/* Background decoration */}
          <Gift className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-500/5 rotate-12 pointer-events-none" />
        </div>
      </section>

      {/* Free Digital Tools Grid */}
      <section id="tools" className="px-4 py-16 sm:py-24 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white">Our Free Tools</h2>
          <p className="text-sm text-slate-400">Fast, secure, and no registration required.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Tool 1 */}
          <Link href="/tools/excel-to-pdf" className="group p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition space-y-4 relative overflow-hidden block">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Excel to PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Convert your spreadsheets (.xlsx, .xls) into high-quality PDF documents instantly.</p>
            </div>
          </Link>

          {/* Tool 2 */}
          <Link href="/tools/word-to-pdf" className="group p-6 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition space-y-4 relative overflow-hidden block">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Word to PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Turn your Word documents (.doc, .docx) into secure PDFs without losing formatting.</p>
            </div>
          </Link>

          {/* Tool 3 */}
          <Link href="/tools/image-compressor" className="group p-6 bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl transition space-y-4 relative overflow-hidden block">
            <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Image Compressor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Compress your images for faster web loading without losing quality.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure Processing
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Lightning Fast
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> Privacy Focused
          </div>
        </div>
      </section>

    </div>
  );
}