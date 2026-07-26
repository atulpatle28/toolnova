export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function isSupportedImage(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(
    file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
  );
}

export function createImageUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImageUrl(url: string) {
  URL.revokeObjectURL(url);
}