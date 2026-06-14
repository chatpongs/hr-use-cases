import { ROLE_LIST } from "../data/roles";
import { useRole } from "../context/role-context";

export function RoleSwitcher() {
  const { roleId, setRoleId, role } = useRole();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {ROLE_LIST.map((r) => {
          const active = r.id === roleId;
          return (
            <button
              key={r.id}
              onClick={() => setRoleId(r.id)}
              className={`btn btn-xs ${active ? "btn-primary" : "btn-outline btn-ghost"}`}
              title={r.description}
            >
              {r.shortLabel}
            </button>
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
