import { useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowRight, Boxes, Building2, CheckCircle2,
  ChevronRight, CircleDashed, CircleDot, Database, Download,
  Filter, GitMerge, Globe2, Hash, LinkIcon, Mail, MapPin, Plus,
  RefreshCw, Search, Sparkles, ShieldAlert, ShieldCheck,
  TrendingUp, Users, X, Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { Avatar } from "../components/ui/Avatar";
import { Drawer } from "../components/ui/Drawer";
import { leads, type Lead } from "../data/fixtures";
import { cn, formatNumber, formatPercent } from "../lib/utils";

const stageOrder = ["sourced", "enriched", "scored", "routed", "synced"] as const;
type Stg = (typeof stageOrder)[number];

const pipelineSteps = [
  {
    id: "src",
    title: "Source",
    desc: "Pull from data providers + inbound forms",
    providers: ["Apollo", "LinkedIn Sales Nav", "Webform /demo"],
    status: "healthy" as const,
    in: 1748,
    out: 1748,
    p95: "412ms",
    icon: Database,
  },
  {
    id: "validate",
    title: "Validate · Email",
    desc: "Syntax + MX + bounce risk score",
    providers: ["NeverBounce"],
    status: "healthy" as const,
    in: 1748,
    out: 1697,
    p95: "188ms",
    icon: ShieldCheck,
  },
  {
    id: "enrich-1",
    title: "Enrich · Person",
    desc: "Title · seniority · LinkedIn",
    providers: ["Apollo (primary)", "Clearbit (fallback)"],
    status: "degraded" as const,
    in: 1697,
    out: 1640,
    p95: "1.42s",
    icon: Sparkles,
  },
  {
    id: "enrich-2",
    title: "Enrich · Company",
    desc: "Firmographic · funding · technographic",
    providers: ["Clearbit", "ZoomInfo (fallback · circuit open)"],
    status: "degraded" as const,
    in: 1640,
    out: 1576,
    p95: "1.91s",
    icon: Building2,
  },
  {
    id: "dedupe",
    title: "Dedupe",
    desc: "Normalized email + domain match · 0.92 threshold",
    providers: ["Helix engine"],
    status: "healthy" as const,
    in: 1576,
    out: 1488,
    p95: "44ms",
    icon: GitMerge,
  },
  {
    id: "score",
    title: "Score",
    desc: "ICP fit · intent · technographic · engagement",
    providers: ["Helix scoring v0.18"],
    status: "healthy" as const,
    in: 1488,
    out: 1488,
    p95: "12ms",
    icon: Hash,
  },
  {
    id: "route",
    title: "Route",
    desc: "AE pool · SDR · queue · Slack notify",
    providers: ["Helix router"],
    status: "healthy" as const,
    in: 1488,
    out: 1244,
    p95: "8ms",
    icon: TrendingUp,
  },
  {
    id: "sync",
    title: "Sync",
    desc: "Bi-directional · conflict resolution · upserts",
    providers: ["Salesforce", "HubSpot"],
    status: "healthy" as const,
    in: 1244,
    out: 1244,
    p95: "688ms",
    icon: ArrowDownToLine,
  },
];

const stageTone: Record<Stg, string> = {
  sourced: "bg-fg-3/15 text-fg-2",
  enriched: "bg-info/10 text-info",
  scored: "bg-warning/10 text-warning",
  routed: "bg-accent/15 text-accent",
  synced: "bg-success/10 text-success",
};

export function Enrichment() {
  const [open, setOpen] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "ICP-A" | "ICP-B" | "Watch">("all");

  const visible = useMemo(() => {
    const filtered =
      filter === "all"
        ? leads
        : leads.filter((l) => l.tags?.includes(filter));
    return filtered.slice(0, 24);
  }, [filter]);

  return (
    <>
      <PageHeader
        eyebrow="Pipeline · Live"
        title="Lead enrichment pipeline"
        description="8-stage pipeline from source to CRM. Two enrichment providers degraded — Clearbit fallback covering 92.4%."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<Download />}>Export</Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>Run job</Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />8 stages active</span>
            <span>throughput <span className="text-fg-2">~141 leads/min</span></span>
            <span>p95 end-to-end <span className="text-fg-2">4.6s</span></span>
            <span>fallbacks last hour <span className="text-warning">27</span></span>
            <span>last run <span className="text-fg-2">14s ago</span></span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Pipeline visualization */}
        <Card
          title="Stage flow"
          subtitle="sourced → enriched → scored → routed → synced"
          actions={
            <>
              <Badge tone="success" dot pulse>live</Badge>
              <Button size="xs" variant="ghost" iconLeft={<RefreshCw />}>Replay</Button>
              <Button size="xs" variant="ghost">Edit</Button>
            </>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] grid grid-cols-8 divide-x divide-line">
              {pipelineSteps.map((s, i) => {
                const Icon = s.icon;
                const passRate = (s.out / s.in) * 100;
                return (
                  <div key={s.id} className="flex flex-col p-3 bg-surface relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9.5px] uppercase tracking-[0.1em] text-fg-4 font-medium tabular">
                        STEP · {String(i + 1).padStart(2, "0")}
                      </span>
                      <StatusDot
                        tone={
                          s.status === "healthy"
                            ? "success"
                            : s.status === "degraded"
                              ? "warning"
                              : "danger"
                        }
                        pulse={s.status !== "healthy"}
                      />
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="h-6 w-6 rounded border border-line bg-surface-2 flex items-center justify-center">
                        <Icon className="h-3 w-3 text-fg-2" strokeWidth={1.8} />
                      </span>
                      <span className="text-[12.5px] font-semibold text-fg truncate">{s.title}</span>
                    </div>
                    <div className="text-[10.5px] text-fg-3 leading-snug mb-2 line-clamp-2 min-h-[28px]">
                      {s.desc}
                    </div>
                    <div className="space-y-0.5 mb-2 min-h-[40px]">
                      {s.providers.map((p) => (
                        <div key={p} className="flex items-center gap-1.5 text-[10px] text-fg-3 truncate">
                          <CircleDot className="h-2 w-2 text-fg-4 shrink-0" />
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-line">
                      <div>
                        <div className="text-[9.5px] uppercase tracking-wider text-fg-4">In</div>
                        <div className="text-[13px] tabular font-semibold text-fg">{formatNumber(s.in)}</div>
                      </div>
                      <div>
                        <div className="text-[9.5px] uppercase tracking-wider text-fg-4">Out · {passRate.toFixed(1)}%</div>
                        <div className="text-[13px] tabular font-semibold text-fg">{formatNumber(s.out)}</div>
                      </div>
                    </div>
                    <div className="mt-1.5 h-1 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passRate}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        className={cn(
                          "h-full",
                          s.status === "healthy" ? "bg-success" : s.status === "degraded" ? "bg-warning" : "bg-danger",
                        )}
                      />
                    </div>
                    <div className="text-[9.5px] text-fg-4 tabular mt-1">p95 · {s.p95}</div>
                    {i < pipelineSteps.length - 1 && (
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-4 w-4 rounded-full bg-bg border border-line flex items-center justify-center">
                        <ChevronRight className="h-2.5 w-2.5 text-fg-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Filter rail + table */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <Card
            title="Provider stack"
            subtitle="primary + fallback"
            className="xl:col-span-1"
            actions={<Badge tone="warning" dot>2 degraded</Badge>}
            padded={false}
          >
            <ul className="divide-y divide-line">
              {[
                { name: "Apollo", role: "Primary · person", reqs: 18432, ok: 99.6, status: "healthy" },
                { name: "Clearbit", role: "Primary · company", reqs: 12104, ok: 92.4, status: "degraded" },
                { name: "ZoomInfo", role: "Fallback · person", reqs: 982, ok: 0, status: "down" },
                { name: "NeverBounce", role: "Validate · email", reqs: 21044, ok: 99.8, status: "healthy" },
                { name: "Hunter", role: "Backfill · email", reqs: 311, ok: 96.1, status: "healthy" },
              ].map((p) => (
                <li key={p.name} className="px-4 py-2.5 flex items-center gap-3 row-hover">
                  <StatusDot
                    tone={p.status === "healthy" ? "success" : p.status === "degraded" ? "warning" : "danger"}
                    pulse={p.status !== "healthy"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium text-fg truncate">{p.name}</div>
                    <div className="text-[10.5px] text-fg-3 truncate">{p.role}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn(
                      "text-[12px] tabular font-medium",
                      p.ok > 99 ? "text-fg" : p.ok > 90 ? "text-warning" : "text-danger",
                    )}>
                      {formatPercent(p.ok, 1)}
                    </div>
                    <div className="text-[10px] text-fg-4 tabular">
                      {formatNumber(p.reqs)}/24h
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Coverage", v: "98.6%" },
                { l: "Cache hit", v: "41%" },
                { l: "Spend / lead", v: "$0.21" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[10px] uppercase tracking-wider text-fg-3">{s.l}</div>
                  <div className="text-[13px] tabular font-semibold text-fg mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Records table */}
          <Card
            title="Records · live"
            subtitle={`${visible.length} of ${leads.length} · stream`}
            actions={
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Search className="h-3 w-3 text-fg-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    placeholder="search records…"
                    className="h-7 pl-6 pr-2 text-[11.5px] bg-surface-2 border border-line rounded outline-none focus:border-accent/60 placeholder:text-fg-4 w-[180px]"
                  />
                </div>
                <div className="flex border border-line rounded overflow-hidden text-[10.5px] tabular">
                  {(["all", "ICP-A", "ICP-B", "Watch"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={cn(
                        "px-2 h-7 transition-colors",
                        filter === t
                          ? "bg-accent text-accent-fg"
                          : "text-fg-3 hover:bg-surface-2 hover:text-fg",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            }
            padded={false}
            className="xl:col-span-3"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] tabular">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 sticky top-0 bg-surface z-10 border-b border-line">
                    <th className="text-left font-medium px-3 py-2">Record</th>
                    <th className="text-left font-medium px-3 py-2">Company</th>
                    <th className="text-left font-medium px-3 py-2">Stage</th>
                    <th className="text-right font-medium px-3 py-2">Score</th>
                    <th className="text-right font-medium px-3 py-2">Conf.</th>
                    <th className="text-left font-medium px-3 py-2">Provider</th>
                    <th className="text-left font-medium px-3 py-2">Owner</th>
                    <th className="text-right font-medium px-3 py-2">Last touch</th>
                    <th className="w-6 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visible.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setOpen(l)}
                      className="row-hover cursor-pointer group"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={l.name} size={20} />
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-medium text-fg truncate max-w-[160px]">{l.name}</div>
                            <div className="text-[10.5px] text-fg-3 truncate max-w-[160px]">{l.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-fg-2 truncate max-w-[150px]">{l.company}</div>
                          <div className="text-[10.5px] text-fg-4 truncate max-w-[150px]">{l.domain}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 h-[20px] px-1.5 rounded text-[10.5px] font-medium uppercase tracking-wide",
                            stageTone[
                              (stageOrder as readonly string[]).includes(l.stage)
                                ? (l.stage as Stg)
                                : "sourced"
                            ],
                          )}
                        >
                          <CircleDot className="h-2 w-2" />
                          {l.stage}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ScoreBar score={l.score} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={cn(
                          "tabular text-[11.5px]",
                          l.confidence > 0.85 ? "text-success" : l.confidence > 0.65 ? "text-warning" : "text-danger",
                        )}>
                          {(l.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          {l.providerStack.slice(0, 3).map((p) => (
                            <span
                              key={p}
                              className="text-[10px] px-1 h-[18px] inline-flex items-center rounded bg-surface-2 text-fg-3 border border-line tabular"
                              title={p}
                            >
                              {p.slice(0, 4)}
                            </span>
                          ))}
                          {l.providerStack.length > 3 && (
                            <span className="text-[10px] text-fg-4">+{l.providerStack.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-fg-3 text-[11.5px]">{l.owner}</td>
                      <td className="px-3 py-2 text-right text-fg-3 text-[11px]">
                        {l.lastTouch ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ChevronRight className="h-3 w-3 text-fg-4 group-hover:text-fg-2" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="border-t border-line h-9 px-3 flex items-center justify-between text-[11px] text-fg-3 tabular">
              <span>Showing {visible.length} · auto-refresh 30s</span>
              <span className="inline-flex items-center gap-3">
                <span>median enrich · 1.42s</span>
                <span>·</span>
                <span>fallback rate · 4.8%</span>
                <span>·</span>
                <span>cache hit · 41%</span>
              </span>
            </footer>
          </Card>
        </div>
      </div>

      <LeadDetailDrawer lead={open} onClose={() => setOpen(null)} />
    </>
  );
}

function ScoreBar({ score }: { score: number }) {
  const tone = score >= 80 ? "bg-success" : score >= 60 ? "bg-accent" : score >= 40 ? "bg-warning" : "bg-danger";
  return (
    <div className="inline-flex items-center gap-2 justify-end">
      <span className="text-[11.5px] tabular font-medium text-fg w-7 text-right">{score}</span>
      <div className="w-16 h-1 bg-surface-2 rounded-full overflow-hidden">
        <div className={cn("h-full", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function LeadDetailDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  return (
    <Drawer
      open={!!lead}
      onClose={onClose}
      title={lead ? lead.name : ""}
      subtitle={lead ? `${lead.id} · ${lead.title}` : ""}
      width={520}
      footer={
        <>
          <Button variant="ghost" size="sm">Discard</Button>
          <Button variant="secondary" size="sm">Re-enrich</Button>
          <Button variant="primary" size="sm" iconRight={<ArrowRight />}>
            Sync to CRM
          </Button>
        </>
      }
    >
      {lead && (
        <div className="px-4 py-4 space-y-5 text-[12px]">
          {/* Identity */}
          <section className="flex items-start gap-3">
            <Avatar name={lead.name} size={44} square className="text-[15px]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] font-semibold text-fg">{lead.name}</span>
                <Badge tone={lead.intent === "high" ? "accent" : lead.intent === "medium" ? "warning" : "neutral"}>
                  intent · {lead.intent}
                </Badge>
                {lead.tags?.map((t) => (
                  <Badge key={t} tone="info">{t}</Badge>
                ))}
              </div>
              <div className="text-fg-3 text-[12px] mt-0.5">{lead.title} · {lead.company}</div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11.5px] text-fg-3">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className={lead.emailValid ? "text-fg-2" : "text-danger"}>
                    {lead.email}
                  </span>
                  {lead.emailValid ? (
                    <CheckCircle2 className="h-3 w-3 text-success" />
                  ) : (
                    <X className="h-3 w-3 text-danger" />
                  )}
                </span>
                <span className="inline-flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  <a className="text-fg-2 hover:text-accent truncate">{lead.linkedin}</a>
                </span>
              </div>
            </div>
          </section>

          {/* Score breakdown */}
          <section className="border border-line rounded-md p-3 bg-surface-2/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-fg-3 font-medium">
                Score breakdown
              </span>
              <span className="text-[18px] font-semibold tabular text-fg">{lead.score}</span>
            </div>
            <div className="space-y-2">
              {Object.entries(lead.scoreBreakdown).map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fg-2 capitalize">{k}</span>
                    <span className="tabular text-fg">{v}/30</span>
                  </div>
                  <div className="h-1 bg-surface rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v / 30) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Firmographic */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2">
              Firmographic
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { l: "Industry", v: lead.industry, i: Boxes },
                { l: "Headcount", v: lead.size, i: Users },
                { l: "Region", v: lead.region, i: Globe2 },
                { l: "Domain", v: lead.domain, i: LinkIcon },
                { l: "HQ", v: "—", i: MapPin },
                { l: "ARR signal", v: lead.arr ? `$${formatNumber(lead.arr)}` : "—", i: TrendingUp },
              ].map((f) => (
                <div key={f.l} className="flex items-start gap-2">
                  <f.i className="h-3 w-3 text-fg-4 mt-0.5" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <div className="text-[10.5px] text-fg-3 uppercase tracking-wider">{f.l}</div>
                    <div className="text-[12px] text-fg truncate">{f.v}</div>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* Data provenance */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2">
              Data provenance
            </div>
            <ul className="space-y-1.5">
              {[
                { f: "title", p: "Apollo", t: "98%" },
                { f: "linkedin", p: "Apollo", t: "100%" },
                { f: "email", p: "Apollo + NeverBounce", t: "94%" },
                { f: "industry", p: "Clearbit", t: "92%" },
                { f: "headcount", p: "Clearbit", t: "84%" },
                { f: "intent", p: "G2 (fallback)", t: "61%" },
              ].map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-[11.5px] tabular">
                  <span className="text-fg-3 w-[80px] truncate">{p.f}</span>
                  <span className="text-fg-2 flex-1 truncate">{p.p}</span>
                  <Badge
                    tone={
                      parseInt(p.t) > 90 ? "success" : parseInt(p.t) > 75 ? "warning" : "danger"
                    }
                    className="h-[18px]"
                  >
                    {p.t}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          {/* Provenance issues */}
          {lead.missingFields.length > 0 && (
            <section className="rounded border border-warning/30 bg-warning/5 p-2.5 flex items-start gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
              <div className="text-[11.5px]">
                <div className="text-fg font-medium">{lead.missingFields.length} fields missing</div>
                <div className="text-fg-3 mt-0.5">
                  Re-enrichment scheduled for next run. Missing: {lead.missingFields.join(", ")}
                </div>
              </div>
            </section>
          )}

          {/* Activity timeline */}
          <section>
            <div className="text-[11px] uppercase tracking-wider text-fg-3 font-medium mb-2">
              Pipeline timeline
            </div>
            <ol className="relative space-y-3 ml-2 pl-3 border-l border-line">
              {[
                { t: "Sourced", d: "Apollo · Q4 Founders EU list", time: "2d ago", icon: Database },
                { t: "Enriched · person", d: "Apollo +6 fields", time: "2d ago", icon: Sparkles },
                { t: "Enriched · company", d: "Clearbit fallback (ZoomInfo down)", time: "2d ago", icon: Building2 },
                { t: "Validated", d: "NeverBounce · deliverable", time: "2d ago", icon: ShieldCheck },
                { t: "Scored", d: "ICP fit 78 · intent 21", time: "2d ago", icon: Hash },
                { t: "Routed", d: "AE pool · Tier-1", time: "1d ago", icon: TrendingUp },
                { t: "Synced", d: "Salesforce · Lead-1748", time: "23h ago", icon: ArrowDownToLine },
                { t: "Engaged", d: "Sequence · ICP-A Founders / EU · step 1", time: "20h ago", icon: Zap },
                { t: "Replied", d: "Positive · ‘open to a 15m intro’", time: "8h ago", icon: CheckCircle2 },
              ].map((e, i) => {
                const Icon = e.icon;
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
              {/* Future state */}
              <li className="flex gap-3 items-start opacity-60">
                <span className="absolute -left-[5px] mt-1 h-2 w-2 rounded-full bg-fg-4 border-2 border-bg" />
                <span className="h-5 w-5 rounded border border-dashed border-line bg-surface-2 flex items-center justify-center shrink-0">
                  <CircleDashed className="h-3 w-3 text-fg-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-fg-3">Booked (pending)</div>
                  <div className="text-[11.5px] text-fg-4">awaiting calendar selection</div>
                </div>
              </li>
            </ol>
          </section>
        </div>
      )}
    </Drawer>
  );
}
