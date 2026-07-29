import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKraft - Free Online PDF & Image Utilities",
  description:
    "Fast, private, browser-based tools to compress PDFs, resize images, and convert formats with zero server upload.",
  metadataBase: new URL("https://toolkraft.vercel.app"),
  verification: {
    google: "JVhRfyFuIT5QjEhV",
  },
  openGraph: {
    title: "ToolKraft | Private Browser Tools",
    description:
      "Compress PDFs, resize images, and convert files 100% locally in your browser.",
    url: "https://toolkraft.vercel.app",
    siteName: "ToolKraft",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolKraft | Private Browser Tools",
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
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}