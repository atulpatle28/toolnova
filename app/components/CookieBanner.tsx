"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem("tk_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("tk_cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-safe pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">🍪 We use cookies</p>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            ToolKraft uses cookies to improve your experience, serve personalized ads, and analyze our traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies.
            <Link href="/privacy-policy" className="text-emerald-400 hover:underline ml-1">
              Read Policy
            </Link>
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={acceptCookies}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition"
          >
            Accept All
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}