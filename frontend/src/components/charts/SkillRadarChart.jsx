import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function SkillRadarChart({ formData }) {
  // Normalize to 0–10 for a clean radar display
  const coding = clamp(toNumber(formData?.Coding_Skills), 0, 10);
  const communication = clamp(toNumber(formData?.Communication_Skills), 0, 10);
  const soft = clamp(toNumber(formData?.Soft_Skills_Rating), 0, 10);

  // Aptitude is 0–100 -> normalize to 0–10
  const aptitude = clamp(toNumber(formData?.Aptitude_Test_Score) / 10, 0, 10);

  // Projects 0–10 already; internships 0–5 -> scale to 0–10
  const projects = clamp(toNumber(formData?.Projects), 0, 10);
  const internships = clamp(toNumber(formData?.Internships) * 2, 0, 10);

  const data = [
    { skill: "Coding", value: coding },
    { skill: "Communication", value: communication },
    { skill: "Aptitude", value: aptitude },
    { skill: "Soft Skills", value: soft },
    { skill: "Projects", value: projects },
    { skill: "Internships", value: internships },
  ];

  return (
    <div className="chartCard">
      <div className="chartHeader">
        <div>
          <div className="chartTitle">Skill radar analysis</div>
          <div className="chartHint">Normalized view of important readiness signals.</div>
        </div>
      </div>

      <div className="chartArea">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.28)" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tickCount={6}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="rgba(79, 209, 197, 0.95)"
              fill="rgba(79, 209, 197, 0.25)"
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value) => [Number(value).toFixed(2), "Score (0–10)"]}
              contentStyle={{
                background: "rgba(2, 6, 23, 0.92)",
                border: "1px solid rgba(148, 163, 184, 0.35)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.75)" }}
              itemStyle={{ color: "rgba(255,255,255,0.9)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mutedSmall">
        Note: Aptitude is normalized from 0–100 to 0–10. Internships (0–5) is scaled to 0–10.
      </div>
    </div>
  );
}

