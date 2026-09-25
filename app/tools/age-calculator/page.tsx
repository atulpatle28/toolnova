import { AgeCalculatorTool } from "@/app/components/ToolComponents";
import Link from "next/link";
import { 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export const metadata = {
  title: "Age Calculator Online - Accurate Age in Years, Months, Days | ToolKraft",
  description:
    "Calculate your exact chronological age in years, months, weeks, days, hours, and minutes. Free, instant, and private online age calculation tool.",
  keywords: [
    "age calculator",
    "calculate age online",
    "exact age finder",
    "chronological age calculator",
    "date of birth calculator",
    "government job age eligibility calculator",
  ],
};

export default function Page() {
  return (
    <div className="space-y-12">
      {/* Interactive Tool Component */}
      <section>
        <AgeCalculatorTool />
      </section>

      {/* SEO & AdSense Compliant Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 text-slate-300">
        
        {/* Intro Section */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
            Accurate Chronological Age Calculator
          </h2>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Determining your precise age down to the exact day, month, and year is essential for various official and personal procedures. Whether you are filling out government competitive examination applications, verifying age eligibility criteria for recruitment drives, calculating retirement benefits, or tracking personal development milestones, our **ToolKraft Age Calculator** delivers verified and instantaneous results without tracking or storing your personal details.
          </p>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Many manual age calculations lead to discrepancies due to varying month lengths and leap years. Our tool uses precise calendar algorithms to account for 365-day normal years, 366-day leap years, and dynamic monthly boundaries, ensuring zero mathematical errors in your official documentation.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            How to Use the Online Age Calculator
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Select Date of Birth</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your exact day, month, and year of birth using the built-in calendar picker.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Target Date (Optional)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                By default, it computes age as of today. You can select an eligibility cut-off date if required.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Instant Breakdown</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive the detailed chronological breakdown in complete years, months, days, and total hours instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Practical Applications / Use Cases */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Common Use Cases for Precise Age Verification
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Competitive Government Examinations:</strong> State PSC, SSC, UPSC, Banking, and Railway recruitment portals impose strict cut-off dates where candidates must verify their minimum and maximum age limit down to the exact day.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Legal & Documentation Requirements:</strong> Used for passport issuance, voter identity registration, driving license applications, and marriage registration certifications.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-200">Retirement & Pension Audits:</strong> Superannuation dates in public and corporate sectors depend on precise chronological age calculation formulas.
              </span>
            </li>
          </ul>
        </div>

        {/* Privacy & Browser Execution */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            100% Client-Side Computation & Data Privacy
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Unlike many online converters and web utilities that upload user data to third-party tracking servers, ToolKraft runs its algorithmic calculations directly inside your web browser. Your date of birth is neither recorded, transmitted, nor stored in any remote database, preserving complete privacy.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                How does this tool handle leap years and February 29 birthdays?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                The algorithm automatically accounts for Gregorian calendar leap years. If you were born on February 29, the calculator tracks elapsed 366-day cycles accurately to compute precise annual milestones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Can I calculate my age on a past or future cut-off date?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Yes. By adjusting the target date parameter, you can compute your exact age as on any past date (for historical records) or future date (for exam eligibility cut-offs).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Is this tool free to use for commercial and official checks?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                ToolKraft utilities are 100% free with no usage limitations, hidden subscription fees, or account registration requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Link to Other Utilities */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need to prepare application documents? Check our file utility tools.
          </p>
          <Link
            href="/tools/image-compressor"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Compress Photos for Forms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>
    </div>
  );
}