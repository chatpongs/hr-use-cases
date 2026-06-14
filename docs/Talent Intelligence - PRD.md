# Talent Intelligence Platform — Product Requirements Document (PRD)

## 1. Document Purpose

This PRD defines the product requirements for the **Talent Intelligence Platform**, one of the two platforms under the CRC HR Platforms initiative. It consolidates business goals, user personas, core modules, functional scope, non-functional requirements, and phasing decisions derived from the vendor proposal, FSD, and workshop outputs.

This document is intended for product owners, business analysts, UX designers, architects, and engineering leads.

---

## 2. Product Vision

Build a single, data-driven talent command center that enables CRC Group (CRC, CPN, CG/CU) to:

- Identify and develop successors for critical roles.
- Surface, search, and compare internal talent with clear competency and risk signals.
- Match internal employees to open internal vacancies using AI.
- Ingest and maintain employee profiles from documents and integrated HR systems.
- Track career velocity and support Individual Career Development Plans (ICDP).

The platform is not a replacement for core HRIS, performance, or recruitment systems. It aggregates, enriches, and presents talent intelligence on top of those systems.

---

## 3. Business Objectives

| # | Objective | Success Measure |
|---|---|---|
| 1 | Reduce time to identify successors for critical roles | Critical roles with at least one ready successor within 3 months |
| 2 | Improve internal mobility | Internal vacancy fill rate from the platform |
| 3 | Reduce regrettable attrition | HR action taken on high-risk employees within 30 days of flag |
| 4 | Standardize talent visibility across CRC Group | Single source of truth for talent classification, competencies, and readiness |
| 5 | Accelerate development planning | ICDP generated and reviewed per talent cycle |

---

## 4. Target Users

### 4.1 Primary Users

| User | Primary Activities |
|---|---|
| Talent HR / Talent Team | Configure critical roles, review succession bench, manage employee profiles, generate ICDP |
| HRBP | Review talent population, filter by BU/function, support career planning, validate profiles |
| Line Manager (CPN requirement) | View direct-report profiles and ICDP, input Manager Comment |

### 4.2 Secondary Users

| User | Activities |
|---|---|
| Hiring Manager | View internal candidates for open vacancies |
| Recruitment Team | Sync external candidates, see internal matches |
| Employee | TBD; possible read-only profile / career view in later phases |
| Leadership / Executive Committee | Dashboard-level insights on talent risk and pipeline |

### 4.3 Audience Assumptions to Confirm

- Whether Line Managers get read access for CRC and CG, or only CPN.
- Whether employees access their own profile in Phase 1.
- Whether HRBP access is scoped to assigned BU/function.

---

## 5. Modules and Scope

### 5.1 Phase 1 Modules

| Module | In Scope |
|---|---|
| Foundation | Authentication, role-based access control, navigation, data integration framework |
| Succession Planning | Critical roles, bench candidates, readiness status, successor ranking, risk indicators |
| Talent Insights | Employee population table, filters, KPI cards, individual profile view |
| Individual Detail View | Competencies, assessment, recommendations, work history, career visualizer, ICDP placeholder, willingness to learn placeholder |
| Upload / Update Profile | HR-only resume/CV upload, AI parsing, extracted-field review, save/update by employee_id |
| Career Planning | Dashboard view, Promotions YTD, velocity chart/table, On Track/Delayed/On Hold status |
| Internal Vacancies | Vacancy list, employee-to-job matching, external candidate sync |

### 5.2 Phase 2 Modules

| Module | Rationale |
|---|---|
| ICDP Report Generation | Full editable .pptx generation; proposal places ICDP Generation in Phase 2 |
| Advanced matching & analytics | Deeper AI matching models, skill intelligence, scenario planning |
| Employee self-service | Employee-facing profile and career view |

### 5.3 Cross-Platform Integration

- **Recruitment Platform**: Internal vacancies are populated by the Recruitment Platform for JG17+ levels. External candidates are synced from the Recruitment Platform.
- **HRIS / Talent_DB**: Employee master data, tenure, performance, and potential come from Talent_DB.
- **Performance Management System**: Performance rating and potential rating feed career velocity and talent classification.

---

## 6. Functional Requirements

### 6.1 Foundation

| ID | Requirement | Priority |
|---|---|---|
| F-001 | Role-based access control with at least four role classes: Talent HR, HRBP, Line Manager, Read-Only/Executive | Must |
| F-002 | Support CRC, CPN, and CG/CU tenants or permission scopes with group-BU filters | Must |
| F-003 | Audit log for profile changes, uploads, and succession decisions | Should |
| F-004 | SSO integration (method TBD with client IT) | Must |

### 6.2 Succession Planning

| ID | Requirement | Priority |
|---|---|---|
| SP-001 | HR can define critical roles with incumbent, target readiness date, and risk level | Must |
| SP-002 | System displays bench candidates per critical role with readiness status | Must |
| SP-003 | Successors ranked by readiness score, risk, and competency match | Must |
| SP-004 | Support multiple candidates per critical role and multiple target roles per employee | Should |
| SP-005 | Visualize bench strength and risk heatmap | Should |

### 6.3 Talent Insights

| ID | Requirement | Priority |
|---|---|---|
| TI-001 | Searchable, filterable employee table by group BU, BU, function, grade, risk, talent type | Must |
| TI-002 | KPI cards for headcount, talent group breakdown, high-risk count, average retention factor | Must |
| TI-003 | Individual profile view with tabs: Competencies, Assessment, Recommendations, Work History, Career Visualizer, ICDP Report, Willingness to Learn | Must |
| TI-004 | AI-generated development recommendations in English and Thai | Should |
| TI-005 | Manager Comment for CPN; scope for CRC/CG TBD | Should |

### 6.4 Individual Detail View

| ID | Requirement | Priority |
|---|---|---|
| ID-001 | Competency radar: actual vs required across six dimensions (TBD with client) | Must |
| ID-002 | Competency gap view with required/actual comparison | Must |
| ID-003 | Support comparison against up to two target roles for CPN | Should |
| ID-004 | Work history timeline | Must |
| ID-005 | Career visualizer: current role → target role → future moves | Should |
| ID-006 | ICDP report placeholder / download in Phase 2 | Phase 2 |
| ID-007 | Willingness to Learn placeholder for CG | TBD |

### 6.5 Upload / Update Profile

| ID | Requirement | Priority |
|---|---|---|
| UP-001 | HR-only upload of PDF/DOC/DOCX resumes, max 10MB | Must |
| UP-002 | AI/OCR extraction of employee fields, competencies, and work history | Must |
| UP-003 | Reviewer can edit extracted fields before save | Must |
| UP-004 | Match existing employee by employee_id; create new if not found | Must |
| UP-005 | View and download uploaded document after upload | Should |
| UP-006 | Confidence score per extracted field | Should |
| UP-007 | Low-confidence field flagging | Should |

### 6.6 Career Planning

| ID | Requirement | Priority |
|---|---|---|
| CP-001 | Dashboard with Promotions YTD, average tenure, On Track/Delayed/On Hold counts | Must |
| CP-002 | Area chart showing velocity distribution over time | Should |
| CP-003 | Velocity table with status filter | Must |
| CP-004 | Career velocity calculated from tenure, performance rating, potential rating | Should |
| CP-005 | Employee drill-down from velocity table to profile/career detail | Should |
| CP-006 | HR action workflow for delayed/on-hold employees | TBD |

### 6.7 Internal Vacancies

| ID | Requirement | Priority |
|---|---|---|
| IV-001 | List internal vacancies for JG17+ updated by HR or Recruitment Platform | Must |
| IV-002 | AI match internal employees against job description | Must |
| IV-003 | Sync external candidates from Recruitment Platform | Should |
| IV-004 | Compare internal vs external candidates per vacancy | Should |

---

## 7. Data Requirements

### 7.1 Core Employee Data

- employee_id (business key)
- name, age, avatar_url
- role_title, department, business_unit, job_function, job_level
- talent_type, performance_rating, potential_rating
- retention_factor, flight_risk
- tenure_year, years_to_retirement

### 7.2 Competency Data

- Six dimensions with actual and required scores
- Example dimensions: Leadership, Management, Functional, Future Skills, Digital, Culture & Values
- CPN requirement: required scores may map to success profiles and support two target roles

### 7.3 Work History

- Role title, company, department, BU, start date, end date
- Current role flagged

### 7.4 Critical Role / Bench Data

- critical_role_id, title, department, BU, incumbent_id
- bench_candidate employee_id, readiness_status, readiness_score

### 7.5 Data Integration

- AWS MWAA (Airflow) for ETL from Talent_DB and Recruit_DB
- n8n for third-party integrations
- Batch refresh cadence to be confirmed (daily / weekly / near-real-time)

---

## 8. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NF-001 | Responsive web app; primary use on desktop/tablet |
| NF-002 | Thai and English UI support |
| NF-003 | File upload limit 10MB with type validation |
| NF-004 | Page load target < 2s for dashboard and table |
| NF-005 | Role-based data isolation: users see only permitted employees |
| NF-006 | Audit trail retained for at least 12 months |
| NF-007 | ICDP export as editable .pptx |
| NF-008 | Accessible to WCAG 2.1 AA over time |

---

## 9. Key Decisions / Open Questions

| # | Decision | Status | Owner |
|---|---|---|---|
| 1 | Manager Comment scope (CPN only vs all entities) | Pending | Talent lead |
| 2 | Willingness to Learn inclusion and audience | Pending | CG/CRC |
| 3 | ICDP report generation phase | Pending | Talent lead |
| 4 | Career Planning Phase 1 scope | Pending | Client sponsor |
| 5 | Competency dimension names and required-score source | Pending | HR/talent team |
| 6 | Flight risk / retention factor calculation and data readiness | Pending | Data/AI team |
| 7 | Upload permission role granularity | Pending | HR/talent team |
| 8 | Line Manager access scope across CRC/CPN/CG | Pending | Client sponsor |

---

## 10. Phasing

### Phase 1: Foundation + Core Talent Intelligence

- Succession Planning
- Talent Insights + Individual Detail View
- Upload / Update Profile
- Career Planning (dashboard-level)
- Internal Vacancies

### Phase 2: Intelligence & Reporting

- ICDP Report Generation
- Advanced AI matching
- Skill intelligence
- Employee self-service
- Scenario planning

---

## 11. Glossary

| Term | Definition |
|---|---|
| ICDP | Individual Career Development Plan — editable PowerPoint report |
| Bench Candidate | Internal employee identified as a potential successor for a critical role |
| Readiness Status | Assessment of how prepared a candidate is to assume a critical role |
| Flight Risk | Likelihood that an employee will leave the organization |
| Retention Factor | Composite score indicating likelihood to stay |
| Career Velocity | Rate of career progression classified as On Track, Delayed, or On Hold |
| 9-Box | Talent classification grid based on performance and potential |
| MWAA | Managed Workflows for Apache Airflow (AWS) |
