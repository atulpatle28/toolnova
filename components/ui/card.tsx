import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. Inlined Utility (Zero external dependency)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Card Root Container
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 text-slate-100 shadow-xl backdrop-blur-sm transition-all duration-200",
        size === "sm" ? "p-4 gap-3 text-xs" : "p-6 gap-4 text-sm",
        className
      )}
      {...props}
    />
  );
}

// 3. Card Header
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 border-b border-slate-800/60 pb-3",
        className
      )}
      {...props}
    />
  );
}

// 4. Card Title
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-lg font-bold tracking-tight text-white group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  );
}

// 5. Card Description
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-xs leading-relaxed text-slate-400", className)}
      {...props}
    />
  );
}

// 6. Card Action (Buttons, Badges, Icons placed in top-right)
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto flex items-center gap-2", className)}
      {...props}
    />
  );
}

// 7. Card Content / Body
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex-1 text-slate-300", className)}
      {...props}
    />
  );
}

// 8. Card Footer
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};