import { cn } from "../../lib/utils";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-12",
        className,
      )}
    >
      {icon && (
        <div className="h-9 w-9 rounded-md border border-line bg-surface-2 flex items-center justify-center text-fg-3 mb-3">
          {icon}
        </div>
      )}
      <div className="text-[13px] font-semibold text-fg">{title}</div>
      {description && (
        <div className="text-[12px] text-fg-3 max-w-sm mt-1">{description}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
