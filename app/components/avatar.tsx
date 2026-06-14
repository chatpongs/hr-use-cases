import { getInitials } from "../data/helpers";

interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ name, color, size = "md" }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${SIZES[size]}`}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
