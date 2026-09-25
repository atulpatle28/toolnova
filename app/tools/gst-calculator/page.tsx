import { GstCalculatorTool } from "@/app/components/ToolComponents";
import Link from "next/link";
import { 
  Receipt, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Percent, 
  Sparkles,
  ArrowRight,
  Calculator,
  FileSpreadsheet
} from "lucide-react";

export const metadata = {
  title: "GST Calculator Online - Exclusive & Inclusive CGST, SGST, IGST Calculator | ToolKraft",
  description:
    "Calculate Goods and Services Tax (GST) online for 5%, 12%, 18%, and 28% slabs. Accurate gross amount, net price, CGST, SGST, and IGST breakdowns for Indian businesses and consumers.",
  keywords: [
    "GST calculator",
    "calculate GST online",
    "GST inclusive calculator",
    "GST exclusive calculator",
    "CGST SGST calculator",
    "reverse GST calculator",
    "GST rates India",
  ],
};

export default function Page() {
  return (
    <div className="space-y-12">
      {/* Interactive Tool Component */}
      <section>
        <GstCalculatorTool />
      </section>

      {/* SEO & AdSense Compliant In-Depth Guide Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 text-slate-300">
        
        {/* Intro Section */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
            Online Goods and Services Tax (GST) Calculator
          </h2>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Goods and Services Tax (GST) is a unified, destination-based indirect tax levied on the manufacture, sale, and consumption of goods and services across India. Whether you are a small business owner issuing tax invoices, an accountant preparing monthly GST returns (GSTR-1 and GSTR-3B), or a consumer verifying purchase bills, the **ToolKraft GST Calculator** delivers instant tax splits between Central GST (CGST), State GST (SGST), and Integrated GST (IGST).
          </p>
          <p className="leading-relaxed text-sm sm:text-base text-slate-400">
            Our tool supports both **GST Inclusive** (reverse calculation from gross price to net value) and **GST Exclusive** (adding tax on base price) methods according to standard Central Board of Indirect Taxes and Customs (CBIC) rules.
          </p>
        </div>

        {/* GST Mathematical Formulas */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            GST Calculation Formulas Explained
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-semibold text-emerald-400 text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4" /> 1. GST Exclusive (Add GST)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applied when tax needs to be added onto the base manufacturing or retail price:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 border border-slate-800">
                GST Amount = (Base Price × GST Rate) ÷ 100<br />
                Gross Total = Base Price + GST Amount
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-semibold text-emerald-400 text-sm flex items-center gap-1.5">
                <Percent className="w-4 h-4" /> 2. GST Inclusive (Remove GST)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applied when calculating the exact base cost and embedded tax from a maximum retail price (MRP):
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 border border-slate-800">
                GST Amount = Gross Price - [Gross Price ÷ (1 + GST Rate ÷ 100)]<br />
                Net Base Price = Gross Price - GST Amount
              </div>
            </div>
          </div>
        </div>

        {/* GST Tax Slabs in India Table */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            Standard GST Slabs in India
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-200 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Tax Slab</th>
                  <th className="p-3 font-semibold">Intra-State Split (Inside State)</th>
                  <th className="p-3 font-semibold">Inter-State (Outside State)</th>
                  <th className="p-3 font-semibold">Typical Goods & Services Covered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-400">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 text-emerald-400 font-bold">0% (Nil)</td>
                  <td className="p-3">CGST: 0% | SGST: 0%</td>
                  <td className="p-3">IGST: 0%</td>
                  <td className="p-3">Fresh vegetables, unprocessed milk, eggs, grain essentials</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 text-emerald-400 font-bold">5%</td>
                  <td className="p-3">CGST: 2.5% | SGST: 2.5%</td>
                  <td className="p-3">IGST: 5%</td>
                  <td className="p-3">Packaged food, apparel under ₹1000, life-saving medicines, transport</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 text-emerald-400 font-bold">12%</td>
                  <td className="p-3">CGST: 6% | SGST: 6%</td>
                  <td className="p-3">IGST: 12%</td>
                  <td className="p-3">Processed foods, computers, business class air travel, medical items</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 text-emerald-400 font-bold">18%</td>
                  <td className="p-3">CGST: 9% | SGST: 9%</td>
                  <td className="p-3">IGST: 18%</td>
                  <td className="p-3">IT software services, telecommunications, financial services, consumer tech</td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 text-rose-400 font-bold">28%</td>
                  <td className="p-3">CGST: 14% | SGST: 14%</td>
                  <td className="p-3">IGST: 28%</td>
                  <td className="p-3">Automobiles, luxury items, gaming, aerated drinks, cement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            How to Use the Online GST Calculator
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-semibold text-white text-base">Enter Amount</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type the initial price value (either net cost before tax or total inclusive invoice amount).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-semibold text-white text-base">Select GST Rate</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose the applicable GST slab (5%, 12%, 18%, 28%) or input a customized rate percentage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-semibold text-white text-base">Instant Breakdown</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review the exact net price, gross total, and bifurcated CGST + SGST or full IGST components.
              </p>
            </div>
          </div>
        </div>

        {/* Difference Between CGST, SGST, and IGST */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Understanding CGST, SGST, and IGST
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span>
                <strong className="text-slate-200">CGST (Central GST) & SGST (State GST):</strong> Levied on intra-state transactions (when seller and buyer reside within the same state). The tax amount is shared equally between the Central and State governments (e.g., an 18% slab splits into 9% CGST and 9% SGST).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-bold">•</span>
              <span>
                <strong className="text-slate-200">IGST (Integrated GST):</strong> Levied on inter-state transactions (trade between two different states or imports into India). The full tax percentage is collected directly by the Central Government and redistributed accordingly.
              </span>
            </li>
          </ul>
        </div>

        {/* Privacy & Client-Side Calculation */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Zero-Server Computation & Financial Privacy
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            All invoice amounts, percentages, and reverse deductions calculate directly inside your local web browser engine. ToolKraft does not transmit, store, or log your turnover figures, billing records, or tax calculations to any third-party servers.
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
                How do I calculate base price from a GST-inclusive invoice amount?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Select the &quot;GST Inclusive&quot; option and input your total bill value along with the applicable tax rate. The calculator uses reverse formulas to extract the net pre-tax price and isolated GST amount automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Is GST applicable on all goods and services in India?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Most goods and services are covered under standard GST slabs. However, petroleum crude, motor spirit (petrol), high-speed diesel, aviation turbine fuel, natural gas, and alcohol for human consumption remain outside the GST framework and are subject to state excise and VAT.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
              <h4 className="font-semibold text-white text-sm">
                Can I export GST computation tables into a PDF or spreadsheet?
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Yes. If you maintain multiple billing entries in spreadsheet format, you can convert them directly using our Excel to PDF utility for client presentations or audit records.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Tool Link */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Need to export financial or tax sheets into printable formats?
          </p>
          <Link
            href="/tools/excel-to-pdf"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel to PDF Converter <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>
    </div>
  );
}