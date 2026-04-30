import { cn } from "../../lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  padded?: boolean;
};

export function Card({ title, subtitle, actions, children, className, padded = true, ...rest }: Props) {
  return (
    <section
      className={cn(
        "bg-surface border border-line rounded-md flex flex-col min-w-0",
        className,
      )}
      {...rest}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-4 h-11 border-b border-line">
          <div className="min-w-0 flex items-center gap-2">
            {title && (
              <h3 className="text-[12.5px] font-semibold text-fg tracking-tight truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="text-[11.5px] text-fg-3 tabular truncate">{subtitle}</span>
            )}
          </div>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={cn("min-w-0", padded && "p-4")}>{children}</div>
    </section>
  );
}
