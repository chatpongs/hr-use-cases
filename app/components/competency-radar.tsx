import type { Competencies } from "../data/types";

interface RadarChartProps {
  competencies: Competencies;
  size?: number;
}

const DIMENSION_LABELS: Record<keyof Competencies, string> = {
  leadership: "Leadership",
  management: "Management",
  functional: "Functional",
  futureSkills: "Future Skills",
  digital: "Digital",
  cultureValues: "Culture & Values",
};

export function CompetencyRadar({ competencies, size = 240 }: RadarChartProps) {
  const dims = Object.keys(DIMENSION_LABELS) as (keyof Competencies)[];
  const maxScore = 5;
  const center = size / 2;
  const radius = size / 2 - 40;

  const angleFor = (i: number) =>
    (Math.PI * 2 * i) / dims.length - Math.PI / 2;

  const pointFor = (value: number, i: number, max: number) => {
    const r = (value / max) * radius;
    const angle = angleFor(i);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const actualPoints = dims
    .map((d, i) => {
      const p = pointFor(competencies[d].actual, i, maxScore);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const requiredPoints = dims
    .map((d, i) => {
      const p = pointFor(competencies[d].required, i, maxScore);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map((level) => {
        const pts = dims
          .map((_, i) => {
            const p = pointFor(level, i, maxScore);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {dims.map((_, i) => {
        const p = pointFor(5, i, maxScore);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Required area */}
      <polygon
        points={requiredPoints}
        fill="rgba(124, 58, 237, 0.08)"
        stroke="#7c3aed"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {/* Actual area */}
      <polygon
        points={actualPoints}
        fill="rgba(37, 99, 235, 0.15)"
        stroke="#2563eb"
        strokeWidth={2}
      />

      {/* Actual points */}
      {dims.map((d, i) => {
        const p = pointFor(competencies[d].actual, i, maxScore);
        return (
          <circle key={d} cx={p.x} cy={p.y} r={3} fill="#2563eb" />
        );
      })}

      {/* Labels */}
      {dims.map((d, i) => {
        const p = pointFor(6, i, maxScore);
        return (
          <text
            key={d}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-600 text-[10px] font-medium"
          >
            {DIMENSION_LABELS[d]}
          </text>
        );
      })}
    </svg>
  );
}

export { DIMENSION_LABELS };
