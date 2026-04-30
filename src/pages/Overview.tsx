import {
  Activity, ArrowRight, AlertTriangle, BadgeCheck, Bell,
  BarChart3, Calendar, CheckCircle2, Database, Download, Filter,
  GitBranch, Plus, Send, Sparkles, RefreshCw, ShieldAlert, Workflow,
} from "lucide-react";
import {
  Area, AreaChart, BarChart, Bar, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Line,
} from "recharts";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { KPI } from "../components/ui/KPI";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import {
  activity, channelAttribution, conversionByStage, kpiTrends, velocityData,
} from "../data/fixtures";
import {
  formatCompact, formatNumber, formatPercent,
} from "../lib/utils";
import { ChartTooltip, useChartColors } from "../components/charts/ChartTheme";

const lvlMap = {
  info: { tone: "neutral", label: "info" },
  success: { tone: "success", label: "ok" },
  warning: { tone: "warning", label: "warn" },
  error: { tone: "danger", label: "err" },
} as const;

const typeIcon = {
  enrichment: Database,
  sync: RefreshCw,
  sequence: Send,
  routing: GitBranch,
  alert: AlertTriangle,
  deal: BadgeCheck,
  ingest: Sparkles,
};

export function Overview() {
  const c = useChartColors();

  return (
    <>
      <PageHeader
        eyebrow="Today · Mon Apr 27"
        title="GTM systems are running"
        description="Operating snapshot across enrichment, outbound, and CRM. 2 providers degraded, 1 down. Pipeline +18% week-over-week."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>
              Filters
            </Button>
            <Button size="sm" variant="secondary" iconLeft={<Calendar />}>
              Last 14d
            </Button>
            <Button size="sm" variant="secondary" iconLeft={<Download />}>
              Export
            </Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>
              New automation
            </Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone="success" pulse /> all-systems
            </span>
            <span>
              last sync <span className="text-fg-2">21s ago</span>
            </span>
            <span>
              data window{" "}
              <span className="text-fg-2">Apr 14 → Apr 27</span>
            </span>
            <span>
              owner <span className="text-fg-2">Ravi Patel</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bell className="h-3 w-3 text-warning" /> 3 active alerts
            </span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* KPI strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 border border-line rounded-md overflow-hidden bg-line gap-px">
          <KPI
            label="Sourced leads"
            value={1748}
            delta={11.4}
            decimals={0}
            trend={kpiTrends.sourcedLeads}
            format={(v) => formatNumber(Math.round(v))}
            hint="14d"
          />
          <KPI
            label="Enriched"
            value={1697}
            delta={9.2}
            decimals={0}
            trend={kpiTrends.enrichedLeads}
            format={(v) => formatNumber(Math.round(v))}
            hint="97.1% rate"
          />
          <KPI
            label="Reply rate"
            value={8.1}
            delta={18.4}
            suffix="%"
            decimals={1}
            trend={kpiTrends.replyRate}
            format={(v) => v.toFixed(1)}
            hint="14d"
          />
          <KPI
            label="Meetings booked"
            value={41}
            delta={24.2}
            decimals={0}
            trend={kpiTrends.meetingsBooked}
            format={(v) => Math.round(v).toString()}
            hint="14d"
          />
          <KPI
            label="Opportunities"
            value={12}
            delta={33.3}
            decimals={0}
            trend={kpiTrends.oppCreated}
            format={(v) => Math.round(v).toString()}
            hint="created"
          />
          <KPI
            label="Pipeline value"
            value={812400}
            delta={18.0}
            prefix="$"
            decimals={0}
            trend={kpiTrends.pipelineValue}
            format={(v) => formatCompact(Math.round(v))}
            hint="open"
          />
        </section>

        {/* Secondary KPI strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 border border-line rounded-md overflow-hidden bg-line gap-px">
          <KPI
            label="Enrichment success"
            value={96.4}
            suffix="%"
            decimals={1}
            delta={1.8}
            trend={kpiTrends.enrichmentSuccess}
            format={(v) => v.toFixed(1)}
            hint="primary + fallback"
          />
          <KPI
            label="Dedupe rate"
            value={4.8}
            suffix="%"
            decimals={1}
            delta={0.6}
            trend={kpiTrends.dedupeRate}
            format={(v) => v.toFixed(1)}
            hint="merged 84"
          />
          <KPI
            label="CRM sync health"
            value={98.6}
            suffix="%"
            decimals={1}
            delta={-0.3}
            invertDelta
            trend={kpiTrends.syncHealth}
            format={(v) => v.toFixed(1)}
            hint="2 systems"
          />
          <KPI
            label="Booked / sourced"
            value={2.4}
            suffix="%"
            decimals={1}
            delta={0.4}
            trend={kpiTrends.bookedRate}
            format={(v) => v.toFixed(1)}
            hint="end-to-end"
          />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Pipeline velocity */}
          <Card
            title="Pipeline velocity"
            subtitle="weekly · last 9 weeks"
            actions={
              <>
                <Badge tone="ghost" dot>sourced</Badge>
                <Badge tone="ghost" dot>enriched</Badge>
                <Badge tone="accent" dot>opps</Badge>
                <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>
                  Inspect
                </Button>
              </>
            }
            className="xl:col-span-2"
            padded={false}
          >
            <div className="h-[260px] px-4 pb-3 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -16, bottom: 4 }}>
                  <defs>
                    <linearGradient id="grad-sourced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.muted} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={c.muted} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-enriched" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.info} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={c.info} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={c.grid} vertical={false} strokeDasharray="2 4" />
                  <XAxis
                    dataKey="week"
                    stroke={c.text}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10.5, fontFamily: "Inter" }}
                  />
                  <YAxis
                    stroke={c.text}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10.5, fontFamily: "Inter" }}
                    width={40}
                  />
                  <Tooltip
                    content={(p) => (
                      <ChartTooltip
                        active={p.active}
                        label={p.label}
                        payload={p.payload}
                        formatter={(v) => formatCompact(v)}
                      />
                    )}
                    cursor={{ stroke: c.line, strokeDasharray: "2 3" }}
                  />
                  <Area
                    name="sourced"
                    type="monotone"
                    dataKey="sourced"
                    stroke={c.muted}
                    strokeWidth={1.4}
                    fill="url(#grad-sourced)"
                  />
                  <Area
                    name="enriched"
                    type="monotone"
                    dataKey="enriched"
                    stroke={c.info}
                    strokeWidth={1.4}
                    fill="url(#grad-enriched)"
                  />
                  <Line
                    name="opps"
                    type="monotone"
                    dataKey="opps"
                    stroke={c.accent}
                    strokeWidth={2}
                    dot={{ r: 2.5, stroke: c.accent, fill: c.surface, strokeWidth: 1.5 }}
                    activeDot={{ r: 4, stroke: c.accent, fill: c.surface, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 border-t border-line">
              {[
                { label: "avg lead → opp", value: "14.2 days", delta: "-2.1d" },
                { label: "win rate (90d)", value: "26.4%", delta: "+3.1pp" },
                { label: "avg ACV", value: "$67,650", delta: "+$4.1k" },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3 border-r border-line last:border-r-0">
                  <div className="text-[10.5px] uppercase tracking-wider text-fg-3 font-medium">
                    {s.label}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-[16px] font-semibold tabular text-fg">{s.value}</div>
                    <div className="text-[11px] text-success tabular">{s.delta}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Channel attribution */}
          <Card
            title="Channel attribution"
            subtitle="pipeline $ · last 14d"
            actions={
              <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>
                Detail
              </Button>
            }
          >
            <ul className="space-y-3">
              {channelAttribution.map((ch) => (
                <li key={ch.channel} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="truncate text-fg-2">{ch.channel}</span>
                    <span className="tabular text-fg font-medium">
                      ${formatCompact(ch.value * 1000)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.share}%` }}
                      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                      className="h-full bg-accent"
                    />
                  </div>
                  <div className="text-[10.5px] text-fg-4 tabular">
                    {formatPercent(ch.share, 1)} of pipeline
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Funnel + Activity */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Conversion by stage */}
          <Card
            title="Conversion by stage"
            subtitle="end-to-end · 14d"
            className="xl:col-span-2"
            padded={false}
            actions={
              <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>
                Funnel
              </Button>
            }
          >
            <div className="px-4 py-4">
              <div className="grid grid-cols-9 gap-1 items-end h-[120px] mb-3">
                {conversionByStage.map((s, i) => (
                  <div key={s.stage} className="flex flex-col justify-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(2, s.rate)}%` }}
                      transition={{ duration: 0.7, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                      className={`w-full rounded-sm ${
                        i < 5
                          ? "bg-fg-3/30 hover:bg-fg-3/50"
                          : i < 8
                            ? "bg-accent/60 hover:bg-accent/80"
                            : "bg-accent hover:bg-accent/90"
                      } transition-colors`}
                      title={`${s.stage} · ${formatNumber(s.count)} (${s.rate}%)`}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-9 gap-1 text-[10px] text-fg-3">
                {conversionByStage.map((s) => (
                  <div key={s.stage} className="text-center truncate">
                    {s.stage}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-9 gap-1 text-[11px] tabular text-fg font-medium mt-1">
                {conversionByStage.map((s) => (
                  <div key={s.stage} className="text-center truncate">
                    {formatCompact(s.count)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-9 gap-1 text-[10px] tabular text-fg-3 mt-0.5">
                {conversionByStage.map((s) => (
                  <div key={s.stage} className="text-center truncate">
                    {s.rate}%
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* What changed today */}
          <Card
            title="What changed today"
            subtitle="activity · 12 events"
            actions={
              <>
                <Badge tone="success" dot pulse>live</Badge>
                <Button size="xs" variant="ghost">All</Button>
              </>
            }
            padded={false}
          >
            <ul className="divide-y divide-line max-h-[320px] overflow-y-auto">
              {activity.map((a) => {
                const lvl = lvlMap[a.level];
                const Icon = typeIcon[a.type];
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-2.5 px-4 py-2.5 row-hover group"
                  >
                    <span
                      className="mt-1 h-5 w-5 rounded border border-line bg-surface-2 flex items-center justify-center shrink-0"
                    >
                      <Icon className="h-3 w-3 text-fg-3" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone={lvl.tone} className="h-[16px] tracking-wide">
                          {a.type}
                        </Badge>
                        <span className="text-[10.5px] text-fg-4 tabular shrink-0">
                          {a.ts}
                        </span>
                      </div>
                      <div className="text-[12px] text-fg-2 mt-1 leading-snug">
                        {a.message}
                      </div>
                      {a.meta && (
                        <div className="font-mono text-[10.5px] text-fg-4 mt-0.5 truncate">
                          {a.meta}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        {/* System health row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card
            title="GTM stack"
            subtitle="9 providers · 2 degraded · 1 down"
            actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Workflows</Button>}
          >
            <ul className="divide-y divide-line -mx-4 -my-4">
              {[
                { n: "Apollo", c: "Source", s: "healthy", v: "99.94%" },
                { n: "Clearbit", c: "Enrich · fallback", s: "degraded", v: "99.10%" },
                { n: "ZoomInfo", c: "Enrich", s: "down", v: "circuit open" },
                { n: "NeverBounce", c: "Validate", s: "healthy", v: "99.99%" },
                { n: "Smartlead", c: "Send", s: "healthy", v: "99.78%" },
                { n: "Salesforce", c: "CRM", s: "healthy", v: "99.97%" },
              ].map((p) => (
                <li key={p.n} className="flex items-center gap-3 px-4 h-9">
                  <StatusDot
                    tone={p.s === "healthy" ? "success" : p.s === "degraded" ? "warning" : "danger"}
                    pulse={p.s !== "healthy"}
                  />
                  <span className="text-[12px] font-medium text-fg w-[110px] truncate">
                    {p.n}
                  </span>
                  <span className="text-[11px] text-fg-3 truncate flex-1">{p.c}</span>
                  <span
                    className={`text-[11px] tabular ${
                      p.s === "down" ? "text-danger" : p.s === "degraded" ? "text-warning" : "text-fg-3"
                    }`}
                  >
                    {p.v}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Active alerts"
            subtitle="3 open · 1 high"
            actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Triage</Button>}
          >
            <ul className="space-y-2.5">
              {[
                {
                  t: "ZoomInfo provider · circuit breaker open",
                  d: "4 consecutive 5xx since 09:53. Fallback to Clearbit succeeding (92.4%).",
                  s: "danger" as const,
                  age: "12m",
                },
                {
                  t: "Schema drift · hubspot_contact.lifecycle_stage",
                  d: "New value RE-ENGAGED not mapped to Helix → SFDC sync.",
                  s: "warning" as const,
                  age: "8m",
                },
                {
                  t: "23 leads share normalized email",
                  d: "Pending merge review · routed to Maya R.",
                  s: "warning" as const,
                  age: "1h",
                },
              ].map((a) => (
                <li key={a.t} className="border border-line rounded p-2.5 hover:bg-surface-2 transition-colors">
                  <div className="flex items-start gap-2">
                    <ShieldAlert
                      className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                        a.s === "danger" ? "text-danger" : "text-warning"
                      }`}
                      strokeWidth={1.8}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] font-medium text-fg truncate">{a.t}</span>
                        <span className="text-[10.5px] text-fg-4 tabular shrink-0">{a.age}</span>
                      </div>
                      <p className="text-[11.5px] text-fg-3 mt-0.5 leading-snug">{a.d}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Today’s sequences"
            subtitle="4 active · 818 sends queued"
            actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Sequences</Button>}
            padded={false}
          >
            <div className="h-[120px] px-4 pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { h: "07", sent: 12, replied: 0 },
                    { h: "08", sent: 48, replied: 2 },
                    { h: "09", sent: 134, replied: 9 },
                    { h: "10", sent: 188, replied: 14 },
                    { h: "11", sent: 142, replied: 11 },
                    { h: "12", sent: 88, replied: 5 },
                    { h: "13", sent: 102, replied: 6 },
                    { h: "14", sent: 76, replied: 4 },
                    { h: "15", sent: 18, replied: 1 },
                  ]}
                  margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                  barCategoryGap="22%"
                >
                  <CartesianGrid stroke={c.grid} strokeDasharray="2 3" vertical={false} />
                  <XAxis dataKey="h" stroke={c.text} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis stroke={c.text} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={28} />
                  <Tooltip content={(p) => <ChartTooltip active={p.active} label={p.label} payload={p.payload} />} cursor={{ fill: c.grid }} />
                  <Bar dataKey="sent" fill={c.muted} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="replied" fill={c.accent} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-line divide-y divide-line">
              {[
                { n: "ICP-A Founders / EU", a: 318, r: "9.4% reply" },
                { n: "Tier-1 Reactivation", a: 102, r: "11.8% reply" },
                { n: "Inbound Speed-to-Lead", a: 18, r: "22.4% reply" },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3 px-4 h-9">
                  <Send className="h-3 w-3 text-fg-3" strokeWidth={1.8} />
                  <span className="text-[12px] text-fg flex-1 truncate">{s.n}</span>
                  <span className="text-[10.5px] text-fg-3 tabular">{s.a} active</span>
                  <span className="text-[10.5px] text-success tabular">{s.r}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Bottom rail */}
        <section className="border border-line rounded-md bg-surface px-4 py-3 flex items-center gap-3 text-[11.5px] text-fg-3 tabular">
          <Activity className="h-3 w-3 text-fg-4" />
          <span>Last warehouse refresh <span className="text-fg-2">2m 14s ago</span></span>
          <span>·</span>
          <span>Helix engine <span className="text-fg-2">v0.18.4</span></span>
          <span>·</span>
          <span>4 jobs running, 0 failed</span>
          <span className="ml-auto inline-flex items-center gap-2">
            <BarChart3 className="h-3 w-3" />
            <span>uptime <span className="text-fg-2">99.94%</span></span>
            <Workflow className="h-3 w-3 ml-2" />
            <span>4 workflows active</span>
            <CheckCircle2 className="h-3 w-3 ml-2 text-success" />
            <span className="text-success">all SLOs green</span>
          </span>
        </section>
      </div>
    </>
  );
}
