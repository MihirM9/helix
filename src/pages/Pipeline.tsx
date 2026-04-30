import { useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpRight, Building2,
  Calendar, ChevronRight, Database, Download,
  Filter, GitBranch, Mail, MapPin, Phone, Plus,
  RefreshCw, Search, Send, Tag, TrendingDown, TrendingUp, Users, Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { Drawer } from "../components/ui/Drawer";
import { deals, type Deal } from "../data/fixtures";
import { cn, formatCurrency } from "../lib/utils";

const stages: Deal["stage"][] = ["Discovery", "Validation", "Proposal", "Negotiation", "Won"];

const stageMeta: Record<Deal["stage"], { color: string; sub: string }> = {
  Discovery: { color: "bg-fg-3/30", sub: "exploring fit" },
  Validation: { color: "bg-info/40", sub: "champion + scope" },
  Proposal: { color: "bg-warning/40", sub: "pricing sent" },
  Negotiation: { color: "bg-accent/50", sub: "redlines" },
  Won: { color: "bg-success/50", sub: "closed-won" },
  Lost: { color: "bg-danger/40", sub: "closed-lost" },
};

const syncTone = {
  synced: "success" as const,
  pending: "warning" as const,
  conflict: "danger" as const,
  error: "danger" as const,
};

const healthIcon = {
  "on-track": TrendingUp,
  "at-risk": AlertTriangle,
  stalled: TrendingDown,
};

const healthTone = {
  "on-track": "text-success",
  "at-risk": "text-warning",
  stalled: "text-danger",
};

export function Pipeline() {
  const [drawer, setDrawer] = useState<Deal | null>(null);
  const visible = useMemo(() => deals.filter((d) => d.stage !== "Lost"), []);
  const grouped = useMemo(() => {
    const g: Record<string, Deal[]> = {};
    stages.forEach((s) => (g[s] = []));
    visible.forEach((d) => {
      if (g[d.stage]) g[d.stage].push(d);
    });
    return g;
  }, [visible]);

  const totalValue = visible.reduce((s, d) => s + d.amount, 0);
  const totalConflicts = deals.filter((d) => d.syncStatus === "conflict" || d.syncStatus === "error").length;

  return (
    <>
      <PageHeader
        eyebrow="CRM · Salesforce + HubSpot"
        title="Deal pipeline"
        description="Single source of truth across both CRMs. Sync runs every 60 seconds with conflict resolution and write-back."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<RefreshCw />}>Sync now</Button>
            <Button size="sm" variant="secondary" iconLeft={<Download />}>Export</Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>New deal</Button>
          </>
        }
        meta={
          <>
            <span>open pipeline <span className="text-fg-2">{formatCurrency(totalValue)}</span></span>
            <span>{visible.length} deals</span>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />Salesforce 99.97%</span>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="warning" pulse />HubSpot 99.42%</span>
            {totalConflicts > 0 && (
              <span className="text-warning">
                {totalConflicts} sync conflict{totalConflicts > 1 ? "s" : ""}
              </span>
            )}
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Sync status row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              l: "Salesforce", s: "synced", v: "21s ago", k: "412 contacts · 28 deals · 0 conflicts",
              i: ArrowDownToLine, tone: "success" as const,
            },
            {
              l: "HubSpot", s: "degraded", v: "2m ago", k: "1.91s p95 · 4 retries last hour",
              i: ArrowDownToLine, tone: "warning" as const,
            },
            {
              l: "Conflicts", s: "review", v: "3 open", k: "stage divergence · auto-merge blocked",
              i: AlertTriangle, tone: "warning" as const,
            },
            {
              l: "Snowflake export", s: "scheduled", v: "06:00", k: "deal_events.parquet · v0.18.4",
              i: Database, tone: "neutral" as const,
            },
          ].map((row) => (
            <div key={row.l} className="bg-surface border border-line rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-fg">
                  <row.i className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.8} />
                  {row.l}
                </div>
                <Badge tone={row.tone} dot pulse={row.tone !== "neutral"}>{row.s}</Badge>
              </div>
              <div className="text-[11.5px] text-fg-3 mt-1.5">{row.k}</div>
              <div className="text-[10.5px] text-fg-4 tabular mt-1">last activity · {row.v}</div>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <Card
          title="Pipeline board"
          subtitle="dragging is no-op in demo"
          actions={
            <div className="flex items-center gap-1">
              <div className="relative">
                <Search className="h-3 w-3 text-fg-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  placeholder="filter deals…"
                  className="h-7 pl-6 pr-2 text-[11.5px] bg-surface-2 border border-line rounded outline-none focus:border-accent/60 placeholder:text-fg-4 w-[180px]"
                />
              </div>
              <Button size="xs" variant="secondary" iconLeft={<Filter />}>Owner: all</Button>
              <Button size="xs" variant="secondary" iconLeft={<Calendar />}>Q4</Button>
            </div>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] grid grid-cols-5 gap-px bg-line">
              {stages.map((stage) => {
                const list = grouped[stage] ?? [];
                const stageVal = list.reduce((s, d) => s + d.amount, 0);
                return (
                  <div key={stage} className="bg-surface min-h-[420px] flex flex-col">
                    <header className="px-3 pt-3 pb-2 sticky top-0 z-10 bg-surface border-b border-line">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn("h-1.5 w-1.5 rounded-full", stageMeta[stage].color)} />
                          <span className="text-[11.5px] font-semibold text-fg uppercase tracking-wide">
                            {stage}
                          </span>
                          <span className="text-[10.5px] text-fg-3 tabular">{list.length}</span>
                        </div>
                        <button className="h-5 w-5 rounded text-fg-4 hover:text-fg hover:bg-surface-2 inline-flex items-center justify-center">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] tabular text-fg-2 font-medium">
                          {formatCurrency(stageVal, true)}
                        </span>
                        <span className="text-[10.5px] text-fg-4">{stageMeta[stage].sub}</span>
                      </div>
                      <div className="mt-1.5 h-0.5 bg-surface-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, list.length * 14)}%` }}
                          transition={{ duration: 0.7 }}
                          className={cn("h-full", stageMeta[stage].color)}
                        />
                      </div>
                    </header>
                    <div className="px-2 py-2 space-y-2 flex-1">
                      {list.length === 0 ? (
                        <div className="text-center py-6 text-[11px] text-fg-4 italic">
                          no deals
                        </div>
                      ) : (
                        list.map((d) => (
                          <DealCard key={d.id} deal={d} onClick={() => setDrawer(d)} />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Deal table for completeness */}
        <Card
          title="All deals"
          subtitle={`${deals.length} total · ${totalConflicts} conflicts`}
          actions={
            <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Inspect schema</Button>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] tabular">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 sticky top-0 bg-surface z-10 border-b border-line">
                  <th className="text-left font-medium px-3 py-2">Deal</th>
                  <th className="text-left font-medium px-3 py-2">Account</th>
                  <th className="text-left font-medium px-3 py-2">Stage</th>
                  <th className="text-right font-medium px-3 py-2">Amount</th>
                  <th className="text-left font-medium px-3 py-2">Owner</th>
                  <th className="text-left font-medium px-3 py-2">Source</th>
                  <th className="text-left font-medium px-3 py-2">Health</th>
                  <th className="text-left font-medium px-3 py-2">Sync</th>
                  <th className="text-right font-medium px-3 py-2">Close</th>
                  <th className="w-6 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {deals.map((d) => {
                  const HealthI = healthIcon[d.health];
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setDrawer(d)}
                      className="row-hover cursor-pointer group"
                    >
                      <td className="px-3 py-2">
                        <div className="text-[12.5px] font-medium text-fg truncate max-w-[180px]">{d.name}</div>
                        <div className="text-[10.5px] text-fg-4 tabular">{d.id}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3 text-fg-4" strokeWidth={1.8} />
                          <span className="text-fg-2 truncate max-w-[140px]">{d.company}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="inline-flex items-center gap-1.5 text-fg-2">
                          <span className={cn("h-1.5 w-1.5 rounded-full", stageMeta[d.stage].color)} />
                          {d.stage}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-fg font-medium">
                        {formatCurrency(d.amount)}
                      </td>
                      <td className="px-3 py-2 text-fg-3">{d.owner}</td>
                      <td className="px-3 py-2 text-fg-3">{d.source}</td>
                      <td className="px-3 py-2">
                        <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] capitalize", healthTone[d.health])}>
                          <HealthI className="h-3 w-3" strokeWidth={2} />
                          {d.health.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Badge tone={syncTone[d.syncStatus]} dot pulse={d.syncStatus !== "synced"}>
                          {d.syncStatus}
                        </Badge>
                        <div className="text-[10px] text-fg-4 mt-0.5">{d.lastSync}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-fg-3 text-[11.5px]">{d.closeDate}</td>
                      <td className="px-3 py-2">
                        <ChevronRight className="h-3 w-3 text-fg-4 group-hover:text-fg-2" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <DealDrawer deal={drawer} onClose={() => setDrawer(null)} />
    </>
  );
}

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const HealthI = healthIcon[deal.health];
  return (
    <motion.button
      layout
      onClick={onClick}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      className="w-full text-left bg-surface-2/40 hover:bg-surface-2 border border-line hover:border-line-strong rounded-md p-2.5 group transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-[10.5px] font-mono text-fg-4 tabular truncate">{deal.id}</span>
        <Badge tone={syncTone[deal.syncStatus]} dot className="h-[16px]">
          {deal.syncStatus}
        </Badge>
      </div>
      <div className="text-[12.5px] font-semibold text-fg leading-snug truncate">
        {deal.name}
      </div>
      <div className="text-[11px] text-fg-3 mt-0.5 truncate">
        {deal.company} · {deal.owner}
      </div>
      <div className="flex items-center justify-between mt-2 text-[11.5px] tabular">
        <span className="text-fg font-medium">{formatCurrency(deal.amount, true)}</span>
        <span className={cn("inline-flex items-center gap-1", healthTone[deal.health])}>
          <HealthI className="h-3 w-3" />
          {deal.health.replace("-", " ")}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px] text-fg-4 tabular border-t border-line pt-1.5">
        <span>{deal.touches} touches</span>
        <span>{deal.ageDays}d old</span>
        <span>{deal.closeDate}</span>
      </div>
    </motion.button>
  );
}

function DealDrawer({ deal, onClose }: { deal: Deal | null; onClose: () => void }) {
  return (
    <Drawer
      open={!!deal}
      onClose={onClose}
      title={deal?.name}
      subtitle={deal ? `${deal.id} · ${deal.company}` : ""}
      width={540}
      footer={
        <>
          <Button size="sm" variant="ghost">Close as lost</Button>
          <Button size="sm" variant="secondary">Reassign</Button>
          <Button size="sm" variant="primary" iconRight={<ArrowRight />}>Advance stage</Button>
        </>
      }
    >
      {deal && (
        <div className="px-4 py-4 space-y-5 text-[12px]">
          {/* Header summary */}
          <section className="bg-surface-2/60 border border-line rounded-md p-3 grid grid-cols-3 gap-3 tabular">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-fg-3">Amount</div>
              <div className="text-[18px] font-semibold text-fg mt-0.5">{formatCurrency(deal.amount)}</div>
              <div className="text-[10.5px] text-success mt-0.5 inline-flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> +12% vs avg
              </div>
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-fg-3">Stage</div>
              <div className="text-[14px] font-semibold text-fg mt-0.5">{deal.stage}</div>
              <div className="text-[10.5px] text-fg-3 mt-0.5">{stageMeta[deal.stage].sub}</div>
            </div>
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-fg-3">Close date</div>
              <div className="text-[14px] font-semibold text-fg mt-0.5">{deal.closeDate}</div>
              <div className="text-[10.5px] text-fg-3 mt-0.5">{deal.ageDays}d in pipe</div>
            </div>
          </section>

          {/* Sync */}
          <section className={cn(
            "border rounded-md p-3 flex items-start gap-2.5",
            deal.syncStatus === "synced"
              ? "border-success/30 bg-success/5"
              : "border-warning/40 bg-warning/5",
          )}>
            <RefreshCw className={cn(
              "h-4 w-4 mt-0.5 shrink-0",
              deal.syncStatus === "synced" ? "text-success" : "text-warning",
            )} strokeWidth={1.8} />
            <div className="text-[11.5px] flex-1 min-w-0">
              <div className="text-fg font-medium">
                {deal.syncStatus === "synced" && "Sync OK · Salesforce + HubSpot"}
                {deal.syncStatus === "pending" && "Sync queued · waiting for HubSpot retry"}
                {deal.syncStatus === "conflict" && "Conflict · stage divergence between SFDC + HubSpot"}
                {deal.syncStatus === "error" && "Sync failed · 5xx upstream"}
              </div>
              <div className="text-fg-3 mt-0.5">last sync · {deal.lastSync} · 0 conflicts auto-merged</div>
            </div>
            {deal.syncStatus !== "synced" && (
              <Button size="xs" variant="secondary" iconLeft={<RefreshCw />}>Resolve</Button>
            )}
          </section>

          {/* Tabs replacement: stacked sections */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2">
              Account
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Row icon={Building2} l="Account" v={deal.company} />
              <Row icon={Users} l="Headcount" v="51-200" />
              <Row icon={MapPin} l="HQ" v="Berlin · DE" />
              <Row icon={Tag} l="Source" v={deal.source} />
              <Row icon={GitBranch} l="Attribution" v={deal.attribution} />
              <Row icon={Mail} l="Contacts" v={`${deal.contacts}`} />
            </dl>
          </section>

          {/* Touches stripe */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2 flex items-center justify-between">
              <span>Touches · last 14 days</span>
              <span className="text-fg-4 tabular">{deal.touches} total</span>
            </div>
            <div className="flex gap-1 h-7">
              {Array.from({ length: 14 }).map((_, i) => {
                const t = (deal.touches + i) % 5;
                const tone =
                  t === 0
                    ? "bg-surface-2"
                    : t === 1
                      ? "bg-fg-3/30"
                      : t === 2
                        ? "bg-info/40"
                        : t === 3
                          ? "bg-accent"
                          : "bg-success";
                return <div key={i} className={cn("flex-1 rounded-sm", tone)} title={`day -${14 - i}`} />;
              })}
            </div>
            <div className="flex justify-between text-[10px] text-fg-4 tabular mt-1">
              <span>−14d</span>
              <span>today</span>
            </div>
          </section>

          {/* Activity timeline */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2">
              Activity
            </div>
            <ol className="relative space-y-3 ml-2 pl-3 border-l border-line">
              {[
                { i: Database, t: "Sourced", d: "Apollo · Q4 Founders EU", time: "31d ago" },
                { i: Send, t: "Sequence enrolled", d: "ICP-A Founders / EU", time: "30d ago" },
                { i: Mail, t: "Reply (positive)", d: "Maya R. · ‘happy to chat’", time: "21d ago" },
                { i: Calendar, t: "Meeting booked", d: "30m intro · Daniel V.", time: "20d ago" },
                { i: GitBranch, t: "Stage → Validation", d: "champion + scope confirmed", time: "12d ago" },
                { i: Phone, t: "Discovery call", d: "stakeholders aligned", time: "8d ago" },
                { i: Tag, t: "Stage → Proposal", d: "pricing sent · 12mo", time: "3d ago" },
                { i: Zap, t: "Auto-followup", d: "Smartlead · day 2 nudge", time: "1d ago" },
              ].map((e, i) => {
                const Icon = e.i;
                return (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="absolute -left-[5px] mt-1 h-2 w-2 rounded-full bg-accent border-2 border-bg" />
                    <span className="h-5 w-5 rounded border border-line bg-surface-2 flex items-center justify-center shrink-0">
                      <Icon className="h-3 w-3 text-fg-3" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-fg">{e.t}</span>
                        <span className="text-[10.5px] text-fg-4 tabular">{e.time}</span>
                      </div>
                      <div className="text-[11.5px] text-fg-3">{e.d}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      )}
    </Drawer>
  );
}

function Row({ icon: Icon, l, v }: { icon: any; l: string; v: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3 w-3 text-fg-4 mt-0.5" strokeWidth={1.8} />
      <div className="min-w-0">
        <div className="text-[10.5px] text-fg-3 uppercase tracking-wider">{l}</div>
        <div className="text-[12px] text-fg truncate">{v}</div>
      </div>
    </div>
  );
}
