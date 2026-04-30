import { cn } from "../lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  meta?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-line bg-bg",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-fg-3 font-medium mb-1.5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[22px] font-semibold text-fg tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[12.5px] text-fg-3 mt-1 max-w-2xl">
              {description}
            </p>
          )}
          {meta && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11.5px] text-fg-3 tabular">
              {meta}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
