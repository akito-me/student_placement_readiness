import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function clamp01(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

export function ProbabilityChart({ probabilityPct }) {
  const pct = clamp01(probabilityPct ?? 0);
  const data = [{ name: "Probability", value: pct, fill: "rgba(124, 92, 255, 0.95)" }];

  return (
    <div className="chartCard">
      <div className="chartHeader">
        <div>
          <div className="chartTitle">Placement probability</div>
          <div className="chartHint">Visual indicator of placement chance.</div>
        </div>
        <div className="chartNumber">{probabilityPct == null ? "—" : `${pct.toFixed(2)}%`}</div>
      </div>

      <div className="chartArea">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            cx="50%"
            cy="54%"
            innerRadius="72%"
            outerRadius="92%"
            barSize={14}
            data={data}
            startAngle={210}
            endAngle={-30}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={14} background />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "Probability"]}
              contentStyle={{
                background: "rgba(2, 6, 23, 0.92)",
                border: "1px solid rgba(148, 163, 184, 0.35)",
                borderRadius: 12,
              }}
              labelStyle={{ color: "rgba(255,255,255,0.75)" }}
              itemStyle={{ color: "rgba(255,255,255,0.9)" }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

