import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle, ArrowRight, AtSign, CheckCircle2, ChevronRight,
  ClipboardPaste, Copy, Cpu, Database, DownloadCloud, FileSpreadsheet,
  Filter, Globe2, Hash, History, Loader2, MailCheck, MailQuestion, MailX,
  Plus, Search, ShieldCheck, Sparkles, Target, Upload,
  Wifi, X, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import {
  domainCoverage, finderProviders, finderQueue, patternFrequency,
  recentFinds, type FinderResult,
} from "../data/fixtures";
import { cn, formatNumber, formatPercent } from "../lib/utils";

type SearchStep = {
  id: string;
  label: string;
  detail: string;
  status: "pending" | "running" | "ok" | "skip" | "fail";
  icon: any;
};

const baseSteps = (domain: string): SearchStep[] => [
  { id: "norm", label: "Normalize input", detail: `→ ${domain.toLowerCase()}`, status: "pending", icon: Cpu },
  { id: "cache", label: "Cache lookup", detail: "Helix internal", status: "pending", icon: History },
  { id: "pattern", label: "Pattern engine", detail: "{first}.{last} · {f}{last} · {first}", status: "pending", icon: Hash },
  { id: "apollo", label: "Apollo", detail: "Primary database · 412ms p95", status: "pending", icon: Database },
  { id: "hunter", label: "Hunter", detail: "Secondary · 844ms p95", status: "pending", icon: Database },
  { id: "clearbit", label: "Clearbit", detail: "Tertiary fallback · 1.42s p95", status: "pending", icon: Sparkles },
  { id: "mx", label: "MX record check", detail: "DNS · catch-all probe", status: "pending", icon: Wifi },
  { id: "smtp", label: "SMTP verify", detail: "RCPT TO · bounce risk", status: "pending", icon: ShieldCheck },
];

const statusTone: Record<FinderResult["status"], { tone: "success" | "warning" | "danger" | "info" | "neutral"; label: string }> = {
  found: { tone: "success", label: "found" },
  guessed: { tone: "warning", label: "guessed" },
  "catch-all": { tone: "warning", label: "catch-all" },
  not_found: { tone: "danger", label: "not found" },
  invalid: { tone: "danger", label: "invalid" },
};

const sourceBadgeTone: Record<FinderResult["source"], "success" | "info" | "accent" | "warning" | "neutral"> = {
  Apollo: "info",
  Hunter: "accent",
  Clearbit: "warning",
  Pattern: "neutral",
  SMTP: "neutral",
  Cache: "success",
};

export function EmailFinder() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FinderResult | null>(null);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [bulkText, setBulkText] = useState("maya@forgebio.com\nDaniel Vogel · kettle.dev\nCarla Rossi, halcyon.ai\nSven Andersen — northwind.io\nYuki, rover.io");
  const [autoBackfill, setAutoBackfill] = useState(true);
  const [recentTab, setRecentTab] = useState<"all" | "found" | "needs_review">("all");
  const tickRef = useRef<number | null>(null);

  const filteredRecent = useMemo(() => {
    if (recentTab === "found") return recentFinds.filter((f) => f.status === "found");
    if (recentTab === "needs_review") return recentFinds.filter((f) => f.status !== "found");
    return recentFinds;
  }, [recentTab]);

  function runLookup() {
    if (!first || !last || !domain) return;
    if (tickRef.current) window.clearTimeout(tickRef.current);

    const normDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const seq = baseSteps(normDomain);
    setSteps(seq.map((s) => ({ ...s, status: "pending" })));
    setResult(null);
    setBusy(true);

    // Pick a probable outcome from seeded patterns
    const matchedRecent = recentFinds.find(
      (r) => r.name.toLowerCase().includes(last.toLowerCase()) || r.domain === normDomain,
    );
    const finalEmail =
      matchedRecent?.email ??
      `${first.toLowerCase()}.${last.toLowerCase()}@${normDomain}`;

    const fakeOutcome: FinderResult =
      matchedRecent ?? {
        id: "live",
        name: `${first} ${last}`,
        domain: normDomain,
        email: finalEmail,
        status: "found",
        confidence: 92,
        source: "Apollo",
        bounceRisk: "low",
        catchAll: false,
        mxOk: true,
        smtpOk: true,
        ts: "now",
        ms: 1244,
      };

    // Simulate the waterfall: each step resolves in ~140-260ms
    const order: Array<{ idx: number; status: SearchStep["status"]; delay: number }> = [
      { idx: 0, status: "ok", delay: 140 },
      { idx: 1, status: fakeOutcome.source === "Cache" ? "ok" : "skip", delay: 220 },
      { idx: 2, status: "ok", delay: 320 },
      { idx: 3, status: fakeOutcome.source === "Apollo" ? "ok" : "skip", delay: 540 },
      { idx: 4, status: fakeOutcome.source === "Hunter" ? "ok" : fakeOutcome.source === "Apollo" ? "skip" : "ok", delay: 800 },
      { idx: 5, status: fakeOutcome.source === "Clearbit" ? "ok" : "skip", delay: 1080 },
      { idx: 6, status: fakeOutcome.mxOk ? "ok" : "fail", delay: 1280 },
      { idx: 7, status: fakeOutcome.smtpOk ? "ok" : fakeOutcome.catchAll ? "fail" : "ok", delay: 1480 },
    ];

    // Mark "running" then "status" for each step in sequence
    const timeouts: number[] = [];
    order.forEach((o) => {
      timeouts.push(
        window.setTimeout(() => {
          setSteps((cur) =>
            cur.map((s, i) => (i === o.idx ? { ...s, status: "running" } : s)),
          );
        }, Math.max(0, o.delay - 90)),
      );
      timeouts.push(
        window.setTimeout(() => {
          setSteps((cur) =>
            cur.map((s, i) => (i === o.idx ? { ...s, status: o.status } : s)),
          );
        }, o.delay),
      );
    });

    tickRef.current = window.setTimeout(() => {
      setResult(fakeOutcome);
      setBusy(false);
    }, 1620);
  }

  useEffect(
    () => () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    },
    [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Outbound · Email finder"
        title="Email finder"
        description="Resolve a verified email from any name + domain through a 6-source waterfall with SMTP verification, catch-all detection, and bounce risk scoring."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<Upload />}>Bulk · CSV</Button>
            <Button size="sm" variant="secondary" iconLeft={<DownloadCloud />}>Export</Button>
            <Button size="sm" variant="primary" iconLeft={<Plus />}>API key</Button>
          </>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-1.5"><StatusDot tone="success" pulse />finder online</span>
            <span>lookups today <span className="text-fg-2">2,184</span></span>
            <span>found rate <span className="text-success">88.4%</span></span>
            <span>median latency <span className="text-fg-2">612ms</span></span>
            <span>cost / find <span className="text-fg-2">$0.04</span></span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-accent" /> auto-backfill <span className="text-fg-2">on</span>
            </span>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Hero finder */}
        <Card padded={false}>
          <div className="px-4 pt-4 pb-3 flex items-center gap-2 border-b border-line">
            <AtSign className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            <span className="text-[12px] font-semibold text-fg uppercase tracking-wide">
              Find a single email
            </span>
            <span className="text-[11px] text-fg-3 ml-2">
              waterfall · cache → pattern → providers → MX → SMTP
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <label className="text-[11.5px] inline-flex items-center gap-1.5 text-fg-3">
                <input
                  type="checkbox"
                  checked={autoBackfill}
                  onChange={(e) => setAutoBackfill(e.target.checked)}
                  className="accent-accent h-3 w-3"
                />
                auto-backfill enrichment
              </label>
              <span className="kbd">⌘ ⏎</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-px bg-line">
            {[
              { l: "First name", v: first, set: setFirst, ph: "Maya", icon: AtSign },
              { l: "Last name", v: last, set: setLast, ph: "Okafor", icon: AtSign },
              { l: "Company domain", v: domain, set: setDomain, ph: "forgebio.com", icon: Globe2 },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.l} className="bg-surface px-4 py-3 min-w-0">
                  <label className="block text-[10px] uppercase tracking-[0.1em] text-fg-3 font-medium mb-1.5">
                    {f.l}
                  </label>
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-fg-4" strokeWidth={1.8} />
                    <input
                      value={f.v}
                      onChange={(e) => f.set(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || (e.metaKey && e.key === "Enter")) runLookup();
                      }}
                      placeholder={f.ph}
                      className="bg-transparent outline-none text-[13.5px] text-fg w-full placeholder:text-fg-4"
                    />
                  </div>
                </div>
              );
            })}
            <div className="bg-surface px-3 flex items-center justify-end">
              <Button
                size="md"
                variant="primary"
                disabled={busy || !first || !last || !domain}
                iconLeft={busy ? <Loader2 className="animate-spin" /> : <Search />}
                onClick={runLookup}
              >
                {busy ? "Searching…" : "Find email"}
              </Button>
            </div>
          </div>

          {/* Waterfall + result */}
          {(steps.length > 0 || result) && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] divide-x divide-line border-t border-line">
              {/* Steps */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] uppercase tracking-[0.1em] text-fg-3 font-medium">
                    Waterfall
                  </span>
                  {busy && (
                    <span className="text-[10.5px] tabular text-fg-3 inline-flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin text-accent" />
                      running · {steps.filter((s) => s.status !== "pending").length} of {steps.length}
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-line border-y border-line">
                  {steps.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li
                        key={s.id}
                        className="flex items-center gap-3 px-2 py-1.5 transition-colors"
                      >
                        <span className="h-5 w-5 rounded border border-line bg-surface-2 flex items-center justify-center shrink-0">
                          <Icon className="h-3 w-3 text-fg-3" strokeWidth={1.8} />
                        </span>
                        <span className="text-[12px] font-medium text-fg w-[140px] truncate">
                          {s.label}
                        </span>
                        <span className="text-[11px] text-fg-3 truncate flex-1 font-mono">
                          {s.detail}
                        </span>
                        <StepBadge status={s.status} />
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Result panel */}
              <div className="px-4 py-3">
                <span className="text-[10.5px] uppercase tracking-[0.1em] text-fg-3 font-medium">
                  Result
                </span>
                <AnimatePresence mode="wait">
                  {!result && busy && (
                    <motion.div
                      key="busy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 space-y-2"
                    >
                      <div className="skeleton h-7" />
                      <div className="skeleton h-4 w-2/3" />
                      <div className="skeleton h-4 w-1/2" />
                      <div className="skeleton h-12 mt-3" />
                    </motion.div>
                  )}
                  {result && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge tone={statusTone[result.status].tone} dot>
                          {statusTone[result.status].label}
                        </Badge>
                        <Badge tone={sourceBadgeTone[result.source]}>
                          via {result.source}
                        </Badge>
                        <span className="text-[10.5px] text-fg-4 tabular ml-auto">{result.ms}ms</span>
                      </div>
                      <div className="bg-surface-2/60 border border-line rounded-md px-3 py-2.5 flex items-center gap-2 group">
                        <MailCheck className="h-3.5 w-3.5 text-accent" />
                        <span className="text-[13px] font-mono text-fg truncate flex-1">
                          {result.email ?? "—"}
                        </span>
                        <button
                          className="h-5 w-5 rounded text-fg-3 hover:text-fg hover:bg-surface inline-flex items-center justify-center"
                          aria-label="Copy"
                          onClick={() => {
                            if (result.email) navigator.clipboard?.writeText(result.email);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mt-3 space-y-2">
                        <ConfidenceBar value={result.confidence} />
                        <div className="grid grid-cols-2 gap-2">
                          <Pill ok={result.mxOk} label="MX record" />
                          <Pill ok={result.smtpOk} label="SMTP RCPT" />
                          <Pill
                            ok={!result.catchAll}
                            label="Not catch-all"
                            warnIfFalse
                          />
                          <Pill
                            ok={result.bounceRisk === "low"}
                            label={`Bounce · ${result.bounceRisk}`}
                            warnIfFalse
                          />
                        </div>
                        {autoBackfill && result.status === "found" && (
                          <div className="flex items-start gap-2 mt-2 px-2.5 py-2 rounded border border-success/30 bg-success/5">
                            <Zap className="h-3 w-3 text-success mt-0.5" />
                            <div className="text-[11.5px] text-fg-2">
                              Auto-backfilled to{" "}
                              <span className="font-mono text-fg">{result.name}</span> in
                              enrichment pipeline. Routed to AE pool · Tier-1.
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  {!result && !busy && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-[12px] text-fg-3"
                    >
                      Awaiting input.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </Card>

        {/* Provider waterfall + bulk + queue */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Provider waterfall */}
          <Card
            title="Provider waterfall"
            subtitle="hit rate by source · 24h"
            actions={<Badge tone="ghost">cascade order →</Badge>}
            padded={false}
          >
            <ul className="divide-y divide-line">
              {finderProviders.map((p, i) => (
                <li key={p.id} className="px-4 py-2.5 hover:bg-surface-2/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded border border-line bg-surface-2 flex items-center justify-center shrink-0 font-mono text-[10px] tabular text-fg-3">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-fg truncate">
                          {p.name}
                        </span>
                        <StatusDot
                          tone={p.status === "healthy" ? "success" : "warning"}
                          pulse={p.status !== "healthy"}
                        />
                      </div>
                      <div className="text-[10.5px] text-fg-3 truncate">{p.role}</div>
                    </div>
                    <div className="text-right shrink-0 tabular">
                      <div className="text-[12px] font-medium text-fg">{p.hit}%</div>
                      <div className="text-[10px] text-fg-4">${p.cost.toFixed(3)} · {p.p95}</div>
                    </div>
                  </div>
                  <div className="h-1 bg-surface-2 rounded-full overflow-hidden mt-1.5 ml-8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.hit}%` }}
                      transition={{ duration: 0.7, delay: i * 0.05 }}
                      className="h-full bg-accent"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Cascade", v: "6 srcs" },
                { l: "Cache hit", v: "41.2%" },
                { l: "Avg cost", v: "$0.04" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[10px] uppercase tracking-wider text-fg-3">{s.l}</div>
                  <div className="text-[13px] tabular font-semibold text-fg mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bulk import */}
          <Card
            title="Bulk lookup"
            subtitle="paste names + domains · CSV / pasted"
            actions={
              <>
                <Button size="xs" variant="ghost" iconLeft={<ClipboardPaste />}>Paste</Button>
                <Button size="xs" variant="secondary" iconLeft={<FileSpreadsheet />}>CSV</Button>
              </>
            }
          >
            <div className="space-y-3">
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full bg-surface-2 border border-line rounded p-2.5 font-mono text-[11.5px] text-fg-2 outline-none focus:border-accent/50 resize-none placeholder:text-fg-4"
                placeholder={"Maya Okafor, forgebio.com\nDaniel Vogel · kettle.dev\n…"}
              />
              <div className="flex items-center justify-between text-[11px] text-fg-3 tabular">
                <span>{bulkText.split("\n").filter(Boolean).length} rows · est. cost $0.{(bulkText.split("\n").filter(Boolean).length * 4).toString().padStart(2, "0")}</span>
                <span>delim auto-detect</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] tabular">
                <div className="rounded border border-line bg-surface-2 px-2.5 py-1.5">
                  <div className="text-fg-4 uppercase tracking-wider text-[9.5px] mb-0.5">parsed</div>
                  <div className="text-fg font-medium">5 rows · 3 patterns</div>
                </div>
                <div className="rounded border border-line bg-surface-2 px-2.5 py-1.5">
                  <div className="text-fg-4 uppercase tracking-wider text-[9.5px] mb-0.5">duplicates</div>
                  <div className="text-fg font-medium">0 against cache</div>
                </div>
              </div>
              <Button size="sm" variant="primary" iconRight={<ArrowRight />} className="w-full">
                Run bulk · 5 lookups
              </Button>
            </div>
          </Card>

          {/* Live queue */}
          <Card
            title="Live queue"
            subtitle={`${finderQueue.length} jobs · streaming`}
            actions={<Badge tone="success" dot pulse>live</Badge>}
            padded={false}
          >
            <ul className="divide-y divide-line">
              {finderQueue.map((q) => (
                <li key={q.id} className="px-4 py-2.5 flex items-center gap-3">
                  <Loader2
                    className={cn(
                      "h-3 w-3 shrink-0",
                      q.state === "queued" ? "text-fg-4" : "text-accent animate-spin",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-fg truncate">{q.name}</div>
                    <div className="text-[10.5px] text-fg-3 truncate font-mono">{q.step}</div>
                  </div>
                  <span className="text-[10.5px] text-fg-4 tabular shrink-0">{q.elapsed}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-2.5 flex items-center justify-between text-[11px] text-fg-3 tabular">
              <span>throughput · ~28/min</span>
              <span>concurrency · 8</span>
            </div>
          </Card>
        </div>

        {/* Recent finds */}
        <Card
          title="Recent finds"
          subtitle={`${recentFinds.length} lookups · last 30m`}
          actions={
            <div className="flex border border-line rounded overflow-hidden text-[10.5px] tabular">
              {(
                [
                  { id: "all", label: "all" },
                  { id: "found", label: "found" },
                  { id: "needs_review", label: "needs review" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setRecentTab(t.id)}
                  className={cn(
                    "px-2 h-7 transition-colors",
                    recentTab === t.id
                      ? "bg-accent text-accent-fg"
                      : "text-fg-3 hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] tabular">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 border-b border-line">
                  <th className="text-left font-medium px-3 py-2">Person</th>
                  <th className="text-left font-medium px-3 py-2">Email</th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-right font-medium px-3 py-2">Conf.</th>
                  <th className="text-left font-medium px-3 py-2">Source</th>
                  <th className="text-left font-medium px-3 py-2">Verify</th>
                  <th className="text-right font-medium px-3 py-2">Latency</th>
                  <th className="text-right font-medium px-3 py-2">When</th>
                  <th className="w-6 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRecent.map((r) => (
                  <tr key={r.id} className="row-hover cursor-pointer group">
                    <td className="px-3 py-2">
                      <div className="text-[12.5px] font-medium text-fg truncate max-w-[160px]">{r.name}</div>
                      <div className="text-[10.5px] text-fg-4 truncate max-w-[160px]">{r.domain}</div>
                    </td>
                    <td className="px-3 py-2 font-mono text-[11.5px] text-fg-2 max-w-[260px]">
                      {r.email ? (
                        <span className="truncate inline-block max-w-full">{r.email}</span>
                      ) : (
                        <span className="text-fg-4 italic">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Badge tone={statusTone[r.status].tone} dot pulse={r.status !== "found"}>
                        {statusTone[r.status].label}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <ConfidenceBar value={r.confidence} compact />
                    </td>
                    <td className="px-3 py-2">
                      <Badge tone={sourceBadgeTone[r.source]} className="h-[18px]">{r.source}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="inline-flex items-center gap-1.5 text-[11px]">
                        <CheckOrCross ok={r.mxOk} label="MX" />
                        <CheckOrCross ok={r.smtpOk} label="SMTP" />
                        {r.catchAll && <Badge tone="warning" className="h-[16px]">catch-all</Badge>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-fg-3">{r.ms}ms</td>
                    <td className="px-3 py-2 text-right text-fg-3 text-[11px]">{r.ts}</td>
                    <td className="px-3 py-2 text-right">
                      <ChevronRight className="h-3 w-3 text-fg-4 group-hover:text-fg-2" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="border-t border-line h-9 px-3 flex items-center justify-between text-[11px] text-fg-3 tabular">
            <span>Showing {filteredRecent.length} of {recentFinds.length}</span>
            <span className="inline-flex items-center gap-3">
              <span>found · 88.4%</span>
              <span>·</span>
              <span>catch-all · 6.1%</span>
              <span>·</span>
              <span>not found · 5.5%</span>
            </span>
          </footer>
        </Card>

        {/* Coverage + patterns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card
            title="Coverage by domain"
            subtitle="hit rate · last 7d"
            className="xl:col-span-2"
            padded={false}
          >
            <table className="w-full text-[12px] tabular">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 border-b border-line">
                  <th className="text-left font-medium px-3 py-2">Domain</th>
                  <th className="text-right font-medium px-3 py-2">Attempts</th>
                  <th className="text-right font-medium px-3 py-2">Found</th>
                  <th className="text-left font-medium px-3 py-2">Hit rate</th>
                  <th className="text-left font-medium px-3 py-2">Pattern</th>
                  <th className="text-left font-medium px-3 py-2">Catch-all</th>
                  <th className="text-right font-medium px-3 py-2">Last</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {domainCoverage.map((d) => {
                  const rate = (d.found / d.attempts) * 100;
                  return (
                    <tr key={d.domain} className="row-hover">
                      <td className="px-3 py-2 font-mono text-[11.5px] text-fg-2">{d.domain}</td>
                      <td className="px-3 py-2 text-right text-fg-2">{d.attempts}</td>
                      <td className="px-3 py-2 text-right text-fg font-medium">{d.found}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <span className={cn(
                            "text-[11.5px] font-medium tabular w-9",
                            rate >= 90 ? "text-success" : rate >= 70 ? "text-accent" : rate >= 50 ? "text-warning" : "text-danger",
                          )}>
                            {rate.toFixed(0)}%
                          </span>
                          <div className="h-1 bg-surface-2 rounded-full overflow-hidden flex-1">
                            <div
                              className={cn(
                                "h-full",
                                rate >= 90 ? "bg-success" : rate >= 70 ? "bg-accent" : rate >= 50 ? "bg-warning" : "bg-danger",
                              )}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] text-fg-3">{d.pattern}</td>
                      <td className="px-3 py-2">
                        {d.catchAll ? (
                          <Badge tone="warning" dot>yes</Badge>
                        ) : (
                          <Badge tone="ghost">no</Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-fg-3 text-[11px]">{d.last} ago</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <Card
            title="Detected patterns"
            subtitle="resolved formats · all-time"
          >
            <ul className="space-y-2.5">
              {patternFrequency.map((p, i) => (
                <li key={p.p}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-mono text-accent">{p.p}</span>
                    <span className="tabular text-fg font-medium">{formatNumber(p.n)}</span>
                  </div>
                  <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.share * 2}%` }}
                      transition={{ duration: 0.7, delay: i * 0.04 }}
                      className="h-full bg-accent"
                    />
                  </div>
                  <div className="text-[10.5px] text-fg-4 tabular mt-0.5">
                    {formatPercent(p.share, 1)} of resolved
                  </div>
                </li>
              ))}
              <li className="border-t border-line pt-2 mt-3 text-[10.5px] text-fg-4 tabular flex items-center gap-2">
                <Target className="h-3 w-3" /> Pattern engine confidence · 0.84 F1
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function StepBadge({ status }: { status: SearchStep["status"] }) {
  if (status === "pending") {
    return <span className="text-[10.5px] text-fg-4 tabular">queued</span>;
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] text-accent tabular">
        <Loader2 className="h-3 w-3 animate-spin" />
        running
      </span>
    );
  }
  if (status === "skip") {
    return (
      <span className="text-[10.5px] text-fg-4 tabular inline-flex items-center gap-1">
        <X className="h-2.5 w-2.5" /> skipped
      </span>
    );
  }
  if (status === "fail") {
    return (
      <span className="text-[10.5px] text-danger tabular inline-flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> failed
      </span>
    );
  }
  return (
    <span className="text-[10.5px] text-success tabular inline-flex items-center gap-1">
      <CheckCircle2 className="h-3 w-3" /> ok
    </span>
  );
}

function ConfidenceBar({ value, compact }: { value: number; compact?: boolean }) {
  const tone =
    value >= 90 ? "bg-success" : value >= 75 ? "bg-accent" : value >= 50 ? "bg-warning" : "bg-danger";
  const text =
    value >= 90 ? "text-success" : value >= 75 ? "text-accent" : value >= 50 ? "text-warning" : "text-danger";
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 justify-end">
        <span className={cn("text-[11.5px] tabular font-medium w-7 text-right", text)}>{value}</span>
        <div className="w-16 h-1 bg-surface-2 rounded-full overflow-hidden">
          <div className={cn("h-full", tone)} style={{ width: `${value}%` }} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-fg-2">Confidence</span>
        <span className={cn("tabular font-medium", text)}>{value}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6 }}
          className={cn("h-full", tone)}
        />
      </div>
    </div>
  );
}

function Pill({ ok, label, warnIfFalse }: { ok: boolean; label: string; warnIfFalse?: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1.5 rounded border text-[11px] tabular",
        ok
          ? "border-success/25 bg-success/5 text-success"
          : warnIfFalse
            ? "border-warning/30 bg-warning/5 text-warning"
            : "border-danger/30 bg-danger/5 text-danger",
      )}
    >
      {ok ? (
        <CheckCircle2 className="h-3 w-3 shrink-0" />
      ) : warnIfFalse ? (
        <MailQuestion className="h-3 w-3 shrink-0" />
      ) : (
        <MailX className="h-3 w-3 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}

function CheckOrCross({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[10.5px] tabular px-1 h-[18px] rounded border",
        ok
          ? "border-success/25 bg-success/5 text-success"
          : "border-danger/30 bg-danger/5 text-danger",
      )}
    >
      {ok ? <CheckCircle2 className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
      {label}
    </span>
  );
}
