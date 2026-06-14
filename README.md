# Talent Intelligence — Phase 1 Demo Companion App

A lightweight, clickable mock-up for walking clients through Phase 1 workflows of the CRC Talent Intelligence Platform. **This is not the production app** — it uses mock data and has no backend or AI integration.

## Purpose

Use this app during client presentations to:

- Walk through each Phase 1 workflow end-to-end.
- Switch between user roles in real time to show permission-based differences.
- Demonstrate what each role (Talent HR, HRBP, Line Manager, Read-Only, Employee) sees.

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scope

- **Phase 1 only**
- **No AI integration** — AI-dependent features show mock/sample data
- **No ICDP** — excluded from Phase 1

## Workflows

| Route | Workflow | Description |
|---|---|---|
| `/` | Home | Workflow selection + role permission matrix |
| `/talent-insights` | Talent Population Discovery | KPI cards, filters, employee table, profile drill-down |
| `/profile/:id` | Individual Profile Review | Competencies radar, gap analysis, recommendations, work history, career visualizer, manager comment |
| `/succession` | Succession Risk & Bench Review | Critical roles, risk heatmap, bench candidates with readiness ranking |
| `/career-planning` | Career Planning & Velocity | Promotions YTD, velocity distribution, On Track / Delayed / On Hold table |
| `/upload` | Upload / Update Profile | CV upload simulation, AI extraction review with confidence scores |
| `/vacancies` | Internal Vacancies & Matching | JG17+ vacancies, internal AI match scores, external candidate comparison |

## Roles

| Role | Access |
|---|---|
| **Talent HR** | Full access across all Group BUs |
| **HRBP** | Scoped to CRC (CDS + Robinson Retail) |
| **Line Manager** | Direct reports only + Manager Comment (CPN) |
| **Read-Only / Executive** | Dashboards only, no profile drill-down |
| **Employee / Talent** | Self-service, own profile only |

Use the **role switcher** in the sidebar to switch roles. Buttons with a lock icon indicate roles that cannot access the current page.

## Presenter Features

- **Presenter Notes** — collapsible yellow panel at the top of each screen with talking points for the current workflow and role.
- **Demo User Selector** — for Line Manager and Employee roles, a dropdown in the top bar lets you pick which person to simulate.
- **Role-based data scoping** — KPI cards, tables, and profiles all respect the active role's permissions.

## Tech Stack

- React Router 7 (SSR)
- React 19
- Tailwind CSS v4 + DaisyUI 5
- TypeScript
