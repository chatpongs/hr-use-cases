import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

const COLOR_CLASS: Record<string, string> = {
  High: "badge-error",
  Medium: "badge-warning",
  Low: "badge-success",
  "Top Talent": "badge-primary",
  Talent: "badge-secondary",
  Pipeline: "badge-info",
  "Watch List": "badge-warning",
  "On Track": "badge-success",
  Delayed: "badge-warning",
  "On Hold": "badge-error",
  "Ready Now": "badge-success",
  "Ready 1-2 Years": "badge-info",
  "Ready 3-5 Years": "badge-ghost",
};

export function Badge({ children, color }: BadgeProps) {
  const key = color ?? (typeof children === "string" ? children : "default");
  const cls = COLOR_CLASS[key] ?? "badge-ghost";
  return (
    <span className={`badge badge-sm ${cls}`}>{children}</span>
  );
}
