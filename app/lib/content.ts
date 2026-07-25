export type ToolEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  slug: string;
  category: string;
};

export type BlogEntry = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
};

const toolAccents = [
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-purple-500",
  "from-sky-500 to-cyan-500",
  "from-blue-500 to-sky-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-violet-500 to-fuchsia-500",
  "from-indigo-500 to-blue-500",
  "from-cyan-500 to-sky-500",
  "from-purple-500 to-violet-500",
  "from-blue-600 to-violet-600",
];

export const defaultTools: ToolEntry[] = [
  { id: "age", title: "Age Calculator", description: "Calculate age in years, months and days quickly.", href: "/tools/age-calculator", accent: toolAccents[0], slug: "age-calculator", category: "Calculators" },
  { id: "emi", title: "EMI Calculator", description: "Estimate monthly EMI and total interest.", href: "/tools/emi-calculator", accent: toolAccents[1], slug: "emi-calculator", category: "Calculators" },
  { id: "gst", title: "GST Calculator", description: "Compute GST, CGST, SGST and overall amount.", href: "/tools/gst-calculator", accent: toolAccents[2], slug: "gst-calculator", category: "Calculators" },
  { id: "percentage", title: "Percentage Calculator", description: "Work out percentage values instantly.", href: "/tools/percentage-calculator", accent: toolAccents[3], slug: "percentage-calculator", category: "Calculators" },
  { id: "bmi", title: "BMI Calculator", description: "Measure BMI with height and weight inputs.", href: "/tools/bmi-calculator", accent: toolAccents[4], slug: "bmi-calculator", category: "Calculators" },
  { id: "sip", title: "SIP Calculator", description: "Plan long-term SIP growth and returns.", href: "/tools/sip-calculator", accent: toolAccents[5], slug: "sip-calculator", category: "Calculators" },
  { id: "compress", title: "Image Compressor", description: "Reduce image size while preserving quality.", href: "/tools/image-compressor", accent: toolAccents[6], slug: "image-compressor", category: "Image Tools" },
  { id: "resize", title: "Image Resizer", description: "Resize images to exact dimensions.", href: "/tools/image-resizer", accent: toolAccents[7], slug: "image-resizer", category: "Image Tools" },
  { id: "pdf", title: "Image to PDF", description: "Convert images into a PDF document.", href: "/tools/image-to-pdf", accent: toolAccents[8], slug: "image-to-pdf", category: "PDF Tools" },
  { id: "merge-pdf", title: "PDF Merge", description: "Combine multiple PDF files in the browser with drag-and-drop ordering.", href: "/tools/pdf-merge", accent: toolAccents[9], slug: "pdf-merge", category: "PDF Tools" },
  { id: "qr", title: "QR Code Generator", description: "Generate shareable QR codes in seconds.", href: "/tools/qr-code-generator", accent: toolAccents[10], slug: "qr-code-generator", category: "Developer Tools" },
  { id: "text", title: "Text Case Converter", description: "Change text into uppercase or title case.", href: "/tools/text-case-converter", accent: toolAccents[10], slug: "text-case-converter", category: "Text Tools" },
  { id: "unit", title: "Unit Converter", description: "Convert meters and feet with a single click.", href: "/tools/unit-converter", accent: toolAccents[11], slug: "unit-converter", category: "Developer Tools" },
];

export const defaultBlogPosts: BlogEntry[] = [
  {
    id: "blog-1",
    title: "How to build a better utility website",
    slug: "build-better-utility-website",
    excerpt: "A quick framework for creating fast, useful and polished online tools.",
    content: "Utility websites grow when each tool solves a clear problem quickly. Focus on accuracy, fast interactions and a clean layout that feels effortless on mobile.",
    category: "Productivity",
    date: "2026-07-25",
  },
  {
    id: "blog-2",
    title: "Why SEO-friendly tools outperform generic content",
    slug: "seo-friendly-tools",
    excerpt: "SEO-friendly tools earn more traffic because they align with intent and provide direct answers.",
    content: "Search engines reward pages that answer user questions clearly. A strong tool page with helpful content, good structure and fast performance will always convert better.",
    category: "SEO",
    date: "2026-07-24",
  },
];

const TOOL_STORAGE_KEY = "toolnova.tools";
const BLOG_STORAGE_KEY = "toolnova.blogs";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadTools(): ToolEntry[] {
  return readStorage<ToolEntry[]>(TOOL_STORAGE_KEY, defaultTools);
}

export function saveTools(tools: ToolEntry[]) {
  writeStorage(TOOL_STORAGE_KEY, tools);
}

export function loadBlogs(): BlogEntry[] {
  return readStorage<BlogEntry[]>(BLOG_STORAGE_KEY, defaultBlogPosts);
}

export function saveBlogs(blogs: BlogEntry[]) {
  writeStorage(BLOG_STORAGE_KEY, blogs);
}

export function getBlogPostBySlug(slug: string): BlogEntry | undefined {
  return loadBlogs().find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogEntry[] {
  const normalized = createSlug(category);
  return loadBlogs().filter((post) => createSlug(post.category) === normalized);
}

export function getBlogCategories(): string[] {
  return Array.from(new Set(loadBlogs().map((post) => post.category)));
}

export function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
