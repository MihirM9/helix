import { useState } from "react";
import {
  Activity, BadgeCheck, Beaker, Bot, Calendar,
  Clock, Code2, Copy, Edit3,
  Eye, Filter, FlaskConical, GitBranch, Hand, Inbox, Mail,
  MoreHorizontal, Pause, Play, Plus, Reply, Send,
  Timer,
} from "lucide-react";

function LinkedinGlyph({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { sequences } from "../data/fixtures";
import { cn, formatNumber, formatPercent } from "../lib/utils";

const stepIcons = {
  email: Mail,
  linkedin: LinkedinGlyph,
  task: Hand,
  wait: Clock,
  branch: GitBranch,
} as const;

const stepTone = {
  email: "text-info",
  linkedin: "text-accent",
  task: "text-fg-2",
  wait: "text-fg-3",
  branch: "text-warning",
} as const;

export function Sequences() {
  const [active, setActive] = useState(sequences[0].id);
  const seq = sequences.find((s) => s.id === active) ?? sequences[0];

  return (
    <>
      <PageHeader
        eyebrow="Outbound · 4 sequences"
        title="Sequence engine"
        description="Multistep email + LinkedIn touchpoints with A/B variants, send-window guardrails, intent detection, and branch-on-reply handoff."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<Beaker />}>A/B reports</Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>New sequence</Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />engine running</span>
            <span>active sends today <span className="text-fg-2">818</span></span>
            <span>positive replies <span className="text-success">+24 (8.1%)</span></span>
            <span>send window <span className="text-fg-2">Tue–Thu · 09:30–11:00 local</span></span>
            <span>guardrail bounces <span className="text-warning">{"<2.0%"}</span></span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
        {/* Sequence list */}
        <Card title="Sequences" subtitle="4 total" padded={false}>
          <ul className="divide-y divide-line">
            {sequences.map((s) => {
              const isActive = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "w-full text-left px-3 py-3 transition-colors",
                      isActive
                        ? "bg-surface-2"
                        : "hover:bg-surface-2/60",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <StatusDot
                        tone={s.status === "active" ? "success" : "warning"}
                        pulse={s.status === "active"}
                      />
                      <span className="text-[12.5px] font-semibold text-fg truncate flex-1">
                        {s.name}
                      </span>
                      {s.abTest && (
                        <Badge tone="info" className="h-[16px]">A/B</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-fg-3 mt-0.5 truncate">{s.audience}</div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[10.5px] tabular">
                      <div>
                        <div className="text-fg-4">enrolled</div>
                        <div className="text-fg font-medium">{formatNumber(s.enrolled)}</div>
                      </div>
                      <div>
                        <div className="text-fg-4">reply</div>
                        <div className="text-success font-medium">{formatPercent(s.replyRate, 1)}</div>
                      </div>
                      <div>
                        <div className="text-fg-4">booked</div>
                        <div className="text-accent font-medium">{formatPercent(s.bookedRate, 1)}</div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line p-2">
            <Button size="xs" variant="ghost" iconLeft={<Plus />} className="w-full justify-start">
              New sequence
            </Button>
          </div>
        </Card>

        {/* Builder */}
        <div className="space-y-5 min-w-0">
          {/* Header card */}
          <Card padded={false}>
            <div className="px-4 py-3.5 flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[16px] font-semibold text-fg truncate">{seq.name}</h2>
                  <Badge tone={seq.status === "active" ? "success" : "warning"} dot pulse={seq.status === "active"}>
                    {seq.status}
                  </Badge>
                  {seq.abTest && <Badge tone="info">A/B running</Badge>}
                </div>
                <div className="text-[12px] text-fg-3 mt-1">
                  Audience · <span className="text-fg-2">{seq.audience}</span>
                  <span className="mx-2">·</span>
                  Send window · <span className="text-fg-2">{seq.sendWindow}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" iconLeft={<Code2 />}>JSON</Button>
                <Button size="sm" variant="secondary" iconLeft={<Copy />}>Duplicate</Button>
                <Button size="sm" variant="secondary" iconLeft={seq.status === "active" ? <Pause /> : <Play />}>
                  {seq.status === "active" ? "Pause" : "Resume"}
                </Button>
                <Button size="sm" variant="primary" iconLeft={<Edit3 />}>Edit</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 border-t border-line">
              {[
                { l: "Enrolled", v: formatNumber(seq.enrolled), c: "text-fg" },
                { l: "Active", v: formatNumber(seq.active), c: "text-fg" },
                { l: "Completed", v: formatNumber(seq.completed), c: "text-fg" },
                { l: "Reply rate", v: formatPercent(seq.replyRate, 1), c: "text-success" },
                { l: "Booked rate", v: formatPercent(seq.bookedRate, 1), c: "text-accent" },
                { l: "Bounce rate", v: "1.2%", c: "text-fg-2" },
              ].map((s, i) => (
                <div key={s.l} className={cn(
                  "px-4 py-2.5 border-r border-line last:border-r-0",
                  i >= 4 && "lg:border-r-0",
                )}>
                  <div className="text-[10px] uppercase tracking-wider text-fg-3 font-medium">{s.l}</div>
                  <div className={cn("text-[16px] font-semibold tabular mt-0.5", s.c)}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Step builder */}
          <Card
            title="Steps"
            subtitle={`${seq.steps.length} touches · branch on reply`}
            actions={
              <>
                <Button size="xs" variant="ghost" iconLeft={<Eye />}>Preview</Button>
                <Button size="xs" variant="secondary" iconLeft={<Plus />}>Step</Button>
              </>
            }
            padded={false}
          >
            {seq.steps.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="h-9 w-9 rounded-md border border-line bg-surface-2 flex items-center justify-center text-fg-3 mb-3 mx-auto">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-[13px] font-semibold text-fg">No steps yet</div>
                <div className="text-[12px] text-fg-3 mt-1 max-w-sm mx-auto">
                  This sequence inherits the playbook from{" "}
                  <span className="text-fg-2">ICP-A Founders / EU</span>. Override to customize touches.
                </div>
                <Button size="sm" variant="primary" iconLeft={<Plus />} className="mt-4">
                  Add first step
                </Button>
              </div>
            ) : (
              <div className="px-4 py-3 space-y-2">
                {seq.steps.map((step, i) => {
                  const Icon = stepIcons[step.type];
                  return (
                    <div key={step.id} className="relative">
                      <div className="flex items-stretch gap-3">
                        {/* Index column */}
                        <div className="flex flex-col items-center w-7 shrink-0">
                          <div className="h-7 w-7 rounded-md border border-line bg-surface-2 flex items-center justify-center font-mono text-[11px] tabular text-fg-3">
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          {i < seq.steps.length - 1 && (
                            <div className="flex-1 w-px bg-line my-1" />
                          )}
                        </div>
                        {/* Step body */}
                        <div className={cn(
                          "flex-1 border border-line rounded-md bg-surface-2/40 hover:bg-surface-2 transition-colors min-w-0",
                          step.type === "branch" && "border-dashed",
                          step.type === "wait" && "border-dashed bg-transparent",
                        )}>
                          <div className="px-3 py-2.5 flex items-start gap-3">
                            <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", stepTone[step.type])} strokeWidth={1.8} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[12.5px] font-semibold text-fg uppercase tracking-wide">
                                  {({ email: "Email", linkedin: "LinkedIn", task: "Task", wait: "Wait", branch: "Branch" } as const)[step.type]}
                                </span>
                                <span className="text-[11px] text-fg-3 tabular">{step.delay}</span>
                                {step.variants && step.variants > 1 && (
                                  <Badge tone="info" className="h-[16px]">
                                    <Beaker className="h-2.5 w-2.5 mr-0.5" /> {step.variants} variants
                                  </Badge>
                                )}
                                {step.type === "wait" && (
                                  <span className="text-[11px] text-fg-3">delay</span>
                                )}
                              </div>
                              {step.subject && (
                                <div className="text-[12px] font-medium text-fg mt-1.5 truncate">
                                  {step.subject}
                                </div>
                              )}
                              {step.preview && (
                                <div className="text-[11.5px] text-fg-3 mt-0.5 leading-snug font-mono">
                                  {step.preview}
                                </div>
                              )}
                              {step.metrics.sent > 0 && (
                                <div className="grid grid-cols-6 gap-2 mt-2.5 text-[10.5px] tabular border-t border-line pt-2">
                                  {[
                                    { l: "sent", v: step.metrics.sent, c: "text-fg" },
                                    { l: "delivered", v: step.metrics.delivered, c: "text-fg-2" },
                                    { l: "opened", v: step.metrics.opened, c: "text-fg-2" },
                                    { l: "replied", v: step.metrics.replied, c: "text-success" },
                                    { l: "booked", v: step.metrics.booked, c: "text-accent" },
                                    { l: "bounced", v: step.metrics.bounced, c: step.metrics.bounced > 5 ? "text-warning" : "text-fg-3" },
                                  ].map((m) => (
                                    <div key={m.l}>
                                      <div className="text-fg-4 uppercase tracking-wider text-[9.5px]">{m.l}</div>
                                      <div className={cn("font-medium mt-0.5", m.c)}>{formatNumber(m.v)}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button className="h-6 w-6 rounded text-fg-4 hover:text-fg hover:bg-surface flex items-center justify-center shrink-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </button>
                          </div>
                          {/* A/B variants progress */}
                          {step.variants && step.variants > 1 && step.metrics.sent > 0 && (
                            <div className="px-3 pb-3 border-t border-line">
                              <div className="flex items-center gap-2 mt-2 mb-1.5">
                                <FlaskConical className="h-3 w-3 text-info" />
                                <span className="text-[10.5px] uppercase tracking-wider text-fg-3 font-medium">A/B variants</span>
                                <span className="text-[10px] text-fg-4 tabular ml-auto">significance · 87%</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { v: "A · cold + hook", reply: 8.2, color: "bg-info" },
                                  { v: "B · social proof", reply: 11.4, color: "bg-accent" },
                                ].map((v) => (
                                  <div key={v.v} className="flex items-center gap-2">
                                    <div className="text-[11px] text-fg-2 truncate flex-1">{v.v}</div>
                                    <div className="w-20 h-1 bg-surface rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${v.reply * 6}%` }}
                                        transition={{ duration: 0.7 }}
                                        className={cn("h-full", v.color)}
                                      />
                                    </div>
                                    <div className="text-[11px] tabular text-fg w-10 text-right">{v.reply}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* Branch */}
                          {step.type === "branch" && (
                            <div className="px-3 pb-3 border-t border-line space-y-1.5">
                              <div className="flex items-center gap-2 text-[11.5px]">
                                <Reply className="h-3 w-3 text-success" />
                                <span className="text-fg-2">on positive reply →</span>
                                <span className="text-fg font-medium">handoff to AE · Slack ping</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11.5px]">
                                <Inbox className="h-3 w-3 text-fg-3" />
                                <span className="text-fg-2">on out-of-office →</span>
                                <span className="text-fg font-medium">delay 7d · resume sequence</span>
                              </div>
                              <div className="flex items-center gap-2 text-[11.5px]">
                                <Hand className="h-3 w-3 text-warning" />
                                <span className="text-fg-2">on unsubscribe →</span>
                                <span className="text-fg font-medium">stop · suppression list</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button className="w-full mt-2 h-8 border border-dashed border-line rounded-md text-[11.5px] text-fg-3 hover:text-fg hover:border-line-strong hover:bg-surface-2 transition-colors inline-flex items-center justify-center gap-1.5">
                  <Plus className="h-3 w-3" />
                  Add step
                </button>
              </div>
            )}
          </Card>

          {/* Personalization variables + intent + perf */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card
              title="Personalization variables"
              subtitle="resolved at send-time"
              padded={false}
            >
              <ul className="divide-y divide-line text-[11.5px]">
                {[
                  { v: "{{firstName}}", s: "Apollo · contact", h: "100%" },
                  { v: "{{company}}", s: "Apollo", h: "100%" },
                  { v: "{{lastFundingRound}}", s: "Crunchbase (fallback)", h: "62%" },
                  { v: "{{industry}}", s: "Clearbit", h: "92%" },
                  { v: "{{recentJobPost}}", s: "LinkedIn parser", h: "47%" },
                  { v: "{{firstNameSubject}}", s: "Helix LLM · safe", h: "100%" },
                ].map((p) => (
                  <li key={p.v} className="px-3 py-2 flex items-center gap-3">
                    <span className="font-mono text-[11px] text-accent">{p.v}</span>
                    <span className="text-fg-3 truncate flex-1">{p.s}</span>
                    <Badge
                      tone={parseInt(p.h) > 90 ? "success" : parseInt(p.h) > 60 ? "warning" : "danger"}
                      className="h-[18px]"
                    >
                      {p.h}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Intent detection" subtitle="last 50 replies">
              <div className="space-y-2.5">
                {[
                  { l: "Positive · meeting", v: 41, t: "success" as const, p: 56 },
                  { l: "Positive · referral", v: 12, t: "info" as const, p: 16 },
                  { l: "Out of office", v: 14, t: "neutral" as const, p: 19 },
                  { l: "Not interested", v: 6, t: "warning" as const, p: 8 },
                  { l: "Unsubscribe", v: 1, t: "danger" as const, p: 1 },
                ].map((i) => (
                  <div key={i.l}>
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-fg-2">{i.l}</span>
                      <span className="tabular text-fg font-medium">{i.v}</span>
                    </div>
                    <div className="h-1 bg-surface-2 rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${i.p * 1.7}%` }}
                        transition={{ duration: 0.7 }}
                        className={cn(
                          "h-full",
                          i.t === "success" && "bg-success",
                          i.t === "info" && "bg-info",
                          i.t === "warning" && "bg-warning",
                          i.t === "danger" && "bg-danger",
                          i.t === "neutral" && "bg-fg-3/60",
                        )}
                      />
                    </div>
                  </div>
                ))}
                <div className="text-[10.5px] text-fg-4 tabular border-t border-line pt-2 mt-3">
                  Classifier · 0.91 F1 · 12ms p95
                </div>
              </div>
            </Card>
            <Card title="Send performance" subtitle="last 7 days">
              <ul className="space-y-2.5 text-[11.5px] tabular">
                {[
                  { i: Send, l: "Sent", v: "2,144" },
                  { i: BadgeCheck, l: "Delivered", v: "2,118 · 98.8%" },
                  { i: Eye, l: "Opened", v: "1,272 · 60.0%" },
                  { i: Reply, l: "Replied", v: "174 · 8.1%" },
                  { i: Calendar, l: "Booked", v: "41 · 1.9%" },
                  { i: Activity, l: "Bounced", v: "26 · 1.2%" },
                ].map((m) => (
                  <li key={m.l} className="flex items-center gap-2.5">
                    <m.i className="h-3 w-3 text-fg-4" strokeWidth={1.8} />
                    <span className="text-fg-3 flex-1">{m.l}</span>
                    <span className="text-fg font-medium">{m.v}</span>
                  </li>
                ))}
                <li className="border-t border-line pt-2 mt-2 flex items-center gap-2.5 text-[10.5px] text-fg-4">
                  <Timer className="h-3 w-3" />
                  Median time-to-reply · 18h 42m
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
