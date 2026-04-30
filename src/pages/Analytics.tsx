import { useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUp, BarChart3, Calendar,
  Download, Filter, GitCommit, Layers, RefreshCw,
  Users, X, Zap,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell, RadarChart, Radar, PolarAngleAxis,
  PolarGrid, PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  channelAttribution, cohortTable, conversionByStage, radarHealth,
  segmentVelocity, velocityData,
} from "../data/fixtures";
import { cn, formatCompact, formatNumber, formatPercent } from "../lib/utils";
import { ChartTooltip, useChartColors } from "../components/charts/ChartTheme";

const filterChips = [
  { l: "Date", v: "Last 14d", icon: Calendar },
  { l: "ICP", v: "ICP-A · ICP-B", icon: Layers },
  { l: "Owner", v: "All", icon: Users },
  { l: "Sequence", v: "ICP-A Founders + 2", icon: Zap },
  { l: "Source", v: "All sources", icon: GitCommit },
];

export function Analytics() {
  const c = useChartColors();
  const [chips, setChips] = useState(filterChips.map((f) => f.v));

  return (
    <>
      <PageHeader
        eyebrow="Analytics · Q4 2026"
        title="Attribution & cohorts"
        description="Pipeline performance across channels, sequences, ICP segments, and cohorts. All metrics roll up from the warehouse — not the CRM."
        actions={
          <>
            <Button size="sm" variant="ghost" iconLeft={<Filter />}>Filters</Button>
            <Button size="sm" variant="secondary" iconLeft={<RefreshCw />}>Refresh</Button>
            <Button size="sm" variant="secondary" iconLeft={<Download />}>Export · CSV</Button>
            <Button size="sm" variant="primary" iconLeft={<BarChart3 />}>Snapshot · PDF</Button>
          </>
        }
        meta={
          <>
            <span>warehouse <span className="text-fg-2">snowflake.helix.gtm</span></span>
            <span>last refresh <span className="text-fg-2">2m 14s ago</span></span>
            <span>row count <span className="text-fg-2">412k</span></span>
            <span>SLO <span className="text-success">98.6% on-time</span></span>
          </>
        }
      />

      {/* Filter chip rail */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 -mb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterChips.map((f, i) => {
            const Icon = f.icon;
            const active = chips[i] !== "removed";
            return (
              <motion.div
                key={f.l}
                layout
                animate={{ opacity: active ? 1 : 0.4, scale: active ? 1 : 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => {
                    const next = [...chips];
                    next[i] = active ? "removed" : f.v;
                    setChips(next);
                  }}
                  className={cn(
                    "h-7 inline-flex items-center gap-1.5 px-2 rounded text-[11.5px] border tabular transition-colors",
                    active
                      ? "border-accent/40 bg-accent-soft text-accent hover:border-accent"
                      : "border-line bg-surface-2 text-fg-3 hover:text-fg",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span className="text-fg-3">{f.l}</span>
                  <span className="text-fg-2 font-medium">{f.v}</span>
                  {active && <X className="h-2.5 w-2.5 text-fg-3 ml-1 opacity-0 group-hover:opacity-100 transition" />}
                </button>
              </motion.div>
            );
          })}
          <button className="h-7 inline-flex items-center gap-1 px-2 rounded text-[11.5px] text-fg-3 border border-dashed border-line hover:border-line-strong hover:text-fg">
            <span className="text-base leading-none">+</span> Add filter
          </button>
          <span className="ml-auto text-[10.5px] text-fg-4 tabular">
            {chips.filter((c) => c !== "removed").length} of {chips.length} active
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Top metrics + funnel */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card
            title="Conversion funnel"
            subtitle="end-to-end · sourced → opp"
            className="xl:col-span-2"
            actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Drill</Button>}
            padded={false}
          >
            <div className="px-4 py-4">
              <div className="space-y-2.5">
                {conversionByStage.map((s, i) => {
                  const widthPct = (s.count / conversionByStage[0].count) * 100;
                  const dropoff =
                    i > 0
                      ? ((conversionByStage[i - 1].count - s.count) / conversionByStage[i - 1].count) * 100
                      : 0;
                  return (
                    <div key={s.stage}>
                      <div className="flex items-baseline justify-between mb-1 text-[11.5px]">
                        <span className="font-medium text-fg w-[110px]">{s.stage}</span>
                        <span className="text-fg-3 tabular flex-1 text-right">
                          {formatNumber(s.count)} · {s.rate}%
                        </span>
                        {i > 0 && (
                          <span className={cn("ml-3 tabular text-[10.5px] w-[70px] text-right", dropoff > 30 ? "text-danger" : dropoff > 15 ? "text-warning" : "text-fg-3")}>
                            {dropoff > 0 ? "−" : ""}{dropoff.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="relative h-6 bg-surface-2 rounded overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPct}%` }}
                          transition={{ duration: 0.7, delay: i * 0.04 }}
                          className={cn(
                            "h-full",
                            i < 4 ? "bg-fg-3/30" : i < 7 ? "bg-info/35" : "bg-accent",
                          )}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-[10.5px] tabular text-fg font-medium mix-blend-difference">
                          {formatNumber(s.count)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card title="Pipeline health" subtitle="6-axis trust score" padded={false}>
            <div className="h-[260px] px-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarHealth} margin={{ top: 16, right: 24, bottom: 16, left: 24 }} outerRadius={80}>
                  <PolarGrid stroke={c.line} radialLines={false} />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontSize: 10, fill: c.text, fontFamily: "Inter" }}
                  />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke={c.accent}
                    fill={c.accent}
                    fillOpacity={0.18}
                    strokeWidth={1.6}
                    isAnimationActive
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-line grid grid-cols-3 px-2 py-2 text-center">
              {[
                { l: "Score", v: "87", t: "text-fg" },
                { l: "Δ 7d", v: "+4", t: "text-success" },
                { l: "Status", v: "good", t: "text-success" },
              ].map((s) => (
                <div key={s.l} className="px-2 border-r border-line last:border-r-0">
                  <div className="text-[10px] uppercase tracking-wider text-fg-3">{s.l}</div>
                  <div className={cn("text-[16px] font-semibold tabular mt-0.5", s.t)}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cohort + attribution */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card
            title="Cohort retention"
            subtitle="leads sourced · meetings booked over time"
            actions={<Badge tone="ghost">absolute counts</Badge>}
            className="xl:col-span-2"
            padded={false}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] tabular">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 border-b border-line">
                    <th className="text-left font-medium px-3 py-2 w-[80px]">Cohort</th>
                    <th className="text-right font-medium px-3 py-2">Sourced</th>
                    <th className="text-right font-medium px-3 py-2">+7d</th>
                    <th className="text-right font-medium px-3 py-2">+14d</th>
                    <th className="text-right font-medium px-3 py-2">+30d</th>
                    <th className="text-right font-medium px-3 py-2">+60d</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortTable.rows.map((row) => (
                    <tr key={row.cohort} className="border-b border-line last:border-b-0 row-hover">
                      <td className="px-3 py-2 font-medium text-fg">{row.cohort}</td>
                      <td className="px-3 py-2 text-right text-fg-2">{formatNumber(row.sourced)}</td>
                      {(["+7d", "+14d", "+30d", "+60d"] as const).map((k) => {
                        const v = row[k];
                        if (v == null) {
                          return <td key={k} className="px-3 py-2 text-right text-fg-4">—</td>;
                        }
                        const intensity = Math.min(1, v / 80);
                        return (
                          <td
                            key={k}
                            className="px-3 py-2 text-right relative"
                            style={{
                              background: `rgb(var(--accent) / ${(intensity * 0.18).toFixed(3)})`,
                            }}
                          >
                            <span className="font-medium text-fg">{v}</span>
                            <span className="text-[9.5px] text-fg-3 ml-1">
                              {((v / row.sourced) * 100).toFixed(1)}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Source attribution" subtitle="$ pipeline · 14d">
            <ul className="space-y-3">
              {channelAttribution.map((ch, i) => {
                const tones = ["bg-accent", "bg-info", "bg-success", "bg-warning", "bg-fg-3", "bg-fg-3/40"];
                return (
                  <li key={ch.channel} className="space-y-1">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-fg-2 truncate">{ch.channel}</span>
                      <span className="tabular text-fg font-medium">${formatCompact(ch.value * 1000)}</span>
                    </div>
                    <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ch.share}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        className={cn("h-full", tones[i % tones.length])}
                      />
                    </div>
                    <div className="text-[10.5px] text-fg-4 tabular">
                      {formatPercent(ch.share, 1)} of pipeline · {formatNumber(Math.round(ch.value * 0.4))} touches
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        {/* Velocity by segment */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card
            title="Velocity by segment"
            subtitle="median days · lead → opp"
            className="xl:col-span-2"
            padded={false}
          >
            <div className="h-[260px] px-3 pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={segmentVelocity}
                  margin={{ top: 6, right: 16, left: -6, bottom: 4 }}
                  layout="vertical"
                  barCategoryGap="35%"
                >
                  <CartesianGrid stroke={c.grid} strokeDasharray="2 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke={c.text}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10.5, fontFamily: "Inter" }}
                  />
                  <YAxis
                    dataKey="segment"
                    type="category"
                    stroke={c.text}
                    tickLine={false}
                    axisLine={false}
                    width={170}
                    tick={{ fontSize: 10.5, fontFamily: "Inter" }}
                  />
                  <Tooltip
                    content={(p) => <ChartTooltip active={p.active} label={p.label} payload={p.payload} formatter={(v) => `${v.toFixed(1)} days`} />}
                    cursor={{ fill: c.grid }}
                  />
                  <Bar dataKey="oppDays" radius={[0, 3, 3, 0]} barSize={14}>
                    {segmentVelocity.map((seg, i) => (
                      <Cell
                        key={i}
                        fill={
                          seg.oppDays < 18 ? c.success : seg.oppDays < 24 ? c.accent : seg.oppDays < 30 ? c.warning : c.danger
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Pipeline velocity"
            subtitle="weekly · 9w"
            padded={false}
          >
            <div className="h-[260px] px-2 pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={velocityData}
                  margin={{ top: 6, right: 8, left: -16, bottom: 4 }}
                >
                  <CartesianGrid stroke={c.grid} strokeDasharray="2 3" vertical={false} />
                  <XAxis dataKey="week" stroke={c.text} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                  <YAxis stroke={c.text} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={32} />
                  <Tooltip content={(p) => <ChartTooltip active={p.active} label={p.label} payload={p.payload} />} cursor={{ stroke: c.line, strokeDasharray: "2 3" }} />
                  <Line type="monotone" dataKey="replied" stroke={c.info} strokeWidth={1.6} dot={false} />
                  <Line type="monotone" dataKey="booked" stroke={c.accent} strokeWidth={1.6} dot={false} />
                  <Line type="monotone" dataKey="opps" stroke={c.success} strokeWidth={1.6} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-line grid grid-cols-3 text-center">
              {[
                { l: "Replied", v: 68, t: "text-info" },
                { l: "Booked", v: 26, t: "text-accent" },
                { l: "Opps", v: 12, t: "text-success" },
              ].map((s) => (
                <div key={s.l} className="px-2 py-2.5 border-r border-line last:border-r-0">
                  <div className="text-[10px] uppercase tracking-wider text-fg-3">{s.l}</div>
                  <div className={cn("text-[14px] font-semibold tabular mt-0.5", s.t)}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Campaign / sequence performance table */}
        <Card
          title="Sequence performance"
          subtitle="all sequences · 14d"
          actions={<Button size="xs" variant="ghost" iconRight={<ArrowRight />}>Compare</Button>}
          padded={false}
        >
          <table className="w-full text-[12px] tabular">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.08em] text-fg-3 border-b border-line">
                <th className="text-left font-medium px-3 py-2">Sequence</th>
                <th className="text-right font-medium px-3 py-2">Sent</th>
                <th className="text-right font-medium px-3 py-2">Open</th>
                <th className="text-right font-medium px-3 py-2">Reply</th>
                <th className="text-right font-medium px-3 py-2">Booked</th>
                <th className="text-right font-medium px-3 py-2">Pipeline $</th>
                <th className="text-right font-medium px-3 py-2">CPL</th>
                <th className="text-right font-medium px-3 py-2">Δ 7d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                { n: "ICP-A Founders / EU", sent: 412, open: 263, reply: 41, booked: 12, pipe: 412000, cpl: 14.20, delta: 18 },
                { n: "Tier-1 Reactivation", sent: 188, open: 121, reply: 22, booked: 8, pipe: 211000, cpl: 22.40, delta: 6 },
                { n: "Inbound Speed-to-Lead", sent: 73, open: 56, reply: 16, booked: 7, pipe: 121000, cpl: 8.10, delta: 32 },
                { n: "Champion Multi-thread", sent: 24, open: 19, reply: 3, booked: 1, pipe: 24000, cpl: 0, delta: -4 },
                { n: "Closed-lost Q2 sweep", sent: 412, open: 198, reply: 18, booked: 4, pipe: 88000, cpl: 11.10, delta: -2 },
              ].map((r) => (
                <tr key={r.n} className="row-hover">
                  <td className="px-3 py-2 font-medium text-fg">{r.n}</td>
                  <td className="px-3 py-2 text-right text-fg-2">{formatNumber(r.sent)}</td>
                  <td className="px-3 py-2 text-right text-fg-2">{formatNumber(r.open)} <span className="text-fg-4 text-[10.5px]">{((r.open / r.sent) * 100).toFixed(0)}%</span></td>
                  <td className="px-3 py-2 text-right text-success">{formatNumber(r.reply)} <span className="text-fg-4 text-[10.5px]">{((r.reply / r.sent) * 100).toFixed(1)}%</span></td>
                  <td className="px-3 py-2 text-right text-accent">{r.booked}</td>
                  <td className="px-3 py-2 text-right text-fg font-medium">${formatCompact(r.pipe)}</td>
                  <td className="px-3 py-2 text-right text-fg-3">${r.cpl.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-[11px]",
                      r.delta > 0 ? "text-success" : "text-danger",
                    )}>
                      {r.delta > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                      {Math.abs(r.delta)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
