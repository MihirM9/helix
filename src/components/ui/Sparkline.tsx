type Props = {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 96,
  height = 28,
  stroke = "rgb(var(--accent))",
  fill,
  className,
}: Props) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} className={className} aria-hidden>
      {fill && <path d={area} fill={fill} />}
      <path d={path} stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
