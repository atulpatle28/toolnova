import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import Footer from "./components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "ToolKraft - Free Online PDF & Image Utilities | MyToolKraft",
    template: "%s | ToolKraft",
  },
  description:
    "Fast, private, browser-based tools to compress PDFs, resize images for Govt exam forms, merge documents, and convert formats with zero server upload.",
  keywords: [
    "ToolKraft",
    "ToolKraft PDF",
    "mytoolkraft",
    "ToolKraft resizer",
    "ToolKraft image resizer",
    "ToolKraft online tools",
    "PDF tools online",
    "image compressor",
    "merge pdf online",
    "pdf to word converter",
  ],
  metadataBase: new URL("https://mytoolkraft.in"),
  alternates: {
    canonical: "/",
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
      "Compress PDFs, resize images, and convert files 100% locally in your browser with zero server upload.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolKraft",
    url: "https://mytoolkraft.in",
    logo: "https://mytoolkraft.in/icon.png",
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToolKraft",
    url: "https://mytoolkraft.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://mytoolkraft.in/tools?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {/* Google AdSense Script */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4988623392842380"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950 flex flex-col min-h-screen font-sans">
        <div className="flex-grow">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}