# Talent Intelligence Platform — Functional Specification Document (FSD)

## 1. Introduction

### 1.1 Purpose

This Functional Specification Document (FSD) describes how the **Talent Intelligence Platform** behaves from a functional perspective. It translates the PRD into module-level functionality, user interactions, business rules, and data flows.

### 1.2 Scope

This FSD covers the modules contained in Phase 1 baseline:

- Foundation (auth, access control, navigation)
- Succession Planning
- Talent Insights
- Individual Detail View
- Upload / Update Profile
- Career Planning
- Internal Vacancies

It references Phase 2 capabilities where needed for boundary clarity.

### 1.3 Definitions

| Term | Definition |
|---|---|
| Critical Role | A strategic position whose vacancy would create significant business risk |
| Bench Candidate | An internal employee linked to one or more critical roles as a successor |
| Readiness Score | Numeric indicator of how prepared a bench candidate is for a target role |
| Flight Risk | Estimated probability of voluntary attrition (High / Medium / Low) |
| Retention Factor | Inverse likelihood to leave, expressed as 0-100 |
| Career Velocity | Classification of career progression pace (On Track / Delayed / On Hold) |
| ICDP | Individual Career Development Plan — exported as editable .pptx |

---

## 2. Overall Architecture

### 2.1 Logical Components

```
+-----------------------------------------------------------+
|                    Talent Intelligence UI                  |
|  (React/Vue/TBD web application, desktop/tablet optimized) |
+-----------------------------------------------------------+
                            |
        +-------------------+-------------------+
        |                   |                   |
+-------v-------+  +--------v---------+  +------v-------+
|  Auth / RBAC  |  |  Business Logic  |  |  Edge / AI   |
+---------------+  |  (API functions) |  |  Functions   |
                   +------------------+  +--------------+
                            |
        +-------------------+-------------------+
        |                   |                   |
+-------v-------+  +--------v---------+  +------v-------+
|   Postgres    |  |  Object Storage  |  |    ETL       |
|   (metadata)  |  |  (CVs, reports)  |  |  (MWAA/n8n)  |
+---------------+  +------------------+  +--------------+
```

### 2.2 Data Sources

| Source | Data |
|---|---|
| Talent_DB (via MWAA) | Employee master, tenure, performance, potential |
| Recruit_DB (via MWAA) | Job vacancies, external candidates |
| Document Upload | Resumes/CVs stored in employee-cvs bucket |
| Edge Functions | AI parsing, recommendations, matching |

---

## 3. Foundation

### 3.1 Authentication

- SSO integration with corporate identity provider (method TBD).
- Session timeout and token refresh handled by the application.

### 3.2 Authorization

| Role | Scope |
|---|---|
| Talent HR | Full platform access within assigned group/BU |
| HRBP | Read access across assigned BU/function; profile edit TBD |
| Line Manager (CPN req) | Read profiles and ICDP of direct reports; add Manager Comment |
| Read-Only / Executive | Dashboards and aggregated reports |

### 3.3 Navigation

Primary navigation modules:

1. Succession Planning
2. Talent Insights
3. Upload / Update Profile
4. Career Planning
5. Internal Vacancies

---

## 4. Succession Planning Module

### 4.1 Dashboard View

- KPI cards:
  - Total Critical Roles
  - Critical Roles with Ready Now Successor
  - Average Bench Strength
  - High-Risk Critical Roles
- Risk heatmap by BU/function.
- Filter by Group BU, BU, Function, Department.

### 4.2 Critical Roles Table

Columns:

- Role Title
- Department / BU
- Incumbent
- Risk Level
- Bench Count
- Readiest Successor
- Target Readiness Date

Actions:

- View role detail
- Add/edit bench candidate
- Mark role as high/medium/low risk

### 4.3 Role Detail / Bench View

- Incumbent card with risk and retention factor.
- Bench candidate list with:
  - Name, current role
  - Readiness status (Ready Now / Ready 1-2 Years / Ready 3-5 Years)
  - Readiness score
  - Competency match
  - Flight risk
- Ability to rank/reorder candidates.

### 4.4 Business Rules

- A critical role may have zero or many bench candidates.
- A bench candidate may be linked to multiple critical roles.
- Readiness score is calculated from competency match, performance, potential, and tenure (exact formula TBD).
- High-risk critical roles are surfaced on dashboard and in reports.

---

## 5. Talent Insights Module

### 5.1 Filters

- Group BU: CRC, CPN, CG / CU
- Business Unit: All BUs, CDS, CRG, Robinson, etc.
- Function: All Functions, Merchandising, Operations, Finance, People, etc.
- Grade: All Grades, JG17+, Director+, VP+
- Risk: All Risk, High, Medium, Low
- Employee search: Name / Employee ID

### 5.2 KPI Cards

- Total Headcount
- Talent Group Breakdown (Top Talent, Talent, Pipeline, Watch List)
- High Risk of Losses
- Average Retention Factor

Note: Talent group terminology may differ for CPN/CG.

### 5.3 Employee Table

Columns:

- Name
- Current Role
- Risk
- Retention Factors (tags)
- Capability Match
- Action

Clicking a name or Open Profile opens the Individual Detail View.

---

## 6. Individual Detail View

### 6.1 Layout

Slide-over or full-page profile view with tabs.

### 6.2 Tabs

1. **Competencies**
   - Radar chart: actual vs required across six dimensions.
   - Required score source: current role, target role, or critical role profile (TBD).

2. **Competency Assessment**
   - Gap view: required vs actual per dimension.
   - CPN additional: compare against up to two target roles.

3. **Development Recommendations**
   - AI-generated recommendations.
   - Thai/English toggle.
   - Recommendation categories: stretch assignment, mentoring, learning, job rotation, etc.

4. **Work History**
   - Timeline of previous and current roles.
   - Source: parsed CV and/or HRIS work history.

5. **Career Visualizer**
   - Current role → target role → future moves.

6. **ICDP Report**
   - Placeholder for Phase 2 editable .pptx generation.
   - May show a preview or download button based on phase decision.

7. **Willingness to Learn**
   - CG requirement placeholder.

### 6.3 Manager Comment

- CPN additional requirement: Line Manager can add/edit rich-text comment.
- Mandatory for review finalization.
- Scope for CRC and CG TBD.

---

## 7. Upload / Update Profile Module

### 7.1 Access Control

Upload and process CV profiles restricted to HR only.

### 7.2 Upload Flow

1. User selects or drops file (PDF/DOC/DOCX, max 10MB).
2. File uploaded to cloud storage (employee-cvs bucket).
3. `parse-employee-profile` edge function extracts structured data using AI.
4. User reviews extracted fields in a pre-filled form.
5. On confirmation, `save-employee-profile` edge function upserts:
   - employee record
   - competencies
   - work history
6. Existing employees matched by `employee_id` are updated; new employees are created.
7. Users can view and download the uploaded document after upload.

### 7.3 Extracted Fields

- Employee ID
- Name
- Email
- Current Role
- Department
- Business Unit
- Function
- Job Level
- Talent Type
- Competencies
- Work History
- Education

### 7.4 Field Mapping

During OCR/parsing, the system must map document content to the fields above. Mapping rules are configurable and reviewable by HR.

### 7.5 Matching Logic

- Primary key: `employee_id`
- If `employee_id` exists: update existing record.
- If `employee_id` does not exist: create new record.
- Secondary match keys (email, citizen ID) may be considered if employee_id is missing.

---

## 8. Career Planning Module

### 8.1 Dashboard View

- Promotions YTD card
- Average Tenure card
- On Track count card
- Delayed / On Hold count card

### 8.2 Career Velocity Distribution Chart

- Type: area chart
- Categories: On Track, Delayed, On Hold
- Time granularity TBD (monthly/quarterly/yearly)

### 8.3 Career Velocity Rules

Illustrative logic to be confirmed with client:

| Status | Rule |
|---|---|
| On Track | Performance and potential meet thresholds and tenure is within expected range |
| Delayed | Performance or potential below threshold relative to tenure |
| On Hold | Significantly below threshold, or no clear target role, or intentionally parked |

Inputs:

- tenure_year
- performance_rating
- potential_rating

### 8.4 Velocity Table

Columns:

- Name
- Current Role
- Tenure
- Performance Rating
- Potential Rating
- Target Role
- Status

Filters: All, On Track, Delayed, On Hold.

### 8.5 Employee Drill-Down

Clicking a row opens a career detail panel showing:

- Current role and target role
- Career path visualization
- Velocity inputs
- Recommended action (example only, to be confirmed)

---

## 9. Internal Vacancies Module

### 9.1 Vacancy Scope

- Internal vacancies for JG17+ levels.
- Updated by HR or the Recruitment Platform.

### 9.2 Vacancy List

Columns:

- Job Title
- Department / BU
- Level
- Priority
- Status
- Internal Matches

### 9.3 Matching

- AI compares internal employees against job description.
- Match score based on competencies, experience, and role level.
- External candidates synced from Recruitment Platform for comparison.

### 9.4 Candidate Comparison

- Side-by-side comparison of internal and external candidates.
- Show competency match, experience relevance, and risk indicators.

---

## 10. Data Model Summary

### 10.1 Core Tables

| Table | Purpose |
|---|---|
| employees | Core employee record |
| employee_competencies | Six actual and six required competency scores |
| employee_work_history | Career timeline |
| critical_roles | Strategic positions |
| bench_candidates | Junction between critical roles and employees |
| kpi_data | Pre-calculated dashboard metrics |
| job_vacancies | Internal open roles |
| vacancy_matches | AI match results per vacancy |
| external_candidates | External candidates from Recruitment Platform |

### 10.2 employees Table (key fields)

| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| employee_id | TEXT | Business identifier |
| name | TEXT | Full name |
| role_title | TEXT | Current job title |
| department | TEXT | Department |
| business_unit | TEXT | Business unit |
| job_function | TEXT | Functional area |
| job_level | TEXT | Seniority |
| talent_type | TEXT | Talent classification |
| performance_rating | INTEGER | Performance score |
| potential_rating | TEXT | High/Medium/Low |
| retention_factor | INTEGER | 0-100 |
| flight_risk | TEXT | High/Medium/Low |
| tenure_year | INTEGER | Years at company |
| years_to_retirement | INTEGER | Estimated years to retirement |

CPN additional: `long_term_target_role` (TEXT, nullable).

### 10.3 employee_competencies Table

| Column | Type | Description |
|---|---|---|
| employee_id | UUID | FK to employees |
| leadership_actual | INTEGER | Actual score |
| leadership_required | INTEGER | Required score |
| management_actual | INTEGER | Actual score |
| management_required | INTEGER | Required score |
| functional_actual | INTEGER | Actual score |
| functional_required | INTEGER | Required score |
| future_skills_actual | INTEGER | Actual score |
| future_skills_required | INTEGER | Required score |
| digital_actual | INTEGER | Actual score |
| digital_required | INTEGER | Required score |
| culture_values_actual | INTEGER | Actual score |
| culture_values_required | INTEGER | Required score |

Dimension names are examples and subject to client confirmation.

---

## 11. Interfaces and Integrations

### 11.1 Inbound Integrations

| Source | Method | Data |
|---|---|---|
| Talent_DB | MWAA (Airflow) ETL | Employee master, performance, potential, tenure |
| Recruit_DB | MWAA (Airflow) ETL | Vacancies, external candidates |
| CV Upload | Direct upload + edge function | Resume/CV documents and parsed data |

### 11.2 Outbound Integrations

| Target | Data |
|---|---|
| Object storage | Uploaded CVs, ICDP reports |
| Recruitment Platform | Internal candidate shortlists (future) |
| Reporting/BI | Aggregated talent metrics (future) |

---

## 12. Error Handling and Edge Cases

| Scenario | Behavior |
|---|---|
| Employee ID not extracted | Flag for manual entry; do not save |
| Duplicate employee_id in upload | Show diff/merge options or overwrite based on rule |
| Unsupported file type | Reject before upload with clear message |
| File exceeds size limit | Reject with size guidance |
| AI parsing fails | Show error, allow retry, route to manual entry |
| Data source refresh fails | Show last successful refresh timestamp and stale data warning |
| Unauthorized access | Redirect to access-denied page |

---

## 13. Security and Compliance

- Upload restricted to HR role.
- Role-based data filtering by group BU, BU, and function.
- Uploaded CVs stored in a dedicated, access-controlled bucket.
- Audit logging for profile changes, uploads, and succession edits.
- PII handled in accordance with CRC Group data privacy policy.

---

## 14. Open Items

| # | Item | Module |
|---|---|---|
| 1 | Final competency dimensions and required-score source | Individual Detail View |
| 2 | Manager Comment scope across CRC/CPN/CG | Individual Detail View |
| 3 | Willingness to Learn inclusion and audience | Individual Detail View |
| 4 | ICDP report generation phase | Individual Detail View / Career Planning |
| 5 | Career velocity formula and thresholds | Career Planning |
| 6 | Career Planning Phase 1 scope | Career Planning |
| 7 | Line Manager access scope across entities | Foundation |
| 8 | Retention factor and flight risk data readiness | Talent Insights |
| 9 | Upload permission granularity | Upload / Update Profile |
| 10 | File virus scan requirement | Upload / Update Profile |
