import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#090d16] py-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand Info */}
          <div>
            <p className="text-lg font-bold text-white">ToolKraft</p>
            <p className="text-sm text-slate-400">
              Free, private online tools & utilities.
            </p>
          </div>

          {/* Policy & Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-emerald-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">
              Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ToolKraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
}