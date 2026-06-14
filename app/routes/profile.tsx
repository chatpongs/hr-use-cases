import { useState } from "react";
import type { Route } from "./+types/profile";
import { Link, useParams } from "react-router";
import { useRole } from "../context/role-context";
import { getEmployeeById } from "../data/employees";
import { isEmployeeAccessible } from "../data/helpers";
import { Avatar } from "../components/avatar";
import { Badge } from "../components/badge";
import { CompetencyRadar, DIMENSION_LABELS } from "../components/competency-radar";
import { PermissionGate } from "../components/permission-gate";
import type { Competencies, Employee } from "../data/types";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Individual Profile — Demo" }];
}

type TabId =
  | "competencies"
  | "assessment"
  | "recommendations"
  | "history"
  | "career";

const TABS: { id: TabId; label: string }[] = [
  { id: "competencies", label: "Competencies" },
  { id: "assessment", label: "Competency Assessment" },
  { id: "recommendations", label: "Development Recommendations" },
  { id: "history", label: "Work History" },
  { id: "career", label: "Career Visualizer" },
];

export default function Profile() {
  const { employeeId } = useParams();
  const { role, demoUserId } = useRole();
  const employee = employeeId ? getEmployeeById(employeeId) : undefined;
  const [activeTab, setActiveTab] = useState<TabId>("competencies");
  const [commentDraft, setCommentDraft] = useState("");
  const [commentSaved, setCommentSaved] = useState(false);
  const { managerComments, setManagerComment } = useRole();

  if (!employee) {
    return (
      <div className="py-12 text-center text-base-content/50">
        Employee not found.
      </div>
    );
  }

  const accessible = isEmployeeAccessible(employee, role, demoUserId);

  if (!accessible) {
    return (
      <PermissionGate requires={() => false} deniedMessage="Out of Scope">
        <div />
      </PermissionGate>
    );
  }

  const canEditComment = role.canEditManagerComment;
  const canViewComment = role.canViewManagerComment;
  const currentComment =
    managerComments[employee.id] ??
    employee.managerComment ??
    commentDraft;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4">
        <Link
          to="/talent-insights"
          className="text-sm text-primary hover:underline"
        >
          &larr; Back to Talent Insights
        </Link>
      </div>

      {/* Profile Header */}
      <div className="mb-6 card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body flex-row items-start gap-4 p-5">
          <Avatar name={employee.name} color={employee.avatarColor} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-base-content">
                {employee.name}
              </h2>
              <Badge color={employee.talentType}>{employee.talentType}</Badge>
            </div>
            <p className="mt-1 text-sm text-base-content/60">
              {employee.roleTitle} &middot; {employee.businessUnit} &middot;{" "}
              {employee.jobFunction} &middot; {employee.jobLevel}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-base-content/50">
              <span>
                <strong className="text-base-content">Tenure:</strong>{" "}
                {employee.tenureYear} years
              </span>
              <span>
                <strong className="text-base-content">Performance:</strong>{" "}
                {employee.performanceRating}/5
              </span>
              <span>
                <strong className="text-base-content">Potential:</strong>{" "}
                {employee.potentialRating}
              </span>
              <span className="flex items-center gap-1.5">
                <strong className="text-base-content">Flight Risk:</strong>{" "}
                <Badge color={employee.flightRisk}>{employee.flightRisk}</Badge>
              </span>
              <span>
                <strong className="text-base-content">Retention:</strong>{" "}
                {employee.retentionFactor}
              </span>
              <span className="flex items-center gap-1.5">
                <strong className="text-base-content">Velocity:</strong>{" "}
                <Badge color={employee.velocityStatus}>
                  {employee.velocityStatus}
                </Badge>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-5">
          {activeTab === "competencies" && (
            <CompetenciesTab competencies={employee.competencies} />
          )}
          {activeTab === "assessment" && (
            <AssessmentTab competencies={employee.competencies} />
          )}
          {activeTab === "recommendations" && (
            <RecommendationsTab
              employee={employee}
              canEditComment={canEditComment}
              canViewComment={canViewComment}
              currentComment={currentComment}
              commentDraft={commentDraft}
              setCommentDraft={setCommentDraft}
              commentSaved={commentSaved}
              setCommentSaved={setCommentSaved}
              onSave={() => {
                setManagerComment(employee.id, commentDraft);
                setCommentSaved(true);
              }}
            />
          )}
          {activeTab === "history" && <HistoryTab employee={employee} />}
          {activeTab === "career" && <CareerTab employee={employee} />}
        </div>
      </div>
    </div>
  );
}

function CompetenciesTab({ competencies }: { competencies: Competencies }) {
  const dims = Object.keys(DIMENSION_LABELS) as (keyof Competencies)[];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <CompetencyRadar competencies={competencies} />
        <div className="mt-2 flex items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border-2 border-primary bg-primary/20" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border-2 border-dashed border-secondary bg-secondary/10" />
            Required
          </span>
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold text-base-content">
          Competency Scores
        </h4>
        <div className="space-y-2">
          {dims.map((d) => {
            const c = competencies[d];
            const gap = c.actual - c.required;
            return (
              <div
                key={d}
                className="flex items-center justify-between rounded-md border border-base-200 px-3 py-2"
              >
                <span className="text-sm text-base-content">
                  {DIMENSION_LABELS[d]}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-base-content">
                    {c.actual}/{c.required}
                  </span>
                  {gap < 0 ? (
                    <span className="badge badge-error badge-sm">
                      -{Math.abs(gap)}
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm">
                      +{gap}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AssessmentTab({ competencies }: { competencies: Competencies }) {
  const dims = Object.keys(DIMENSION_LABELS) as (keyof Competencies)[];
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-base-content">
        Competency Gap Analysis
      </h4>
      <div className="space-y-3">
        {dims.map((d) => {
          const c = competencies[d];
          const gap = c.actual - c.required;
          const pct = c.required > 0 ? (c.actual / c.required) * 100 : 100;
          return (
            <div key={d}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-base-content">{DIMENSION_LABELS[d]}</span>
                <span
                  className={`font-medium ${gap < 0 ? "text-error" : "text-success"}`}
                >
                  {c.actual} / {c.required} ({Math.round(pct)}%)
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm ${
                      i < c.actual
                        ? gap < 0
                          ? "bg-warning"
                          : "bg-success"
                        : i < c.required
                          ? "bg-error/30"
                          : "bg-base-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-base-content/50">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-success" />
          Met / Exceeds
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-warning" />
          Partial (below required)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-error/30" />
          Required (not met)
        </span>
      </div>
    </div>
  );
}

function RecommendationsTab({
  employee,
  canEditComment,
  canViewComment,
  currentComment,
  commentDraft,
  setCommentDraft,
  commentSaved,
  setCommentSaved,
  onSave,
}: {
  employee: Employee;
  canEditComment: boolean;
  canViewComment: boolean;
  currentComment: string;
  commentDraft: string;
  setCommentDraft: (v: string) => void;
  commentSaved: boolean;
  setCommentSaved: (v: boolean) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-base-content">
            AI Development Recommendations
          </h4>
          <span className="badge badge-ghost badge-sm">
            Mock data (Phase 2: AI)
          </span>
        </div>
        <ul className="space-y-2">
          {employee.developmentRecommendations.map((rec, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-md border border-base-200 bg-base-200/50 px-3 py-2 text-sm text-base-content"
            >
              <span className="text-primary">&#x2022;</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Manager Comment Section */}
      <div className="divider my-2"></div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-base-content">
            Manager Comment
            <span className="ml-2 text-xs font-normal text-base-content/40">
              (CPN requirement)
            </span>
          </h4>
          {canEditComment && (
            <span className="badge badge-warning badge-sm">
              Required for review finalization
            </span>
          )}
        </div>

        {!canViewComment && !canEditComment && (
          <p className="text-sm text-base-content/40">
            Manager Comment is not visible for your role.
          </p>
        )}

        {canViewComment && !canEditComment && (
          <div className="rounded-md border border-base-200 bg-base-200/50 px-3 py-2">
            {currentComment ? (
              <p className="text-sm text-base-content">{currentComment}</p>
            ) : (
              <p className="text-sm italic text-base-content/40">
                No manager comment yet.
              </p>
            )}
          </div>
        )}

        {canEditComment && (
          <div className="space-y-2">
            <textarea
              value={commentDraft || currentComment}
              onChange={(e) => {
                setCommentDraft(e.target.value);
                setCommentSaved(false);
              }}
              placeholder="Add qualitative feedback for this employee..."
              rows={4}
              className="textarea textarea-bordered w-full text-sm"
            />
            <div className="flex items-center gap-3">
              <button onClick={onSave} className="btn btn-primary btn-sm">
                Save Comment
              </button>
              {commentSaved && (
                <span className="text-xs text-success">
                  &#x2713; Saved (session only)
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryTab({ employee }: { employee: Employee }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-base-content">Work History</h4>
      <ul className="timeline timeline-vertical">
        {employee.workHistory.map((entry) => (
          <li key={entry.id}>
            <hr />
            <div className="timeline-start text-xs text-base-content/50">
              {entry.startDate} &mdash; {entry.endDate ?? "Present"}
              {entry.current && (
                <span className="ml-1 badge badge-success badge-xs">Current</span>
              )}
            </div>
            <div className="timeline-middle">
              <div className="h-3 w-3 rounded-full border-2 border-primary bg-base-100" />
            </div>
            <div className="timeline-end timeline-box">
              <p className="text-sm font-medium text-base-content">
                {entry.roleTitle}
              </p>
              <p className="text-xs text-base-content/50">
                {entry.company} &middot; {entry.department} &middot;{" "}
                {entry.businessUnit}
              </p>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CareerTab({ employee }: { employee: Employee }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-base-content">
        Career Visualizer
      </h4>
      <div className="flex items-center justify-center gap-6 py-4">
        {/* Current Role */}
        <div className="rounded-lg border-2 border-primary bg-primary/10 px-4 py-3 text-center">
          <p className="text-xs font-medium uppercase text-primary">Current</p>
          <p className="mt-1 text-sm font-semibold text-base-content">
            {employee.roleTitle}
          </p>
          <p className="text-xs text-base-content/50">
            {employee.businessUnit} &middot; {employee.jobLevel}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center text-2xl text-base-content/30">
          &rarr;
        </div>

        {/* Target Role */}
        <div
          className={`rounded-lg border-2 px-4 py-3 text-center ${
            employee.longTermTargetRole
              ? "border-secondary bg-secondary/10"
              : "border-dashed border-base-300 bg-base-200"
          }`}
        >
          <p className="text-xs font-medium uppercase text-secondary">
            Long-term Target
          </p>
          {employee.longTermTargetRole ? (
            <p className="mt-1 text-sm font-semibold text-base-content">
              {employee.longTermTargetRole}
            </p>
          ) : (
            <p className="mt-1 text-sm italic text-base-content/40">
              Not defined
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-md bg-base-200 px-4 py-3 text-xs text-base-content/60">
        <strong className="text-base-content">Career Velocity:</strong>{" "}
        <Badge color={employee.velocityStatus}>
          {employee.velocityStatus}
        </Badge>
        <span className="ml-2">
          Tenure {employee.tenureYear}y &middot; Performance{" "}
          {employee.performanceRating}/5 &middot; Potential{" "}
          {employee.potentialRating}
        </span>
      </div>
    </div>
  );
}
