import type { ReactNode } from "react";
import { useRole } from "../context/role-context";

interface PermissionGateProps {
  requires?: (role: ReturnType<typeof useRole>["role"]) => boolean;
  deniedMessage?: string;
  children: ReactNode;
}

export function PermissionGate({
  requires,
  deniedMessage = "Access Denied",
  children,
}: PermissionGateProps) {
  const { role } = useRole();

  if (requires && !requires(role)) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-error/20 text-2xl text-error">
            &#x1f6ab;
          </div>
          <p className="text-base font-semibold text-base-content">{deniedMessage}</p>
          <p className="mt-1 text-sm text-base-content/50">
            The <span className="font-medium text-primary">{role.label}</span> role does not have permission to view this.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
