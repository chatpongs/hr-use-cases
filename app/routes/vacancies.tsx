import { useState, useMemo } from "react";
import type { Route } from "./+types/vacancies";
import { Link } from "react-router";
import { useRole } from "../context/role-context";
import {
  getScopedVacancies,
  getVacancyMatches,
  EXTERNAL_CANDIDATES,
} from "../data/helpers";
import type { JobVacancy } from "../data/types";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Internal Vacancies — Demo" }];
}

export default function Vacancies() {
  const { role } = useRole();
  const scopedVacancies = useMemo(
    () => getScopedVacancies(role),
    [role],
  );

  const [filters, setFilters] = useState({
    groupBu: "all",
    priority: "all",
  });
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(
    null,
  );

  const filtered = useMemo(() => {
    return scopedVacancies.filter((v) => {
      if (filters.groupBu !== "all" && v.groupBu !== filters.groupBu)
        return false;
      if (filters.priority !== "all" && v.priority !== filters.priority)
        return false;
      return true;
    });
  }, [scopedVacancies, filters]);

  const selectedVacancy =
    filtered.find((v) => v.id === selectedVacancyId) ?? null;

  if (selectedVacancy) {
    return (
      <VacancyDetail
        vacancy={selectedVacancy}
        onBack={() => setSelectedVacancyId(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-base-content">
          Internal Vacancies
        </h2>
        <p className="text-sm text-base-content/60">
          JG17+ open roles scoped for{" "}
          <span style={{ color: role.accentColor }} className="font-medium">
            {role.label}
          </span>{" "}
          — {filtered.length} vacancies
        </p>
      </div>

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
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
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

      {/* Vacancy Table */}
      <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow-sm">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Department / BU</th>
              <th>Level</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Internal Matches</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td className="font-medium text-base-content">{v.title}</td>
                <td>
                  <p className="text-base-content">{v.businessUnit}</p>
                  <p className="text-xs text-base-content/40">{v.department}</p>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm">{v.level}</span>
                </td>
                <td>
                  <Badge color={v.priority}>{v.priority}</Badge>
                </td>
                <td>
                  <span className="badge badge-success badge-sm">
                    {v.status}
                  </span>
                </td>
                <td>
                  <span className="badge badge-primary badge-sm">
                    {v.internalMatchEmployeeIds.length} candidates
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedVacancyId(v.id)}
                    className="btn btn-xs btn-outline btn-primary whitespace-nowrap"
                  >
                    View Matches
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-sm text-base-content/40"
                >
                  No vacancies match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VacancyDetail({
  vacancy,
  onBack,
}: {
  vacancy: JobVacancy;
  onBack: () => void;
}) {
  const internalMatches = useMemo(
    () => getVacancyMatches(vacancy),
    [vacancy],
  );

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-primary hover:underline"
      >
        &larr; Back to Vacancies
      </button>

      {/* Vacancy Header */}
      <div className="mb-6 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-base-content">
                {vacancy.title}
              </h2>
              <p className="mt-1 text-sm text-base-content/60">
                {vacancy.department} &middot; {vacancy.businessUnit} &middot;{" "}
                {vacancy.groupBu}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge color={vacancy.priority}>{vacancy.priority} Priority</Badge>
              <span className="badge badge-success badge-sm">{vacancy.status}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-base-content/50">
            <span>
              <strong className="text-base-content">Level:</strong> {vacancy.level}
            </span>
            <span>
              <strong className="text-base-content">Internal matches:</strong>{" "}
              {internalMatches.length}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Matches */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-base-content">
            Internal Candidate Matches
          </h3>
          <span className="badge badge-ghost badge-sm">
            AI matching (mock)
          </span>
        </div>

        <div className="space-y-2">
          {internalMatches.map((match, idx) => (
            <div
              key={match.employeeId}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-3">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>

                  <Avatar
                    name={match.employee.name}
                    color={match.employee.avatarColor}
                    size="md"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/profile/${match.employee.id}`}
                        className="text-sm font-medium text-base-content hover:text-primary hover:underline"
                      >
                        {match.employee.name}
                      </Link>
                      {idx === 0 && (
                        <span className="badge badge-primary badge-xs">
                          Best match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/60">
                      {match.employee.roleTitle} &middot;{" "}
                      {match.employee.businessUnit} &middot;{" "}
                      {match.employee.jobLevel}
                    </p>
                  </div>

                  {/* Match Score */}
                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Match Score</p>
                    <div className="flex items-center gap-2">
                      <progress
                        className={`progress h-2 w-16 ${match.matchScore >= 80 ? "progress-success" : match.matchScore >= 65 ? "progress-warning" : "progress-error"}`}
                        value={match.matchScore}
                        max="100"
                      />
                      <span className="text-sm font-bold text-base-content">
                        {match.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="hidden lg:flex flex-wrap gap-1 max-w-[200px]">
                    {match.matchReasons.map((reason, i) => (
                      <span
                        key={i}
                        className="badge badge-outline badge-xs text-info"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Candidates Comparison */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-base-content">
            External Candidates (from Recruitment Platform)
          </h3>
          <span className="badge badge-ghost badge-sm">Synced</span>
        </div>

        <div className="space-y-2">
          {EXTERNAL_CANDIDATES.map((cand) => (
            <div
              key={cand.id}
              className="card bg-base-100 shadow-sm border border-base-200"
            >
              <div className="card-body p-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-sm font-bold text-base-content/60">
                    &#x1f464;
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-base-content">
                      {cand.name}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {cand.currentRole} &middot; {cand.company} &middot;{" "}
                      {cand.experience}y experience
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-base-content/40">Match Score</p>
                    <div className="flex items-center gap-2">
                      <progress
                        className={`progress h-2 w-16 ${cand.matchScore >= 80 ? "progress-success" : cand.matchScore >= 65 ? "progress-warning" : "progress-error"}`}
                        value={cand.matchScore}
                        max="100"
                      />
                      <span className="text-sm font-bold text-base-content">
                        {cand.matchScore}%
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-outline badge-sm">
                    External
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Hiring Recommendation */}
      <div className="mt-6 alert alert-info">
        <div className="text-sm">
          <strong>AI Hiring Rationale (mock):</strong>{" "}
          {internalMatches[0] && internalMatches[0].matchScore >= 80 ? (
            <>
              Top internal candidate{" "}
              <strong>{internalMatches[0].employee.name}</strong> has a{" "}
              {internalMatches[0].matchScore}% match score. Recommend internal
              hire to accelerate fill time and retain talent.
            </>
          ) : (
            <>
              No strong internal match found. Consider external recruitment for
              this role.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
