import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKraft - Free Online PDF & Image Utilities | MyToolKraft",
  description:
    "Fast, private, browser-based tools to compress PDFs, resize images for Govt exam forms, and convert formats with zero server upload.",
  keywords: [
    "ToolKraft",
    "ToolKraft PDF",
    "mytoolkraft",
    "ToolKraft resizer",
    "ToolKraft image resizer",
    "ToolKraft online tools",
    "PDF tools online",
    "image compressor",
  ],
  metadataBase: new URL("https://mytoolkraft.in"),
  alternates: {
    canonical: "https://mytoolkraft.in",
  },
  verification: {
    google: "LEUp0bxNFHmpKcLcci9Zd_ZU-BZGnLedy8FBbcXjdYM",
  },
  openGraph: {
    title: "ToolKraft - Free Online PDF & Image Utilities",
    description:
      "Compress PDFs, resize images, and convert files 100% locally in your browser with zero server uploads.",
    url: "https://mytoolkraft.in",
    siteName: "ToolKraft",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolKraft - Private Browser Utilities",
    description:
      "Compress PDFs, resize images, and convert files 100% locally in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4988623392842380"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}