import { useLocation } from "react-router";
import { ROLE_LIST, getModuleFromPath } from "../data/roles";
import { useRole } from "../context/role-context";

export function RoleSwitcher() {
  const { roleId, setRoleId, role } = useRole();
  const location = useLocation();
  const currentModule = getModuleFromPath(location.pathname);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {ROLE_LIST.map((r) => {
          const active = r.id === roleId;
          const allowed =
            currentModule === null || r.modules.includes(currentModule);

          return (
            <div
              key={r.id}
              className="tooltip tooltip-right tooltip-primary"
              data-tip={
                allowed
                  ? r.label
                  : `${r.label} — no access to this page`
              }
            >
              <button
                onClick={() => allowed && setRoleId(r.id)}
                className={`btn btn-xs gap-1 ${
                  active ? "btn-primary" : "btn-outline btn-ghost"
                } ${!allowed ? "cursor-not-allowed" : ""}`}
              >
                {!allowed && <span className="opacity-60">&#x1f512;</span>}
                {r.shortLabel}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-base-content/60">
        <span className="font-semibold">{role.label}</span>
      </p>
      <p className="text-xs leading-snug text-base-content/50">
        {role.description}
      </p>
    </div>
  );
}
