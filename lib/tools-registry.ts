import {
  Crop,
  FileText,
  Sparkles,
  Type,
  Search,
  Code,
  Palette,
  RefreshCw,
  Calculator,
  Wrench,
  Combine,
  Scissors,
  FileSearch,
  Bot,
  Lock,
  Zap,
  Globe,
  FileType,
  UserCheck,
  ImageIcon,
  LayoutGrid,
  Presentation,
  FileSpreadsheet,
  QrCode,
  CaseSensitive,
  LucideIcon,
} from "lucide-react";

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: "pdf" | "image" | "converters" | "calculators" | "utilities" | "dev" | "ai" | "text";
  href: string;
  icon: LucideIcon;
  isPopular?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  badge?: string;
  gradient?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All Tools", icon: Sparkles },
  { id: "pdf", name: "PDF Tools", icon: FileText },
  { id: "image", name: "Image Studio", icon: Crop },
  { id: "converters", name: "Converters", icon: RefreshCw },
  { id: "calculators", name: "Calculators", icon: Calculator },
  { id: "utilities", name: "Utilities", icon: Wrench },
  { id: "dev", name: "Developer", icon: Code },
  { id: "ai", name: "AI Tools", icon: Bot },
  { id: "text", name: "Text Tools", icon: Type },
];

export const ALL_TOOLS: ToolItem[] = [
  // --- Featured High Intent Traffic ---
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG / PNG Converter",
    description: "Convert Apple iPhone HEIC/HEIF photos to JPG or PNG format instantly in your browser.",
    category: "converters",
    href: "/tools/heic-to-jpg",
    icon: FileType,
    isPopular: true,
    badge: "US POPULAR",
    gradient: "from-blue-500/10 to-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "govt-job-photo-resizer",
    name: "Govt Exam Photo & Signature Resizer",
    description: "Resize photos & signatures by exact KB limits and dimensions for SSC, UPSC, MPSC & Banking forms.",
    category: "image",
    href: "/tools/govt-job-photo-resizer",
    icon: UserCheck,
    isPopular: true,
    isTrending: true,
    badge: "EXAM TOOL",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "pdf-compressor",
    name: "Target Size PDF Compressor",
    description: "Compress PDFs to exact target KB limits directly inside browser RAM without remote server uploads.",
    category: "pdf",
    href: "/tools/pdf-compressor",
    icon: FileText,
    isPopular: true,
    badge: "KB Optimizer",
    gradient: "from-emerald-500/10 to-cyan-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "pdf-merge",
    name: "Merge PDF Suite",
    description: "Combine multiple PDF documents into one organized file with custom sequence ordering.",
    category: "pdf",
    href: "/tools/pdf-merge",
    icon: Combine,
    isPopular: true,
    badge: "Most Used",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
  },

  // --- Image Studio Suite ---
  {
    id: "image-compressor",
    name: "Target Size Image Compressor",
    description: "Compress JPG, PNG, and WebP assets to exact KB targets using client-side image quantization.",
    category: "image",
    href: "/tools/image-compressor",
    icon: Crop,
    isPopular: true,
    badge: "Batch Mode",
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400",
  },
  {
    id: "image-crop",
    name: "Photo Editor & Aspect Cropper",
    description: "Crop photos, adjust passport dimensions, apply brightness filters, and export high-res files.",
    category: "image",
    href: "/tools/image-crop",
    icon: Crop,
    badge: "Studio Suite",
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400",
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Convert heavy or transparent PNG files into lightweight JPGs over an opaque white canvas.",
    category: "converters",
    href: "/tools/png-to-jpg",
    icon: ImageIcon,
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400",
  },

  // --- Document Converters: To PDF ---
  {
    id: "word-to-pdf",
    name: "Word to PDF Converter",
    description: "Convert Microsoft Word (.docx) documents into clean vector PDFs with locked formatting.",
    category: "converters",
    href: "/tools/word-to-pdf",
    icon: FileText,
    isPopular: true,
    gradient: "from-blue-500/10 to-emerald-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG / Image to PDF",
    description: "Transform scans, gallery photos, and graphics into a single unified multi-page PDF document.",
    category: "converters",
    href: "/tools/jpg-to-pdf",
    icon: RefreshCw,
    badge: "Multi-Image",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert presentation slide decks (.pptx) into standardized landscape PDF files.",
    category: "converters",
    href: "/tools/powerpoint-to-pdf",
    icon: Presentation,
    gradient: "from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-400",
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert spreadsheet workbooks (.xlsx) into printable tabular PDF sheets.",
    category: "converters",
    href: "/tools/excel-to-pdf",
    icon: FileSpreadsheet,
    gradient: "from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "html-to-pdf",
    name: "HTML to PDF Converter",
    description: "Render HTML code or web page markups into downloadable vector PDF files.",
    category: "converters",
    href: "/tools/html-to-pdf",
    icon: Globe,
    gradient: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400",
  },

  // --- Document Converters: From PDF ---
  {
    id: "pdf-to-word",
    name: "PDF to Word Converter",
    description: "Extract text content and layout structures from PDF files into editable .docx documents.",
    category: "converters",
    href: "/tools/pdf-to-word",
    icon: FileText,
    isPopular: true,
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image (JPG)",
    description: "Extract and render each PDF page into high-resolution JPG images with retina clarity.",
    category: "converters",
    href: "/tools/pdf-to-image",
    icon: ImageIcon,
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint (.pptx)",
    description: "Convert PDF documents into editable 16:9 widescreen presentation slide decks.",
    category: "converters",
    href: "/tools/pdf-to-powerpoint",
    icon: Presentation,
    gradient: "from-red-500/10 to-orange-500/10 border-red-500/30 text-red-400",
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel (.xlsx)",
    description: "Extract tables and financial statements from PDF files directly into Excel workbooks.",
    category: "converters",
    href: "/tools/pdf-to-excel",
    icon: FileSpreadsheet,
    gradient: "from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400",
  },
  {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A Converter",
    description: "Convert standard PDF documents into ISO-compliant long-term legal archival format.",
    category: "pdf",
    href: "/tools/pdf-to-pdfa",
    icon: FileText,
    gradient: "from-slate-500/10 to-zinc-500/10 border-slate-500/30 text-slate-300",
  },

  // --- PDF Manipulation Tools ---
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Extract specific individual pages or custom page ranges from multi-page documents.",
    category: "pdf",
    href: "/tools/pdf-split",
    icon: Scissors,
    gradient: "from-purple-500/10 to-indigo-500/10 border-purple-500/30 text-purple-400",
  },
  {
    id: "pdf-organize",
    name: "Organize PDF Pages",
    description: "Rotate sideways pages, reorder sequential sheets, or delete unwanted pages.",
    category: "pdf",
    href: "/tools/pdf-organize",
    icon: LayoutGrid,
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "pdf-protect",
    name: "Protect PDF",
    description: "Encrypt and lock your sensitive PDF documents with custom 256-bit password protection.",
    category: "pdf",
    href: "/tools/pdf-protect",
    icon: Lock,
    gradient: "from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-400",
  },

  // --- Utilities & Calculators ---
  {
    id: "qr-code-generator",
    name: "Vector QR Code Generator",
    description: "Generate high-resolution PNG & SVG QR codes for URLs, text, and Wi-Fi networks.",
    category: "utilities",
    href: "/tools/qr-code-generator",
    icon: QrCode,
    isPopular: true,
    badge: "Vector SVG",
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-400",
  },
  {
    id: "sip-calculator",
    name: "SIP Wealth Calculator",
    description: "Calculate expected mutual fund returns, compound interest growth, and final maturity corpus.",
    category: "calculators",
    href: "/tools/sip-calculator",
    icon: Calculator,
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate exam scores, retail discounts, markups, and percentage differences instantly.",
    category: "calculators",
    href: "/tools/percentage-calculator",
    icon: Calculator,
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "text-case-converter",
    name: "Text Case Converter & Counter",
    description: "Analyze word count, reading time, and switch between UPPERCASE, lowercase, and Title Case.",
    category: "text",
    href: "/tools/text-case-converter",
    icon: CaseSensitive,
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400",
  },
];