import {
  AlertCircle, AlertTriangle, ArrowRight, BadgeCheck,
  ChevronRight, Database, Download, Filter, GitMerge,
  Hash, Mail, MailX, RefreshCw, Search, Shield, ShieldAlert,
  Sparkles, X, Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { dataQualityIssues } from "../data/fixtures";
import { cn, formatNumber } from "../lib/utils";

const sevTone = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "info" as const,
};

const issueIcon: Record<string, any> = {
  "Schema drift": AlertCircle,
  "Provider failure": ShieldAlert,
  "Duplicates": GitMerge,
  "Invalid emails": MailX,
  "Missing fields": Hash,
  "Stale": RefreshCw,
};

export function DataQuality() {
  const high = dataQualityIssues.filter((i) => i.severity === "high").length;
  const medium = dataQualityIssues.filter((i) => i.severity === "medium").length;
  const low = dataQualityIssues.filter((i) => i.severity === "low").length;

  return (
    <>
      <PageHeader
        eyebrow="Data quality · trust score 87"
        title="Data quality center"
        description="Monitoring for duplicates, missing fields, schema drift, invalid emails, and broken automations. All findings are auto-routed to owners."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<RefreshCw />}>Re-scan</Button>
            <Button size="sm" variant="secondary" iconLeft={<Download />}>Export · CSV</Button>
            <Button size="sm" variant="primary" iconLeft={<Shield />}>Quarantine queue</Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />scanner active</span>
            <span>last scan <span className="text-fg-2">2m ago</span></span>
            <span>records monitored <span className="text-fg-2">412k</span></span>
            <span>open issues <span className={cn(high > 0 && "text-danger")}>{dataQualityIssues.length}</span></span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Alert banner */}
        {high > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-danger/30 bg-danger/5 rounded-md p-3 flex items-start gap-3"
          >
            <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" strokeWidth={1.8} />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-fg">
                {high} high-severity issue{high > 1 ? "s" : ""} require review
              </div>
              <div className="text-[11.5px] text-fg-3 mt-0.5">
                ZoomInfo provider · circuit breaker open. Schema drift on{" "}
                <span className="font-mono">hubspot_contact.lifecycle_stage</span>. CRM writes
                blocked until resolved or marked safe.
              </div>
            </div>
            <Button size="xs" variant="secondary">Triage all</Button>
            <button className="h-6 w-6 rounded text-fg-4 hover:text-fg hover:bg-surface-2 inline-flex items-center justify-center">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        {/* Trust score + dimension grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card title="Trust score" subtitle="87 / 100 · weighted">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[44px] leading-none font-semibold text-fg tabular tracking-tight">87</div>
                <div className="text-[11px] text-fg-3 mt-1">good · safe to operate on this data</div>
              </div>
              <Badge tone="success" dot>+4 vs 7d</Badge>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { l: "Coverage", v: 88, w: "20%" },
                { l: "Accuracy", v: 92, w: "25%" },
                { l: "Freshness", v: 74, w: "15%" },
                { l: "Deliverability", v: 96, w: "20%" },
                { l: "Routing", v: 90, w: "10%" },
                { l: "Sync", v: 81, w: "10%" },
              ].map((d) => (
                <div key={d.l}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-fg-2">{d.l}</span>
                    <span className="text-fg-3 tabular">
                      <span className="text-fg font-medium">{d.v}</span> · weight {d.w}
                    </span>
                  </div>
                  <div className="h-1 bg-surface-2 rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.v}%` }}
                      transition={{ duration: 0.7 }}
                      className={cn(
                        "h-full",
                        d.v >= 90 ? "bg-success" : d.v >= 80 ? "bg-accent" : d.v >= 70 ? "bg-warning" : "bg-danger",
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Issue volume"
            subtitle="last 14 days · daily"
            className="xl:col-span-2"
            padded={false}
          >
            <div className="px-4 pt-4 pb-3 grid grid-cols-3 gap-3">
              {[
                { l: "High", v: high, t: "danger" as const },
                { l: "Medium", v: medium, t: "warning" as const },
                { l: "Low", v: low, t: "info" as const },
              ].map((s) => (
                <div key={s.l} className="border border-line rounded p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-fg-3 uppercase tracking-wider">{s.l}</span>
                    <Badge tone={s.t} dot pulse={s.v > 0 && s.t === "danger"}>{s.l}</Badge>
                  </div>
                  <div className="text-[24px] font-semibold tabular text-fg mt-1">{s.v}</div>
                  <div className="text-[10.5px] text-fg-4 tabular">open · auto-routed</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-end gap-1 h-[120px]">
                {Array.from({ length: 14 }).map((_, i) => {
                  const h1 = (Math.sin(i * 1.2) + 1) * 18 + 6;
                  const h2 = (Math.cos(i * 0.7) + 1) * 22 + 6;
                  const h3 = (Math.sin(i * 0.4) + 1) * 14 + 4;
                  return (
                    <div key={i} className="flex-1 flex flex-col gap-px justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: h1 }}
                        transition={{ duration: 0.5, delay: i * 0.02 }}
                        className="bg-danger/80"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: h2 }}
                        transition={{ duration: 0.5, delay: i * 0.025 }}
                        className="bg-warning/70"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: h3 }}
                        transition={{ duration: 0.5, delay: i * 0.03 }}
                        className="bg-info/60"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-fg-4 tabular mt-1.5">
                <span>−14d</span>
                <span>−7d</span>
                <span>today</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Open issues table */}
        <Card
          title="Open issues"
          subtitle={`${dataQualityIssues.length} total · ${high} high · ${medium} medium · ${low} low`}
          actions={
            <>
              <div className="relative">
                <Search className="h-3 w-3 text-fg-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  placeholder="search issues…"
                  className="h-7 pl-6 pr-2 text-[11.5px] bg-surface-2 border border-line rounded outline-none focus:border-accent/60 placeholder:text-fg-4 w-[180px]"
                />
              </div>
              <Button size="xs" variant="secondary">All severities</Button>
              <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>SLA report</Button>
            </>
          }
          padded={false}
        >
          <table className="w-full text-[12px] tabular">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 border-b border-line">
                <th className="text-left font-medium px-3 py-2 w-[80px]">Sev</th>
                <th className="text-left font-medium px-3 py-2">Type</th>
                <th className="text-left font-medium px-3 py-2">Entity</th>
                <th className="text-right font-medium px-3 py-2">Affected</th>
                <th className="text-left font-medium px-3 py-2">Detected</th>
                <th className="text-left font-medium px-3 py-2">Owner</th>
                <th className="text-left font-medium px-3 py-2 max-w-[400px]">Detail</th>
                <th className="w-[120px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dataQualityIssues.map((iss) => {
                const Icon = issueIcon[iss.type] ?? AlertCircle;
                return (
                  <tr key={iss.id} className="row-hover">
                    <td className="px-3 py-2.5">
                      <Badge tone={sevTone[iss.severity as "high" | "medium" | "low"]} dot pulse={iss.severity === "high"}>
                        {iss.severity}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="inline-flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.8} />
                        <span className="text-fg font-medium">{iss.type}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-fg-2 truncate max-w-[220px]">
                      {iss.entity}
                    </td>
                    <td className="px-3 py-2.5 text-right text-fg font-medium">
                      {formatNumber(iss.count)}
                    </td>
                    <td className="px-3 py-2.5 text-fg-3">{iss.detected}</td>
                    <td className="px-3 py-2.5 text-fg-3">
                      {iss.severity === "high" ? "RevOps" : iss.severity === "medium" ? "Maya R." : "auto"}
                    </td>
                    <td className="px-3 py-2.5 text-fg-3 max-w-[400px] truncate">{iss.message}</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="xs" variant="ghost">Snooze</Button>
                        <Button size="xs" variant="secondary" iconRight={<ChevronRight />}>Resolve</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Quality monitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              l: "Email deliverability",
              v: "96.4%",
              s: "good",
              i: Mail,
              meta: "29 hard bounces last 24h · auto-suppressed",
              tone: "success" as const,
            },
            {
              l: "Schema integrity",
              v: "1 drift",
              s: "review",
              i: AlertCircle,
              meta: "hubspot_contact.lifecycle_stage · new value RE-ENGAGED",
              tone: "warning" as const,
            },
            {
              l: "Duplicate ratio",
              v: "1.3%",
              s: "good",
              i: GitMerge,
              meta: "23 records flagged · 11 auto-merged · 12 pending",
              tone: "success" as const,
            },
            {
              l: "Provider availability",
              v: "2/9 degraded",
              s: "warn",
              i: Database,
              meta: "ZoomInfo down · Clearbit p95 1.42s · fallback ok",
              tone: "warning" as const,
            },
            {
              l: "Field completeness",
              v: "94.1%",
              s: "good",
              i: Hash,
              meta: "title, industry, headcount · re-enrichment scheduled",
              tone: "success" as const,
            },
            {
              l: "Routing fidelity",
              v: "100%",
              s: "good",
              i: BadgeCheck,
              meta: "0 misroutes · 0 SLA breaches · 38s avg",
              tone: "success" as const,
            },
            {
              l: "Sync conflict rate",
              v: "0.7%",
              s: "good",
              i: Sparkles,
              meta: "3 deals · stage divergence between SFDC + HubSpot",
              tone: "info" as const,
            },
            {
              l: "Freshness · headcount",
              v: "180d+",
              s: "stale",
              i: RefreshCw,
              meta: "312 companies · enrichment job queued",
              tone: "warning" as const,
            },
          ].map((m) => (
            <div key={m.l} className="bg-surface border border-line rounded-md p-3 hover:border-line-strong transition-colors">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <m.i className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.8} />
                  <span className="text-[12px] font-semibold text-fg truncate">{m.l}</span>
                </div>
                <Badge tone={m.tone} dot pulse={m.tone === "warning"}>
                  {m.s}
                </Badge>
              </div>
              <div className="text-[20px] font-semibold tabular text-fg mt-1.5">{m.v}</div>
              <div className="text-[10.5px] text-fg-3 mt-1 leading-snug line-clamp-2 min-h-[28px]">
                {m.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Broken automations */}
        <Card
          title="Broken automations"
          subtitle="surfaced from workflow runtime"
          actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Workflows</Button>}
          padded={false}
        >
          <ul className="divide-y divide-line">
            {[
              {
                t: "Daily ICP-A enrichment",
                desc: "ZoomInfo · 4 consecutive 5xx · circuit breaker open at 09:53",
                next: "fallback to Clearbit succeeding (92.4%)",
                sev: "high",
                node: "node-02 · ZoomInfo",
              },
              {
                t: "Reply → Meeting handoff",
                desc: "Slack DM · ‘maya@helix-internal.slack’ scope missing on @ravi",
                next: "fallback channel #revops-pings active",
                sev: "medium",
                node: "node-03 · Slack",
              },
              {
                t: "Closed-lost reactivation",
                desc: "Cron paused · last run 12d ago · awaiting Q4 ICP review",
                next: "manual unpause required",
                sev: "low",
                node: "trigger · Cron Q",
              },
            ].map((b) => (
              <li key={b.t} className="px-4 py-3 row-hover">
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "mt-0.5 h-5 w-5 rounded flex items-center justify-center shrink-0 border",
                    b.sev === "high" ? "border-danger/30 bg-danger/10" : b.sev === "medium" ? "border-warning/30 bg-warning/10" : "border-line bg-surface-2",
                  )}>
                    <AlertTriangle className={cn(
                      "h-3 w-3",
                      b.sev === "high" ? "text-danger" : b.sev === "medium" ? "text-warning" : "text-fg-3",
                    )} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12.5px] font-semibold text-fg truncate">{b.t}</span>
                      <Badge tone={sevTone[b.sev as "high" | "medium" | "low"]}>{b.sev}</Badge>
                      <span className="text-[10.5px] font-mono text-fg-4 ml-auto">{b.node}</span>
                    </div>
                    <div className="text-[11.5px] text-fg-3 mt-1">{b.desc}</div>
                    <div className="text-[11px] text-fg-2 mt-0.5 inline-flex items-center gap-1">
                      <Zap className="h-3 w-3 text-success" />
                      {b.next}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="xs" variant="ghost">Mute 24h</Button>
                    <Button size="xs" variant="secondary" iconRight={<ChevronRight />}>Open</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
