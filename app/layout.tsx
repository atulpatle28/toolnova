import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner"; // Naya Cookie Banner import

const inter = Inter({ subsets: ["latin"] });

// 1. Google aur SEO ke liye Metadata
export const metadata: Metadata = {
  title: "ToolKraft - Free Online Digital Tools & Giveaways",
  description: "Use everyday free digital tools like Excel to PDF converter, and participate in 100% verified lucky draw giveaways to win brand new smartphones and cash.",
  keywords: "free online tools, pdf converter, lucky draw, win iphone, ToolKraft",
  openGraph: {
    title: "ToolKraft - Free Tools & Giveaways",
    description: "Join the ToolKraft Mega Giveaway and use our free utility tools.",
    url: "https://mytoolkraft.in",
    siteName: "ToolKraft",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 flex flex-col min-h-screen`}>
        
        {/* 2. Professional Header / Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">TK</span>
              ToolKraft
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-emerald-400 transition">Home</Link>
              <Link href="/about" className="hover:text-emerald-400 transition">About Us</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition">Contact</Link>
              <Link href="/contest" className="text-emerald-400 font-bold hover:text-emerald-300 transition">🔥 Giveaway</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer aur Global Components */}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}