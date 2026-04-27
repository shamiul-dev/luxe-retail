import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({ className, elevated = false, padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg",
        elevated ? "shadow-overlay" : "shadow-raised",
        padding === "none" && "",
        padding === "sm"   && "p-4",
        padding === "md"   && "p-6",
        padding === "lg"   && "p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
