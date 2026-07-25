"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";

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
  <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-8">

    <h1 className="text-4xl font-bold text-white mb-2">
      Image Crop Tool
    </h1>

    <p className="text-slate-400 mb-8">
      Crop JPG, PNG and WebP images online.
      Everything happens securely inside your browser.
    </p>

    <div className="grid md:grid-cols-2 gap-8">

      <div>

        <label className="flex flex-col items-center justify-center h-56 rounded-2xl border-2 border-dashed border-blue-500 bg-slate-800 cursor-pointer hover:bg-slate-700 transition">

          <div className="text-6xl mb-4">
            📷
          </div>

          <div className="text-white text-lg font-semibold">
            Drop Image Here
          </div>

          <div className="text-slate-400 text-sm mt-2">
            or Click to Upload
          </div>

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImage}
          />

        </label>

      </div>

      <div>

        <div className="relative h-[450px] rounded-2xl overflow-hidden bg-black">

          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
          )}

        </div>

      </div>

    </div>

    <div className="mt-8">

      <div className="flex items-center justify-between">

        <span className="text-white">
          Zoom
        </span>

        <span className="text-blue-400">
          {zoom.toFixed(1)}x
        </span>

      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="w-full mt-3"
      />

    </div>

  </div>
  
);
}