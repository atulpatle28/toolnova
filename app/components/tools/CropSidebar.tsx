"use client";

type CropSidebarProps = {
  croppedImage: string | null;
};

export default function CropSidebar({
  croppedImage,
}: CropSidebarProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Cropped Preview
      </h2>

      {croppedImage ? (
        <div className="overflow-hidden rounded-lg border">
          <img
            src={croppedImage}
            alt="Cropped Preview"
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
          No cropped image yet
        </div>
      )}
    </div>
  );
}