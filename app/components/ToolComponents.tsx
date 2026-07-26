"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import { ToolLayout } from "./ToolLayout";

function InputField({
  label,
  value,
  onChange,
  type = "number",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none ring-0"
      />
    </label>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export function AgeCalculatorTool() {
  const [dateOfBirth, setDateOfBirth] = useState("1995-06-12");
  const [comparisonDate, setComparisonDate] = useState(new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const birth = new Date(dateOfBirth);
    const end = new Date(comparisonDate);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }

    const diff = end.getTime() - birth.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

    return { years, months, days };
  }, [dateOfBirth, comparisonDate]);

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate age in years, months and days with precision for birthdays, anniversaries or planning milestones."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
          <InputField label="As of date" value={comparisonDate} onChange={setComparisonDate} type="date" />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="Years" value={`${result.years}`} />
              <ResultCard label="Months" value={`${result.months}`} />
              <ResultCard label="Days" value={`${result.days}`} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid dates to calculate age.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("10");
  const [tenure, setTenure] = useState("12");

  const result = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate) / 100 / 12;
    const n = Number(tenure);

    if (p <= 0 || r <= 0 || n <= 0) {
      return null;
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return {
      emi: emi.toFixed(2),
      total: (emi * n).toFixed(2),
      interest: (emi * n - p).toFixed(2),
    };
  }, [principal, rate, tenure]);

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Plan your loan repayments with a simple monthly EMI estimate and total interest breakdown."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Loan amount" value={principal} onChange={setPrincipal} />
          <InputField label="Annual interest rate (%)" value={rate} onChange={setRate} />
          <InputField label="Tenure (months)" value={tenure} onChange={setTenure} />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="Monthly EMI" value={`₹${result.emi}`} />
              <ResultCard label="Total payable" value={`₹${result.total}`} />
              <ResultCard label="Interest payable" value={`₹${result.interest}`} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid values to calculate EMI.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function GstCalculatorTool() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");

  const result = useMemo(() => {
    const a = Number(amount);
    const r = Number(rate);
    if (a <= 0 || r <= 0) {
      return null;
    }
    const tax = a * (r / 100);
    const total = a + tax;
    return {
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      cgst: (tax / 2).toFixed(2),
      sgst: (tax / 2).toFixed(2),
    };
  }, [amount, rate]);

  return (
    <ToolLayout
      title="GST Calculator"
      description="Calculate GST amounts with accurate total and split values for simple business planning."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Amount" value={amount} onChange={setAmount} />
          <InputField label="GST rate (%)" value={rate} onChange={setRate} />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="GST amount" value={`₹${result.tax}`} />
              <ResultCard label="Total value" value={`₹${result.total}`} />
              <ResultCard label="CGST" value={`₹${result.cgst}`} />
              <ResultCard label="SGST" value={`₹${result.sgst}`} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid values to calculate GST.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function PercentageCalculatorTool() {
  const [value, setValue] = useState("500");
  const [percent, setPercent] = useState("20");

  const result = useMemo(() => {
    const v = Number(value);
    const p = Number(percent);
    if (v <= 0 || p <= 0) {
      return null;
    }
    const answer = (v * p) / 100;
    return { answer: answer.toFixed(2), remainder: (v - answer).toFixed(2) };
  }, [value, percent]);

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Quickly calculate percentages, discounts and share values without manual math."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Base value" value={value} onChange={setValue} />
          <InputField label="Percentage (%)" value={percent} onChange={setPercent} />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="Result" value={`${result.answer}`} />
              <ResultCard label="Remaining value" value={`${result.remainder}`} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid values to calculate percentage.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function BmiCalculatorTool() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");

  const result = useMemo(() => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (w <= 0 || h <= 0) {
      return null;
    }
    const bmi = w / (h * h);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";
    return { bmi: bmi.toFixed(1), category };
  }, [weight, height]);

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Measure body mass index and understand the health range based on weight and height."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Weight (kg)" value={weight} onChange={setWeight} />
          <InputField label="Height (cm)" value={height} onChange={setHeight} />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="BMI" value={`${result.bmi}`} />
              <ResultCard label="Category" value={result.category} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid values to calculate BMI.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function SipCalculatorTool() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const p = Number(monthlyInvestment);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;
    if (p <= 0 || r <= 0 || n <= 0) {
      return null;
    }
    const futureValue = p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    return {
      futureValue: futureValue.toFixed(2),
      invested: (p * n).toFixed(2),
    };
  }, [monthlyInvestment, rate, years]);

  return (
    <ToolLayout
      title="SIP Calculator"
      description="Estimate the future value of your mutual fund SIP investments with monthly contributions."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
          <InputField label="Monthly investment" value={monthlyInvestment} onChange={setMonthlyInvestment} />
          <InputField label="Expected annual return (%)" value={rate} onChange={setRate} />
          <InputField label="Investment period (years)" value={years} onChange={setYears} />
        </div>
        <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-violet-500/20 to-sky-500/20 p-5">
          {result ? (
            <>
              <ResultCard label="Future value" value={`₹${result.futureValue}`} />
              <ResultCard label="Total invested" value={`₹${result.invested}`} />
            </>
          ) : (
            <p className="text-sm text-slate-300">Enter valid values to calculate SIP growth.</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export function ImageCompressorTool() {
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high" | "custom">("medium");
  const [customQuality, setCustomQuality] = useState(82);
  const [results, setResults] = useState<Array<{
    id: string;
    fileName: string;
    originalUrl: string;
    compressedUrl: string;
    originalSize: number;
    compressedSize: number;
    percentageSaved: number;
    previewUrl: string;
    mimeType: string;
    outputName: string;
  }>>([]);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      results.forEach((result) => {
        URL.revokeObjectURL(result.originalUrl);
        URL.revokeObjectURL(result.compressedUrl);
      });
    };
  }, [results]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getQuality = (level: "low" | "medium" | "high" | "custom") => {
    if (level === "low") return 0.9;
    if (level === "medium") return 0.8;
    if (level === "high") return 0.68;
    return Number((customQuality / 100).toFixed(2));
  };

  const getScale = (level: "low" | "medium" | "high" | "custom") => {
    if (level === "low") return 1;
    if (level === "medium") return 0.95;
    if (level === "high") return 0.9;
    return Math.max(0.8, 1 - (customQuality / 100) * 0.18);
  };

  const loadImage = (file: File) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    const img = await loadImage(file);
    const scale = getScale(compressionLevel);
    const targetWidth = Math.max(1, Math.round(img.naturalWidth * scale));
    const targetHeight = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

    const outputMime = file.type.includes("image/png") || file.type.includes("image/webp") ? "image/webp" : "image/jpeg";
    const extension = outputMime === "image/webp" ? "webp" : "jpg";
    const quality = getQuality(compressionLevel);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputMime, quality);
    });

    if (!blob) {
      throw new Error(`Unable to process ${file.name}`);
    }

    const compressedUrl = URL.createObjectURL(blob);
    const originalUrl = URL.createObjectURL(file);
    const percentageSaved = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

    return {
      id: `${file.name}-${blob.size}`,
      fileName: file.name,
      originalUrl,
      compressedUrl,
      originalSize: file.size,
      compressedSize: blob.size,
      percentageSaved,
      previewUrl: compressedUrl,
      mimeType: outputMime,
      outputName: `compressed-${file.name.replace(/\.[^.]+$/, "")}.${extension}`,
    };
  };

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    const files = Array.from(selectedFiles).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;

    setProcessing(true);
    try {
      const processed = await Promise.all(files.map((file) => processFile(file)));
      setResults((previous) => [...processed, ...previous]);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const clearResults = () => {
    results.forEach((result) => {
      URL.revokeObjectURL(result.originalUrl);
      URL.revokeObjectURL(result.compressedUrl);
    });
    setResults([]);
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress images quickly in your browser with premium presets, smart quality controls and instant previews."
    >
      <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`rounded-[1.25rem] border border-dashed p-6 text-center transition ${isDragging ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-slate-950/50"}`}
        >
          <p className="text-lg font-semibold text-white">Drop JPG, PNG or WEBP files here</p>
          <p className="mt-2 text-sm text-slate-400">Batch compress multiple images in seconds without uploading them anywhere.</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
            Choose images
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} className="hidden" />
          </label>
        </div>

        <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Compression controls</p>
            <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
              {processing ? "Processing…" : "Ready"}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {(["low", "medium", "high", "custom"] as const).map((level) => (
              <button key={level} onClick={() => setCompressionLevel(level)} className={`rounded-2xl border px-3 py-3 text-sm capitalize ${compressionLevel === level ? "border-violet-400 bg-violet-500/20 text-violet-100" : "border-white/10 bg-white/10 text-slate-200"}`}>
                {level === "custom" ? "Custom" : level}
              </button>
            ))}
          </div>

          <label className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
            <span>Custom quality {customQuality}%</span>
            <input type="range" min="1" max="100" value={customQuality} onChange={(event) => setCustomQuality(Number(event.target.value))} className="accent-violet-500" />
          </label>

          <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
            Recommended setting: medium for everyday sharing, high for tighter size savings, and custom when you need full control.
          </div>
        </div>

        {results.length ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Compressed files</p>
              <button onClick={clearResults} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                Clear all
              </button>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((result) => (
                <div key={result.id} className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{result.fileName}</p>
                      <p className="text-sm text-slate-400">Saved {result.percentageSaved}%</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                      {formatBytes(result.compressedSize)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                      <p className="text-slate-400">Original</p>
                      <p className="mt-1 font-semibold text-white">{formatBytes(result.originalSize)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                      <p className="text-slate-400">Compressed</p>
                      <p className="mt-1 font-semibold text-white">{formatBytes(result.compressedSize)}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">Before</p>
                      <img src={result.originalUrl} alt={`Original ${result.fileName}`} className="h-40 w-full rounded-xl object-contain" />
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">After</p>
                      <img src={result.previewUrl} alt={`Compressed ${result.fileName}`} className="h-40 w-full rounded-xl object-contain" />
                    </div>
                  </div>

                  <a href={result.compressedUrl} download={result.outputName} className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
                    Download compressed image
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}

export function ImageResizerTool() {
  const [fileName, setFileName] = useState("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalDataUrl, setOriginalDataUrl] = useState("");
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalMeta, setOriginalMeta] = useState({ width: 0, height: 0, type: "", size: 0 });
  const [resizeUnit, setResizeUnit] = useState<"px" | "mm" | "cm" | "in" | "%">("px");
  const [widthValue, setWidthValue] = useState("1200");
  const [heightValue, setHeightValue] = useState("800");
  const [pixelWidth, setPixelWidth] = useState(1200);
  const [pixelHeight, setPixelHeight] = useState(800);
  const [lockAspect, setLockAspect] = useState(true);
  const [dpi, setDpi] = useState("300");
  const [quality, setQuality] = useState("0.95");
  const [outputFormat, setOutputFormat] = useState<"jpg" | "png" | "webp">("png");
  const [previewDataUrl, setPreviewDataUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [outputSize, setOutputSize] = useState(0);
  const [compareValue, setCompareValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [printWidth, setPrintWidth] = useState("10");
  const [printHeight, setPrintHeight] = useState("15");
  const [printUnit, setPrintUnit] = useState<"mm" | "cm" | "in">("cm");

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const pxToUnit = (px: number, unit: "px" | "mm" | "cm" | "in" | "%") => {
    if (unit === "px") return px;
    if (unit === "%") return 100;
    const dpiValue = Number(dpi) || 300;
    if (unit === "mm") return (px * 25.4) / dpiValue;
    if (unit === "cm") return (px * 25.4) / dpiValue / 10;
    return px / dpiValue;
  };

  const unitToPx = (value: number, unit: "px" | "mm" | "cm" | "in" | "%") => {
    if (unit === "px") return value;
    if (unit === "%") return (value / 100) * (originalMeta.width || 1);
    const dpiValue = Number(dpi) || 300;
    if (unit === "mm") return (value * dpiValue) / 25.4;
    if (unit === "cm") return (value * dpiValue * 10) / 25.4;
    return value * dpiValue;
  };

  const applyPreset = (preset: { width: number; height: number; unit?: "px" | "mm" | "cm" | "in" }) => {
    const nextUnit = preset.unit || "px";
    const nextWidth = preset.width;
    const nextHeight = preset.height;
    const widthPx = unitToPx(nextWidth, nextUnit);
    const heightPx = unitToPx(nextHeight, nextUnit);
    setResizeUnit(nextUnit);
    setWidthValue(String(nextWidth));
    setHeightValue(String(nextHeight));
    setPixelWidth(Math.round(widthPx));
    setPixelHeight(Math.round(heightPx));
  };

  useEffect(() => {
    if (!sourceImage) return;

    const canvas = document.createElement("canvas");
    const nextWidth = Math.max(1, Math.round(pixelWidth));
    const nextHeight = Math.max(1, Math.round(pixelHeight));
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(sourceImage, 0, 0, nextWidth, nextHeight);

    const mimeType = outputFormat === "jpg" ? "image/jpeg" : outputFormat === "webp" ? "image/webp" : "image/png";
    const qualityValue = outputFormat === "png" ? undefined : Number(quality);
    const previewUrl = canvas.toDataURL(mimeType, qualityValue);
    setPreviewDataUrl(previewUrl);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setOutputSize(blob.size);
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(URL.createObjectURL(blob));
      },
      mimeType,
      qualityValue
    );
  }, [sourceImage, pixelWidth, pixelHeight, quality, outputFormat, downloadUrl]);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const loadFile = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = document.createElement("img");
      img.onload = () => {
        setOriginalDataUrl(dataUrl);
        setSourceImage(img);
        setOriginalMeta({ width: img.naturalWidth, height: img.naturalHeight, type: file.type, size: file.size });
        setPixelWidth(img.naturalWidth);
        setPixelHeight(img.naturalHeight);
        setWidthValue(String(img.naturalWidth));
        setHeightValue(String(img.naturalHeight));
        setResizeUnit("px");
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (target: "width" | "height", value: string) => {
    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) return;
    if (target === "width") {
      setWidthValue(value);
      const widthPx = Math.max(1, Math.round(unitToPx(nextValue, resizeUnit)));
      setPixelWidth(widthPx);
      if (lockAspect) {
        const ratio = originalMeta.width ? originalMeta.width / originalMeta.height : 1;
        const nextHeight = Math.max(1, Math.round(widthPx / ratio));
        setPixelHeight(nextHeight);
        setHeightValue(String(pxToUnit(nextHeight, resizeUnit).toFixed(2).replace(/\.00$/, "")));
      }
    } else {
      setHeightValue(value);
      const heightPx = Math.max(1, Math.round(unitToPx(nextValue, resizeUnit)));
      setPixelHeight(heightPx);
      if (lockAspect) {
        const ratio = originalMeta.width ? originalMeta.width / originalMeta.height : 1;
        const nextWidth = Math.max(1, Math.round(heightPx * ratio));
        setPixelWidth(nextWidth);
        setWidthValue(String(pxToUnit(nextWidth, resizeUnit).toFixed(2).replace(/\.00$/, "")));
      }
    }
  };

  const handleUnitChange = (nextUnit: "px" | "mm" | "cm" | "in" | "%") => {
    setResizeUnit(nextUnit);
    setWidthValue(String(pxToUnit(pixelWidth, nextUnit).toFixed(2).replace(/\.00$/, "")));
    setHeightValue(String(pxToUnit(pixelHeight, nextUnit).toFixed(2).replace(/\.00$/, "")));
  };

  const currentPrintWidthPx = Math.max(1, Math.round(unitToPx(Number(printWidth), printUnit)));
  const currentPrintHeightPx = Math.max(1, Math.round(unitToPx(Number(printHeight), printUnit)));

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images professionally with presets, DPI controls, print sizing, before-and-after preview and multi-format export."
    >
      <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            loadFile(event.dataTransfer.files?.[0] || null);
          }}
          className={`rounded-[1.25rem] border border-dashed p-6 text-center transition ${isDragging ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-slate-950/50"}`}
        >
          <p className="text-lg font-semibold text-white">Drag and drop an image here</p>
          <p className="mt-2 text-sm text-slate-400">or browse from your device to start resizing instantly.</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
            Browse image
            <input type="file" accept="image/*" onChange={(event) => loadFile(event.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>

        {originalDataUrl ? (
          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Original image</p>
                    <p className="mt-1 text-sm text-slate-300">{fileName}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                    {originalMeta.width} × {originalMeta.height}px
                  </div>
                </div>
                <img src={originalDataUrl} alt="Original preview" className="mt-4 max-h-72 w-full rounded-2xl object-contain" />
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                    <p className="text-slate-400">File type</p>
                    <p className="mt-1 font-medium text-white">{originalMeta.type || "Unknown"}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                    <p className="text-slate-400">Original size</p>
                    <p className="mt-1 font-medium text-white">{formatBytes(originalMeta.size)}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                    <p className="text-slate-400">Dimensions</p>
                    <p className="mt-1 font-medium text-white">{originalMeta.width} × {originalMeta.height}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Resize controls</p>
                  <button onClick={() => setLockAspect((value) => !value)} className={`rounded-full px-3 py-2 text-sm ${lockAspect ? "bg-violet-500/20 text-violet-200" : "bg-white/10 text-slate-200"}`}>
                    {lockAspect ? "🔒 Locked" : "🔓 Unlocked"}
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Width</span>
                    <div className="flex gap-2">
                      <input value={widthValue} onChange={(event) => handleInputChange("width", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" />
                      <select value={resizeUnit} onChange={(event) => handleUnitChange(event.target.value as "px" | "mm" | "cm" | "in" | "%") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                        <option value="px">px</option>
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Height</span>
                    <div className="flex gap-2">
                      <input value={heightValue} onChange={(event) => handleInputChange("height", event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" />
                      <select value={resizeUnit} onChange={(event) => handleUnitChange(event.target.value as "px" | "mm" | "cm" | "in" | "%") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                        <option value="px">px</option>
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>DPI</span>
                    <select value={dpi} onChange={(event) => setDpi(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                      {[72, 96, 150, 200, 300, 600].map((option) => (
                        <option key={option} value={option}>{option} DPI</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Quality</span>
                    <input type="range" min="0.1" max="1" step="0.01" value={Number(quality)} onChange={(event) => setQuality(event.target.value)} className="accent-violet-500" />
                    <span className="text-xs text-slate-400">Current: {Number(quality).toFixed(2)}</span>
                  </label>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Presets</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-slate-400">Passport / ID</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "35×45 mm", width: 35, height: 45, unit: "mm" as const },
                          { label: "2×2 inch", width: 2, height: 2, unit: "in" as const },
                          { label: "Indian Passport", width: 35, height: 45, unit: "mm" as const },
                          { label: "Aadhaar", width: 3.5, height: 2.5, unit: "cm" as const },
                          { label: "PAN Card", width: 8.5, height: 5.5, unit: "cm" as const },
                        ].map((preset) => (
                          <button key={preset.label} onClick={() => applyPreset(preset)} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-slate-400">Social media</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Instagram Post", width: 1080, height: 1350, unit: "px" as const },
                          { label: "Instagram Story", width: 1080, height: 1920, unit: "px" as const },
                          { label: "Facebook Cover", width: 820, height: 312, unit: "px" as const },
                          { label: "YouTube Thumbnail", width: 1280, height: 720, unit: "px" as const },
                          { label: "WhatsApp DP", width: 1080, height: 1080, unit: "px" as const },
                        ].map((preset) => (
                          <button key={preset.label} onClick={() => applyPreset(preset)} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Preview</p>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                    {pixelWidth} × {pixelHeight}px
                  </div>
                </div>
                {previewDataUrl ? (
                  <>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                      <img src={previewDataUrl} alt="Resized preview" className="max-h-72 w-full rounded-2xl object-contain" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                        <p className="text-slate-400">Estimated output size</p>
                        <p className="mt-1 font-semibold text-white">{formatBytes(outputSize)}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                        <p className="text-slate-400">Output format</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(["jpg", "png", "webp"] as const).map((format) => (
                            <button key={format} onClick={() => setOutputFormat(format)} className={`rounded-full px-3 py-2 text-sm ${outputFormat === format ? "bg-violet-500/20 text-violet-200" : "bg-slate-900/70 text-slate-200"}`}>
                              {format.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Print size calculator</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input value={printWidth} onChange={(event) => setPrintWidth(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" placeholder="Width" />
                  <input value={printHeight} onChange={(event) => setPrintHeight(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" placeholder="Height" />
                </div>
                <select value={printUnit} onChange={(event) => setPrintUnit(event.target.value as "mm" | "cm" | "in") } className="mt-3 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                  At {dpi} DPI, your image prints at about {currentPrintWidthPx} × {currentPrintHeightPx}px for the selected size.
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Before & After</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                  <input type="range" min="0" max="100" value={compareValue} onChange={(event) => setCompareValue(Number(event.target.value))} className="w-full accent-violet-500" />
                  <div className="relative mt-3 overflow-hidden rounded-2xl">
                    <img src={originalDataUrl} alt="Before contrast" className="w-full rounded-2xl object-contain" />
                    {previewDataUrl ? (
                      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${compareValue}%` }}>
                        <img src={previewDataUrl} alt="After contrast" className="h-full w-full object-contain" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {downloadUrl ? (
                <a href={downloadUrl} download={`resized-${fileName || "image"}.${outputFormat}`} className="inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
                  Download resized image
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}

export function ImageToPdfTool() {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<Array<{
    id: string;
    name: string;
    file: File;
    dataUrl: string;
    pdfDataUrl: string;
    naturalWidth: number;
    naturalHeight: number;
    rotation: number;
    selected: boolean;
  }>>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<"a4" | "a5" | "letter" | "legal" | "custom">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<"none" | "small" | "medium" | "large">("small");
  const [fitMode, setFitMode] = useState<"fit" | "original">("fit");
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
  const [customWidth, setCustomWidth] = useState("210");
  const [customHeight, setCustomHeight] = useState("297");
  const [downloading, setDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const pageSizeLabel = useMemo(() => {
    if (pageSize === "custom") return `Custom ${customWidth} × ${customHeight} mm`;
    return pageSize.toUpperCase();
  }, [pageSize, customWidth, customHeight]);

  const marginValue = useMemo(() => {
    if (margin === "none") return 0;
    if (margin === "small") return 18;
    if (margin === "medium") return 36;
    return 54;
  }, [margin]);

  const getPageDimensionsPt = () => {
    const widths: Record<string, number> = { a4: 595, a5: 420, letter: 612, legal: 612, custom: Number(customWidth) * 2.83464567 };
    const heights: Record<string, number> = { a4: 842, a5: 595, letter: 792, legal: 1008, custom: Number(customHeight) * 2.83464567 };
    const width = widths[pageSize];
    const height = heights[pageSize];
    if (orientation === "landscape") {
      return { width: Math.max(width, height), height: Math.min(width, height) };
    }
    return { width, height };
  };

  const drawPreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { width, height } = getPageDimensionsPt();
    const previewWidth = 760;
    const previewHeight = Math.round((height / width) * previewWidth);
    canvas.width = previewWidth;
    canvas.height = previewHeight;

    context.fillStyle = "#050816";
    context.fillRect(0, 0, previewWidth, previewHeight);
    context.strokeStyle = "rgba(255,255,255,0.2)";
    context.lineWidth = 2;
    context.strokeRect(20, 20, previewWidth - 40, previewHeight - 40);

    if (!images.length) {
      context.fillStyle = "#e2e8f0";
      context.font = "600 24px sans-serif";
      context.fillText("Upload images to preview your PDF", 44, 92);
      context.font = "16px sans-serif";
      context.fillStyle = "#94a3b8";
      context.fillText("Each image will appear on its own page with your selected layout settings.", 44, 130);
      return;
    }

    const firstImage = images[0];
    const img = new Image();
    img.onload = () => {
      const availableWidth = previewWidth - 80 - marginValue * 2;
      const availableHeight = previewHeight - 80 - marginValue * 2;
      const pageAspect = width / height;
      const previewAspect = availableWidth / availableHeight;
      let renderWidth = availableWidth;
      let renderHeight = availableHeight;
      if (fitMode === "fit") {
        const scale = Math.min(availableWidth / img.width, availableHeight / img.height);
        renderWidth = img.width * scale;
        renderHeight = img.height * scale;
      } else {
        const scale = Math.min(1, availableWidth / img.width, availableHeight / img.height);
        renderWidth = img.width * scale;
        renderHeight = img.height * scale;
      }
      const x = (previewWidth - renderWidth) / 2;
      const y = (previewHeight - renderHeight) / 2;
      context.save();
      context.translate(x + renderWidth / 2, y + renderHeight / 2);
      context.rotate((firstImage.rotation * Math.PI) / 180);
      context.drawImage(img, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
      context.restore();
      context.fillStyle = "rgba(2, 6, 23, 0.7)";
      context.fillRect(24, previewHeight - 72, previewWidth - 48, 44);
      context.fillStyle = "#f8fafc";
      context.font = "600 16px sans-serif";
      context.fillText(`${pageSizeLabel} · ${orientation} · ${quality} quality`, 40, previewHeight - 44);
    };
    img.src = firstImage.dataUrl;
  };

  useEffect(() => {
    drawPreview();
  }, [images, pageSize, orientation, margin, fitMode, quality, customWidth, customHeight, marginValue]);

  const readFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const entries = await Promise.all(
      Array.from(files).map(async (file) => {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = dataUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const pdfDataUrl = canvas.toDataURL("image/png");

        return {
          id: `${file.name}-${Math.random().toString(36).slice(2, 10)}`,
          name: file.name,
          file,
          dataUrl,
          pdfDataUrl,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          rotation: 0,
          selected: false,
        };
      })
    );

    setImages((previous) => [...entries, ...previous]);
  };

  const reorderImages = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setImages((previous) => {
      const updated = [...previous];
      const fromIndex = updated.findIndex((item) => item.id === draggedId);
      const toIndex = updated.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return previous;
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setDraggedId(null);
  };

  const rotateImage = (id: string, direction: -1 | 1) => {
    setImages((previous) => previous.map((item) => (item.id === id ? { ...item, rotation: (item.rotation + direction * 90 + 360) % 360 } : item)));
  };

  const deleteSelected = () => {
    setImages((previous) => previous.filter((item) => !item.selected));
  };

  const toggleSelection = (id: string) => {
    setImages((previous) => previous.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const generatePdf = async () => {
    if (!images.length) return;
    setDownloading(true);

    const { width, height } = getPageDimensionsPt();
    const pdf = new jsPDF({ orientation: orientation === "landscape" ? "landscape" : "portrait", unit: "pt", format: [width, height] });
    const pageMargin = marginValue;

    images.forEach((image, index) => {
      if (index > 0) pdf.addPage();

      const img = new Image();
      img.src = image.dataUrl;
      const naturalWidth = img.naturalWidth || image.naturalWidth;
      const naturalHeight = img.naturalHeight || image.naturalHeight;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - pageMargin * 2;
      const maxHeight = pageHeight - pageMargin * 2;
      let drawWidth = naturalWidth;
      let drawHeight = naturalHeight;
      let x = pageMargin;
      let y = pageMargin;

      if (fitMode === "fit") {
        const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
        drawWidth = naturalWidth * scale;
        drawHeight = naturalHeight * scale;
      } else {
        const scale = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);
        drawWidth = naturalWidth * scale;
        drawHeight = naturalHeight * scale;
      }

      x = (pageWidth - drawWidth) / 2;
      y = (pageHeight - drawHeight) / 2;

      pdf.addImage(image.pdfDataUrl, "PNG", x, y, drawWidth, drawHeight, undefined, "FAST");
    });

    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(url);
    setDownloading(false);
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Turn JPG, PNG and WEBP images into a polished downloadable PDF with live preview, rotation, sorting and layout controls."
    >
      <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            readFiles(event.dataTransfer.files);
          }}
          className="rounded-[1.25rem] border border-dashed border-white/10 bg-slate-950/50 p-6 text-center"
        >
          <p className="text-lg font-semibold text-white">Drop images here to build your PDF</p>
          <p className="mt-2 text-sm text-slate-400">Upload one or many JPG, PNG or WEBP files and arrange them in the order you want.</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
            Choose images
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => readFiles(event.target.files)} className="hidden" />
          </label>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Layout controls</p>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  {images.length} {images.length === 1 ? "page" : "pages"}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Page size</span>
                  <select value={pageSize} onChange={(event) => setPageSize(event.target.value as "a4" | "a5" | "letter" | "legal" | "custom") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                    <option value="a4">A4</option>
                    <option value="a5">A5</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Orientation</span>
                  <select value={orientation} onChange={(event) => setOrientation(event.target.value as "portrait" | "landscape") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </label>
              </div>

              {pageSize === "custom" ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Width (mm)</span>
                    <input value={customWidth} onChange={(event) => setCustomWidth(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    <span>Height (mm)</span>
                    <input value={customHeight} onChange={(event) => setCustomHeight(event.target.value)} className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white" />
                  </label>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Margins</span>
                  <select value={margin} onChange={(event) => setMargin(event.target.value as "none" | "small" | "medium" | "large") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                    <option value="none">None</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>Display mode</span>
                  <select value={fitMode} onChange={(event) => setFitMode(event.target.value as "fit" | "original") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                    <option value="fit">Fit to page</option>
                    <option value="original">Original size</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
                <span>PDF quality</span>
                <select value={quality} onChange={(event) => setQuality(event.target.value as "low" | "medium" | "high") } className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Image order</p>
                <div className="flex gap-2">
                  <button onClick={deleteSelected} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Delete selected</button>
                  <button onClick={() => setImages([])} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Clear all</button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {images.map((image) => (
                  <div key={image.id} draggable onDragStart={() => setDraggedId(image.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderImages(image.id)} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={image.selected} onChange={() => toggleSelection(image.id)} className="h-4 w-4 rounded border-white/10 bg-transparent" />
                      <img src={image.dataUrl} alt={image.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{image.name}</p>
                        <p className="text-sm text-slate-400">{image.naturalWidth} × {image.naturalHeight}px</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => rotateImage(image.id, -1)} className="rounded-full border border-white/10 bg-white/10 px-2 py-2 text-sm text-slate-200">↺</button>
                        <button onClick={() => rotateImage(image.id, 1)} className="rounded-full border border-white/10 bg-white/10 px-2 py-2 text-sm text-slate-200">↻</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Live preview</p>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                  {pageSizeLabel}
                </div>
              </div>
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-slate-900/70 p-3">
                <canvas ref={previewCanvasRef} className="w-full rounded-2xl" />
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Ready to export</p>
              <div className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-slate-300">
                <p>Each selected image will be placed on a separate page in the order shown above.</p>
                <p>Use the preview to confirm the page size, margins and fit mode before you download.</p>
              </div>
              <button onClick={generatePdf} className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
                {downloading ? "Preparing PDF…" : "Download PDF"}
              </button>
              {downloadUrl ? (
                <a href={downloadUrl} download="toolnova-images.pdf" className="mt-3 inline-flex rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-200">
                  Open downloaded PDF
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export function PdfMergeTool() {
  const [pdfFiles, setPdfFiles] = useState<Array<{
    id: string;
    name: string;
    file: File;
    pageCount: number;
    selected: boolean;
  }>>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    message: string;
    supportsPasswordEntry: boolean;
    fileIdToRemove?: string;
    fileIndexToRemove?: number;
    onRemove?: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    supportsPasswordEntry: false,
  });

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const closeDialog = () => {
    setDialogState({ open: false, title: "", message: "", supportsPasswordEntry: false });
  };

  const removePdfFromQueue = (id?: string, index?: number) => {
    if (id || typeof index === "number") {
      setPdfFiles((previous) => {
        if (typeof index === "number" && index >= 0 && index < previous.length) {
          const next = [...previous];
          next.splice(index, 1);
          return next;
        }

        if (id) {
          return previous.filter((item) => item.id !== id);
        }

        return previous;
      });
    }
    closeDialog();
  };

  const showDialog = (title: string, message: string, supportsPasswordEntry = false, fileIdToRemove?: string, fileIndexToRemove?: number, onRemove?: () => void) => {
    setDialogState({ open: true, title, message, supportsPasswordEntry, fileIdToRemove, fileIndexToRemove, onRemove });
  };

  const validatePdfFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    try {
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  return pdfDoc.getPageCount();
} catch (error) {
  const message =
    error instanceof Error ? error.message : String(error);

  if (/encrypted|password/i.test(message)) {
    throw new Error("encrypted");
  }

  throw error;
}
  };

  const readFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");

    const validFiles = Array.from(files).filter((file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));
    if (validFiles.length !== files.length) {
      setError("Only PDF files can be merged. Please choose valid PDF documents.");
    }

    const parsedFiles = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const pageCount = await validatePdfFile(file);
          return {
            id: `${file.name}-${Math.random().toString(36).slice(2, 10)}`,
            name: file.name,
            file,
            pageCount,
            selected: false,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const isProtected = /encrypted|password/i.test(message);
          showDialog(
            isProtected ? "Encrypted PDF" : "Unable to open PDF",
            "This PDF is encrypted or password protected and cannot be merged with the current PDF engine.",
            false,
            undefined,
            undefined,
            () => {
              closeDialog();
            }
          );
          return null;
        }
      })
    );

    const usableFiles = parsedFiles.filter((item): item is NonNullable<typeof item> => item !== null);
    setPdfFiles((previous) => [...previous, ...usableFiles]);
  };

  const reorderFiles = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setPdfFiles((previous) => {
      const updated = [...previous];
      const fromIndex = updated.findIndex((item) => item.id === draggedId);
      const toIndex = updated.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return previous;
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    setDraggedId(null);
  };

  const removeSelected = () => {
    setPdfFiles((previous) => previous.filter((item) => !item.selected));
  };

  const removeSinglePdf = (id: string) => {
    setPdfFiles((previous) => previous.filter((item) => item.id !== id));
  };

  const mergePdfFiles = async () => {
    if (!pdfFiles.length) return;
    setMerging(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const entry of pdfFiles) {
        const bytes = await entry.file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      if (mergedPdf.getPageCount() === 0) {
        showDialog("Unable to merge PDFs", "This PDF is encrypted or password protected and cannot be merged with the current PDF engine.", false, undefined, undefined, () => {
          closeDialog();
        });
        return;
      }

      const mergedBytes = await mergedPdf.save();
      const pdfBytes = new Uint8Array(mergedBytes);
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError("The PDFs couldn’t be merged. Please try again with valid documents.");
    } finally {
      setMerging(false);
    }
  };

  const selectAll = () => {
    setPdfFiles((previous) => previous.map((item) => ({ ...item, selected: true })));
  };

  return (
    <ToolLayout
      title="PDF Merge"
      description="Combine multiple PDF documents into one polished file directly in your browser with drag-and-drop ordering, selection controls and instant download."
    >
      {dialogState.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Notice</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{dialogState.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{dialogState.message}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => {
                  closeDialog();
                }}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 font-semibold text-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (dialogState.onRemove) {
                    dialogState.onRemove();
                  } else {
                    removePdfFromQueue(dialogState.fileIdToRemove, dialogState.fileIndexToRemove);
                  }
                }}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-2.5 font-semibold text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            readFiles(event.dataTransfer.files);
          }}
          className={`rounded-[1.25rem] border border-dashed p-6 text-center transition ${isDragging ? "border-violet-400 bg-violet-500/10" : "border-white/10 bg-slate-950/50"}`}
        >
          <p className="text-lg font-semibold text-white">Drop PDF files here</p>
          <p className="mt-2 text-sm text-slate-400">Upload multiple PDFs, arrange them in the order you want and merge them without sending anything to a server.</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
            Browse files
            <input type="file" accept="application/pdf" multiple onChange={(event) => readFiles(event.target.files)} className="hidden" />
          </label>
        </div>

        {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">PDF queue</p>
                <p className="mt-1 text-sm text-slate-400">{pdfFiles.length} document{pdfFiles.length === 1 ? "" : "s"} ready to merge</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={selectAll} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Select all</button>
                <button onClick={removeSelected} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Remove selected</button>
                <button onClick={() => setPdfFiles([])} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">Clear all</button>
              </div>
            </div>

            <div className="space-y-3">
              {pdfFiles.length ? (
                pdfFiles.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedId(item.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => reorderFiles(item.id)}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(item.selected)}
                        onChange={() => {
                          setPdfFiles((previous) => previous.map((entry) => (entry.id === item.id ? { ...entry, selected: !entry.selected } : entry)));
                        }}
                        className="h-4 w-4 rounded border-white/10 bg-transparent"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-sm font-semibold text-violet-200">
                        PDF
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.pageCount} page{item.pageCount === 1 ? "" : "s"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSinglePdf(item.id);
                          }}
                          className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-sm text-slate-200"
                        >
                          ✕
                        </button>
                        <div className="text-sm text-slate-400">↕</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
                  Your merged PDF queue will appear here. Add one or more PDF files to begin.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Merge and download</p>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7 text-slate-300">
              <p>Drag files into the upload area or use Browse files to add PDFs.</p>
              <p>Reorder them by dragging the cards, select any file to remove it, and merge everything into a single document.</p>
              <p>Processing happens locally in your browser, so your files never leave the device.</p>
            </div>

            <button
              onClick={mergePdfFiles}
              disabled={!pdfFiles.length || merging}
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {merging ? "Merging PDFs…" : "Merge PDFs"}
            </button>

            {downloadUrl ? (
              <a href={downloadUrl} download="toolnova-merged.pdf" className="mt-3 inline-flex rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-200">
                Download merged PDF
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("https://toolnova.dev");
  const [imageUrl, setImageUrl] = useState("");

  const generate = async () => {
    const url = await QRCode.toDataURL(text || "ToolNova", { width: 260, margin: 1 });
    setImageUrl(url);
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create attractive QR codes for links, contact details and digital assets."
    >
      <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
        <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white" placeholder="Enter anything to turn into a QR code" />
        <button onClick={generate} className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
          Generate QR code
        </button>
        {imageUrl ? (
          <div className="flex flex-col items-start gap-3">
            <img src={imageUrl} alt="Generated QR code" className="rounded-2xl border border-white/10 bg-white p-3" />
            <a href={imageUrl} download="toolnova-qr.png" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200">
              Download PNG
            </a>
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}

export function TextCaseConverterTool() {
  const [text, setText] = useState("toolnova makes everyday tasks easy");
  const [result, setResult] = useState("");

  const transform = (mode: "upper" | "lower" | "title" | "sentence") => {
    if (!text) return;
    let value = text;
    if (mode === "upper") value = text.toUpperCase();
    if (mode === "lower") value = text.toLowerCase();
    if (mode === "title") value = text.replace(/\b\w/g, (char) => char.toUpperCase());
    if (mode === "sentence") value = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    setResult(value);
  };

  return (
    <ToolLayout
      title="Text Case Converter"
      description="Switch text into upper, lower, title or sentence case in a single step."
    >
      <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
        <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white" />
        <div className="flex flex-wrap gap-2">
          {[
            ["Uppercase", "upper"],
            ["Lowercase", "lower"],
            ["Title Case", "title"],
            ["Sentence Case", "sentence"],
          ].map(([label, mode]) => (
            <button key={mode} onClick={() => transform(mode as "upper" | "lower" | "title" | "sentence")} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">
              {label}
            </button>
          ))}
        </div>
        {result ? <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200">{result}</div> : null}
      </div>
    </ToolLayout>
  );
}

export function UnitConverterTool() {
  const [value, setValue] = useState("1");
  const [result, setResult] = useState("");

  const convert = (unit: "m" | "ft") => {
    const num = Number(value);
    if (Number.isNaN(num)) {
      setResult("Enter a valid number");
      return;
    }
    if (unit === "m") setResult(`${(num * 3.28084).toFixed(2)} ft`);
    if (unit === "ft") setResult(`${(num / 3.28084).toFixed(2)} m`);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between meters and feet in a simple, fast utility."
    >
      <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-900/60 p-5">
        <InputField label="Value" value={value} onChange={setValue} />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => convert("m")} className="rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 font-semibold text-white">
            Convert to feet
          </button>
          <button onClick={() => convert("ft")} className="rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-200">
            Convert to meters
          </button>
        </div>
        {result ? <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200">{result}</div> : null}
      </div>
    </ToolLayout>
  );
}

export function ToolCard({ title, description, href, accent }: { title: string; description: string; href: string; accent: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-violet-400/40">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-xl text-white`}>
        ✦
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-4 text-sm font-medium text-sky-300">Open tool →</div>
    </Link>
  );
}
