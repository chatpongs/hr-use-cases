# Talent Intelligence Platform — Phase 1 Mock-Up Companion App PRD

## 1. Purpose

This document describes the **mock-up companion app** we will build to walk the client through Phase 1 workflows of the CRC Talent Intelligence Platform.

It is **not** the production app. It is a lightweight, clickable presentation tool that lets the presenter switch roles in real time and demonstrate what different users see at each step of a workflow.

Source material:

- `docs/Talent Intelligence - PRD.md`
- `docs/Talent Intelligence - FSD.md`
- `docs/Talent Intelligence - Use Cases.md`

Scope constraints for the mock-up:

- **Phase 1 only**
- **No AI integration** — AI-dependent outputs are shown as static/mock data
- **No ICDP** — excluded from Phase 1

---

## 2. Product Vision

A quick wireframe-style companion app that lets the presenter:

- Walk the client through end-to-end Phase 1 workflows.
- Instantly switch between user roles and show permission-based differences.
- Simulate data inputs (forms, comments, uploads) using local state only.
- Highlight where AI and Phase 2 capabilities will appear later.

---

## 3. Target Users of the Mock-Up

| User | How they use the mock-up |
|---|---|
| **Presenter (you)** | Clicks through workflows, switches roles, uses presenter notes to guide discussion |
| **Client stakeholders** | View the same screen as the presenter and see how the platform behaves per role |

---

## 4. Global Behaviors

### 4.1 Role Switcher

A visible role switcher is always available in the app header.

Roles:

- **Talent HR** — full platform access within Group BU/BU scope
- **HRBP** — scoped to assigned BU/function
- **Line Manager** — direct reports only, plus Manager Comment for CPN
- **Read-Only / Executive** — dashboards and aggregated reports only

Switching roles immediately re-renders the current screen to show what that role sees.

### 4.2 Workflow Navigation

Each workflow is a guided sequence with numbered steps (e.g., Step 1/5). The presenter advances using **Next / Previous** controls.

### 4.3 Presenter Notes

Each workflow step has optional presenter notes visible to the presenter (or as a collapsible panel) to guide talking points.

### 4.4 Simulated Data Input

Forms and inputs (e.g., Manager Comment, extracted-field review) use React state only. They appear to work during the demo but do not persist to a backend. Optional `localStorage` persistence can be added so inputs survive role switches within one demo session.

### 4.5 Visual Style

Quick wireframe style using Tailwind CSS. Functional layouts, real tables, real filters, but minimal polish and no animations.

---

## 5. Mock-Up Workflows

### Workflow 1: Foundation / Onboarding

**Purpose:** Introduce the app, navigation, and role model.

**Steps:**

1. Landing screen with app title and brief description.
2. Role switcher explanation — show what each role represents.
3. Pick a role and observe how the navigation menu changes.
4. Show a permission preview matrix summarizing module access per role.

**Role contrast:** Different roles see different menu items and module availability.

---

### Workflow 2: Talent Population Discovery

**Purpose:** Browse and filter the employee population.

**Steps:**

1. Open the **Talent Insights** module.
2. View KPI cards: Total Headcount, Talent Group Breakdown, High Risk of Losses, Average Retention Factor.
3. Apply filters: Group BU, BU, Function, Grade, Risk.
4. Search by employee name or employee ID.
5. Browse the employee table.
6. Click an employee to open the Individual Detail View.

**Role contrast:**

- Talent HR: sees all employees in scope.
- HRBP: sees employees in assigned BU/function only.
- Line Manager: sees direct reports only.
- Employee: sees own record only (if self-service is enabled).
- Read-Only: sees KPI cards and table but no detail drill-down.

---

### Workflow 3: Individual Talent Profile Review

**Purpose:** Deep-dive into a single employee.

**Steps:**

1. Open an employee profile from the Talent Insights table.
2. Review tabs: **Competencies**, **Competency Assessment**, **Development Recommendations**, **Work History**, **Career Visualizer**.
3. Show the competency radar chart (actual vs required).
4. Show the competency gap view.
5. Show static/mock development recommendations.
6. Show work history timeline and career visualizer.

**Role contrast:**

- Talent HR: sees all tabs and data.
- HRBP: sees scoped employee profiles.
- Line Manager: sees direct reports only; sees Manager Comment section.
- Employee: sees own profile, read-only.
- Read-Only: sees limited profile summary.

---

### Workflow 4: Manager Comment (CPN-Specific)

**Purpose:** Show the CPN requirement for Line Manager qualitative input.

**Steps:**

1. Switch to **Line Manager** role.
2. Open a direct report's profile.
3. Navigate to the **Development Recommendations** tab.
4. Add or edit a rich-text Manager Comment.
5. Observe the "required for review finalization" indicator.

**Role contrast:**

- Line Manager: can add/edit Manager Comment.
- Talent HR: can view comment, cannot edit.
- HRBP: may view depending on scope (TBD).
- Employee/others: comment not visible.

---

### Workflow 5: Upload / Update Employee Profile

**Purpose:** Demonstrate HR-led profile ingestion without AI backend.

**Steps:**

1. Open the **Upload / Update Profile** module.
2. Drag/drop or select a CV file (PDF/DOC/DOCX, max 10MB).
3. See a simulated extraction review form with pre-filled mock fields.
4. Edit extracted fields (employee_id, name, role, competencies, work history).
5. Click **Save** to simulate upsert by employee_id.
6. Show success state and updated employee record.

**Role contrast:**

- Talent HR: full upload and edit access.
- HRBP: upload access if granted (configurable in demo).
- Line Manager / Employee / Read-Only: "Access Denied" or read-only message.

---

### Workflow 6: Career Planning & Velocity Tracking

**Purpose:** Track promotion velocity and status.

**Steps:**

1. Open the **Career Planning** module.
2. View dashboard cards: Promotions YTD, Average Tenure, On Track, Delayed, On Hold.
3. View the velocity distribution area chart.
4. Browse the velocity table.
5. Filter by status: On Track, Delayed, On Hold.
6. Click a row to drill down to employee career detail.

**Role contrast:**

- Talent HR: full dashboard and drill-down.
- HRBP: scoped view.
- Line Manager: direct reports only.
- Read-Only: dashboard aggregates only.

---

### Workflow 7: Succession Risk & Bench Review

**Purpose:** Review critical roles and successor benches.

**Steps:**

1. Open the **Succession Planning** module.
2. View dashboard KPI cards: Total Critical Roles, Ready Now Successors, Average Bench Strength, High-Risk Critical Roles.
3. View risk heatmap by BU/function.
4. Filter critical roles by Group BU, BU, Function, Department.
5. Click a critical role to open detail/bench view.
6. Review bench candidates ranked by readiness status and score.

**Role contrast:**

- Talent HR: full view, can add/edit bench candidates.
- HRBP: scoped to assigned BU/function.
- Line Manager: read-only, limited to relevant roles/direct reports.
- Read-Only: dashboard only.

---

### Workflow 8: Internal Vacancies & Candidate Matching

**Purpose:** Show JG17+ internal mobility flow.

**Steps:**

1. Open the **Internal Vacancies** module.
2. View vacancy list with columns: Job Title, Department/BU, Level, Priority, Status, Internal Matches.
3. Filter by department, level, priority.
4. Click a vacancy to view job details.
5. View internal matches with static/mock match scores.
6. Compare internal vs external candidates side by side.

**Role contrast:**

- Hiring Manager / Recruiter: full access, internal + external candidates.
- Talent HR: can view internal matches.
- HRBP: scoped vacancies.
- Line Manager / Employee / Read-Only: limited or no access.

---

### Workflow 9: Employee Self-Service View (Optional)

**Purpose:** Preview what an employee sees if self-service is included in Phase 1.

**Steps:**

1. Switch to **Employee** role.
2. View own profile.
3. Browse competencies, development recommendations, career visualizer.

**Role contrast:** Only the Employee role can access; all others see access-denied.

---

### Workflow 10: Permission / Out-of-Scope Preview

**Purpose:** Explicitly demonstrate denied access.

**Steps:**

1. From a limited role, attempt to open a restricted screen or employee outside scope.
2. Show "Access Denied" or "Out of your scope" state.

**Role contrast:** Highlights why the role model matters.

---

## 6. Build Order

1. Foundation layout + role switcher + workflow navigation
2. Shared reusable components (filters, KPI cards, data tables, slide-over, permission gate)
3. Mock data layer (employees, competencies, work history, critical roles, vacancies)
4. Workflow 2: Talent Population Discovery
5. Workflow 3: Individual Talent Profile Review
6. Workflow 4: Manager Comment
7. Workflow 7: Succession Risk & Bench Review
8. Workflow 6: Career Planning & Velocity Tracking
9. Workflow 5: Upload / Update Employee Profile
10. Workflow 8: Internal Vacancies & Candidate Matching
11. Optional: Workflow 9 and Workflow 10

---

## 7. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NF-001 | Runs locally via `npm run dev` |
| NF-002 | Quick wireframe visual style |
| NF-003 | Role switcher visible to client |
| NF-004 | Presenter notes per workflow step |
| NF-005 | Simulated inputs work during demo but do not persist |
| NF-006 | Thai and English labels where applicable |

---

## 8. Open Questions

| # | Question | Status |
|---|---|---|
| 1 | Should Employee self-service be included in Phase 1 demo? | TBD |
| 2 | Should Manager Comment be shown for all entities or CPN-only? | CPN-only for now |
| 3 | Should we use realistic CRC-style sample data or generic placeholders? | To be created |
| 4 | Should simulated inputs persist across role switches via localStorage? | Optional |
