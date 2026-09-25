import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!+bytes || bytes < 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function sanitizeFilename(
  filename: string,
  fallback: string = "toolkraft-file"
): string {
  if (!filename) return fallback;
  return (
    filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() || fallback
  );
}

export function triggerFileDownload(url: string, filename: string): void {
  if (typeof window === "undefined" || !url) return;

  const isBlob = url.startsWith("blob:");
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.rel = "noopener noreferrer";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (isBlob) {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  }
}