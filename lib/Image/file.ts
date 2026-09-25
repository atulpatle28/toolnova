export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/svg+xml",
] as const;

export type SupportedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

const FILE_EXTENSION_FALLBACK: Record<string, SupportedImageType> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  svg: "image/svg+xml",
};

/**
 * Validates file support using both MIME type and filename extension fallback
 * (Crucial for iOS Safari HEIC uploads where `file.type` is often blank).
 */
export function isSupportedImage(file: File): boolean {
  if (!file) return false;

  // 1. Direct MIME type match
  if (ACCEPTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
    return true;
  }

  // 2. Extension fallback
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return Boolean(FILE_EXTENSION_FALLBACK[extension]);
}

/**
 * Resolves a normalized MIME type even if the browser leaves `file.type` empty.
 */
export function getImageMimeType(file: File): string {
  if (file.type) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return FILE_EXTENSION_FALLBACK[extension] || "application/octet-stream";
}

/**
 * Allocates a client-side in-memory Blob URL for direct DOM rasterization.
 */
export function createImageUrl(file: Blob | File): string {
  if (typeof window === "undefined" || !file) return "";
  return URL.createObjectURL(file);
}

/**
 * Safely revokes allocated memory pointers.
 */
export function revokeImageUrl(url: string | null | undefined): void {
  if (typeof window === "undefined" || !url) return;
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}