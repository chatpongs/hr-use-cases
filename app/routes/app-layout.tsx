import { NavLink, Outlet, useLocation } from "react-router";
import type { Route } from "./+types/app-layout";
import { RoleSwitcher } from "../components/role-switcher";
import { PresenterNotes } from "../components/presenter-notes";
import { useRole } from "../context/role-context";
import { MODULE_LABELS } from "../data/roles";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Talent Intelligence — Phase 1 Demo" }];
}

export default function AppLayout() {
  const { role, demoUserId, setDemoUserId } = useRole();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const roleNotes = getRoleNotes(role.label);

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

function getRoleNotes(roleLabel: string): string[] {
  const map: Record<string, string[]> = {
    "Talent HR": [
      "You are viewing as Talent HR with full access across all Group BUs.",
      "Point out that HR can see all employees, KPIs, and drill into any profile.",
      "KPIs and tables reflect the full population in scope.",
    ],
    HRBP: [
      "You are viewing as HRBP scoped to CRC only (CDS + Robinson Retail BUs).",
      "Highlight how the employee list and KPIs are smaller — scoped by BU.",
      "Upload module is hidden from the nav for HRBP.",
    ],
    "Line Manager": [
      "You are viewing as a Line Manager — direct reports only.",
      "Use the demo user selector in the top bar to switch managers.",
      "Point out that only direct reports appear in the table.",
      "Manager Comment editing is available on direct-report profiles.",
    ],
    "Read-Only / Executive": [
      "You are viewing as Read-Only / Executive.",
      "KPIs and dashboards are visible but individual profile drill-down is disabled.",
      "Succession and Career Planning dashboards are available.",
    ],
    "Employee / Talent": [
      "You are viewing as an Employee — self-service, own profile only.",
      "Use the demo user selector to view different employees' self-service experience.",
      "Only the Individual Profile module is available.",
    ],
  };
  return map[roleLabel] ?? ["Switch roles using the sidebar to compare views."];
}
