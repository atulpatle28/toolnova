/**
 * Triggers a browser download for Data URLs, Object URLs (blob:), or standard binary URLs.
 * Handles DOM safety, mobile browser touch events, and automatic Blob URL memory cleanup.
 */
export function downloadDataUrl(url: string, filename: string): void {
  if (typeof window === "undefined" || !url) return;

  const isBlob = url.startsWith("blob:");
  const link = document.createElement("a");

  link.href = url;
  link.download = filename || "toolkraft-download";
  link.rel = "noopener noreferrer";

  // Prevent UI flashes and layout shifts
  link.style.display = "none";
  link.style.position = "fixed";
  link.style.pointerEvents = "none";

  document.body.appendChild(link);

  // Dispatch mouse event for broader mobile browser compatibility (iOS Safari / Android Chrome)
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  document.body.removeChild(link);

  // Delay revoking Blob URLs to allow asynchronous browser write cycles to complete
  if (isBlob) {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  }
}

export default downloadDataUrl;