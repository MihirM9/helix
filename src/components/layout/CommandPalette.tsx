import { AnimatePresence, motion } from "framer-motion";
import {
  Search, ArrowRight, LayoutDashboard, Database, Send, GitBranch,
  BarChart3, Workflow, ShieldAlert, Plus, Sun, Moon, AtSign,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../lib/theme";

type CmdItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  kbd?: string;
};

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const nav = useNavigate();
  const { toggle, theme } = useTheme();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CmdItem[] = useMemo(
    () => [
      { id: "go-overview", label: "Go to Overview", group: "Navigate", icon: LayoutDashboard, run: () => nav("/"), kbd: "G O" },
      { id: "go-enrich", label: "Go to Enrichment Pipeline", group: "Navigate", icon: Database, run: () => nav("/enrichment"), kbd: "G E" },
      { id: "go-finder", label: "Go to Email Finder", group: "Navigate", icon: AtSign, run: () => nav("/finder"), kbd: "G F" },
      { id: "go-seq", label: "Go to Sequences", group: "Navigate", icon: Send, run: () => nav("/sequences"), kbd: "G S" },
      { id: "go-pipe", label: "Go to CRM Pipeline", group: "Navigate", icon: GitBranch, run: () => nav("/pipeline"), kbd: "G P" },
      { id: "go-anal", label: "Go to Analytics & Attribution", group: "Navigate", icon: BarChart3, run: () => nav("/analytics"), kbd: "G A" },
      { id: "go-wf", label: "Go to Workflows", group: "Navigate", icon: Workflow, run: () => nav("/workflows"), kbd: "G W" },
      { id: "go-dq", label: "Go to Data Quality", group: "Navigate", icon: ShieldAlert, run: () => nav("/data-quality"), kbd: "G Q" },
      { id: "new-seq", label: "Create new sequence", group: "Create", icon: Plus, run: () => nav("/sequences"), hint: "Multistep · A/B variants" },
      { id: "new-deal", label: "Create deal", group: "Create", icon: Plus, run: () => nav("/pipeline") },
      { id: "new-list", label: "Create lead list", group: "Create", icon: Plus, run: () => nav("/enrichment") },
      { id: "find-email", label: "Find an email", group: "Create", icon: AtSign, run: () => nav("/finder"), hint: "name + domain · 6-source waterfall" },
      { id: "bulk-find", label: "Bulk email lookup", group: "Create", icon: AtSign, run: () => nav("/finder"), hint: "paste names · CSV import" },
      { id: "toggle-theme", label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode", group: "Settings", icon: theme === "dark" ? Sun : Moon, run: toggle, kbd: "⌘ ⇧ L" },
      { id: "fix-zoom", label: "Open ZoomInfo provider · circuit breaker", group: "Alerts", icon: ShieldAlert, run: () => nav("/data-quality"), hint: "4 consecutive 5xx · since 12m ago" },
      { id: "fix-drift", label: "Resolve schema drift · hubspot_contact.lifecycle_stage", group: "Alerts", icon: ShieldAlert, run: () => nav("/data-quality"), hint: "Unmapped value RE-ENGAGED" },
    ],
    [nav, toggle, theme],
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) =>
      [i.label, i.group, i.hint ?? ""].join(" ").toLowerCase().includes(t),
    );
  }, [q, items]);

  const grouped = useMemo(() => {
    const g: Record<string, CmdItem[]> = {};
    filtered.forEach((i) => {
      if (!g[i.group]) g[i.group] = [];
      g[i.group].push(i);
    });
    return g;
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        e.preventDefault();
        filtered[active].run();
        onClose();
      }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-start justify-center pt-[14vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full max-w-[560px] bg-surface border border-line rounded-lg shadow-pop overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 h-11 border-b border-line">
              <Search className="h-3.5 w-3.5 text-fg-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                placeholder="Search commands, leads, sequences, accounts…"
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-fg-4"
              />
              <span className="kbd">esc</span>
            </div>
            <div className="max-h-[55vh] overflow-y-auto">
              {Object.keys(grouped).length === 0 ? (
                <div className="px-4 py-8 text-center text-[12.5px] text-fg-3">
                  No matches for{" "}
                  <span className="text-fg font-medium">"{q}"</span>
                </div>
              ) : (
                Object.entries(grouped).map(([group, list]) => (
                  <div key={group} className="py-1.5">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-4 font-medium">
                      {group}
                    </div>
                    {list.map((i) => {
                      const idx = filtered.indexOf(i);
                      const isActive = idx === active;
                      const Icon = i.icon;
                      return (
                        <button
                          key={i.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            i.run();
                            onClose();
                          }}
                          className={
                            "w-full flex items-center gap-2.5 px-3 h-8 text-left text-[12.5px] " +
                            (isActive
                              ? "bg-surface-2 text-fg"
                              : "text-fg-2 hover:bg-surface-2")
                          }
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-fg-3" />
                          <span className="flex-1 truncate">{i.label}</span>
                          {i.hint && (
                            <span className="text-[11px] text-fg-4 truncate max-w-[180px]">
                              {i.hint}
                            </span>
                          )}
                          {i.kbd ? (
                            <span className="flex gap-0.5">
                              {i.kbd.split(" ").map((k) => (
                                <span key={k} className="kbd">{k}</span>
                              ))}
                            </span>
                          ) : (
                            isActive && (
                              <ArrowRight className="h-3 w-3 text-fg-3" />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-line h-9 px-3 flex items-center justify-between text-[10.5px] text-fg-3">
              <span className="inline-flex items-center gap-2">
                <span><span className="kbd">↑</span> <span className="kbd">↓</span> navigate</span>
                <span><span className="kbd">↵</span> open</span>
              </span>
              <span>Helix · ⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
