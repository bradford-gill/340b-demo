import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import type { Hospital } from '../data/hospitals';
import { projectDPP } from '../utils/calculations';

const COLORS = {
  grid: 'var(--chart-grid)',
  axisText: 'var(--content-quaternary)',
  axisLine: 'var(--border-default)',
  tooltipBg: 'var(--app-elevated)',
  tooltipBorder: 'var(--border-default)',
  tooltipText: 'var(--content-primary)',
  shadow: 'var(--chart-shadow)',
  threshold: 'var(--danger-solid)',
  thresholdLabel: 'var(--danger-text)',
  noIntervention: 'var(--danger-solid)',
  basicOutreach: 'var(--warning-solid)',
  targeted: 'var(--safe-solid)',
  activeDotFill: 'var(--content-primary)',
  activeDotStroke: 'var(--border-focus)',
};

function getScenarioLineColor(level: number): string {
  if (level > 0.6) return COLORS.targeted;
  if (level > 0.3) return COLORS.basicOutreach;
  return COLORS.noIntervention;
}

interface DPPChartProps {
  hospital: Hospital;
  interventionLevel: number;
  height?: number;
  showScenarioLines?: boolean;
}

export default function DPPChart({ hospital, interventionLevel, height = 320, showScenarioLines = true }: DPPChartProps) {
  const data = useMemo(
    () => projectDPP(hospital, interventionLevel),
    [hospital, interventionLevel]
  );

  const allValues = data.flatMap((d) => [
    d.noIntervention,
    d.basicOutreach,
    d.targetedIntervention,
    d.custom,
  ]);
  const minY = Math.floor(Math.min(...allValues, 11.75) * 2) / 2 - 0.5;
  const maxY = Math.ceil(Math.max(...allValues, 11.75) * 2) / 2 + 0.5;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={COLORS.grid}
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: COLORS.axisText, fontSize: 12 }}
          axisLine={{ stroke: COLORS.axisLine }}
          tickLine={false}
        />
        <YAxis
          domain={[minY, maxY]}
          tick={{ fill: COLORS.axisText, fontSize: 12, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: COLORS.tooltipBg,
            border: `1px solid ${COLORS.tooltipBorder}`,
            borderRadius: '8px',
            boxShadow: `0 4px 16px ${COLORS.shadow}`,
            fontFamily: 'Inter',
            fontSize: '13px',
            color: COLORS.tooltipText,
          }}
          formatter={(value: number, name: string) => {
            const labels: Record<string, string> = {
              noIntervention: 'No intervention',
              basicOutreach: 'Basic outreach',
              targetedIntervention: 'Targeted intervention',
              custom: 'Current scenario',
            };
            return [`${value.toFixed(2)}%`, labels[name] || name];
          }}
        />
        <ReferenceLine
          y={11.75}
          stroke={COLORS.threshold}
          strokeDasharray="8 4"
          strokeWidth={2}
          label={{
            value: '340B Threshold: 11.75%',
            position: 'right',
            fill: COLORS.thresholdLabel,
            fontSize: 12,
            fontFamily: 'JetBrains Mono',
          }}
        />
        {showScenarioLines && (
          <>
            <Line
              type="monotone"
              dataKey="noIntervention"
              stroke={COLORS.noIntervention}
              strokeWidth={1.5}
              strokeOpacity={0.4}
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="basicOutreach"
              stroke={COLORS.basicOutreach}
              strokeWidth={1.5}
              strokeDasharray="6 3"
              strokeOpacity={0.4}
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="targetedIntervention"
              stroke={COLORS.targeted}
              strokeWidth={1.5}
              strokeOpacity={0.4}
              dot={false}
              activeDot={false}
            />
          </>
        )}
        <Line
          type="monotone"
          dataKey="custom"
          stroke={getScenarioLineColor(interventionLevel)}
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5, fill: COLORS.activeDotFill, stroke: COLORS.activeDotStroke, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
