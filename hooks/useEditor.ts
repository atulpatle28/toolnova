"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface ImageMeta {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
}

export interface UseEditorReturn {
  image: string | null;
  resultImage: string | null;
  loading: boolean;
  meta: ImageMeta | null;
  error: string | null;
  setImage: (url: string | null) => void;
  setResultImage: (url: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadFile: (file: File) => Promise<void>;
  downloadResult: (filename?: string) => void;
  reset: () => void;
}

export function useEditor(): UseEditorReturn {
  const [image, setImageState] = useState<string | null>(null);
  const [resultImage, setResultImageState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ImageMeta | null>(null);

  // Object URLs tracked for automatic garbage-collection cleanup
  const activeBlobUrls = useRef<Set<string>>(new Set());

  const registerBlobUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      activeBlobUrls.current.add(url);
    }
  }, []);

  const revokeBlobUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:") && activeBlobUrls.current.has(url)) {
      URL.revokeObjectURL(url);
      activeBlobUrls.current.delete(url);
    }
  }, []);

  const setImage = useCallback(
    (url: string | null) => {
      setImageState((prev) => {
        if (prev && prev !== url) revokeBlobUrl(prev);
        registerBlobUrl(url);
        return url;
      });
    },
    [revokeBlobUrl, registerBlobUrl]
  );

  const setResultImage = useCallback(
    (url: string | null) => {
      setResultImageState((prev) => {
        if (prev && prev !== url) revokeBlobUrl(prev);
        registerBlobUrl(url);
        return url;
      });
    },
    [revokeBlobUrl, registerBlobUrl]
  );

  // Load image File, measure natural dimensions, and allocate isolated Blob URL
  const loadFile = useCallback(
    async (file: File): Promise<void> => {
      setError(null);
      setLoading(true);

      try {
        if (!file.type.startsWith("image/") && !file.name.match(/\.(heic|heif|png|jpe?g|webp|svg)$/i)) {
          throw new Error("Invalid file type. Please upload an image asset.");
        }

        const objectUrl = URL.createObjectURL(file);

        // Extract natural dimensions using in-memory HTML Image
        const img = new Image();
        img.src = objectUrl;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to decode image data."));
        });

        setImage(objectUrl);
        setResultImage(null);
        setMeta({
          name: file.name,
          size: file.size,
          type: file.type || "image/unknown",
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load image file.");
      } finally {
        setLoading(false);
      }
    },
    [setImage, setResultImage]
  );

  // Instant browser-level file download trigger
  const downloadResult = useCallback(
    (customFilename?: string) => {
      if (!resultImage) return;

      const a = document.createElement("a");
      a.href = resultImage;
      a.download =
        customFilename ||
        (meta ? `toolkraft-${meta.name.replace(/\.[^/.]+$/, "")}.png` : "toolkraft-edited-asset.png");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    [resultImage, meta]
  );

  // Deep memory wipe on reset
  const reset = useCallback(() => {
    activeBlobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    activeBlobUrls.current.clear();
    setImageState(null);
    setResultImageState(null);
    setMeta(null);
    setError(null);
    setLoading(false);
  }, []);

  // Free allocated memory whenever the component unmounts
  useEffect(() => {
    return () => {
      activeBlobUrls.current.forEach((url) => URL.revokeObjectURL(url));
      activeBlobUrls.current.clear();
    };
  }, []);

  return {
    image,
    resultImage,
    loading,
    meta,
    error,
    setImage,
    setResultImage,
    setLoading,
    setError,
    loadFile,
    downloadResult,
    reset,
  };
}

export default useEditor;