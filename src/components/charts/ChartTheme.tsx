import { useTheme } from "../../lib/theme";

export function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    accent: isDark ? "#FF6421" : "#EA580C",
    accentSoft: isDark ? "rgba(255,100,33,0.18)" : "rgba(234,88,12,0.14)",
    line: isDark ? "#27272A" : "#E7E5E4",
    lineSoft: isDark ? "#1F1F23" : "#EDECEA",
    text: isDark ? "#A8A29E" : "#78716C",
    textStrong: isDark ? "#FAFAF9" : "#0C0A09",
    grid: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    success: isDark ? "#34D399" : "#16A34A",
    danger: isDark ? "#F87171" : "#DC2626",
    info: isDark ? "#60A5FA" : "#2563EB",
    warning: isDark ? "#F59E0B" : "#D97706",
    muted: isDark ? "#52525B" : "#A8A29E",
    surface: isDark ? "#111113" : "#FFFFFF",
  };
}

type TooltipEntry = {
  name?: unknown;
  value?: unknown;
  color?: string;
  dataKey?: unknown;
};

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: ReadonlyArray<TooltipEntry>;
  label?: unknown;
  formatter?: (v: number, key?: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-line shadow-pop rounded-md px-3 py-2 text-[11.5px] tabular min-w-[140px]">
      {label !== undefined && (
        <div className="text-fg-3 mb-1.5 text-[10.5px] uppercase tracking-wider">
          {String(label)}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => {
          const v = p.value;
          const dk =
            typeof p.dataKey === "string" || typeof p.dataKey === "number"
              ? String(p.dataKey)
              : "";
          const nm =
            typeof p.name === "string" || typeof p.name === "number"
              ? String(p.name)
              : dk;
          const display =
            formatter && typeof v === "number"
              ? formatter(v, dk || undefined)
              : Array.isArray(v)
                ? v.join(", ")
                : (v as React.ReactNode);
          return (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-fg-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                {nm}
              </span>
              <span className="text-fg font-medium">{display}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
