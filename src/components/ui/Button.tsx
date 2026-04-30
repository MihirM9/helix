import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "xs" | "sm" | "md";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const sizes: Record<Size, string> = {
  xs: "h-6 px-2 text-[11.5px] gap-1",
  sm: "h-7 px-2.5 text-[12px] gap-1.5",
  md: "h-8 px-3 text-[12.5px] gap-1.5",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent/90 active:bg-accent/95 border border-accent shadow-xs",
  secondary:
    "bg-surface text-fg border border-line hover:bg-surface-2 hover:border-line-strong",
  outline:
    "bg-transparent text-fg-2 border border-line hover:text-fg hover:bg-surface-2",
  ghost:
    "bg-transparent text-fg-2 border border-transparent hover:bg-surface-2 hover:text-fg",
  danger:
    "bg-danger text-white border border-danger hover:bg-danger/90",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "secondary", size = "sm", iconLeft, iconRight, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {iconLeft && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{iconLeft}</span>}
      {children}
      {iconRight && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{iconRight}</span>}
    </button>
  ),
);
Button.displayName = "Button";
