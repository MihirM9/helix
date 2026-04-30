import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Send,
  Workflow,
  BarChart3,
  GitBranch,
  ShieldAlert,
  ChevronsLeft,
  Plus,
  Bookmark,
  Search,
  AtSign,
} from "lucide-react";
import { Logo } from "../Logo";
import { Avatar } from "../ui/Avatar";
import { StatusDot } from "../ui/StatusDot";
import { cn } from "../../lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard, kbd: "G O" },
  { to: "/enrichment", label: "Enrichment", icon: Database, kbd: "G E" },
  { to: "/finder", label: "Email Finder", icon: AtSign, kbd: "G F" },
  { to: "/sequences", label: "Sequences", icon: Send, kbd: "G S" },
  { to: "/pipeline", label: "Pipeline", icon: GitBranch, kbd: "G P" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, kbd: "G A" },
  { to: "/workflows", label: "Workflows", icon: Workflow, kbd: "G W" },
  { to: "/data-quality", label: "Data Quality", icon: ShieldAlert, kbd: "G Q" },
];

const saved = [
  { label: "ICP-A · last 7d", count: 412 },
  { label: "Bounced this week", count: 41 },
  { label: "AEs · stalled deals", count: 7 },
];

export function Sidebar({ onCommandOpen }: { onCommandOpen: () => void }) {
  return (
    <aside className="hidden lg:flex w-[232px] shrink-0 flex-col border-r border-line bg-surface">
      <SidebarContent onCommandOpen={onCommandOpen} />
    </aside>
  );
}

export function SidebarContent({ onCommandOpen }: { onCommandOpen: () => void }) {
  const loc = useLocation();
  return (
    <div className="flex w-full h-full flex-col bg-surface">
      {/* Workspace switcher */}
      <div className="h-12 px-3 flex items-center gap-2 border-b border-line">
        <Logo size={22} />
        <div className="min-w-0 flex flex-col leading-none">
          <span className="text-[12.5px] font-semibold text-fg tracking-tight truncate">
            Helix · GTM
          </span>
          <span className="text-[10.5px] text-fg-3 truncate">
            workspace · forge.bio
          </span>
        </div>
        <button
          className="ml-auto h-6 w-6 rounded text-fg-4 hover:text-fg hover:bg-surface-2 flex items-center justify-center"
          aria-label="Collapse"
          title="Collapse sidebar"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-2.5 border-b border-line">
        <button
          onClick={onCommandOpen}
          className="w-full h-7 inline-flex items-center gap-2 px-2 rounded text-[11.5px] text-fg-3 bg-surface-2 hover:bg-surface-3 border border-line hover:border-line-strong transition-colors"
        >
          <Search className="h-3 w-3" />
          <span className="flex-1 text-left">Search · jump to…</span>
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.1em] font-medium text-fg-4">
          Workspaces
        </div>
        <ul className="space-y-px">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = loc.pathname === n.to;
            return (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={cn(
                    "group flex items-center gap-2 h-7 px-2 rounded text-[12.5px] transition-colors",
                    active
                      ? "bg-surface-2 text-fg font-medium"
                      : "text-fg-2 hover:text-fg hover:bg-surface-2",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      active ? "text-accent" : "text-fg-3 group-hover:text-fg-2",
                    )}
                    strokeWidth={1.8}
                  />
                  <span className="flex-1 truncate">{n.label}</span>
                  <span className="hidden xl:inline-flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {n.kbd.split(" ").map((k) => (
                      <span key={k} className="kbd">{k}</span>
                    ))}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="px-2 mt-5 mb-1.5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-fg-4">
            Saved views
          </span>
          <button className="h-4 w-4 rounded text-fg-4 hover:text-fg hover:bg-surface-2 flex items-center justify-center">
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <ul className="space-y-px">
          {saved.map((s) => (
            <li key={s.label}>
              <button className="w-full flex items-center gap-2 h-7 px-2 rounded text-[12px] text-fg-2 hover:text-fg hover:bg-surface-2">
                <Bookmark className="h-3 w-3 shrink-0 text-fg-4" strokeWidth={1.8} />
                <span className="flex-1 text-left truncate">{s.label}</span>
                <span className="text-[10.5px] text-fg-4 tabular">{s.count}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-2 mt-5 mb-1.5 text-[10px] uppercase tracking-[0.1em] font-medium text-fg-4">
          System
        </div>
        <ul className="px-2 text-[11.5px] text-fg-3 space-y-1.5 tabular">
          <li className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="success" />
              Salesforce
            </span>
            <span className="text-fg-4">99.97%</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="warning" pulse />
              HubSpot
            </span>
            <span className="text-fg-4">99.42%</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="danger" pulse />
              ZoomInfo
            </span>
            <span className="text-fg-4">96.21%</span>
          </li>
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-line p-2.5 flex items-center gap-2">
        <Avatar name="Ravi Patel" size={26} square />
        <div className="min-w-0 leading-none">
          <div className="text-[12px] font-medium text-fg truncate">Ravi Patel</div>
          <div className="text-[10.5px] text-fg-3 truncate">Founder · RevOps</div>
        </div>
        <span className="ml-auto kbd">⌘.</span>
      </div>
    </div>
  );
}
