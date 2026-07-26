type LoadingOverlayProps = {
  show: boolean;
  text?: string;
};

export default function LoadingOverlay({
  show,
  text = "Processing image...",
}: LoadingOverlayProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

        <p className="text-sm font-medium text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}