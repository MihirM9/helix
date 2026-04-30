# Helix · GTM Systems Command Center

A frontend prototype for an internal GTM operations console used by founders
and RevOps engineers. Built around the idea that go-to-market is an
engineering system: enrichment pipelines, outbound automations, CRM syncing,
attribution, and monitoring — not a marketing site.

The brand is intentionally generic ("Helix"). The logo is a custom inline SVG.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v3** with a custom token system (`src/index.css`,
  `tailwind.config.js`)
- **React Router v7** for page navigation
- **Recharts** for charts (with a custom theme/tooltip in
  `src/components/charts/ChartTheme.tsx`)
- **Framer Motion** for tasteful transitions
- **Lucide React** for icons

No backend — all data is realistic seeded fixtures in `src/data/fixtures.ts`.

## Pages

1. **Overview** (`/`) — KPI strip with animated counters and sparklines, pipeline
   velocity, channel attribution, conversion funnel, "what changed today"
   activity rail, GTM stack health, alerts, and a daily sequences chart.
2. **Enrichment** (`/enrichment`) — 8-stage enrichment pipeline visualization
   (source → validate → enrich · person → enrich · company → dedupe → score →
   route → sync), provider stack panel, live records table, and a lead detail
   drawer with score breakdown, firmographics, data provenance, and pipeline
   timeline.
3. **Sequences** (`/sequences`) — Multi-sequence sidebar, step builder with
   email / LinkedIn / wait / branch nodes, A/B variant comparisons,
   personalization variables, intent detection, and per-step metrics.
4. **Pipeline** (`/pipeline`) — CRM Kanban across 5 stages, sync status badges
   per CRM, conflict surfacing, deal table with health and sync state, and a
   deal detail drawer with activity timeline and 14-day touch heatmap.
5. **Analytics** (`/analytics`) — Filter chips with smooth state transitions,
   conversion funnel, pipeline health radar, cohort retention table (intensity
   shading), source attribution, segment velocity chart, sequence performance
   table.
6. **Workflows** (`/workflows`) — Connected workflow grid, node graph for the
   selected workflow, run log table, full GTM stack provider table with
   uptime/p95/success, and a "manual handoffs · automated" before/after column.
7. **Data Quality** (`/data-quality`) — Trust score with weighted dimensions,
   issue volume mini stack chart, open-issues table, 8-monitor grid, and a
   broken-automations list.

## Power-user details

- **Command palette** (`⌘K`) — fuzzy search over pages, alerts, and creation
  flows. Arrow keys + return.
- **Theme** — dark mode is default; toggle in the top bar. Persists in
  localStorage. Tokens defined in `src/index.css`.
- **Animated KPI counters** — `useMotionValue` + sparkline, color follows
  delta direction.
- **Live status pulses** for live providers and active workflows.
- **Drawers** for lead and deal detail with inline score bars, provenance
  scoring, and a vertical activity timeline.
- **Filter chips** with motion-based add/remove.
- **Cohort table** uses intensity shading for retention.
- **Pipeline health radar** with 6 weighted axes.
- **Tabular numerics** everywhere data is shown.

## Design system

- Custom typography scale tuned for compact data UIs (12.5–13px base, 22px
  page titles).
- Single accent color: burnt orange (`#EA580C` in light, `#FF6421` in dark).
- Refined border radii (3–8px) — no overly soft cards.
- Strict spacing system on a 4px grid.
- Visible focus rings for keyboard nav.
- Skeleton class (`.skeleton`) and pulse keyframes available globally.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type check + production build
npm run preview  # preview the production build
```

## Project layout

```
src/
├── App.tsx               # routes
├── main.tsx              # bootstrap (theme, router)
├── index.css             # tokens, base, components, utilities
├── lib/
│   ├── theme.tsx         # ThemeProvider · localStorage · system pref
│   └── utils.ts          # cn(), number/currency formatters, seeded random
├── data/fixtures.ts      # all demo data (leads, deals, sequences, etc.)
├── components/
│   ├── Logo.tsx          # custom inline SVG mark
│   ├── PageHeader.tsx    # sticky page titlebar with eyebrow + meta + actions
│   ├── charts/ChartTheme.tsx  # chart color hook + custom Tooltip
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── CommandPalette.tsx
│   └── ui/
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Drawer.tsx
│       ├── EmptyState.tsx
│       ├── KPI.tsx
│       ├── Skeleton.tsx
│       ├── Sparkline.tsx
│       └── StatusDot.tsx
└── pages/
    ├── Overview.tsx
    ├── Enrichment.tsx
    ├── Sequences.tsx
    ├── Pipeline.tsx
    ├── Analytics.tsx
    ├── Workflows.tsx
    └── DataQuality.tsx
```

## Notes on copy

All content is operational shorthand — "Sync degraded", "12 records need
review", "Reply rate up 18%", "2 providers failing fallback" — meant to feel
like an internal product used daily. There is no marketing copy or lorem
ipsum.
