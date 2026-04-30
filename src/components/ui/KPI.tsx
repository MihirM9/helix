import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Sparkline } from "./Sparkline";

type Props = {
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  delta?: number; // percent change
  invertDelta?: boolean; // when down is good (e.g. bounce rate)
  decimals?: number;
  trend?: number[];
  format?: (n: number) => string;
  className?: string;
  hint?: string;
};

export function KPI({
  label,
  value,
  unit,
  prefix,
  suffix,
  delta,
  invertDelta = false,
  decimals = 0,
  trend,
  format,
  className,
  hint,
}: Props) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) =>
    format ? format(v) : v.toFixed(decimals),
  );
  const [, force] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.0,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: () => force((n) => n + 1),
    });
    return () => controls.stop();
  }, [value, motionVal]);

  const deltaPositive = delta != null ? delta >= 0 : null;
  const deltaGood =
    deltaPositive == null ? null : invertDelta ? !deltaPositive : deltaPositive;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 px-4 py-3.5 bg-surface min-w-0",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-fg-3 font-medium truncate">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-fg-4 tabular shrink-0">{hint}</span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 min-w-0">
        <div className="flex items-baseline gap-1 min-w-0">
          {prefix && (
            <span className="text-fg-3 text-lg leading-none">{prefix}</span>
          )}
          <motion.span className="text-[26px] leading-none font-semibold text-fg tabular tracking-tight tabular-nums">
            {display.get()}
          </motion.span>
          {(unit || suffix) && (
            <span className="text-fg-3 text-[12.5px] leading-none ml-0.5">
              {unit || suffix}
            </span>
          )}
        </div>
        {trend && trend.length > 1 && (
          <Sparkline
            data={trend}
            width={64}
            height={22}
            stroke={
              deltaGood == null
                ? "rgb(var(--fg-3))"
                : deltaGood
                  ? "rgb(var(--success))"
                  : "rgb(var(--danger))"
            }
          />
        )}
      </div>

      {delta != null && (
        <div className="flex items-center gap-1.5 -mt-1">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-medium tabular",
              deltaGood === null && "text-fg-3",
              deltaGood && "text-success",
              deltaGood === false && "text-danger",
            )}
          >
            {deltaPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-fg-4">vs last 7d</span>
        </div>
      )}
    </div>
  );
}
