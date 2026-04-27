import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth = false, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variant === "primary"   && "bg-accent text-white hover:bg-accent-hover shadow-raised hover:shadow-overlay",
        variant === "secondary" && "bg-primary text-white hover:bg-primary-container shadow-raised hover:shadow-overlay",
        variant === "outline"   && "border border-primary text-primary bg-transparent hover:bg-surface-low",
        variant === "ghost"     && "text-content-secondary bg-transparent hover:bg-surface-container",
        size === "sm" && "text-xs px-3 py-2",
        size === "md" && "text-sm px-5 py-3",
        size === "lg" && "text-[15px] px-8 py-4",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
