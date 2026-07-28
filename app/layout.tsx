import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKraft | Free Online PDF & Image Utility Suite",
  description:
    "Fast, private & powerful client-side web utility tools. Compress, merge, split, and convert PDFs and images with zero server logs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}