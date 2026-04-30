type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
};

/**
 * Custom inline SVG logomark for "Helix" — a stylized double-helix knot
 * that suggests pipelines, threading, and engineering. Single accent color.
 */
export function Logo({ size = 22, withWordmark = false, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="0.75"
          y="0.75"
          width="22.5"
          height="22.5"
          rx="5.25"
          className="fill-accent"
        />
        <path
          d="M6 18 C 9 14, 9 10, 6 6"
          stroke="rgb(var(--accent-fg))"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 6 C 15 10, 15 14, 18 18"
          stroke="rgb(var(--accent-fg))"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M7.4 8 H 16.6 M7.4 12 H 16.6 M7.4 16 H 16.6"
          stroke="rgb(var(--accent-fg))"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      {withWordmark && (
        <span className="font-sans text-[14px] tracking-tight font-semibold text-fg leading-none">
          Helix
          <span className="text-fg-3 font-normal ml-1.5 tracking-normal">
            / GTM
          </span>
        </span>
      )}
    </span>
  );
}
