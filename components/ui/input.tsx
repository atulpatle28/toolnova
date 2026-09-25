"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Inlined Utility (Zero external dependency needed)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-semibold file:text-emerald-400 hover:border-slate-700 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rose-500 aria-invalid:ring-2 aria-invalid:ring-rose-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
export default Input;