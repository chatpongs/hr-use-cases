import type { Route } from "./+types/home";
import { Link } from "react-router";
import { MODULE_LABELS } from "../data/roles";
import { useRole } from "../context/role-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Workflows — Talent Intelligence Demo" },
    { name: "description", content: "Phase 1 workflow walkthrough" },
  ];
}

const WORKFLOWS = [
  {
    id: "talent-insights",
    title: "Talent Population Discovery",
    module: "talent-insights" as const,
    description:
      "Browse and filter the employee population. View KPI cards, apply filters, and open individual profiles. Shows role-based data scoping.",
    steps: ["KPI cards", "Filters", "Employee table", "Open profile"],
    priority: true,
  },
  {
    id: "profile",
    title: "Individual Talent Profile Review",
    module: "profile" as const,
    description:
      "Deep-dive into an employee profile. Competencies radar, gap view, development recommendations, work history, and career visualizer.",
    steps: ["Competencies", "Gap view", "Recommendations", "Work history", "Career visualizer"],
    priority: true,
  },
];

export default function Home() {
  const { role } = useRole();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-base-content">Phase 1 Workflows</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Select a workflow to walk through. Use the role switcher in the
          sidebar to compare what different roles see.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {WORKFLOWS.map((wf) => {
          const available = role.modules.includes(wf.module);
          return (
            <div
              key={wf.id}
              className={`card bg-base-100 shadow-sm ${available ? "border border-base-200" : "border border-dashed border-base-300 opacity-60"}`}
            >
              <div className="card-body gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-base-content">
                    {wf.title}
                  </h3>
                  {wf.priority && (
                    <span className="badge badge-primary badge-sm">
                      Start here
                    </span>
                  )}
                </div>
                <p className="text-sm text-base-content/70">{wf.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {wf.steps.map((s) => (
                    <span key={s} className="badge badge-ghost badge-sm">
                      {s}
                    </span>
                  ))}
                </div>
                {available ? (
                  <Link
                    to={MODULE_LABELS[wf.module].path}
                    className="btn btn-primary btn-sm w-fit"
                  >
                    Start Workflow
                  </Link>
                ) : (
                  <p className="text-sm text-base-content/40">
                    Not available for {role.label}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <h3 className="text-sm font-semibold text-base-content">
            Role Permission Matrix
          </h3>
          <p className="mb-3 text-xs text-base-content/50">
            Quick reference for what each role can access in this demo.
          </p>
          <PermissionMatrix />
        </div>
      </div>
    </div>
  );
}

function PermissionMatrix() {
  const modules: { key: string; label: string }[] = [
    { key: "talent-insights", label: "Talent Insights" },
    { key: "profile", label: "Individual Profile" },
    { key: "succession", label: "Succession Planning" },
    { key: "career-planning", label: "Career Planning" },
    { key: "upload", label: "Upload Profile" },
    { key: "vacancies", label: "Internal Vacancies" },
  ];
  const roles = [
    { key: "talent-hr", label: "Talent HR" },
    { key: "hrbp", label: "HRBP" },
    { key: "line-manager", label: "Line Manager" },
    { key: "read-only", label: "Read-Only" },
    { key: "employee", label: "Employee" },
  ];

  const access: Record<string, Record<string, boolean>> = {
    "talent-hr": { "talent-insights": true, profile: true, succession: true, "career-planning": true, upload: true, vacancies: true },
    hrbp: { "talent-insights": true, profile: true, succession: true, "career-planning": true, upload: false, vacancies: true },
    "line-manager": { "talent-insights": true, profile: true, succession: false, "career-planning": true, upload: false, vacancies: false },
    "read-only": { "talent-insights": true, profile: false, succession: true, "career-planning": true, upload: false, vacancies: false },
    employee: { "talent-insights": false, profile: true, succession: false, "career-planning": false, upload: false, vacancies: false },
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-base-content/50">
              Module
            </th>
            {roles.map((r) => (
              <th
                key={r.key}
                className="text-center text-xs font-semibold text-base-content/50"
              >
                {r.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map((m) => (
            <tr key={m.key}>
              <td className="text-sm text-base-content">{m.label}</td>
              {roles.map((r) => (
                <td key={r.key} className="text-center">
                  {access[r.key]?.[m.key] ? (
                    <span className="text-success">&#x2713;</span>
                  ) : (
                    <span className="text-base-content/20">&times;</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
