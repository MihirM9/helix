import { cn } from "../../lib/utils";

type Props = {
  name: string;
  size?: number;
  className?: string;
  square?: boolean;
};

const palette = [
  "#ea580c",
  "#0ea5e9",
  "#16a34a",
  "#a855f7",
  "#f59e0b",
  "#0d9488",
  "#dc2626",
  "#475569",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function Avatar({ name, size = 22, className, square }: Props) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = palette[hash(name) % palette.length];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-medium text-white shrink-0",
        square ? "rounded-[4px]" : "rounded-full",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.max(9, size * 0.42),
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
