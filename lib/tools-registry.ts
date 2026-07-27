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
  Stamp,
  Zap,
  Globe,
  Sliders,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  icon: LucideIcon;
  isPopular?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  badge?: string;
  gradient: string;
}

export const CATEGORIES = [
  { id: "all", name: "All Tools", icon: Sparkles },
  { id: "pdf", name: "PDF Tools", icon: FileText },
  { id: "image", name: "Image Studio", icon: Crop },
  { id: "ai", name: "AI Tools", icon: Bot },
  { id: "text", name: "Text Tools", icon: Type },
  { id: "seo", name: "SEO Tools", icon: Search },
  { id: "dev", name: "Developer", icon: Code },
  { id: "color", name: "Color Tools", icon: Palette },
  { id: "converters", name: "Converters", icon: RefreshCw },
  { id: "calculators", name: "Calculators", icon: Calculator },
  { id: "utilities", name: "Utilities", icon: Wrench },
];

export const ALL_TOOLS: ToolItem[] = [
 {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert single or multiple JPG, PNG, WEBP images into a clean, combined PDF document.",
    category: "converters",
    href: "/tools/image-to-pdf",
    icon: RefreshCw,
    isPopular: true,
    badge: "Multi-Image",
    gradient: "from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
   {
    id: "pdf-merge",
    name: "Merge PDF Suite",
    description: "Combine multiple PDF documents into one organized file with page reordering & rotation.",
    category: "pdf",
    href: "/tools/pdf-merge",
    icon: Combine,
    isPopular: true,
    isTrending: true,
    badge: "Most Used",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: "pdf-compressor",
    name: "Target Size PDF Compressor",
    description: "Compress PDFs to exact KB or MB limits for job portals and official submissions.",
    category: "pdf",
    href: "/tools/pdf-compressor",
    icon: FileText,
    isPopular: true,
    isNew: true,
    badge: "11zon KB Mode",
    gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
 {
  id: "image-compressor",
  name: "Target Size Image Compressor",
  description: "Compress JPG, PNG, and WEBP images to an exact target KB limit instantly.",
  category: "image",
  href: "/tools/image-compressor",
  icon: Crop, // Lucide icon import karein
  isPopular: true,
  badge: "Batch Mode",
  gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
},
 {
    id: "image-studio",
    name: "Image Studio & Passport Creator",
    description: "Interactive cropping, standard passport presets, contrast/brightness filters, and canvas rotation.",
    category: "image",
    href: "/tools/image-crop",
    icon: Crop,
    isPopular: true,
    badge: "Studio Suite",
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator & Scanner",
    description: "Create customizable QR codes for links, Wi-Fi, text, and UPI payments with custom colors and logo support.",
    category: "utilities",
    href: "/tools/qr-code-generator",
    icon: Sparkles,
    isPopular: true,
    badge: "Custom Logo",
    gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: "text-converter",
    name: "Word Counter & Text Case Converter",
    description: "Analyze word count, reading time, and instantly convert text between Uppercase, Title Case, CamelCase, and clean spaces.",
    category: "text",
    href: "/tools/text-converter",
    icon: Type,
    isPopular: true,
    badge: "Smart Stats",
    gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: "ai-summarizer",
    name: "AI Document Summarizer",
    description: "Extract high-yield key takeaways and executive summaries from lengthy documents.",
    category: "ai",
    href: "/tools/pdf-merge",
    icon: Bot,
    isNew: true,
    badge: "GPT-4o Powered",
    gradient: "from-violet-500/10 to-indigo-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
  },
  {
    id: "ocr-pdf",
    name: "OCR Searchable PDF Converter",
    description: "Convert scanned PDF pages into selectable, searchable, and copyable text.",
    category: "pdf",
    href: "/tools/pdf-merge",
    icon: FileSearch,
    isTrending: true,
    gradient: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
  {
    id: "protect-pdf",
    name: "PDF Lock & Encryption",
    description: "Set 256-bit user passwords and restriction flags to secure confidential documents.",
    category: "pdf",
    href: "/tools/pdf-merge",
    icon: Lock,
    gradient: "from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
  },
  {
    id: "svg-optimizer",
    name: "SVG Vector Optimizer",
    description: "Clean up unwanted code tags, minify SVG paths, and shrink vector file size.",
    category: "dev",
    href: "/tools/image-crop",
    icon: Code,
    gradient: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "html-pdf",
    name: "Webpage to PDF Renderer",
    description: "Render live Web URLs or raw HTML code snippets into downloadable vector PDFs.",
    category: "converters",
    href: "/tools/pdf-merge",
    icon: Globe,
    gradient: "from-sky-500/10 to-indigo-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400",
  },
  
];