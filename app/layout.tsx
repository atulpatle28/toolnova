import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolKraft | Free Online Utility Suite",
  description: "Private client-side tools for PDFs and images.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}