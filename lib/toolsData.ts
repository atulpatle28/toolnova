import {
  FileImage,
  FileText,
  Presentation,
  FileSpreadsheet,
  Code,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface PdfToolItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  badge?: string;
  gradient: string;
}

export const convertToPdfTools: PdfToolItem[] = [
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert photos, scans, and gallery images into formatted PDF files.",
    href: "/tools/jpg-to-pdf",
    icon: FileImage,
    active: true,
    badge: "Popular",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word (.docx, .doc) documents into clean PDF documents.",
    href: "/tools/word-to-pdf",
    icon: FileText,
    active: true,
    badge: "Essential",
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400",
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Transform PowerPoint (.pptx) presentation slides into landscape PDF documents.",
    href: "/tools/powerpoint-to-pdf",
    icon: Presentation,
    active: true,
    gradient: "from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-400",
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel (.xlsx) spreadsheets and tables into printable PDF sheets.",
    href: "/tools/excel-to-pdf",
    icon: FileSpreadsheet,
    active: true,
    gradient: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400",
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF",
    description: "Render HTML code snippets or live webpage markup directly into PDF files.",
    href: "/tools/html-to-pdf",
    icon: Code,
    active: true,
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400",
  },
];

export const convertFromPdfTools: PdfToolItem[] = [
  {
    id: "pdf-to-image",
    name: "PDF to JPG",
    description: "Extract and render each PDF page into high-resolution JPG images.",
    href: "/tools/pdf-to-image",
    icon: FileImage,
    active: true,
    badge: "Retina 2x",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract readable text and document formatting into editable .docx files.",
    href: "/tools/pdf-to-word",
    icon: FileText,
    active: true,
    badge: "Popular",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert PDF documents into editable 16:9 widescreen presentation slides.",
    href: "/tools/pdf-to-powerpoint",
    icon: Presentation,
    active: true,
    gradient: "from-orange-500/10 to-rose-500/10 border-orange-500/20 text-orange-400",
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract financial tables and balance sheets directly into Excel workbooks.",
    href: "/tools/pdf-to-excel",
    icon: FileSpreadsheet,
    active: true,
    gradient: "from-green-500/10 to-teal-500/10 border-green-500/20 text-green-400",
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Convert regular PDF files to ISO 19005 compliant archival format for legal retention.",
    href: "/tools/pdf-to-pdfa",
    icon: ShieldCheck,
    active: true,
    badge: "ISO Standard",
    gradient: "from-slate-500/10 to-zinc-500/10 border-slate-500/20 text-slate-300",
  },
];