"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";

export default function PercentageCalculatorPage() {
  const [percent, setPercent] = useState<string>("");
  const [baseNumber, setBaseNumber] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(percent);
    const n = parseFloat(baseNumber);

    if (isNaN(p) || isNaN(n)) return;
    setResult(parseFloat(((p / 100) * n).toFixed(2)));
  };

  const reset = () => {
    setPercent("");
    setBaseNumber("");
    setResult(null);
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
                <CardTitle>Percentage Calculator</CardTitle>
                <CardDescription>
                  Find the percentage of any number quickly and accurately.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={calculate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="percent">What is (%)</Label>
                  <Input
                    id="percent"
                    type="number"
                    placeholder="e.g. 20"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    step="any"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base">Of Number</Label>
                  <Input
                    id="base"
                    type="number"
                    placeholder="e.g. 500"
                    value={baseNumber}
                    onChange={(e) => setBaseNumber(e.target.value)}
                    step="any"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="default" className="flex-1">
                  Calculate
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {result !== null && (
              <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-center">
                <p className="text-xs text-slate-400">
                  {percent}% of {baseNumber} is
                </p>
                <p className="text-3xl font-extrabold text-emerald-400 mt-1">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}