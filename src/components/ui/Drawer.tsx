import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../../lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "left";
};

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  width = 480,
  children,
  footer,
  side = "right",
}: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              "fixed top-0 bottom-0 z-50 bg-surface border-line flex flex-col",
              side === "right" ? "right-0 border-l" : "left-0 border-r",
            )}
            style={{ width: `min(${width}px, 92vw)` }}
            initial={{ x: side === "right" ? width : -width, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: side === "right" ? width : -width, opacity: 0.6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {(title || subtitle) && (
              <header className="flex items-center justify-between px-4 h-12 border-b border-line shrink-0">
                <div className="min-w-0">
                  {title && (
                    <div className="text-[13px] font-semibold text-fg truncate">{title}</div>
                  )}
                  {subtitle && (
                    <div className="text-[11px] text-fg-3 tabular truncate">{subtitle}</div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="h-7 w-7 inline-flex items-center justify-center rounded text-fg-3 hover:bg-surface-2 hover:text-fg"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </header>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <footer className="border-t border-line px-4 h-12 shrink-0 flex items-center justify-end gap-2">
                {footer}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
