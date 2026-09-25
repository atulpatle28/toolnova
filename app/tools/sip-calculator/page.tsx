"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";

export default function SipCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("");
  const [expectedRate, setExpectedRate] = useState<string>("");
  const [timePeriodYears, setTimePeriodYears] = useState<string>("");

  const [investedAmount, setInvestedAmount] = useState<number | null>(null);
  const [estReturns, setEstReturns] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);

  const calculateSip = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(monthlyInvestment);
    const annualRate = parseFloat(expectedRate);
    const years = parseFloat(timePeriodYears);

    if (!p || !annualRate || !years) return;

    const i = annualRate / 12 / 100; // Monthly interest rate
    const n = years * 12; // Total months

    // Future Value formula for SIP: P * [((1 + i)^n - 1) / i] * (1 + i)
    const total = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = p * n;
    const returns = total - invested;

    setInvestedAmount(Math.round(invested));
    setEstReturns(Math.round(returns));
    setTotalValue(Math.round(total));
  };

  const reset = () => {
    setMonthlyInvestment("");
    setExpectedRate("");
    setTimePeriodYears("");
    setInvestedAmount(null);
    setEstReturns(null);
    setTotalValue(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>SIP Calculator</CardTitle>
                <CardDescription>
                  Calculate wealth creation and compound growth for Mutual Fund SIPs.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={calculateSip} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Investment (₹)</Label>
                <Input
                  id="monthly"
                  type="number"
                  placeholder="e.g. 5000"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  min="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Expected Return Rate (% p.a.)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="e.g. 12"
                  value={expectedRate}
                  onChange={(e) => setExpectedRate(e.target.value)}
                  step="0.1"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Time Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="e.g. 10"
                  value={timePeriodYears}
                  onChange={(e) => setTimePeriodYears(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="default" className="flex-1">
                  Calculate Wealth
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {totalValue !== null && (
              <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-center">
                <div>
                  <p className="text-[11px] text-slate-400">Invested</p>
                  <p className="text-base font-bold text-slate-200">
                    ₹{investedAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Est. Returns</p>
                  <p className="text-base font-bold text-emerald-400">
                    ₹{estReturns?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Value</p>
                  <p className="text-base font-bold text-blue-400">
                    ₹{totalValue?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}