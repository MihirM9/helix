import { useState } from "react";
import {
  ArrowRight, BadgeCheck, Brain,
  ChevronRight, Clock, Code2, Database,
  FileJson, Filter, GitBranch, Pause, Play, Plus, Power,
  RefreshCw, Send, Settings, ShieldCheck, Sparkles, Workflow as WorkflowIcon,
  Zap,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { providers, workflows } from "../data/fixtures";
import { cn, formatNumber } from "../lib/utils";

const nodeIcons: Record<string, any> = {
  "Form": FileJson,
  "Webform": FileJson,
  "Webform /demo": FileJson,
  "Cron 06:00": Clock,
  "Cron Q": Clock,
  "Smartlead webhook": Send,
  "Apollo": Database,
  "LinkedIn Sales Nav": Database,
  "ZoomInfo": Database,
  "Clearbit": Sparkles,
  "NeverBounce": ShieldCheck,
  "Hunter": ShieldCheck,
  "Smartlead": Send,
  "Salesforce": BadgeCheck,
  "HubSpot": BadgeCheck,
  "Snowflake": Database,
  "Score": Brain,
  "Route": GitBranch,
  "Slack ping": Zap,
  "Slack DM": Zap,
  "Dedupe": GitBranch,
  "Title diff": Brain,
  "Intent detect": Brain,
};

const beforeAfter = [
  { task: "Pull list from Apollo", before: "manual export · 8m", after: "auto · cron 06:00", saved: "~40m/d" },
  { task: "Enrich firmographic", before: "spreadsheet vlookup", after: "Clearbit + ZoomInfo fallback", saved: "~2h/d" },
  { task: "Validate emails", before: "free tool · paste", after: "NeverBounce · in-pipeline", saved: "~30m/d" },
  { task: "Dedupe vs SFDC", before: "weekly RevOps cleanup", after: "Helix engine · 0.92 threshold", saved: "~3h/wk" },
  { task: "Score for ICP-A", before: "AE judgment", after: "model · 87 F1", saved: "~1h/d" },
  { task: "Route hot leads", before: "round-robin in Slack", after: "rule · score>=72 ∧ ICP=A", saved: "speed-to-lead 11m → 38s" },
  { task: "Sync to CRM", before: "CSV upload", after: "bi-directional · 60s", saved: "near real-time" },
];

const providerCategoryIcon: Record<string, any> = {
  Source: Database,
  Enrich: Sparkles,
  Validate: ShieldCheck,
  Send: Send,
  CRM: BadgeCheck,
  Reporting: Database,
};

export function Workflows() {
  const [active, setActive] = useState(workflows[0].id);
  const w = workflows.find((x) => x.id === active) ?? workflows[0];

  return (
    <>
      <PageHeader
        eyebrow="Automations · 4 active"
        title="Workflow runtime"
        description="Connected tools and structured workflows across the GTM stack. Each node is a typed function; failure surfaces here, not in someone’s inbox."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<Code2 />}>YAML</Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>New workflow</Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />engine v0.18.4</span>
            <span>runs today <span className="text-fg-2">88</span></span>
            <span>fail rate <span className="text-success">0.6%</span></span>
            <span>avg p95 <span className="text-fg-2">9.4s</span></span>
            <span>queued jobs <span className="text-fg-2">12</span></span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Workflow grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3">
          {workflows.map((wf) => {
            const isActive = wf.id === active;
            return (
              <button
                key={wf.id}
                onClick={() => setActive(wf.id)}
                className={cn(
                  "text-left bg-surface border rounded-md p-3 transition-all min-w-0 group",
                  isActive ? "border-accent/60 ring-2 ring-accent/20" : "border-line hover:border-line-strong",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="inline-flex items-center gap-2">
                    <WorkflowIcon className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.8} />
                    <span className="text-[10.5px] font-mono text-fg-4 tabular">{wf.id.toUpperCase()}</span>
                  </div>
                  <Badge
                    tone={wf.status === "healthy" ? "success" : wf.status === "degraded" ? "warning" : "danger"}
                    dot
                    pulse={wf.status !== "healthy"}
                  >
                    {wf.status}
                  </Badge>
                </div>
                <div className="text-[13px] font-semibold text-fg leading-snug">{wf.name}</div>
                <div className="text-[11px] text-fg-3 mt-1 line-clamp-2 min-h-[28px]">{wf.desc}</div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-[10.5px] tabular border-t border-line pt-2">
                  <div>
                    <div className="text-fg-4 uppercase tracking-wider text-[9.5px]">runs/24h</div>
                    <div className="text-fg font-medium mt-0.5">{wf.runs24h}</div>
                  </div>
                  <div>
                    <div className="text-fg-4 uppercase tracking-wider text-[9.5px]">success</div>
                    <div className={cn("font-medium mt-0.5", wf.successRate > 99 ? "text-success" : wf.successRate > 95 ? "text-warning" : "text-danger")}>
                      {wf.successRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-fg-4 uppercase tracking-wider text-[9.5px]">p95</div>
                    <div className="text-fg font-medium mt-0.5">{wf.avgRuntime}</div>
                  </div>
                </div>
                <div className="text-[10.5px] text-fg-4 mt-1.5">last run · {wf.lastRun}</div>
              </button>
            );
          })}
        </div>

        {/* Selected workflow node graph */}
        <Card
          title={w.name}
          subtitle={`${w.nodes.length} nodes · ${w.runs24h} runs/24h · last ${w.lastRun}`}
          actions={
            <>
              <Button size="xs" variant="ghost" iconLeft={<Settings />}>Config</Button>
              <Button size="xs" variant="secondary" iconLeft={<RefreshCw />}>Run now</Button>
              <Button size="xs" variant="secondary" iconLeft={w.status === "healthy" ? <Pause /> : <Play />}>
                {w.status === "healthy" ? "Pause" : "Resume"}
              </Button>
            </>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <div className="min-w-max px-4 py-6 flex items-center gap-3">
              {w.nodes.map((n, i) => {
                const Icon = nodeIcons[n] ?? Database;
                const isLast = i === w.nodes.length - 1;
                return (
                  <div key={n} className="flex items-center gap-3 shrink-0">
                    <div
                      className={cn(
                        "relative flex flex-col items-center bg-surface border rounded-md px-3 py-2 min-w-[120px] hover:border-accent/50 transition-colors group",
                        i === 0 ? "border-accent/40" : "border-line",
                      )}
                    >
                      <div className="absolute -top-1.5 left-2 text-[9px] uppercase tracking-wider text-fg-4 bg-surface px-1 tabular">
                        node {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="h-3.5 w-3.5 text-fg-3 shrink-0" strokeWidth={1.8} />
                        <span className="text-[12px] font-medium text-fg truncate">{n}</span>
                        <StatusDot
                          tone={
                            (i === 1 && w.status === "degraded") ? "warning" : "success"
                          }
                          pulse={i === 1 && w.status === "degraded"}
                          className="ml-auto"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full mt-1.5 text-[9.5px] text-fg-4 tabular">
                        <span>{["typed", "primary", "schema-mapped", "monitored", "verified", "logged"][i % 6]}</span>
                        <span>{["12ms", "412ms", "188ms", "8ms", "688ms", "44ms"][i % 6]}</span>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-px w-8 bg-gradient-to-r from-line via-line-strong to-line" />
                        <ChevronRight className="h-3 w-3 text-fg-4 absolute" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Run log */}
          <div className="border-t border-line">
            <div className="flex items-center justify-between px-4 h-9 text-[11px] text-fg-3">
              <span className="font-medium uppercase tracking-wider">Recent runs</span>
              <Button size="xs" variant="ghost" iconRight={<ArrowRight />}>All</Button>
            </div>
            <table className="w-full text-[12px] tabular">
              <thead className="border-y border-line">
                <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3">
                  <th className="text-left font-medium px-3 py-1.5">Run ID</th>
                  <th className="text-left font-medium px-3 py-1.5">Started</th>
                  <th className="text-right font-medium px-3 py-1.5">Duration</th>
                  <th className="text-right font-medium px-3 py-1.5">Records</th>
                  <th className="text-left font-medium px-3 py-1.5">Status</th>
                  <th className="text-left font-medium px-3 py-1.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  { id: "RUN-09812", t: "10:03:14", d: "11.4s", r: 188, s: "success", n: "all nodes ok" },
                  { id: "RUN-09811", t: "09:48:51", d: "12.1s", r: 162, s: "success", n: "1 retry · NeverBounce 503" },
                  { id: "RUN-09810", t: "09:33:02", d: "9.8s", r: 144, s: "success", n: "—" },
                  { id: "RUN-09809", t: "09:18:44", d: "21.0s", r: 312, s: "warn", n: "ZoomInfo timeout · fallback ok" },
                  { id: "RUN-09808", t: "09:00:00", d: "10.2s", r: 188, s: "success", n: "—" },
                  { id: "RUN-09807", t: "08:48:11", d: "12.0s", r: 174, s: "success", n: "—" },
                  { id: "RUN-09806", t: "08:33:02", d: "11.9s", r: 188, s: "success", n: "—" },
                  { id: "RUN-09805", t: "08:18:14", d: "32.4s", r: 412, s: "fail", n: "ZoomInfo 5xx · circuit breaker open" },
                ].map((r) => (
                  <tr key={r.id} className="row-hover">
                    <td className="px-3 py-1.5 font-mono text-fg-2">{r.id}</td>
                    <td className="px-3 py-1.5 text-fg-3">{r.t}</td>
                    <td className="px-3 py-1.5 text-right text-fg-2">{r.d}</td>
                    <td className="px-3 py-1.5 text-right text-fg-2">{formatNumber(r.r)}</td>
                    <td className="px-3 py-1.5">
                      <Badge
                        tone={r.s === "success" ? "success" : r.s === "warn" ? "warning" : "danger"}
                        dot
                      >
                        {r.s}
                      </Badge>
                    </td>
                    <td className="px-3 py-1.5 text-fg-3 truncate max-w-[300px]">{r.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Connected stack + before-after */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card
            title="Connected stack"
            subtitle="9 providers · last 24h"
            className="xl:col-span-2"
            padded={false}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-line">
              {providers.map((p) => {
                const Icon = providerCategoryIcon[p.category] ?? Database;
                return (
                  <div key={p.id} className="p-3 hover:bg-surface-2 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-fg-3" strokeWidth={1.8} />
                        <span className="text-[12.5px] font-semibold text-fg truncate">{p.name}</span>
                      </div>
                      <StatusDot
                        tone={p.status === "healthy" ? "success" : p.status === "degraded" ? "warning" : "danger"}
                        pulse={p.status !== "healthy"}
                      />
                    </div>
                    <div className="text-[10.5px] text-fg-3 mt-0.5 uppercase tracking-wider font-medium">
                      {p.category}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[10.5px] tabular">
                      <div>
                        <div className="text-fg-4 text-[9.5px] uppercase tracking-wider">uptime</div>
                        <div className="font-medium text-fg mt-0.5">{p.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-fg-4 text-[9.5px] uppercase tracking-wider">p95</div>
                        <div className="font-medium text-fg mt-0.5">{p.p95Latency}</div>
                      </div>
                      <div>
                        <div className="text-fg-4 text-[9.5px] uppercase tracking-wider">success</div>
                        <div className={cn(
                          "font-medium mt-0.5",
                          p.successRate > 99 ? "text-success" : p.successRate > 90 ? "text-warning" : "text-danger",
                        )}>
                          {p.successRate}%
                        </div>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-fg-4 tabular mt-1.5">
                      {formatNumber(p.reqs24h)} reqs · {p.lastRun}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Manual handoffs · automated" subtitle="founder time saved">
            <ul className="space-y-3">
              {beforeAfter.map((row, i) => (
                <li key={row.task}>
                  <div className="flex items-center justify-between text-[11.5px] mb-1">
                    <span className="font-medium text-fg truncate">{row.task}</span>
                    <Badge tone="success" className="h-[16px]">
                      <Power className="h-2 w-2 mr-0.5" /> auto
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                    <div className="rounded border border-line bg-surface-2 px-2 py-1.5">
                      <div className="text-fg-4 uppercase tracking-wider text-[9.5px] mb-0.5">before</div>
                      <div className="text-fg-3 line-through">{row.before}</div>
                    </div>
                    <div className="rounded border border-accent/30 bg-accent-soft/40 px-2 py-1.5">
                      <div className="text-fg-4 uppercase tracking-wider text-[9.5px] mb-0.5">after</div>
                      <div className="text-fg">{row.after}</div>
                    </div>
                  </div>
                  <div className="text-[10.5px] text-success tabular mt-1 inline-flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" /> saved · {row.saved}
                  </div>
                  {i < beforeAfter.length - 1 && <div className="border-b border-line mt-3 -mx-4" />}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
