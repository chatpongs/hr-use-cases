import type { GroupBU } from "./types";

export type RoleId =
  | "talent-hr"
  | "hrbp"
  | "line-manager"
  | "read-only"
  | "employee";

export type ModuleId =
  | "talent-insights"
  | "profile"
  | "succession"
  | "career-planning"
  | "upload"
  | "vacancies";

export interface RoleDefinition {
  id: RoleId;
  label: string;
  shortLabel: string;
  description: string;
  accentColor: string;
  scope: {
    groupBus: GroupBU[] | "all";
    businessUnits: string[] | "all";
    directReportsOnly: boolean;
    selfOnly: boolean;
  };
  canUpload: boolean;
  canEditManagerComment: boolean;
  canViewManagerComment: boolean;
  canViewCompensation: boolean;
  canDrillToProfile: boolean;
  modules: ModuleId[];
}

export const ROLES: Record<RoleId, RoleDefinition> = {
  "talent-hr": {
    id: "talent-hr",
    label: "Talent HR",
    shortLabel: "HR",
    description:
      "Full platform access within Group BU/BU scope. Can upload profiles, edit bench candidates, and view all talent data.",
    accentColor: "#2563eb",
    scope: {
      groupBus: ["CRC", "CPN", "CG/CU"],
      businessUnits: "all",
      directReportsOnly: false,
      selfOnly: false,
    },
    canUpload: true,
    canEditManagerComment: false,
    canViewManagerComment: true,
    canViewCompensation: true,
    canDrillToProfile: true,
    modules: [
      "talent-insights",
      "profile",
      "succession",
      "career-planning",
      "upload",
      "vacancies",
    ],
  },
  hrbp: {
    id: "hrbp",
    label: "HRBP",
    shortLabel: "HRBP",
    description:
      "Scoped to assigned BU/function. Read access across assigned business units with limited edit permissions.",
    accentColor: "#7c3aed",
    scope: {
      groupBus: ["CRC"],
      businessUnits: ["CDS", "Robinson Retail"],
      directReportsOnly: false,
      selfOnly: false,
    },
    canUpload: false,
    canEditManagerComment: false,
    canViewManagerComment: true,
    canViewCompensation: false,
    canDrillToProfile: true,
    modules: [
      "talent-insights",
      "profile",
      "succession",
      "career-planning",
      "vacancies",
    ],
  },
  "line-manager": {
    id: "line-manager",
    label: "Line Manager",
    shortLabel: "Mgr",
    description:
      "Read-only access to direct reports. Can add/edit Manager Comment (CPN requirement).",
    accentColor: "#0891b2",
    scope: {
      groupBus: ["CRC"],
      businessUnits: "all",
      directReportsOnly: true,
      selfOnly: false,
    },
    canUpload: false,
    canEditManagerComment: true,
    canViewManagerComment: true,
    canViewCompensation: false,
    canDrillToProfile: true,
    modules: ["talent-insights", "profile", "career-planning"],
  },
  "read-only": {
    id: "read-only",
    label: "Read-Only / Executive",
    shortLabel: "Exec",
    description:
      "Dashboard and aggregated reports only. No drill-down to individual profiles.",
    accentColor: "#64748b",
    scope: {
      groupBus: "all",
      businessUnits: "all",
      directReportsOnly: false,
      selfOnly: false,
    },
    canUpload: false,
    canEditManagerComment: false,
    canViewManagerComment: false,
    canViewCompensation: false,
    canDrillToProfile: false,
    modules: ["talent-insights", "succession", "career-planning"],
  },
  employee: {
    id: "employee",
    label: "Employee / Talent",
    shortLabel: "Emp",
    description:
      "Self-service read-only access to own talent profile, competencies, and career visualizer.",
    accentColor: "#16a34a",
    scope: {
      groupBus: "all",
      businessUnits: "all",
      directReportsOnly: false,
      selfOnly: true,
    },
    canUpload: false,
    canEditManagerComment: false,
    canViewManagerComment: false,
    canViewCompensation: false,
    canDrillToProfile: true,
    modules: ["profile"],
  },
};

export const ROLE_LIST = Object.values(ROLES);

export const MODULE_LABELS: Record<ModuleId, { label: string; path: string }> =
  {
    "talent-insights": { label: "Talent Insights", path: "/talent-insights" },
    profile: { label: "Individual Profile", path: "/profile" },
    succession: { label: "Succession Planning", path: "/succession" },
    "career-planning": { label: "Career Planning", path: "/career-planning" },
    upload: { label: "Upload Profile", path: "/upload" },
    vacancies: { label: "Internal Vacancies", path: "/vacancies" },
  };
