"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, RotateCcw } from "lucide-react";

export default function BmiCalculatorPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBmi = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (!w || !h || h <= 0) return;

    const val = parseFloat((w / (h * h)).toFixed(1));
    setBmi(val);

    if (val < 18.5) setCategory("Underweight");
    else if (val < 25) setCategory("Normal weight");
    else if (val < 30) setCategory("Overweight");
    else setCategory("Obese");
  };

  const reset = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setCategory("");
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
                <CardTitle>BMI Calculator</CardTitle>
                <CardDescription>
                  Calculate Body Mass Index (BMI) and health category instantly.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={calculateBmi} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="default" className="flex-1">
                  Calculate BMI
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {bmi !== null && (
              <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-center space-y-1">
                <p className="text-xs text-slate-400">Your BMI Score</p>
                <p className="text-3xl font-extrabold text-emerald-400">{bmi}</p>
                <p className="text-sm font-semibold text-slate-200">
                  Status: <span className="text-emerald-400">{category}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}