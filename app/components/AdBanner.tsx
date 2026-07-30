"use client";

import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  dataFullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = "",
}: AdBannerProps) {
  useEffect(() => {
    try {
      // Ensure window.adsbygoogle is initialized
      window.adsbygoogle = window.adsbygoogle || [];
      // Push the ad to trigger AdSense render
      window.adsbygoogle.push({});
    } catch (err) {
      console.error("AdSense execution error:", err);
    }
  }, []);

  return (
    <div className={`overflow-hidden text-center my-4 ${className}`}>
      {/* Label indicating it's an advertisement (Google recommendation) */}
      <span className="block text-[10px] tracking-widest text-slate-500 uppercase mb-1">
        Advertisement
      </span>

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4988623392842380"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}