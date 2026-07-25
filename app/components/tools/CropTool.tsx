"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import CropCanvas from "./CropCanvas";
import CropSidebar from "./CropSidebar";

export default function CropTool() {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Image Crop Tool</h1>

        <p className="mt-2 text-muted-foreground">
          Crop JPG, PNG and WebP images directly in your browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="min-h-[600px] p-6">
            <CropCanvas onCrop={setCroppedImage} />
          </Card>
        </div>

        <div>
          <Card className="min-h-[600px] p-6">
            <CropSidebar croppedImage={croppedImage} />
          </Card>
        </div>
      </div>
    </div>
  );
}