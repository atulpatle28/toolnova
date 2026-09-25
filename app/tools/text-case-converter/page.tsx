import { TextCaseConverterTool } from "@/app/components/ToolComponents";
import Link from "next/link";
import {
  Type,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Layers,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Text Case Converter Online - Uppercase, Lowercase, Title Case & CamelCase | ToolKraft",
  description:
    "Free online text case converter. Convert strings to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly in your browser.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case tool",
    "camelCase converter",
    "snake_case generator",
    "string case transformer",
  ],
};

export default function Page() {
  return (
    <div className="space-y-12">
      {/* Interactive Tool Component */}
      <section>
        <TextCaseConverterTool />
      </section>

      {/* SEO & AdSense Compliant In-Depth Guide Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 text-slate-300 font-sans">
        {/* Intro Section */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
            Versatile Online String &amp; Text Case Converter
          </h2>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Accidental Caps Lock activations, inconsistent heading styles in editorial drafts, and disparate variable naming conventions in software development frequently require reformatting text. Manually retyping paragraphs, code snippets, or document headers is slow and prone to typographical errors. The **ToolKraft Text Case Converter** transforms blocks of text across standard grammatical cases and programming naming conventions instantly.
          </p>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            All character code manipulations evaluate strictly inside your browser&apos;s client-side JavaScript execution environment. Your confidential documents, code repositories, and proprietary drafts are processed in memory and never transmitted to external cloud servers.
          </p>
        </div>

        {/* Standard Casing Taxonomy Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Case Styles &amp; Standard Formatting Rules
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
              <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Casing Style</th>
                  <th className="p-3 font-semibold">Transformation Mechanism</th>
                  <th className="p-3 font-semibold">Formatted Output Example</th>
                  <th className="p-3 font-semibold">Primary Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-400">
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">Sentence case</td>
                  <td className="p-3">Capitalizes the first character of each sentence</td>
                  <td className="p-3 font-mono text-emerald-400">The quick brown fox.</td>
                  <td className="p-3">Editorial copy, essays, and standard prose</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">UPPERCASE</td>
                  <td className="p-3">Converts all letters to full capital glyphs</td>
                  <td className="p-3 font-mono text-emerald-400">THE QUICK BROWN FOX</td>
                  <td className="p-3">Warning labels, banners, and SQL keywords</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">lowercase</td>
                  <td className="p-3">Forces every alphabetic character into small letters</td>
                  <td className="p-3 font-mono text-emerald-400">the quick brown fox</td>
                  <td className="p-3">Database normalizations, emails, and URLs</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">Title Case</td>
                  <td className="p-3">Capitalizes the initial letter of every distinct word</td>
                  <td className="p-3 font-mono text-emerald-400">The Quick Brown Fox</td>
                  <td className="p-3">Blog titles, book headers, and formal announcements</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">camelCase</td>
                  <td className="p-3">Lower initial word, capitalized subsequent words</td>
                  <td className="p-3 font-mono text-emerald-400">theQuickBrownFox</td>
                  <td className="p-3">JavaScript, TypeScript, and Java identifiers</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">snake_case</td>
                  <td className="p-3">Replaces whitespace with underscores in lowercase</td>
                  <td className="p-3 font-mono text-emerald-400">the_quick_brown_fox</td>
                  <td className="p-3">Python variables, database column keys</td>
                </tr>
                <tr className="hover:bg-slate-900/60">
                  <td className="p-3 font-medium text-white">kebab-case</td>
                  <td className="p-3">Replaces whitespace with hyphens in lowercase</td>
                  <td className="p-3 font-mono text-emerald-400">the-quick-brown-fox</td>
                  <td className="p-3">CSS class selectors, REST APIs, and URL slugs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            How to Convert Text Case in 3 Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Paste Input Text</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copy and paste your raw text, article draft, or programming strings directly into the workspace editor.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Choose Target Case</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any case button—such as Title Case, UPPERCASE, camelCase, or snake_case—to execute conversion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Copy Formatted Text</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use the one-click copy button to paste the clean, standardized text directly into your project or code editor.
              </p>
            </div>
          </div>
        </div>

        {/* Developer & Editorial Workflows */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            Specialized Transformation Modes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Editorial &amp; Content Publishing
              </h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Quickly fix accidental Caps Lock passages by switching to Sentence case, or standardize title formatting across headlines, newsletter subject lines, and sub-headings using Title Case.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" /> Developer Variable Normalization
              </h4>
              <p className="text-slate-400 leading-relaxed text-xs">
                Refactor identifiers from plain space-delimited text into valid programming identifiers like `camelCase` for TypeScript variables, `snake_case` for database schemas, and `kebab-case` for CSS tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security Callout */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            100% In-Browser Privacy Protection
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Proprietary source code, sensitive manuscripts, and internal business documentation should never be pasted into unvetted online services. ToolKraft processes all string algorithms locally within your device&apos;s browser memory. No text data is logged, tracked, or sent to remote cloud servers.
          </p>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-slate-400">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                What is the difference between Title Case and Capitalized Case?
              </h4>
              <p className="leading-relaxed">
                Capitalized Case uniformly forces the first letter of every single word into uppercase. Title Case follows grammatical styling rules where major words are capitalized while minor articles and prepositions (such as &quot;and&quot;, &quot;in&quot;, &quot;the&quot;, &quot;of&quot;) remain lowercase unless starting a line.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                How does Sentence case handle punctuation and line breaks?
              </h4>
              <p className="leading-relaxed">
                The sentence parser detects period (.), exclamation (!), and question mark (?) delimiters, alongside newline breaks, automatically capitalizing the subsequent alphabetic token while converting intermediate capital letters to lowercase.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm mb-1.5">
                Is there any character limit for text conversion?
              </h4>
              <p className="leading-relaxed">
                No artificial string ceilings are enforced. The client-side parser can handle tens of thousands of characters effortlessly using your local device&apos;s memory.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Utility Link */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need to generate custom vector QR codes for URLs or text strings?
          </p>
          <Link
            href="/tools/qr-code-generator"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            QR Code Generator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}