"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";

export default function EmiCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [tenureYears, setTenureYears] = useState<string>("");
  const [emi, setEmi] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateEmi = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(tenureYears);

    if (!p || !annualRate || !years) return;

    const r = annualRate / 12 / 100; // monthly rate
    const n = years * 12; // total months

    const emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emiCalc * n;
    const totalInt = totalPay - p;

    setEmi(Math.round(emiCalc));
    setTotalPayment(Math.round(totalPay));
    setTotalInterest(Math.round(totalInt));
  };

  const reset = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenureYears("");
    setEmi(null);
    setTotalPayment(null);
    setTotalInterest(null);
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
                <CardTitle>EMI Calculator</CardTitle>
                <CardDescription>
                  Calculate your monthly loan EMI, interest, and total payable amount.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={calculateEmi} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g. 500000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  min="1000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="e.g. 8.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  step="0.01"
                  min="0.1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  placeholder="e.g. 5"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="default" className="flex-1">
                  Calculate EMI
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {emi !== null && (
              <div className="mt-6 grid grid-cols-3 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-center">
                <div>
                  <p className="text-[11px] text-slate-400">Monthly EMI</p>
                  <p className="text-lg font-bold text-emerald-400">₹{emi.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Interest</p>
                  <p className="text-lg font-bold text-amber-400">₹{totalInterest?.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Total Amount</p>
                  <p className="text-lg font-bold text-blue-400">₹{totalPayment?.toLocaleString("en-IN")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}