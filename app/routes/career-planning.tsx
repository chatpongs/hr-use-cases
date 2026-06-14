import { useState, useMemo } from "react";
import type { Route } from "./+types/career-planning";
import { Link } from "react-router";
import { useRole } from "../context/role-context";
import {
  getScopedEmployees,
  getCareerKpiData,
  getVelocityBreakdownByBu,
} from "../data/helpers";
import type { VelocityStatus } from "../data/types";
import { KpiCard } from "../components/kpi-card";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Career Planning — Demo" }];
}

export default function CareerPlanning() {
  const { role, demoUserId } = useRole();
  const scopedEmployees = useMemo(
    () => getScopedEmployees(role, demoUserId),
    [role, demoUserId],
  );

  const [statusFilter, setStatusFilter] = useState<VelocityStatus | "all">(
    "all",
  );

  const kpiData = getCareerKpiData(scopedEmployees);
  const buBreakdown = getVelocityBreakdownByBu(scopedEmployees);
  const canDrill = role.canDrillToProfile;

  const filtered = useMemo(() => {
    if (statusFilter === "all") return scopedEmployees;
    return scopedEmployees.filter((e) => e.velocityStatus === statusFilter);
  }, [scopedEmployees, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-base-content">Career Planning</h2>
        <p className="text-sm text-base-content/60">
          Career velocity scoped for{" "}
          <span style={{ color: role.accentColor }} className="font-medium">
            {role.label}
          </span>
          {role.scope.directReportsOnly && " (direct reports only)"}
          {role.scope.selfOnly && " (own profile only)"}
          {" — "}
          {filtered.length} employees
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Promotions YTD"
          value={kpiData.promotionsYtd}
          accent="#2563eb"
          sublabel={`${kpiData.totalPopulation} in scope`}
        />
        <KpiCard
          label="Average Tenure"
          value={`${kpiData.averageTenure}y`}
          accent="#0891b2"
        />
        <KpiCard
          label="On Track"
          value={kpiData.onTrackCount}
          accent="#16a34a"
          sublabel={
            <span>
              {kpiData.totalPopulation > 0
                ? Math.round(
                    (kpiData.onTrackCount / kpiData.totalPopulation) * 100,
                  )
                : 0}
              % of population
            </span>
          }
        />
        <KpiCard
          label="Delayed / On Hold"
          value={kpiData.delayedCount + kpiData.onHoldCount}
          accent="#dc2626"
          sublabel={
            <span>
              {kpiData.delayedCount} delayed &middot; {kpiData.onHoldCount} on
              hold
            </span>
          }
        />
      </div>

      {/* Velocity Distribution Chart */}
      {buBreakdown.length > 0 && (
        <div className="mb-6 card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-4">
            <h3 className="mb-3 text-sm font-semibold text-base-content">
              Velocity Distribution by Group BU
            </h3>
            <div className="space-y-3">
              {buBreakdown.map((row) => {
                const trackPct =
                  row.total > 0 ? (row.onTrack / row.total) * 100 : 0;
                const delayedPct =
                  row.total > 0 ? (row.delayed / row.total) * 100 : 0;
                const holdPct =
                  row.total > 0 ? (row.onHold / row.total) * 100 : 0;
                return (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-base-content/70">
                        {row.label}
                      </span>
                      <span className="text-base-content/50">
                        {row.total} employees
                      </span>
                    </div>
                    <div className="flex h-6 w-full overflow-hidden rounded-lg">
                      <div
                        className="flex items-center justify-center bg-success text-success-content text-xs font-medium"
                        style={{ width: `${trackPct}%` }}
                        title={`${row.onTrack} On Track`}
                      >
                        {trackPct > 15 && row.onTrack}
                      </div>
                      <div
                        className="flex items-center justify-center bg-warning text-warning-content text-xs font-medium"
                        style={{ width: `${delayedPct}%` }}
                        title={`${row.delayed} Delayed`}
                      >
                        {delayedPct > 15 && row.delayed}
                      </div>
                      <div
                        className="flex items-center justify-center bg-error text-error-content text-xs font-medium"
                        style={{ width: `${holdPct}%` }}
                        title={`${row.onHold} On Hold`}
                      >
                        {holdPct > 15 && row.onHold}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-base-content/50">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-success" />
                On Track
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-warning" />
                Delayed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-sm bg-error" />
                On Hold
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Velocity Table */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-base-content/60">Filter by status:</span>
        <div className="join">
          <button
            onClick={() => setStatusFilter("all")}
            className={`btn btn-xs join-item ${statusFilter === "all" ? "btn-primary" : "btn-outline"}`}
          >
            All ({kpiData.totalPopulation})
          </button>
          <button
            onClick={() => setStatusFilter("On Track")}
            className={`btn btn-xs join-item ${statusFilter === "On Track" ? "btn-success" : "btn-outline"}`}
          >
            On Track ({kpiData.onTrackCount})
          </button>
          <button
            onClick={() => setStatusFilter("Delayed")}
            className={`btn btn-xs join-item ${statusFilter === "Delayed" ? "btn-warning" : "btn-outline"}`}
          >
            Delayed ({kpiData.delayedCount})
          </button>
          <button
            onClick={() => setStatusFilter("On Hold")}
            className={`btn btn-xs join-item ${statusFilter === "On Hold" ? "btn-error" : "btn-outline"}`}
          >
            On Hold ({kpiData.onHoldCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow-sm">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Role</th>
              <th>Tenure</th>
              <th>Performance</th>
              <th>Potential</th>
              <th>Target Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={emp.name}
                      color={emp.avatarColor}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-base-content">
                        {emp.name}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {emp.employeeId}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-base-content">{emp.roleTitle}</p>
                  <p className="text-xs text-base-content/40">
                    {emp.businessUnit}
                  </p>
                </td>
                <td className="text-base-content">{emp.tenureYear}y</td>
                <td>
                  <div className="flex items-center gap-1">
                    <span className="text-base-content">
                      {emp.performanceRating}
                    </span>
                    <span className="text-base-content/30">/5</span>
                  </div>
                </td>
                <td>
                  <Badge color={emp.potentialRating}>
                    {emp.potentialRating}
                  </Badge>
                </td>
                <td className="text-base-content/70">
                  {emp.longTermTargetRole ?? (
                    <span className="italic text-base-content/30">
                      Not defined
                    </span>
                  )}
                </td>
                <td>
                  <Badge color={emp.velocityStatus}>
                    {emp.velocityStatus}
                  </Badge>
                </td>
                <td>
                  {canDrill ? (
                    <Link
                      to={`/profile/${emp.id}`}
                      className="btn btn-xs btn-primary whitespace-nowrap"
                    >
                      View Career
                    </Link>
                  ) : (
                    <span className="text-xs text-base-content/40">
                      No drill-down
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-sm text-base-content/40"
                >
                  No employees match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
