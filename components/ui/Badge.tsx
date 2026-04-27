import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "error" | "outline";
}

export default function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase",
        variant === "default" && "bg-surface-container text-content-secondary",
        variant === "primary" && "bg-primary text-white",
        variant === "accent"  && "bg-accent text-white",
        variant === "success" && "bg-green-50 text-green-700 border border-green-200",
        variant === "warning" && "bg-yellow-50 text-yellow-700 border border-yellow-200",
        variant === "error"   && "bg-red-50 text-red-700 border border-red-200",
        variant === "outline" && "border border-border-strong text-content-secondary bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
