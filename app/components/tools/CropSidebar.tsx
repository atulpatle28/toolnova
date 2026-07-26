"use client";

type CropSidebarProps = {
  croppedImage: string | null;
};
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Cropped Preview
      </h2>

      {croppedImage ? (
  <div className="space-y-4">
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
  </div>
) : (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
          No cropped image yet
        </div>
      )}
    </div>
  );
}