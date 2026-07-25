"use client";

import { useRef, useState } from "react";
import {
  Cropper,
  CropperRef,
  RectangleStencil,
} from "react-advanced-cropper";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type CropCanvasProps = {
  onCrop: (image: string) => void;
};

export default function CropCanvas({
  onCrop,
}: CropCanvasProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  if (!image) {
    return (
      <div className="flex h-[550px] w-full items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <label className="flex cursor-pointer flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-5">
            <ImagePlus className="h-10 w-10" />
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              Upload an Image
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Drag & Drop your image here
              <br />
              or click to browse
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] overflow-hidden rounded-xl border bg-black">
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-full w-full"
          stencilComponent={RectangleStencil}
          stencilProps={{
            grid: true,
            movable: true,
            resizable: true,
          }}
          onChange={(cropper) => {
            console.log(cropper.getCoordinates());
          }}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setImage(null);

            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          Change Image
        </Button>

        <Button
          onClick={() => {
            const canvas = cropperRef.current?.getCanvas();

            if (!canvas) return;

            const dataUrl = canvas.toDataURL("image/png");

            onCrop(dataUrl);
          }}
        >
          Crop Image
        </Button>
      </div>
    </div>
  );
}