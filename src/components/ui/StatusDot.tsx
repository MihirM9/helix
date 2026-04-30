import { cn } from "../../lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "accent" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-fg-3",
};

export function StatusDot({
  tone = "neutral",
  pulse,
  className,
}: {
  tone?: Tone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex h-1.5 w-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", tones[tone])} />
      {pulse && (
        <span
          className={cn(
            "absolute inset-0 h-1.5 w-1.5 rounded-full opacity-60 animate-ping",
            tones[tone],
          )}
        />
      )}
    </span>
  );
}
