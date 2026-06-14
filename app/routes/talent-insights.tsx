import { useState, useMemo } from "react";
import type { Route } from "./+types/talent-insights";
import { Link } from "react-router";
import { useRole } from "../context/role-context";
import {
  getScopedEmployees,
  getFilterOptions,
  getKpiData,
  capabilityMatchScore,
} from "../data/helpers";
import type { Employee } from "../data/types";
import { KpiCard } from "../components/kpi-card";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Talent Insights — Demo" }];
}

export default function TalentInsights() {
  const { role, demoUserId } = useRole();
  const scopedEmployees = useMemo(
    () => getScopedEmployees(role, demoUserId),
    [role, demoUserId],
  );

  const filterOptions = getFilterOptions();
  const [filters, setFilters] = useState({
    groupBu: "all",
    businessUnit: "all",
    jobFunction: "all",
    jobLevel: "all",
    flightRisk: "all",
    search: "",
  });

  const filtered = useMemo(() => {
    return scopedEmployees.filter((e) => {
      if (filters.groupBu !== "all" && e.groupBu !== filters.groupBu) return false;
      if (filters.businessUnit !== "all" && e.businessUnit !== filters.businessUnit)
        return false;
      if (filters.jobFunction !== "all" && e.jobFunction !== filters.jobFunction)
        return false;
      if (filters.jobLevel !== "all" && e.jobLevel !== filters.jobLevel)
        return false;
      if (filters.flightRisk !== "all" && e.flightRisk !== filters.flightRisk)
        return false;
      if (
        filters.search &&
        !e.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !e.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [scopedEmployees, filters]);

  const kpiData = getKpiData(filtered);
  const canDrill = role.canDrillToProfile;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-base-content">Talent Insights</h2>
        <p className="text-sm text-base-content/60">
          Population scoped for{" "}
          <span style={{ color: role.accentColor }} className="font-medium">
            {role.label}
          </span>
          {role.scope.directReportsOnly && " (direct reports only)"}
          {role.scope.selfOnly && " (own profile only)"}
          {" — "}
          {filtered.length} of {scopedEmployees.length} employees shown
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Headcount"
          value={kpiData.totalHeadcount}
          accent="#2563eb"
        />
        <KpiCard
          label="High Risk of Loss"
          value={kpiData.highRiskCount}
          accent="#dc2626"
          sublabel={
            <span>
              {kpiData.totalHeadcount > 0
                ? Math.round(
                    (kpiData.highRiskCount / kpiData.totalHeadcount) * 100,
                  )
                : 0}
              % of population
            </span>
          }
        />
        <KpiCard
          label="Avg Retention Factor"
          value={kpiData.averageRetentionFactor}
          accent="#0891b2"
        />
        <KpiCard
          label="Talent Breakdown"
          value={
            <div className="flex flex-wrap gap-1">
              {Object.entries(kpiData.talentBreakdown).map(([type, count]) => (
                <Badge key={type} color={type}>
                  {type}: {count}
                </Badge>
              ))}
            </div>
          }
          accent="#7c3aed"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <FilterSelect
              label="Group BU"
              value={filters.groupBu}
              onChange={(v) => setFilters({ ...filters, groupBu: v })}
              options={filterOptions.groupBus}
            />
            <FilterSelect
              label="Business Unit"
              value={filters.businessUnit}
              onChange={(v) => setFilters({ ...filters, businessUnit: v })}
              options={filterOptions.businessUnits}
            />
            <FilterSelect
              label="Function"
              value={filters.jobFunction}
              onChange={(v) => setFilters({ ...filters, jobFunction: v })}
              options={filterOptions.functions}
            />
            <FilterSelect
              label="Grade"
              value={filters.jobLevel}
              onChange={(v) => setFilters({ ...filters, jobLevel: v })}
              options={filterOptions.grades}
            />
            <FilterSelect
              label="Risk"
              value={filters.flightRisk}
              onChange={(v) => setFilters({ ...filters, flightRisk: v })}
              options={filterOptions.risks}
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-base-content/50">
                Search
              </label>
              <input
                type="text"
                placeholder="Name / Employee ID"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input input-bordered input-sm w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow-sm">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Current Role</th>
              <th>BU / Function</th>
              <th>Talent Type</th>
              <th>Risk</th>
              <th>Retention</th>
              <th>Capability Match</th>
              <th>Action</th>
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
                      <p className="font-medium text-base-content">{emp.name}</p>
                      <p className="text-xs text-base-content/40">{emp.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-base-content">{emp.roleTitle}</p>
                  <p className="text-xs text-base-content/40">{emp.jobLevel}</p>
                </td>
                <td>
                  <p className="text-base-content">{emp.businessUnit}</p>
                  <p className="text-xs text-base-content/40">{emp.jobFunction}</p>
                </td>
                <td>
                  <Badge color={emp.talentType}>{emp.talentType}</Badge>
                </td>
                <td>
                  <Badge color={emp.flightRisk}>{emp.flightRisk}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <progress
                      className="progress progress-warning w-16 h-2"
                      value={emp.retentionFactor}
                      max="100"
                    />
                    <span className="text-xs text-base-content/60">
                      {emp.retentionFactor}
                    </span>
                  </div>
                </td>
                <td>
                  <CapabilityBar employee={emp} />
                </td>
                <td>
                  {canDrill ? (
                    <Link
                      to={`/profile/${emp.id}`}
                      className="btn btn-xs btn-primary whitespace-nowrap"
                    >
                      Open Profile
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
                <td colSpan={8} className="py-8 text-center text-sm text-base-content/40">
                  No employees match the current filters for this role.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-base-content/50">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered select-sm w-full"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function CapabilityBar({ employee }: { employee: Employee }) {
  const score = capabilityMatchScore(employee);
  const color =
    score >= 80 ? "progress-success" : score >= 60 ? "progress-warning" : "progress-error";
  return (
    <div className="flex items-center gap-2">
      <progress className={`progress ${color} w-12 h-2`} value={score} max="100" />
      <span className="text-xs font-medium">{score}%</span>
    </div>
  );
}
