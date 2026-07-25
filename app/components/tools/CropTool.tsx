"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";

import Card from "../ui/Card";
import UploadBox from "../ui/UploadBox";
import EditorLayout from "../image-editor/EditorLayout";

export default function CropTool() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  return (
  <Card className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-bold mb-2">
      Image Crop Tool
    </h1>

    <p className="text-slate-400 mb-8">
      Crop JPG, PNG and WebP images directly in your browser.
    </p>

    <EditorLayout
      left={
        <div className="space-y-6">

          {!image ? (
            <label>
              <UploadBox />

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-black">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>
          )}

        </div>
      }

      right={
        <div className="space-y-6">

          <Card>
            <h2 className="text-xl font-semibold mb-4">
              Controls
            </h2>

            <label className="block text-sm mb-2">
              Zoom ({zoom.toFixed(1)}x)
            </label>

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </Card>

        </div>
      }
    />
  </Card>
  );
}