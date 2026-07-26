"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type CropSidebarProps = {
  croppedImage: string | null;
};

export default function CropSidebar({
  croppedImage,
}: CropSidebarProps) {
  const handleDownload = () => {
    if (!croppedImage) return;

    const link = document.createElement("a");

    link.href = croppedImage;
    link.download = "cropped-image.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">
        Cropped Preview
      </h2>

      {croppedImage ? (
        <>
          <div className="overflow-hidden rounded-lg border">
            <img
              src={croppedImage}
              alt="Cropped Preview"
              className="w-full"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleDownload}
          >
            Download Image
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Zoom
            </label>

            <Slider
              defaultValue={[100]}
              min={50}
              max={300}
              step={1}
            />
          </div>
        </>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
          No cropped image yet
        </div>
      )}
    </div>
  );
}