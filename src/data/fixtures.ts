import { seededRandom } from "../lib/utils";

export type Lead = {
  id: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  size: string;
  industry: string;
  region: string;
  email: string;
  emailValid: boolean;
  linkedin: string;
  source: "Apollo" | "ZoomInfo" | "Clearbit" | "LinkedIn" | "Referral" | "Inbound";
  stage: "sourced" | "enriched" | "scored" | "routed" | "synced" | "engaged" | "replied" | "discarded";
  score: number;
  scoreBreakdown: { firmographic: number; intent: number; technographic: number; engagement: number };
  confidence: number;
  enrichedFields: string[];
  missingFields: string[];
  providerStack: string[];
  owner: string;
  routedTo: string;
  sequence?: string;
  lastTouch?: string;
  duplicates?: number;
  arr?: number;
  intent?: "high" | "medium" | "low";
  tags?: string[];
};

const firstNames = [
  "Maya", "Ravi", "Carla", "Daniel", "Yuki", "Sven", "Ana",
  "Kofi", "Priya", "Léa", "Jonas", "Amaya", "Theo", "Noor",
  "Mateo", "Sasha", "Ines", "Hugo", "Selin", "Felix", "Ezra",
  "Lia", "Kenji", "Mira", "Tom", "Nora", "Diego", "Anya",
];
const lastNames = [
  "Okafor", "Patel", "Hoffmann", "Schmidt", "Tanaka", "Costa",
  "Park", "Andersen", "Khan", "Rossi", "Berger", "Vogel",
  "Morales", "Becker", "Ali", "Oduya", "Iwasaki", "Kovač",
  "Petersen", "Nilsson", "Marchetti", "Hauser", "Larsen",
];

const companies = [
  ["Forge", "Biotech", "forgebio.com", "51-200", "Biotech", "EU"],
  ["Northwind Logistics", "Logistics", "northwind.io", "201-500", "Logistics", "NA"],
  ["Crisp", "Software", "crisp.app", "11-50", "Dev Tools", "NA"],
  ["Kettle", "Software", "kettle.dev", "11-50", "FinOps", "EU"],
  ["Halcyon Robotics", "Robotics", "halcyon.ai", "51-200", "Robotics", "NA"],
  ["Mantle Labs", "Energy", "mantle-labs.com", "11-50", "Climate", "EU"],
  ["Thread", "Retail", "threadhq.com", "201-500", "Commerce", "NA"],
  ["Beacon Health", "Health", "beaconhealth.io", "501-1000", "Healthtech", "NA"],
  ["Ostrich", "Software", "ostrich.dev", "1-10", "Dev Tools", "NA"],
  ["Marlo Bank", "Fintech", "marlo.bank", "201-500", "Fintech", "EU"],
  ["Rover Robotics", "Robotics", "rover.io", "51-200", "Robotics", "APAC"],
  ["Stack Foundry", "Software", "stackfoundry.com", "11-50", "DevOps", "NA"],
  ["Glassbeam", "Analytics", "glassbeam.io", "51-200", "Analytics", "NA"],
  ["Hummingbird", "Compliance", "hummingbird.co", "51-200", "RegTech", "NA"],
  ["Atlas Freight", "Logistics", "atlasfreight.com", "501-1000", "Logistics", "NA"],
  ["Ferment", "Food", "ferment.bio", "11-50", "Foodtech", "EU"],
  ["Plinth", "Software", "plinth.io", "1-10", "Infra", "NA"],
  ["Quanta", "Hardware", "quantadevices.com", "201-500", "Hardware", "APAC"],
  ["Strata Energy", "Energy", "strata.energy", "51-200", "Climate", "NA"],
  ["Dovetail Labs", "Software", "dovetail-labs.io", "11-50", "AI/ML", "NA"],
];

const titles = [
  "Head of RevOps", "VP Sales", "Director of Marketing",
  "CTO", "Head of Growth", "VP Engineering",
  "Sr. Sales Engineer", "Director of Operations",
  "Head of Demand Gen", "VP Marketing", "Chief of Staff",
  "Founder", "Co-founder & CEO", "Head of Data",
];

const sources: Lead["source"][] = ["Apollo", "ZoomInfo", "Clearbit", "LinkedIn", "Referral", "Inbound"];
const stages: Lead["stage"][] = [
  "sourced", "enriched", "scored", "routed", "synced", "engaged", "replied", "discarded",
];
const owners = ["Maya R.", "Daniel V.", "Carla O.", "Sven A.", "Ravi P."];
const sequencesList = ["AE-Outbound-Q4", "ICP-A Founders", "Tier-1 Reactivation", "Inbound Speed-to-Lead", "Champion Multi-thread"];

export function generateLeads(n = 60): Lead[] {
  const rnd = seededRandom(20260427);
  const leads: Lead[] = [];
  for (let i = 0; i < n; i++) {
    const fn = firstNames[Math.floor(rnd() * firstNames.length)];
    const ln = lastNames[Math.floor(rnd() * lastNames.length)];
    const c = companies[Math.floor(rnd() * companies.length)];
    const stage = stages[Math.floor(rnd() * stages.length)];
    const score = Math.floor(40 + rnd() * 60);
    const conf = 0.45 + rnd() * 0.55;
    const emailValid = rnd() > 0.12;
    const enrichedFields = [
      "firmographic", "title", "linkedin",
      ...(rnd() > 0.4 ? ["technographic"] : []),
      ...(rnd() > 0.6 ? ["intent"] : []),
      ...(rnd() > 0.7 ? ["funding"] : []),
    ];
    const missing = rnd() > 0.7 ? ["mobile", "department"] : rnd() > 0.5 ? ["mobile"] : [];
    const stack = ["Apollo", ...(rnd() > 0.4 ? ["Clearbit"] : []), ...(rnd() > 0.6 ? ["ZoomInfo"] : []), "Hunter"];
    leads.push({
      id: `LD-${(10000 + i).toString().padStart(5, "0")}`,
      name: `${fn} ${ln}`,
      title: titles[Math.floor(rnd() * titles.length)],
      company: c[0],
      domain: c[2],
      size: c[3],
      industry: c[4],
      region: c[5],
      email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, "")}@${c[2]}`,
      emailValid,
      linkedin: `linkedin.com/in/${fn.toLowerCase()}${ln.toLowerCase().replace(/[^a-z]/g, "")}`,
      source: sources[Math.floor(rnd() * sources.length)],
      stage,
      score,
      scoreBreakdown: {
        firmographic: Math.floor(20 + rnd() * 30),
        intent: Math.floor(rnd() * 30),
        technographic: Math.floor(rnd() * 25),
        engagement: Math.floor(rnd() * 20),
      },
      confidence: Math.round(conf * 100) / 100,
      enrichedFields,
      missingFields: missing,
      providerStack: stack,
      owner: owners[Math.floor(rnd() * owners.length)],
      routedTo: rnd() > 0.5 ? "AE pool · Tier-1" : "SDR · Maya R.",
      sequence: rnd() > 0.5 ? sequencesList[Math.floor(rnd() * sequencesList.length)] : undefined,
      lastTouch: rnd() > 0.4 ? `${Math.floor(rnd() * 23) + 1}h ago` : undefined,
      duplicates: rnd() > 0.85 ? Math.floor(rnd() * 3) + 1 : 0,
      arr: rnd() > 0.7 ? Math.floor(20000 + rnd() * 280000) : undefined,
      intent: rnd() > 0.7 ? "high" : rnd() > 0.4 ? "medium" : "low",
      tags: rnd() > 0.5 ? ["ICP-A"] : rnd() > 0.3 ? ["ICP-B"] : ["Watch"],
    });
  }
  return leads;
}

export const leads = generateLeads(64);

/* ───────── Pipeline / deals ───────── */

export type Deal = {
  id: string;
  name: string;
  company: string;
  domain: string;
  amount: number;
  stage: "Discovery" | "Validation" | "Proposal" | "Negotiation" | "Won" | "Lost";
  owner: string;
  source: string;
  closeDate: string;
  ageDays: number;
  syncStatus: "synced" | "pending" | "conflict" | "error";
  lastSync: string;
  attribution: string;
  health: "on-track" | "at-risk" | "stalled";
  contacts: number;
  touches: number;
};

const dealStages: Deal["stage"][] = [
  "Discovery", "Validation", "Proposal", "Negotiation", "Won", "Lost",
];

export function generateDeals(n = 28): Deal[] {
  const rnd = seededRandom(7);
  const deals: Deal[] = [];
  for (let i = 0; i < n; i++) {
    const c = companies[Math.floor(rnd() * companies.length)];
    const stage = dealStages[Math.floor(rnd() * dealStages.length)];
    const amount = Math.floor(15000 + rnd() * 220000);
    const sync: Deal["syncStatus"] = rnd() > 0.85 ? "conflict" : rnd() > 0.75 ? "pending" : rnd() > 0.95 ? "error" : "synced";
    const close = new Date(Date.now() + (Math.floor(rnd() * 90) - 10) * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10);
    deals.push({
      id: `OPP-${(2000 + i).toString().padStart(4, "0")}`,
      name: `${c[0]} · ${stage === "Won" ? "Annual" : "Pilot"}`,
      company: c[0],
      domain: c[2],
      amount,
      stage,
      owner: owners[Math.floor(rnd() * owners.length)],
      source: sources[Math.floor(rnd() * sources.length)],
      closeDate: close,
      ageDays: Math.floor(2 + rnd() * 90),
      syncStatus: sync,
      lastSync: `${Math.floor(rnd() * 59) + 1}m ago`,
      attribution: rnd() > 0.5 ? "Outbound · Sequence A" : rnd() > 0.5 ? "Inbound · SEO" : "Referral",
      health: rnd() > 0.7 ? "at-risk" : rnd() > 0.85 ? "stalled" : "on-track",
      contacts: Math.floor(2 + rnd() * 5),
      touches: Math.floor(4 + rnd() * 22),
    });
  }
  return deals;
}

export const deals = generateDeals(28);

/* ───────── Activity ───────── */

export type Activity = {
  id: string;
  ts: string;
  type: "enrichment" | "sync" | "sequence" | "routing" | "alert" | "deal" | "ingest";
  level: "info" | "warning" | "error" | "success";
  message: string;
  meta?: string;
};

export const activity: Activity[] = [
  { id: "a1", ts: "10:42:18", type: "sync", level: "success", message: "Salesforce sync · 412 contacts synced", meta: "delta=412 conflicts=0" },
  { id: "a2", ts: "10:39:02", type: "enrichment", level: "warning", message: "Clearbit fallback triggered for 27 leads", meta: "primary=Apollo · fallback=Clearbit" },
  { id: "a3", ts: "10:33:51", type: "sequence", level: "info", message: "Sequence ‘ICP-A Founders’ launched · 84 sends queued", meta: "send_window=09:30–11:00" },
  { id: "a4", ts: "10:21:14", type: "routing", level: "success", message: "Routed 31 leads to AE pool · Tier-1", meta: "rule=score>=72 ∧ ICP=A" },
  { id: "a5", ts: "10:15:22", type: "deal", level: "success", message: "Opportunity created · Strata Energy ($82,500)", meta: "OPP-2014" },
  { id: "a6", ts: "10:09:48", type: "alert", level: "error", message: "ZoomInfo provider · 4 consecutive 5xx", meta: "circuit_breaker=open" },
  { id: "a7", ts: "10:02:11", type: "ingest", level: "info", message: "Ingested 188 leads from LinkedIn Sales Nav", meta: "list=Q4-Founders-EU" },
  { id: "a8", ts: "09:58:33", type: "enrichment", level: "success", message: "Email validation · 96.4% deliverable", meta: "n=812 invalid=29" },
  { id: "a9", ts: "09:51:07", type: "sequence", level: "info", message: "Reply detected · maya@forgebio.com (positive)", meta: "intent=meeting" },
  { id: "a10", ts: "09:44:52", type: "alert", level: "warning", message: "Schema drift on hubspot_contact.lifecycle_stage", meta: "owner=RevOps" },
  { id: "a11", ts: "09:31:00", type: "sync", level: "info", message: "HubSpot sync window opened", meta: "interval=15m" },
  { id: "a12", ts: "09:14:20", type: "ingest", level: "success", message: "Inbound form · helix.gtm/demo · 3 leads", meta: "score=avg 68" },
];

/* ───────── KPIs / charts ───────── */

export type Trend = number[];

export const kpiTrends = {
  sourcedLeads: [840, 902, 988, 1024, 1098, 1187, 1244, 1326, 1410, 1488, 1577, 1622, 1689, 1748],
  enrichedLeads: [780, 856, 920, 996, 1078, 1142, 1208, 1284, 1361, 1442, 1518, 1576, 1640, 1697],
  replyRate: [4.1, 4.4, 4.8, 5.0, 5.4, 5.6, 5.9, 6.4, 6.5, 6.8, 7.1, 7.6, 7.8, 8.1],
  meetingsBooked: [12, 14, 13, 17, 21, 19, 22, 26, 30, 28, 33, 36, 38, 41],
  pipelineValue: [
    412000, 438000, 461000, 489000, 512000, 547000, 578000,
    608000, 642000, 681000, 711000, 738000, 770000, 812400,
  ],
  enrichmentSuccess: [88, 89, 91, 90, 92, 93, 92, 94, 94, 93, 95, 95, 96, 96.4],
  dedupeRate: [3.4, 3.2, 3.5, 3.8, 3.6, 3.9, 4.1, 4.3, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8],
  syncHealth: [98, 99, 98, 97, 99, 98, 99, 99, 98, 96, 97, 99, 98, 98.6],
  bookedRate: [1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4],
  oppCreated: [2, 3, 4, 3, 5, 4, 6, 7, 5, 8, 9, 10, 11, 12],
};

/* Pipeline velocity by week */
export const velocityData = [
  { week: "W34", sourced: 422, enriched: 388, replied: 18, booked: 5, opps: 2 },
  { week: "W35", sourced: 461, enriched: 431, replied: 21, booked: 7, opps: 3 },
  { week: "W36", sourced: 502, enriched: 478, replied: 26, booked: 9, opps: 3 },
  { week: "W37", sourced: 558, enriched: 521, replied: 33, booked: 11, opps: 5 },
  { week: "W38", sourced: 604, enriched: 572, replied: 38, booked: 14, opps: 7 },
  { week: "W39", sourced: 671, enriched: 644, replied: 47, booked: 16, opps: 6 },
  { week: "W40", sourced: 712, enriched: 684, replied: 54, booked: 19, opps: 9 },
  { week: "W41", sourced: 768, enriched: 731, replied: 62, booked: 23, opps: 11 },
  { week: "W42", sourced: 822, enriched: 791, replied: 68, booked: 26, opps: 12 },
];

export const conversionByStage = [
  { stage: "Sourced", count: 1748, rate: 100 },
  { stage: "Enriched", count: 1697, rate: 97.1 },
  { stage: "Validated", count: 1576, rate: 90.2 },
  { stage: "Scored", count: 1488, rate: 85.1 },
  { stage: "Routed", count: 1244, rate: 71.2 },
  { stage: "Engaged", count: 612, rate: 35.0 },
  { stage: "Replied", count: 142, rate: 8.1 },
  { stage: "Booked", count: 41, rate: 2.3 },
  { stage: "Opp.", count: 12, rate: 0.7 },
];

export const channelAttribution = [
  { channel: "Outbound — Sequence A", value: 412, share: 38.4 },
  { channel: "Outbound — Sequence B", value: 218, share: 20.3 },
  { channel: "Inbound — SEO", value: 162, share: 15.1 },
  { channel: "Inbound — Demo form", value: 121, share: 11.2 },
  { channel: "Referral", value: 88, share: 8.2 },
  { channel: "LinkedIn DMs", value: 73, share: 6.8 },
];

/* ───────── Sequences ───────── */

export type SequenceStep = {
  id: string;
  type: "email" | "linkedin" | "task" | "wait" | "branch";
  delay: string;
  subject?: string;
  preview?: string;
  variants?: number;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    replied: number;
    booked: number;
    bounced: number;
  };
};

export const sequences = [
  {
    id: "SEQ-001",
    name: "ICP-A Founders / EU",
    status: "active",
    audience: "Founder · 11–50 · EU",
    enrolled: 412,
    active: 318,
    completed: 94,
    replyRate: 9.4,
    bookedRate: 2.7,
    sendWindow: "Tue–Thu · 09:30–11:00 local",
    abTest: true,
    steps: [
      { id: "s1", type: "email", delay: "Day 0", subject: "Helping {{firstName}} ship pipeline ops", preview: "Hey {{firstName}} — saw {{company}} just raised {{lastFundingRound}}. We…", variants: 2,
        metrics: { sent: 412, delivered: 401, opened: 263, replied: 41, booked: 12, bounced: 11 } },
      { id: "s2", type: "wait", delay: "+2 days", metrics: { sent: 0, delivered: 0, opened: 0, replied: 0, booked: 0, bounced: 0 } },
      { id: "s3", type: "linkedin", delay: "Day 2", subject: "Connection note", preview: "Quick note on what we're seeing in {{industry}} GTM…",
        metrics: { sent: 360, delivered: 360, opened: 211, replied: 26, booked: 6, bounced: 0 } },
      { id: "s4", type: "email", delay: "Day 4", subject: "{{firstName}} — 2 ideas for {{company}}", preview: "Specific patterns we've seen with founders at your stage…", variants: 2,
        metrics: { sent: 332, delivered: 326, opened: 198, replied: 28, booked: 8, bounced: 6 } },
      { id: "s5", type: "branch", delay: "Day 5", subject: "Reply detected → handoff", metrics: { sent: 0, delivered: 0, opened: 0, replied: 0, booked: 0, bounced: 0 } },
      { id: "s6", type: "email", delay: "Day 7", subject: "Closing the loop", preview: "Last note — happy to send the runbook regardless…",
        metrics: { sent: 248, delivered: 244, opened: 122, replied: 14, booked: 4, bounced: 4 } },
    ] satisfies SequenceStep[],
  },
  {
    id: "SEQ-002",
    name: "Tier-1 Reactivation",
    status: "active",
    audience: "Closed-lost · 6–12mo",
    enrolled: 188,
    active: 102,
    completed: 86,
    replyRate: 11.8,
    bookedRate: 3.1,
    sendWindow: "Mon–Wed · 08:00–10:00 local",
    abTest: false,
    steps: [],
  },
  {
    id: "SEQ-003",
    name: "Inbound Speed-to-Lead",
    status: "active",
    audience: "Inbound · /demo",
    enrolled: 73,
    active: 18,
    completed: 55,
    replyRate: 22.4,
    bookedRate: 9.6,
    sendWindow: "Realtime",
    abTest: false,
    steps: [],
  },
  {
    id: "SEQ-004",
    name: "Champion Multi-thread",
    status: "paused",
    audience: "Existing accts · expand",
    enrolled: 24,
    active: 0,
    completed: 24,
    replyRate: 14.2,
    bookedRate: 4.0,
    sendWindow: "Manual",
    abTest: false,
    steps: [],
  },
];

/* ───────── Workflows / providers ───────── */

export type Provider = {
  id: string;
  name: string;
  category: "Source" | "Enrich" | "Validate" | "Send" | "CRM" | "Reporting";
  status: "healthy" | "degraded" | "down";
  uptime: number;
  p95Latency: string;
  successRate: number;
  lastRun: string;
  reqs24h: number;
};

export const providers: Provider[] = [
  { id: "p1", name: "Apollo", category: "Source", status: "healthy", uptime: 99.94, p95Latency: "412ms", successRate: 99.6, lastRun: "1m ago", reqs24h: 18432 },
  { id: "p2", name: "LinkedIn Sales Nav", category: "Source", status: "healthy", uptime: 99.81, p95Latency: "612ms", successRate: 98.7, lastRun: "3m ago", reqs24h: 4128 },
  { id: "p3", name: "ZoomInfo", category: "Enrich", status: "down", uptime: 96.21, p95Latency: "—", successRate: 0, lastRun: "12m ago · failed", reqs24h: 982 },
  { id: "p4", name: "Clearbit", category: "Enrich", status: "degraded", uptime: 99.10, p95Latency: "1.42s", successRate: 92.4, lastRun: "47s ago", reqs24h: 12104 },
  { id: "p5", name: "NeverBounce", category: "Validate", status: "healthy", uptime: 99.99, p95Latency: "188ms", successRate: 99.8, lastRun: "12s ago", reqs24h: 21044 },
  { id: "p6", name: "Smartlead", category: "Send", status: "healthy", uptime: 99.78, p95Latency: "844ms", successRate: 99.1, lastRun: "32s ago", reqs24h: 6219 },
  { id: "p7", name: "Salesforce", category: "CRM", status: "healthy", uptime: 99.97, p95Latency: "688ms", successRate: 99.7, lastRun: "21s ago", reqs24h: 9211 },
  { id: "p8", name: "HubSpot", category: "CRM", status: "degraded", uptime: 99.42, p95Latency: "1.91s", successRate: 96.2, lastRun: "2m ago", reqs24h: 3812 },
  { id: "p9", name: "Snowflake", category: "Reporting", status: "healthy", uptime: 99.99, p95Latency: "211ms", successRate: 100, lastRun: "1m ago", reqs24h: 211 },
];

export const workflows = [
  {
    id: "wf1",
    name: "Inbound → Speed-to-lead",
    desc: "Form fill → enrich → score → route to AE in <60s",
    runs24h: 73,
    successRate: 100,
    avgRuntime: "11.4s",
    nodes: ["Form", "Clearbit", "Score", "Route", "Slack ping", "Salesforce"],
    status: "healthy",
    lastRun: "32s ago",
  },
  {
    id: "wf2",
    name: "Daily ICP-A enrichment",
    desc: "Pull list → enrich (Apollo→Clearbit) → validate → dedupe → load",
    runs24h: 1,
    successRate: 96.4,
    avgRuntime: "8m 41s",
    nodes: ["Cron 06:00", "Apollo", "Clearbit", "NeverBounce", "Dedupe", "HubSpot"],
    status: "degraded",
    lastRun: "4h ago · 27 fallbacks",
  },
  {
    id: "wf3",
    name: "Reply → Meeting handoff",
    desc: "Positive reply → notify AE → create deal stub in SFDC",
    runs24h: 14,
    successRate: 100,
    avgRuntime: "3.2s",
    nodes: ["Smartlead webhook", "Intent detect", "Slack DM", "Salesforce"],
    status: "healthy",
    lastRun: "9m ago",
  },
  {
    id: "wf4",
    name: "Closed-lost reactivation",
    desc: "Quarterly sweep · re-enrich · enroll if title changed",
    runs24h: 0,
    successRate: 99.1,
    avgRuntime: "21m 04s",
    nodes: ["Cron Q", "Apollo", "Title diff", "Smartlead"],
    status: "healthy",
    lastRun: "12d ago",
  },
];

/* ───────── Data quality issues ───────── */

export const dataQualityIssues = [
  { id: "dq1", severity: "high", type: "Schema drift", entity: "hubspot_contact.lifecycle_stage", count: 1, message: "New value ‘RE-ENGAGED’ not mapped in Helix → SFDC sync", detected: "8m ago" },
  { id: "dq2", severity: "high", type: "Provider failure", entity: "ZoomInfo /v1/people", count: 4, message: "Circuit breaker open · fallback to Clearbit succeeding", detected: "12m ago" },
  { id: "dq3", severity: "medium", type: "Duplicates", entity: "leads", count: 23, message: "23 records share a normalized email · pending merge review", detected: "1h ago" },
  { id: "dq4", severity: "medium", type: "Invalid emails", entity: "leads", count: 41, message: "Hard bounce on first send · marked undeliverable", detected: "2h ago" },
  { id: "dq5", severity: "low", type: "Missing fields", entity: "contacts.title", count: 88, message: "Title missing on 88 enriched contacts · re-enrichment scheduled", detected: "3h ago" },
  { id: "dq6", severity: "low", type: "Stale", entity: "company.headcount", count: 312, message: "Headcount last refreshed >180 days · enrich queued", detected: "yesterday" },
];

/* ───────── Cohort table ───────── */

export const cohortTable = {
  rows: [
    { cohort: "W36", sourced: 502, "+7d": 41, "+14d": 14, "+30d": 5, "+60d": 2 },
    { cohort: "W37", sourced: 558, "+7d": 47, "+14d": 18, "+30d": 7, "+60d": 3 },
    { cohort: "W38", sourced: 604, "+7d": 52, "+14d": 22, "+30d": 9, "+60d": 4 },
    { cohort: "W39", sourced: 671, "+7d": 61, "+14d": 26, "+30d": 11, "+60d": null },
    { cohort: "W40", sourced: 712, "+7d": 68, "+14d": 31, "+30d": null, "+60d": null },
    { cohort: "W41", sourced: 768, "+7d": 74, "+14d": null, "+30d": null, "+60d": null },
    { cohort: "W42", sourced: 822, "+7d": null, "+14d": null, "+30d": null, "+60d": null },
  ],
};

export const radarHealth = [
  { axis: "Coverage", value: 88 },
  { axis: "Accuracy", value: 92 },
  { axis: "Freshness", value: 74 },
  { axis: "Deliverability", value: 96 },
  { axis: "Routing", value: 90 },
  { axis: "Sync", value: 81 },
];

/* ───────── Email Finder ───────── */

export type FinderResult = {
  id: string;
  name: string;
  domain: string;
  email?: string;
  status: "found" | "guessed" | "catch-all" | "not_found" | "invalid";
  confidence: number;
  source: "Apollo" | "Hunter" | "Clearbit" | "Pattern" | "SMTP" | "Cache";
  bounceRisk: "low" | "medium" | "high";
  catchAll: boolean;
  mxOk: boolean;
  smtpOk: boolean;
  ts: string;
  ms: number;
};

export const recentFinds: FinderResult[] = [
  { id: "f1", name: "Maya Okafor", domain: "forgebio.com", email: "maya.okafor@forgebio.com", status: "found", confidence: 96, source: "Apollo", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "2m ago", ms: 412 },
  { id: "f2", name: "Daniel Vogel", domain: "kettle.dev", email: "daniel@kettle.dev", status: "found", confidence: 92, source: "Hunter", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "3m ago", ms: 884 },
  { id: "f3", name: "Carla Rossi", domain: "halcyon.ai", email: "c.rossi@halcyon.ai", status: "guessed", confidence: 71, source: "Pattern", bounceRisk: "medium", catchAll: true, mxOk: true, smtpOk: false, ts: "4m ago", ms: 1240 },
  { id: "f4", name: "Sven Andersen", domain: "northwind.io", email: "sven.andersen@northwind.io", status: "found", confidence: 98, source: "Cache", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "6m ago", ms: 14 },
  { id: "f5", name: "Yuki Tanaka", domain: "rover.io", status: "not_found", confidence: 0, source: "Apollo", bounceRisk: "high", catchAll: false, mxOk: true, smtpOk: false, ts: "8m ago", ms: 2104 },
  { id: "f6", name: "Léa Marchetti", domain: "ferment.bio", email: "lea.m@ferment.bio", status: "found", confidence: 88, source: "Clearbit", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "9m ago", ms: 1612 },
  { id: "f7", name: "Kofi Patel", domain: "stackfoundry.com", email: "kofi.patel@stackfoundry.com", status: "found", confidence: 94, source: "Hunter", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "11m ago", ms: 712 },
  { id: "f8", name: "Anya Petersen", domain: "marlo.bank", status: "catch-all", confidence: 58, source: "SMTP", bounceRisk: "medium", catchAll: true, mxOk: true, smtpOk: false, ts: "13m ago", ms: 1890 },
  { id: "f9", name: "Theo Hauser", domain: "atlasfreight.com", email: "thauser@atlasfreight.com", status: "found", confidence: 81, source: "Pattern", bounceRisk: "medium", catchAll: false, mxOk: true, smtpOk: true, ts: "15m ago", ms: 942 },
  { id: "f10", name: "Mira Nilsson", domain: "dovetail-labs.io", email: "mira@dovetail-labs.io", status: "found", confidence: 91, source: "Apollo", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "17m ago", ms: 528 },
  { id: "f11", name: "Diego Costa", domain: "quantadevices.com", status: "invalid", confidence: 12, source: "Pattern", bounceRisk: "high", catchAll: false, mxOk: false, smtpOk: false, ts: "21m ago", ms: 384 },
  { id: "f12", name: "Selin Berger", domain: "glassbeam.io", email: "selin.berger@glassbeam.io", status: "found", confidence: 95, source: "Hunter", bounceRisk: "low", catchAll: false, mxOk: true, smtpOk: true, ts: "24m ago", ms: 671 },
];

export const finderProviders = [
  { id: "cache", name: "Cache", role: "Helix internal", hit: 41.2, p95: "14ms", cost: 0, ok: 100, status: "healthy" as const },
  { id: "pattern", name: "Pattern engine", role: "Domain pattern guess", hit: 23.4, p95: "8ms", cost: 0, ok: 100, status: "healthy" as const },
  { id: "apollo", name: "Apollo", role: "Primary database", hit: 58.6, p95: "412ms", cost: 0.18, ok: 99.6, status: "healthy" as const },
  { id: "hunter", name: "Hunter", role: "Secondary database", hit: 14.8, p95: "844ms", cost: 0.04, ok: 98.2, status: "healthy" as const },
  { id: "clearbit", name: "Clearbit", role: "Tertiary fallback", hit: 6.1, p95: "1.42s", cost: 0.06, ok: 92.4, status: "degraded" as const },
  { id: "smtp", name: "SMTP verify", role: "Catch-all + bounce probe", hit: 88.2, p95: "1.18s", cost: 0.002, ok: 96.7, status: "healthy" as const },
];

export const domainCoverage = [
  { domain: "forgebio.com", attempts: 41, found: 39, pattern: "{first}.{last}", catchAll: false, last: "2m" },
  { domain: "kettle.dev", attempts: 22, found: 22, pattern: "{first}", catchAll: false, last: "3m" },
  { domain: "halcyon.ai", attempts: 18, found: 12, pattern: "{f}.{last}", catchAll: true, last: "4m" },
  { domain: "northwind.io", attempts: 64, found: 61, pattern: "{first}.{last}", catchAll: false, last: "6m" },
  { domain: "rover.io", attempts: 12, found: 4, pattern: "{first}{l}", catchAll: false, last: "8m" },
  { domain: "ferment.bio", attempts: 9, found: 8, pattern: "{first}.{l}", catchAll: false, last: "9m" },
  { domain: "stackfoundry.com", attempts: 33, found: 31, pattern: "{first}.{last}", catchAll: false, last: "11m" },
  { domain: "marlo.bank", attempts: 14, found: 6, pattern: "—", catchAll: true, last: "13m" },
  { domain: "atlasfreight.com", attempts: 28, found: 22, pattern: "{f}{last}", catchAll: false, last: "15m" },
  { domain: "dovetail-labs.io", attempts: 11, found: 11, pattern: "{first}", catchAll: false, last: "17m" },
];

export const patternFrequency = [
  { p: "{first}.{last}", n: 1284, share: 41.4 },
  { p: "{first}", n: 612, share: 19.8 },
  { p: "{f}{last}", n: 488, share: 15.7 },
  { p: "{first}{l}", n: 312, share: 10.0 },
  { p: "{f}.{last}", n: 188, share: 6.0 },
  { p: "{last}.{first}", n: 96, share: 3.1 },
  { p: "other", n: 124, share: 4.0 },
];

export const finderQueue = [
  { id: "q1", name: "Hugo Larsen · plinth.io", state: "querying", step: "Apollo", elapsed: "0.4s" },
  { id: "q2", name: "Noor Ali · strata.energy", state: "smtp_check", step: "SMTP probe", elapsed: "1.1s" },
  { id: "q3", name: "Felix Becker · crisp.app", state: "pattern_guess", step: "Pattern · {first}.{last}", elapsed: "0.1s" },
  { id: "q4", name: "Ezra Iwasaki · glassbeam.io", state: "queued", step: "—", elapsed: "0.0s" },
  { id: "q5", name: "Lia Kovač · marlo.bank", state: "queued", step: "—", elapsed: "0.0s" },
];

export const segmentVelocity = [
  { segment: "ICP-A · Founders 11-50", oppDays: 14.2, replied: 9.4, booked: 2.7 },
  { segment: "ICP-A · RevOps 51-200", oppDays: 18.4, replied: 7.1, booked: 2.1 },
  { segment: "ICP-B · CTOs 11-50", oppDays: 22.1, replied: 6.4, booked: 1.6 },
  { segment: "ICP-B · Marketing 201-500", oppDays: 26.8, replied: 4.9, booked: 1.1 },
  { segment: "Watch · Late stage", oppDays: 31.4, replied: 3.2, booked: 0.6 },
];
