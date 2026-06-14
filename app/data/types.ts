export type GroupBU = "CRC" | "CPN" | "CG/CU";

export type FlightRisk = "High" | "Medium" | "Low";

export type PotentialRating = "High" | "Medium" | "Low";

export type TalentType =
  | "Top Talent"
  | "Talent"
  | "Pipeline"
  | "Watch List";

export type ReadinessStatus =
  | "Ready Now"
  | "Ready 1-2 Years"
  | "Ready 3-5 Years";

export type VelocityStatus = "On Track" | "Delayed" | "On Hold";

export interface Competency {
  actual: number;
  required: number;
}

export interface Competencies {
  leadership: Competency;
  management: Competency;
  functional: Competency;
  futureSkills: Competency;
  digital: Competency;
  cultureValues: Competency;
}

export interface WorkHistoryEntry {
  id: string;
  roleTitle: string;
  company: string;
  department: string;
  businessUnit: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatarColor: string;
  roleTitle: string;
  department: string;
  businessUnit: string;
  groupBu: GroupBU;
  jobFunction: string;
  jobLevel: string;
  talentType: TalentType;
  performanceRating: number;
  potentialRating: PotentialRating;
  retentionFactor: number;
  flightRisk: FlightRisk;
  tenureYear: number;
  yearsToRetirement: number;
  managerId: string | null;
  longTermTargetRole: string | null;
  competencies: Competencies;
  workHistory: WorkHistoryEntry[];
  developmentRecommendations: string[];
  managerComment: string | null;
  velocityStatus: VelocityStatus;
}

export interface CriticalRole {
  id: string;
  title: string;
  department: string;
  businessUnit: string;
  groupBu: GroupBU;
  incumbentId: string;
  riskLevel: FlightRisk;
  targetReadinessDate: string;
  benchCandidateIds: string[];
}

export interface BenchCandidate {
  employeeId: string;
  criticalRoleId: string;
  readinessStatus: ReadinessStatus;
  readinessScore: number;
}

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  businessUnit: string;
  groupBu: GroupBU;
  level: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Closed";
  internalMatchEmployeeIds: string[];
}
