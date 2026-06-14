import type { Employee, GroupBU } from "./types";
import type { RoleDefinition } from "./roles";
import { EMPLOYEES } from "./employees";

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
