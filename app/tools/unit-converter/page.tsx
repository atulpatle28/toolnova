"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, RotateCcw } from "lucide-react";

export default function UnitConverterPage() {
  const [meters, setMeters] = useState<string>("");
  const [feet, setFeet] = useState<string>("");

  const handleMetersChange = (val: string) => {
    setMeters(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFeet((num * 3.28084).toFixed(3));
    } else {
      setFeet("");
    }
  };

  const handleFeetChange = (val: string) => {
    setFeet(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setMeters((num / 3.28084).toFixed(3));
    } else {
      setMeters("");
    }
  };

  const reset = () => {
    setMeters("");
    setFeet("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <CardTitle>Length Unit Converter</CardTitle>
                <CardDescription>
                  Convert length instantly between Meters and Feet.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="meters">Meters (m)</Label>
                <Input
                  id="meters"
                  type="number"
                  placeholder="e.g. 10"
                  value={meters}
                  onChange={(e) => handleMetersChange(e.target.value)}
                  step="any"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feet">Feet (ft)</Label>
                <Input
                  id="feet"
                  type="number"
                  placeholder="e.g. 32.8"
                  value={feet}
                  onChange={(e) => handleFeetChange(e.target.value)}
                  step="any"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={reset} className="w-full sm:w-auto">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}