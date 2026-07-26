type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-[350px] items-center justify-center rounded-xl border border-dashed">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}