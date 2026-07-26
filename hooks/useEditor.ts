"use client";

import { useState } from "react";

export function useEditor() {
  const [image, setImage] = useState<string | null>(null);

  const [resultImage, setResultImage] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  function reset() {
    setImage(null);
    setResultImage(null);
    setLoading(false);
  }

  return {
    image,
    setImage,
    resultImage,
    setResultImage,
    loading,
    setLoading,
    reset,
  };
}