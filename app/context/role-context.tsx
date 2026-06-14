import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { RoleId } from "../data/roles";
import { ROLES, type RoleDefinition } from "../data/roles";

interface RoleContextValue {
  roleId: RoleId;
  role: RoleDefinition;
  demoUserId: string;
  setRoleId: (id: RoleId) => void;
  setDemoUserId: (id: string) => void;
  notesVisible: boolean;
  toggleNotes: () => void;
  managerComments: Record<string, string>;
  setManagerComment: (employeeId: string, comment: string) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const DEFAULT_DEMO_USER: Record<RoleId, string> = {
  "talent-hr": "e001",
  hrbp: "e001",
  "line-manager": "e002",
  "read-only": "e001",
  employee: "e003",
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId>("talent-hr");
  const [demoUserId, setDemoUserId] = useState<string>(
    DEFAULT_DEMO_USER["talent-hr"],
  );
  const [notesVisible, setNotesVisible] = useState(true);
  const [managerComments, setManagerComments] = useState<Record<string, string>>(
    {},
  );

  const handleSetRoleId = useCallback((id: RoleId) => {
    setRoleId(id);
    setDemoUserId(DEFAULT_DEMO_USER[id]);
  }, []);

  const toggleNotes = useCallback(() => {
    setNotesVisible((v) => !v);
  }, []);

  const setManagerComment = useCallback(
    (employeeId: string, comment: string) => {
      setManagerComments((prev) => ({ ...prev, [employeeId]: comment }));
    },
    [],
  );

  const value = useMemo<RoleContextValue>(
    () => ({
      roleId,
      role: ROLES[roleId],
      demoUserId,
      setRoleId: handleSetRoleId,
      setDemoUserId,
      notesVisible,
      toggleNotes,
      managerComments,
      setManagerComment,
    }),
    [
      roleId,
      demoUserId,
      notesVisible,
      managerComments,
      handleSetRoleId,
      toggleNotes,
      setManagerComment,
    ],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return ctx;
}
