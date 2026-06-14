import { useState, useMemo } from "react";
import type { Route } from "./+types/succession";
import { Link } from "react-router";
import { useRole } from "../context/role-context";
import {
  getScopedCriticalRoles,
  getBenchCandidatesForRole,
  getSuccessionKpiData,
  getRiskHeatmapData,
  capabilityMatchScore,
} from "../data/helpers";
import { getEmployeeById } from "../data/employees";
import type { CriticalRole } from "../data/types";
import { KpiCard } from "../components/kpi-card";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Succession Planning — Demo" }];
}

export default function Succession() {
  const { role } = useRole();
  const scopedRoles = useMemo(
    () => getScopedCriticalRoles(role),
    [role],
  );

  const [filters, setFilters] = useState({
    groupBu: "all",
    riskLevel: "all",
  });
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return scopedRoles.filter((cr) => {
      if (filters.groupBu !== "all" && cr.groupBu !== filters.groupBu)
        return false;
      if (filters.riskLevel !== "all" && cr.riskLevel !== filters.riskLevel)
        return false;
      return true;
    });
  }, [scopedRoles, filters]);

  const kpiData = getSuccessionKpiData(filtered);
  const heatmapData = getRiskHeatmapData(filtered);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-base-content">
          Succession Planning
        </h2>
        <p className="text-sm text-base-content/60">
          Critical roles and successor benches scoped for{" "}
          <span style={{ color: role.accentColor }} className="font-medium">
            {role.label}
          </span>{" "}
          — {filtered.length} critical roles
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Critical Roles"
          value={kpiData.totalCriticalRoles}
          accent="#2563eb"
        />
        <KpiCard
          label="Ready Now Successor"
          value={kpiData.readyNowCount}
          accent="#16a34a"
          sublabel={
            <span>
              {kpiData.totalCriticalRoles > 0
                ? Math.round(
                    (kpiData.readyNowCount / kpiData.totalCriticalRoles) * 100,
                  )
                : 0}
              % coverage
            </span>
          }
        />
        <KpiCard
          label="Avg Bench Strength"
          value={kpiData.averageBenchStrength}
          accent="#7c3aed"
          sublabel="candidates per role"
        />
        <KpiCard
          label="High-Risk Roles"
          value={kpiData.highRiskCount}
          accent="#dc2626"
        />
      </div>

      {/* Risk Heatmap */}
      {heatmapData.length > 0 && (
        <div className="mb-6 card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-4">
            <h3 className="mb-3 text-sm font-semibold text-base-content">
              Risk Distribution by BU
            </h3>
            <div className="space-y-2">
              {heatmapData.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-xs text-base-content/70">
                    {row.label}
                  </span>
                  <div className="flex flex-1 gap-1">
                    {row.high > 0 && (
                      <div
                        className="flex items-center justify-center rounded bg-error/80 px-2 py-1 text-xs font-medium text-error-content"
                        title={`${row.high} high-risk`}
                      >
                        {row.high} High
                      </div>
                    )}
                    {row.medium > 0 && (
                      <div
                        className="flex items-center justify-center rounded bg-warning/80 px-2 py-1 text-xs font-medium text-warning-content"
                        title={`${row.medium} medium-risk`}
                      >
                        {row.medium} Med
                      </div>
                    )}
                    {row.low > 0 && (
                      <div
                        className="flex items-center justify-center rounded bg-success/80 px-2 py-1 text-xs font-medium text-success-content"
                        title={`${row.low} low-risk`}
                      >
                        {row.low} Low
                      </div>
                    )}
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs text-base-content/50">
                    {row.total} total
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-base-content/50">
                Group BU
              </label>
              <select
                value={filters.groupBu}
                onChange={(e) =>
                  setFilters({ ...filters, groupBu: e.target.value })
                }
                className="select select-bordered select-sm w-full"
              >
                <option value="all">All</option>
                <option value="CRC">CRC</option>
                <option value="CPN">CPN</option>
                <option value="CG/CU">CG/CU</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-base-content/50">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) =>
                  setFilters({ ...filters, riskLevel: e.target.value })
                }
                className="select select-bordered select-sm w-full"
              >
                <option value="all">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Roles Table */}
      <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow-sm">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Role Title</th>
              <th>Department / BU</th>
              <th>Incumbent</th>
              <th>Risk</th>
              <th>Bench</th>
              <th>Readiest Successor</th>
              <th>Target Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cr) => {
              const incumbent = getEmployeeById(cr.incumbentId);
              const candidates = getBenchCandidatesForRole(cr.id);
              const isExpanded = expandedRoleId === cr.id;
              return (
                <>
                  <tr
                    key={cr.id}
                    className="cursor-pointer hover"
                    onClick={() =>
                      setExpandedRoleId(isExpanded ? null : cr.id)
                    }
                  >
                    <td className="font-medium text-base-content">
                      {cr.title}
                    </td>
                    <td>
                      <p className="text-base-content">{cr.businessUnit}</p>
                      <p className="text-xs text-base-content/40">
                        {cr.department}
                      </p>
                    </td>
                    <td>
                      {incumbent && (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={incumbent.name}
                            color={incumbent.avatarColor}
                            size="sm"
                          />
                          <div>
                            <p className="text-xs font-medium text-base-content">
                              {incumbent.name}
                            </p>
                            <p className="text-xs text-base-content/40">
                              {incumbent.roleTitle}
                            </p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge color={cr.riskLevel}>{cr.riskLevel}</Badge>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {cr.benchCandidateIds.length}
                      </span>
                    </td>
                    <td>
                      {candidates[0] ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={candidates[0].employee!.name}
                            color={candidates[0].employee!.avatarColor}
                            size="sm"
                          />
                          <div>
                            <p className="text-xs font-medium text-base-content">
                              {candidates[0].employee!.name}
                            </p>
                            <Badge color={candidates[0].readinessStatus}>
                              {candidates[0].readinessStatus}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/40">
                          No bench
                        </span>
                      )}
                    </td>
                    <td className="text-xs text-base-content/60">
                      {cr.targetReadinessDate}
                    </td>
                    <td>
                      <span className="text-xs text-primary">
                        {isExpanded ? "Collapse" : "Expand"}
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${cr.id}-bench`}>
                      <td colSpan={8} className="bg-base-200/40">
                        <BenchDetail criticalRole={cr} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-base-content/40"
                >
                  No critical roles match the current filters for this role.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BenchDetail({ criticalRole }: { criticalRole: CriticalRole }) {
  const { role } = useRole();
  const incumbent = getEmployeeById(criticalRole.incumbentId);
  const candidates = getBenchCandidatesForRole(criticalRole.id);
  const canEdit = role.id === "talent-hr";
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-4 p-2">
      {/* Incumbent Card */}
      {incumbent && (
        <div className="flex items-center gap-4 rounded-lg border border-base-200 bg-base-100 p-4">
          <Avatar
            name={incumbent.name}
            color={incumbent.avatarColor}
            size="md"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-base-content">
              {incumbent.name}
            </p>
            <p className="text-xs text-base-content/60">
              Current Incumbent &middot; {incumbent.roleTitle}
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="text-center">
              <p className="text-base-content/40">Flight Risk</p>
              <Badge color={incumbent.flightRisk}>{incumbent.flightRisk}</Badge>
            </div>
            <div className="text-center">
              <p className="text-base-content/40">Retention</p>
              <p className="font-semibold text-base-content">
                {incumbent.retentionFactor}
              </p>
            </div>
            <div className="text-center">
              <p className="text-base-content/40">Tenure</p>
              <p className="font-semibold text-base-content">
                {incumbent.tenureYear}y
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bench Candidates */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-base-content">
            Successor Bench
          </h4>
          {canEdit && (
            <button
              onClick={() =>
                showToast("Demo: bench editing is not persisted. This action would open a candidate picker in the real app.")
              }
              className="btn btn-xs btn-outline btn-primary"
            >
              + Add Candidate
            </button>
          )}
        </div>

        {candidates.length === 0 ? (
          <p className="rounded-lg border border-dashed border-base-300 py-6 text-center text-sm text-base-content/40">
            No bench candidates identified for this role yet.
          </p>
        ) : (
          <div className="space-y-2">
            {candidates.map((cand, idx) => {
              const emp = cand.employee!;
              const capScore = capabilityMatchScore(emp);
              return (
                <div
                  key={cand.employeeId}
                  className="flex items-center gap-4 rounded-lg border border-base-200 bg-base-100 p-3"
                >
                  {/* Rank */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>

                  <Avatar name={emp.name} color={emp.avatarColor} size="md" />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${emp.id}`}
                        className="text-sm font-medium text-base-content hover:text-primary hover:underline"
                      >
                        {emp.name}
                      </Link>
                      {idx === 0 && (
                        <span className="badge badge-primary badge-xs">
                          Top pick
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/60">
                      {emp.roleTitle} &middot; {emp.businessUnit} &middot;{" "}
                      {emp.jobLevel}
                    </p>
                  </div>

                  {/* Readiness */}
                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Readiness</p>
                    <Badge color={cand.readinessStatus}>
                      {cand.readinessStatus}
                    </Badge>
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Score</p>
                    <p className="text-sm font-bold text-primary">
                      {cand.readinessScore}
                    </p>
                  </div>

                  {/* Capability Match */}
                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Capability</p>
                    <p className="text-sm font-semibold text-base-content">
                      {capScore}%
                    </p>
                  </div>

                  {/* Flight Risk */}
                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Flight Risk</p>
                    <Badge color={emp.flightRisk}>{emp.flightRisk}</Badge>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() =>
                        showToast(`Demo: removing ${emp.name} from bench is not persisted in this demo.`)
                      }
                      className="btn btn-ghost btn-xs text-error"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!canEdit && (
        <p className="text-xs text-base-content/40">
          View-only access. Bench editing is available for Talent HR only.
        </p>
      )}

      {toastMsg && (
        <div className="toast toast-end z-50">
          <div className="alert alert-info shadow-lg">
            <span className="text-sm">{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
