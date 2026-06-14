import type { Employee, GroupBU, CriticalRole } from "./types";
import type { RoleDefinition } from "./roles";
import { EMPLOYEES } from "./employees";
import { CRITICAL_ROLES, BENCH_CANDIDATES } from "./succession";

export interface FilterOptions {
  groupBus: GroupBU[];
  businessUnits: string[];
  functions: string[];
  grades: string[];
  risks: string[];
}

export function getFilterOptions(): FilterOptions {
  const groupBus = [...new Set(EMPLOYEES.map((e) => e.groupBu))];
  const businessUnits = [...new Set(EMPLOYEES.map((e) => e.businessUnit))];
  const functions = [...new Set(EMPLOYEES.map((e) => e.jobFunction))];
  const grades = [...new Set(EMPLOYEES.map((e) => e.jobLevel))];
  const risks = ["High", "Medium", "Low"];
  return { groupBus, businessUnits, functions, grades, risks };
}

export function getScopedEmployees(
  role: RoleDefinition,
  demoUserId?: string,
): Employee[] {
  if (role.scope.selfOnly && demoUserId) {
    return EMPLOYEES.filter((e) => e.id === demoUserId);
  }
  if (role.scope.directReportsOnly && demoUserId) {
    return EMPLOYEES.filter((e) => e.managerId === demoUserId);
  }
  let result = EMPLOYEES;
  if (role.scope.groupBus !== "all") {
    result = result.filter((e) =>
      (role.scope.groupBus as GroupBU[]).includes(e.groupBu),
    );
  }
  if (role.scope.businessUnits !== "all") {
    result = result.filter((e) =>
      (role.scope.businessUnits as string[]).includes(e.businessUnit),
    );
  }
  return result;
}

export function isEmployeeAccessible(
  employee: Employee,
  role: RoleDefinition,
  demoUserId?: string,
): boolean {
  const scoped = getScopedEmployees(role, demoUserId);
  return scoped.some((e) => e.id === employee.id);
}

export interface KpiData {
  totalHeadcount: number;
  talentBreakdown: Record<string, number>;
  highRiskCount: number;
  averageRetentionFactor: number;
}

export function getKpiData(employees: Employee[]): KpiData {
  const talentBreakdown: Record<string, number> = {};
  for (const e of employees) {
    talentBreakdown[e.talentType] = (talentBreakdown[e.talentType] ?? 0) + 1;
  }
  const highRiskCount = employees.filter((e) => e.flightRisk === "High").length;
  const averageRetentionFactor =
    employees.length > 0
      ? Math.round(
          employees.reduce((sum, e) => sum + e.retentionFactor, 0) /
            employees.length,
        )
      : 0;
  return {
    totalHeadcount: employees.length,
    talentBreakdown,
    highRiskCount,
    averageRetentionFactor,
  };
}

export function capabilityMatchScore(employee: Employee): number {
  const c = employee.competencies;
  const dims = [
    c.leadership,
    c.management,
    c.functional,
    c.futureSkills,
    c.digital,
    c.cultureValues,
  ];
  const ratios = dims.map((d) =>
    d.required > 0 ? Math.min(d.actual / d.required, 1) : 1,
  );
  return Math.round((ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getScopedCriticalRoles(
  role: RoleDefinition,
): CriticalRole[] {
  let result = CRITICAL_ROLES;
  if (role.scope.groupBus !== "all") {
    result = result.filter((cr) =>
      (role.scope.groupBus as GroupBU[]).includes(cr.groupBu),
    );
  }
  if (role.scope.businessUnits !== "all") {
    result = result.filter((cr) =>
      (role.scope.businessUnits as string[]).includes(cr.businessUnit),
    );
  }
  return result;
}

export function getBenchCandidatesForRole(criticalRoleId: string) {
  return BENCH_CANDIDATES.filter(
    (bc) => bc.criticalRoleId === criticalRoleId,
  )
    .map((bc) => {
      const employee = EMPLOYEES.find((e) => e.id === bc.employeeId);
      return { ...bc, employee };
    })
    .filter((bc) => bc.employee !== undefined)
    .sort((a, b) => b.readinessScore - a.readinessScore);
}

export interface SuccessionKpiData {
  totalCriticalRoles: number;
  readyNowCount: number;
  averageBenchStrength: number;
  highRiskCount: number;
}

export function getSuccessionKpiData(
  roles: CriticalRole[],
): SuccessionKpiData {
  let readyNowCount = 0;
  let highRiskCount = 0;
  let totalBench = 0;

  for (const cr of roles) {
    const candidates = BENCH_CANDIDATES.filter(
      (bc) => bc.criticalRoleId === cr.id,
    );
    totalBench += candidates.length;
    if (candidates.some((bc) => bc.readinessStatus === "Ready Now")) {
      readyNowCount++;
    }
    if (cr.riskLevel === "High") {
      highRiskCount++;
    }
  }

  return {
    totalCriticalRoles: roles.length,
    readyNowCount,
    averageBenchStrength:
      roles.length > 0 ? Math.round((totalBench / roles.length) * 10) / 10 : 0,
    highRiskCount,
  };
}

export function getRiskHeatmapData(
  roles: CriticalRole[],
): { label: string; high: number; medium: number; low: number; total: number }[] {
  const grouped: Record<
    string,
    { high: number; medium: number; low: number; total: number }
  > = {};

  for (const cr of roles) {
    const key = `${cr.groupBu} / ${cr.businessUnit}`;
    if (!grouped[key]) {
      grouped[key] = { high: 0, medium: 0, low: 0, total: 0 };
    }
    grouped[key].total++;
    if (cr.riskLevel === "High") grouped[key].high++;
    else if (cr.riskLevel === "Medium") grouped[key].medium++;
    else grouped[key].low++;
  }

  return Object.entries(grouped).map(([label, data]) => ({ label, ...data }));
}
