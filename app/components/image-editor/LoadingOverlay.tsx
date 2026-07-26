"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface LoadingOverlayProps {
  isVisible?: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isVisible = false,
  message = "Loading...",
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && (
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}