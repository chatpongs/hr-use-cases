import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  accent?: string;
}

export function KpiCard({ label, value, sublabel, accent = "#2563eb" }: KpiCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4 gap-1">
        <div
          className="h-1 w-10 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
          {label}
        </p>
        <p className="text-2xl font-bold text-base-content">{value}</p>
        {sublabel && (
          <div className="text-xs text-base-content/50">{sublabel}</div>
        )}
      </div>
    </div>
  );
}
