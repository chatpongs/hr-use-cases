import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/app-layout";
import { RoleSwitcher } from "../components/role-switcher";
import { PresenterNotes } from "../components/presenter-notes";
import { useRole } from "../context/role-context";
import { MODULE_LABELS, getModuleFromPath } from "../data/roles";
import { getEmployeeById } from "../data/employees";
import { isEmployeeAccessible } from "../data/helpers";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Talent Intelligence — Phase 1 Demo" }];
}

export default function AppLayout() {
  const { role, demoUserId, setDemoUserId } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const roleNotes = getPresenterNotes(
    location.pathname,
    role.label,
    role,
    demoUserId,
  );

  useEffect(() => {
    const moduleId = getModuleFromPath(location.pathname);
    if (moduleId && !role.modules.includes(moduleId)) {
      navigate("/", { replace: true });
    }
  }, [role, location.pathname, navigate]);

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-base-300 bg-base-100">
        <div className="border-b border-base-300 px-4 py-4">
          <NavLink to="/" className="block">
            <h1 className="text-base font-bold text-base-content">
              Talent Intelligence
            </h1>
            <p className="text-xs text-base-content/50">Phase 1 Demo</p>
          </NavLink>
        </div>

        <div className="border-b border-base-300 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/40">
            Active Role
          </p>
          <RoleSwitcher />
        </div>

        {(role.scope.directReportsOnly || role.scope.selfOnly) && (
          <div className="border-b border-base-300 px-4 py-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-base-content/40">
              Demo User
            </p>
            <p className="text-xs text-base-content/60">
              {role.scope.directReportsOnly
                ? "Manager: showing direct reports"
                : "Employee: showing own profile"}
            </p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="menu menu-sm w-full gap-0.5">
            <li>
              <NavLink to="/" end>
                Workflows
              </NavLink>
            </li>
            {role.modules.map((moduleId) => {
              const mod = MODULE_LABELS[moduleId];
              return (
                <li key={moduleId}>
                  <NavLink to={mod.path}>{mod.label}</NavLink>
                </li>
              );
            })}
          </ul>
          {!role.modules.includes("upload") && (
            <p className="mt-2 px-3 text-xs text-base-content/40">
              Upload Profile is not available for this role.
            </p>
          )}
        </nav>

        <div className="border-t border-base-300 px-4 py-3">
          <p className="text-xs text-base-content/40">
            Companion demo app — data is mock/sample.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: role.accentColor }}
              />
              <span className="text-sm font-semibold text-base-content">
                {role.label}
              </span>
              {(role.scope.directReportsOnly || role.scope.selfOnly) && (
                <span className="text-xs text-base-content/50">
                  {role.scope.directReportsOnly
                    ? "(direct reports only)"
                    : "(own profile only)"}
                </span>
              )}
            </div>
            <DemoUserSelector
              demoUserId={demoUserId}
              setDemoUserId={setDemoUserId}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {!isHome && (
            <div className="mb-4">
              <PresenterNotes notes={roleNotes} />
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DemoUserSelector({
  demoUserId,
  setDemoUserId,
}: {
  demoUserId: string;
  setDemoUserId: (id: string) => void;
}) {
  const { role } = useRole();

  if (!role.scope.directReportsOnly && !role.scope.selfOnly) {
    return null;
  }

  return (
    <label className="flex items-center gap-2 text-xs text-base-content/60">
      Demo user:
      <select
        value={demoUserId}
        onChange={(e) => setDemoUserId(e.target.value)}
        className="select select-bordered select-xs"
      >
        {DEMO_USER_OPTIONS[role.id]?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const DEMO_USER_OPTIONS: Record<string, { value: string; label: string }[]> = {
  "line-manager": [
    { value: "e001", label: "Somchai J. (VP Merchandising)" },
    { value: "e002", label: "Naree S. (Dir. Operations)" },
    { value: "e006", label: "Wipada P. (Dir. Leasing)" },
    { value: "e009", label: "Tanawat P. (VP Engineering)" },
    { value: "e010", label: "Pim C. (Plant Manager)" },
    { value: "e004", label: "Anong R. (Head People Analytics)" },
  ],
  employee: [
    { value: "e001", label: "Somchai J." },
    { value: "e002", label: "Naree S." },
    { value: "e003", label: "Prasert W." },
    { value: "e004", label: "Anong R." },
    { value: "e005", label: "Krit S." },
    { value: "e006", label: "Wipada P." },
    { value: "e007", label: "Chai C." },
    { value: "e008", label: "Malee T." },
    { value: "e009", label: "Tanawat P." },
    { value: "e010", label: "Pim C." },
    { value: "e012", label: "Jiraporn S." },
    { value: "e015", label: "Apinya K." },
  ],
};

function getPresenterNotes(
  pathname: string,
  roleLabel: string,
  role: ReturnType<typeof useRole>["role"],
  demoUserId: string,
): string[] {
  const moduleNotes: Record<string, string[]> = {
    "talent-insights": [
      "Highlight the KPI cards — headcount, high-risk, retention, talent breakdown.",
      "Apply a filter (e.g. Group BU or Risk) to show how the table narrows.",
      "Click 'Open Profile' to drill into an employee's individual detail view.",
      "Switch roles to show how the population scope changes per role.",
    ],
    succession: [
      "Walk through the KPI cards — total critical roles, ready-now coverage.",
      "Show the risk distribution heatmap by BU.",
      "Expand a critical role row to reveal the bench candidates ranked by readiness.",
      "For Talent HR: point out the Add/Remove bench candidate buttons.",
    ],
    "career-planning": [
      "Highlight Promotions YTD and the On Track vs Delayed breakdown.",
      "Explain the velocity distribution chart — green/yellow/red by Group BU.",
      "Use the status filter buttons to isolate Delayed or On Hold employees.",
      "Click 'View Career' to drill into a specific employee's career path.",
    ],
    upload: [
      "This module is HR-only — other roles see Access Denied.",
      "Click the dropzone and select any file to simulate a CV upload.",
      "After 'parsing', review the extracted fields with confidence scores.",
      "Point out low-confidence fields flagged in amber/red for manual review.",
      "Show the create-vs-update detection based on Employee ID.",
    ],
    vacancies: [
      "Show the JG17+ vacancy list with priority and match counts.",
      "Click 'View Matches' to see internal candidates with AI match scores.",
      "Scroll to compare internal vs external candidates side by side.",
      "Highlight the AI hiring rationale at the bottom (mock).",
    ],
    profile: [
      "Walk through the tabs: Competencies, Assessment, Recommendations, History, Career.",
      "On Competencies: show the radar chart (actual vs required).",
      "Switch to Line Manager role to demo the editable Manager Comment.",
      "Switch to Employee role to show the self-service read-only view.",
    ],
  };

  const roleNotes: Record<string, string[]> = {
    "Talent HR": [
      "Role: Talent HR — full access across all Group BUs.",
    ],
    HRBP: [
      "Role: HRBP — scoped to CRC (CDS + Robinson Retail). Data is filtered.",
    ],
    "Line Manager": [
      "Role: Line Manager — direct reports only. Use the demo user selector.",
    ],
    "Read-Only / Executive": [
      "Role: Read-Only — dashboards visible, profile drill-down disabled.",
    ],
    "Employee / Talent": [
      "Role: Employee — self-service, own profile only.",
    ],
  };

  const moduleKey = pathname.startsWith("/profile")
    ? "profile"
    : pathname.startsWith("/talent-insights")
      ? "talent-insights"
      : pathname.startsWith("/succession")
        ? "succession"
        : pathname.startsWith("/career-planning")
          ? "career-planning"
          : pathname.startsWith("/upload")
            ? "upload"
            : pathname.startsWith("/vacancies")
              ? "vacancies"
              : null;

  if (!moduleKey) {
    return roleNotes[roleLabel] ?? [];
  }

  // Check if the profile being viewed is out of scope for this role
  if (moduleKey === "profile") {
    const match = pathname.match(/^\/profile\/(.+)$/);
    const empId = match?.[1];
    if (empId) {
      const employee = getEmployeeById(empId);
      if (employee && !isEmployeeAccessible(employee, role, demoUserId)) {
        return [
          `This employee (${employee.name}) is OUT OF SCOPE for the ${roleLabel} role.`,
          role.scope.directReportsOnly
            ? "Line Managers can only view their direct reports."
            : role.scope.selfOnly
              ? "Employees can only view their own profile."
              : "This employee falls outside the role's BU/function scope.",
          "This demonstrates the role-based data isolation requirement.",
        ];
      }
    }
  }

  return [...(moduleNotes[moduleKey] ?? []), ...(roleNotes[roleLabel] ?? [])];
}
