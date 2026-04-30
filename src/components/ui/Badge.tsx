import { cn } from "../../lib/utils";

type Tone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ghost";

type Props = {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
};

const toneClasses: Record<Tone, string> = {
  neutral:
    "bg-surface-2 border-line text-fg-2 dark:bg-surface-2 dark:text-fg-2",
  accent:
    "bg-accent-soft border-accent/30 text-accent dark:bg-accent-soft dark:text-accent",
  success:
    "bg-success/10 border-success/25 text-success",
  warning:
    "bg-warning/10 border-warning/25 text-warning",
  danger:
    "bg-danger/10 border-danger/25 text-danger",
  info:
    "bg-info/10 border-info/25 text-info",
  ghost:
    "bg-transparent border-line text-fg-3",
};

const dotClasses: Record<Tone, string> = {
  neutral: "bg-fg-3",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  ghost: "bg-fg-3",
};

export function Badge({ tone = "neutral", children, className, dot, pulse }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-1.5 h-[20px] rounded text-[10.5px] font-medium tracking-wide uppercase border tabular",
        toneClasses[tone],
        className,
      )}
    >
      {dot && (
        <span className="relative inline-flex">
          <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[tone])} />
          {pulse && (
            <span
              className={cn(
                "absolute inset-0 h-1.5 w-1.5 rounded-full opacity-70 animate-pulseDot",
                dotClasses[tone],
              )}
            />
          )}
        </span>
      )}
      {children}
    </span>
  );
}
