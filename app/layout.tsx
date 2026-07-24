import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toolnova.dev"),
  title: {
    default: "ToolNova | 100+ Free Online Tools",
    template: "%s | ToolNova",
  },
  description:
    "ToolNova offers fast, modern and SEO-friendly online tools for calculations, image editing, PDFs and more.",
  keywords: ["online tools", "calculators", "image tools", "PDF tools", "free tools"],
  alternates: {
    canonical: "https://toolnova.dev",
  },
  openGraph: {
    title: "ToolNova | 100+ Free Online Tools",
    description: "Modern utility website with calculators, image tools, PDF utilities and QR generation.",
    url: "https://toolnova.dev",
    siteName: "ToolNova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNova | 100+ Free Online Tools",
    description: "Modern utility website with calculators, image tools, PDF utilities and QR generation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
