import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Filter,
  Calendar,
  Download,
  Plus,
  Command,
  Menu,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useTheme } from "../../lib/theme";
import { Badge } from "../ui/Badge";
import { Avatar } from "../ui/Avatar";

const titles: Record<string, { crumbs: string[]; sub?: string }> = {
  "/": { crumbs: ["Helix", "Overview"], sub: "Today · all systems" },
  "/enrichment": { crumbs: ["Helix", "Enrichment Pipeline"], sub: "live · 8 stages" },
  "/sequences": { crumbs: ["Helix", "Outbound Sequences"], sub: "4 active · 1 paused" },
  "/finder": { crumbs: ["Helix", "Email Finder"], sub: "6-source waterfall · live" },
  "/pipeline": { crumbs: ["Helix", "CRM Pipeline"], sub: "synced · Salesforce + HubSpot" },
  "/analytics": { crumbs: ["Helix", "Analytics", "Attribution"], sub: "Q4 · funnel + cohorts" },
  "/workflows": { crumbs: ["Helix", "Workflows"], sub: "4 active · 13 nodes" },
  "/data-quality": { crumbs: ["Helix", "Data Quality"], sub: "6 issues · 1 high" },
};

export function TopBar({
  onCommandOpen,
  onMobileNav,
}: {
  onCommandOpen: () => void;
  onMobileNav: () => void;
}) {
  const loc = useLocation();
  const nav = useNavigate();
  const { theme, toggle } = useTheme();
  const t = titles[loc.pathname] ?? { crumbs: ["Helix"] };

  return (
    <header className="sticky top-0 z-30 h-12 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="h-full flex items-center gap-2 px-4">
        <button
          onClick={onMobileNav}
          className="lg:hidden h-7 w-7 rounded border border-line bg-surface text-fg-2 hover:bg-surface-2 inline-flex items-center justify-center"
          aria-label="Open navigation"
        >
          <Menu className="h-3.5 w-3.5" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0 flex items-center gap-1.5 text-[12.5px]">
          {t.crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight className="h-3 w-3 text-fg-4 shrink-0" />}
              <span
                className={
                  i === t.crumbs.length - 1
                    ? "text-fg font-medium truncate"
                    : "text-fg-3 truncate"
                }
              >
                {c}
              </span>
            </span>
          ))}
          {t.sub && (
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 pl-2 border-l border-line text-[11.5px] text-fg-3 tabular">
              {t.sub}
            </span>
          )}
        </nav>

        <div className="flex-1" />

        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Calendar />}
          className="hidden md:inline-flex"
        >
          Last 14 days
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Filter />}
          className="hidden md:inline-flex"
        >
          Filters
          <Badge tone="accent" className="h-[16px] px-1 ml-1">3</Badge>
        </Button>

        <button
          onClick={onCommandOpen}
          className="h-7 hidden md:inline-flex items-center gap-2 px-2 rounded text-[11.5px] text-fg-3 bg-surface hover:bg-surface-2 border border-line"
        >
          <Command className="h-3 w-3" /> jump to
          <span className="kbd ml-1">⌘K</span>
        </button>

        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Download />}
          className="hidden md:inline-flex"
          aria-label="Export"
        >
          Export
        </Button>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="h-7 w-7 inline-flex items-center justify-center rounded border border-line bg-surface text-fg-2 hover:bg-surface-2"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          aria-label="Notifications"
          className="relative h-7 w-7 inline-flex items-center justify-center rounded border border-line bg-surface text-fg-2 hover:bg-surface-2"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

        <Button
          variant="primary"
          size="sm"
          iconLeft={<Plus />}
          onClick={() => nav("/sequences")}
          className="hidden sm:inline-flex"
        >
          New
        </Button>

        <Avatar name="Ravi Patel" size={26} square className="ml-1" />
      </div>
    </header>
  );
}
