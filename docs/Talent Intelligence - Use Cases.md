# Talent Intelligence Platform — Roles and Use Cases

This document maps the major user roles in the CRC Talent Intelligence Platform to their use cases. It is intended as a quick reference for workshops, UX planning, and permission design.

Source material:

- `ICS-Hexa_Talent Intelligence_FSD_HighLevel for CRC Final 050526.pdf` v1.9
- `talent-phase-1-interactive-walkthrough-plan.md`
- Prototype packages under `docs/talent-phase-1-storyline-*`

Scope note: this document focuses on the **Talent Platform** first, as requested. Recruitment platform roles and use cases are referenced only where they intersect with Talent Intelligence.

---

## 1. Role summary

| Role | Primary purpose | Typical system access |
|---|---|---|
| **Talent HR / HR Administrator** | Own and maintain talent data, run succession and career reviews | Full talent module access within their Group BU/BU scope; upload/update employee profiles |
| **HRBP** | Support business units with talent insights and actions | Similar to Talent HR, often scoped to assigned BUs |
| **Line Manager** | Review direct reports, add development comments, support talent decisions | Read-only direct-report profiles + Manager Comment (CPN requirement) |
| **Employee / Talent** | View own profile, career visualizer, ICDP | Self-service read-only access to own talent data |
| **Hiring Manager / Recruiter** | Manage internal vacancies and evaluate external candidates | Internal Vacancies and External Candidates modules |
| **System / AI service** | Parse CVs, calculate risk, match candidates, generate recommendations | Background edge functions and ML services |

---

## 2. Permission model (Role Types A–F)

The FSD defines six role types that control data visibility across Group BU, BU, Function, and Grade.

| Type | Scope | Typical mapping |
|---|---|---|
| **A** | All Group BUs and everything underneath | Central / group-level Talent HR |
| **B** | One Group BU, all BUs, Functions, Grades under it | Group BU Talent HR |
| **C** | One Group BU, selected BUs, all Functions/Grades under selected BUs | Regional / cluster HR |
| **D** | One Group BU, one BU, selected Functions, all Grades under those Functions | HRBP / function HR |
| **E** | One Group BU, BU, Functions, only selected Grades | Specialist HR |
| **F** | One Group BU, BU, selected Functions and selected Grades | Limited HR / project roles |

Key assumptions:

- Each employee belongs to **one** Group BU, one BU, one Function, and one Grade at a time.
- Filters, KPI cards, and tables must respect the active user's role type.
- Sensitive data such as compensation or percentile-in-range must be hidden unless the user has explicit Compensation clearance.

---

## 3. Use cases by role

### 3.1 Talent HR / HR Administrator

This is the power user of the Talent Platform. They are responsible for maintaining the talent population, identifying successors, and preparing talent reviews.

| # | Use case | Description | Related module / FSD section |
|---|---|---|---|
| 1.1 | Review succession risk | View critical/key positions, bench strength, readiness, and risk signals to identify gaps. | Succession Planning |
| 1.2 | Filter talent population | Apply Group BU, BU, Function, Grade, and position filters to narrow views. | Shared filters |
| 1.3 | Review successor bench | Expand a critical role to see ranked successors, match scores, and readiness. | Succession Planning |
| 1.4 | Browse employee talent list | View all employees in scope with risk, retention factors, and capability match. | Talent Insights |
| 1.5 | Open employee profile | Open the Individual Detail View to review competencies, gaps, history, and career path. | Talent Insights |
| 1.6 | Review AI development recommendations | See AI-generated development suggestions based on competency gaps. | Talent Insights → Development Recommendations |
| 1.7 | Upload or update employee profile | Upload a resume/CV, review AI-extracted fields, and create or update an employee by employee ID. | Upload Employee Profile |
| 1.8 | Download ICDP report | Generate a native .pptx Individual Career Development Plan for an employee. | Talent Insights → ICDP Report |
| 1.9 | Review career planning status | View Promotions YTD, career tracking chart, and employee velocity table. | Career Planning |
| 1.10 | Configure custom views | Add/remove columns in talent and succession tables. | Shared table customization |

---

### 3.2 HRBP

HRBPs use the platform to advise business units. Their access is usually scoped to the BUs or Functions they support.

| # | Use case | Description | Related module |
|---|---|---|---|
| 2.1 | Review BU-level talent health | Use KPI cards and filters scoped to assigned BUs. | Talent Insights |
| 2.2 | Identify high-risk employees | Filter by Risk of Loss and review retention factors. | Talent Insights |
| 2.3 | Prepare talent conversations | Open employee profiles and review competency gaps before calibration. | Talent Insights |
| 2.4 | Review succession coverage | Check critical roles and bench strength within their BU scope. | Succession Planning |
| 2.5 | Support profile updates | Upload or update employee profiles when needed (if granted HR permission). | Upload Employee Profile |

---

### 3.3 Line Manager

The FSD adds a CPN-specific requirement that Line Managers should have read-only access to their direct reports and the ability to add/edit a Manager's Comment.

| # | Use case | Description | Related module |
|---|---|---|---|
| 3.1 | View direct-report profiles | Read-only access to profile data for their direct reports. | Talent Insights |
| 3.2 | Review direct-report competencies | See radar chart and competency gap for team members. | Talent Insights → Competencies |
| 3.3 | Review development recommendations | Read AI-generated recommendations for direct reports. | Talent Insights → Development Recommendations |
| 3.4 | Add/edit Manager's Comment | Provide qualitative feedback in rich text; mandatory for review finalization (CPN). | Talent Insights → Development Recommendations |
| 3.5 | View direct-report ICDP | Download or view the Individual Career Development Plan. | Talent Insights → ICDP Report |

---

### 3.4 Employee / Talent

Self-service access is expected to be read-only and limited to the employee's own data.

| # | Use case | Description | Related module |
|---|---|---|---|
| 4.1 | View own talent profile | See competencies, work history, career visualizer, and talent type. | Talent Insights |
| 4.2 | View development recommendations | Read AI-generated recommendations. | Talent Insights → Development Recommendations |
| 4.3 | View career visualizer | See current role, target role, and possible next moves. | Talent Insights → Career Visualizer |
| 4.4 | Download own ICDP | Generate and download the Individual Career Development Plan. | Talent Insights → ICDP Report |
| 4.5 | View willingness to learn | See qualitative willingness-to-learn notes (CG additional requirement). | Talent Insights |

---

### 3.5 Hiring Manager / Recruiter

These users intersect with the Recruitment Platform. Their primary focus is filling vacancies using internal and external candidates.

| # | Use case | Description | Related module |
|---|---|---|---|
| 5.1 | View internal vacancies | See open JG17+ vacancies updated by HR or Recruitment. | Internal Vacancies |
| 5.2 | Generate AI matches | Trigger the matching algorithm to find top internal candidates for a vacancy. | Internal Vacancies |
| 5.3 | Review top internal matches | View top 5+ internal matches with scores and reasoning. | Internal Vacancies |
| 5.4 | Decide internal vs external hiring | Review AI hiring rationale and external-hiring recommendation. | Internal Vacancies |
| 5.5 | Upload external candidates | Upload a CV to evaluate an external candidate against a vacancy. | External Candidates |
| 5.6 | Review external candidate details | View parsed work experience, achievements, education, and competencies. | External Candidates |
| 5.7 | Edit external candidate data | Manually adjust extracted candidate fields. | External Candidates |

---

### 3.6 System / AI service

These are non-human actors that run in the background. They are listed here because they shape what the human roles can see and do.

| # | Use case | Description | Related module |
|---|---|---|---|
| 6.1 | Parse employee CV | Extract structured profile data from PDF/DOC resumes. | Upload Employee Profile |
| 6.2 | Calculate flight risk | Use ML to predict Risk of Loss and retention factors. | Talent Insights |
| 6.3 | Match candidates to vacancies | Compare internal employees or external candidates against job descriptions. | Internal Vacancies / External Candidates |
| 6.4 | Generate development recommendations | Produce AI suggestions based on competency gaps. | Talent Insights |
| 6.5 | Generate ICDP PowerPoint | Build a native .pptx report from employee data. | Talent Insights → ICDP Report |
| 6.6 | Calculate career velocity | Apply FSD rules to classify employees as On Track, Delayed, or On Hold. | Career Planning |

---

## 4. Cross-role permission decisions still open

The following decisions are not fully resolved in the FSD and should be confirmed with the client:

| Topic | Open question | Affected roles |
|---|---|---|
| Employee self-service | Should employees access their own profile view in Phase 1? | Employee / Talent |
| Line Manager scope | Is Manager Comment CPN-only or required for CRC/CG too? | Line Manager |
| Thai-language output | Should AI recommendations and hiring rationale support Thai? | All viewers of AI content |
| ICDP Phase boundary | Is ICDP export in Phase 1 profile view or Phase 2 deliverable? | Talent HR, Line Manager, Employee |
| Willingness to Learn | Is this CG-only and Phase 1 or later? | Talent HR, Line Manager, Employee |
| Upload permission | Is profile upload restricted to Talent HR, or can HRBPs also upload? | Talent HR, HRBP |
| Career Planning inclusion | Is Career Planning in Phase 1, reduced, or later? | Talent HR, HRBP |
| Compensation data | Who gets explicit Compensation clearance for PIR/salary data? | Talent HR, HRBP, Line Manager |

---

## 5. How this maps to the interactive walkthrough

The four storyline prototypes in `docs/talent-phase-1-storyline-*` are designed to confirm the most important role/use-case combinations for Phase 1.

| Storyline | Primary role | Use cases confirmed |
|---|---|---|
| Storyline 1: Succession Risk | Talent HR | 1.1, 1.2, 1.3, 1.4, 2.4 |
| Storyline 2: Talent Profile | Talent HR, Line Manager | 1.4, 1.5, 1.6, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1–4.5 |
| Storyline 3: Upload/Update Profile | Talent HR / HRBP | 1.7, 2.5 |
| Storyline 4: Career Planning | Talent HR / HRBP | 1.9 |

---

## 6. Glossary

| Term | Meaning |
|---|---|
| **ICDP** | Individual Career Development Plan — exported as editable PowerPoint |
| **PIR** | Percentile in Range — compensation-sensitive data |
| **Risk of Loss** | ML-predicted likelihood that an employee will leave |
| **Retention Factor** | ML-derived reason or theme behind attrition risk |
| **Capability Match** | Average ratio of actual vs required competencies |
| **Velocity** | Career progression pace classified as On Track, Delayed, or On Hold |
| **Group BU** | Top-level business group (CRC, CPN, CG/CU, etc.) |
| **BU** | Business Unit under a Group BU |
| **Function** | Department or functional area |
| **Grade / JG** | Job grade level |
