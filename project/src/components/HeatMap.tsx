import { useMemo } from 'react';
import type { Patient } from '../data/patients';

interface HeatMapProps {
  patients: Patient[];
}

export default function HeatMap({ patients }: HeatMapProps) {
  const zipData = useMemo(() => {
    const counts: Record<string, { total: number; highRisk: number }> = {};
    patients.forEach((p) => {
      if (!counts[p.zipCode]) counts[p.zipCode] = { total: 0, highRisk: 0 };
      counts[p.zipCode].total++;
      if (p.riskLevel === 'High') counts[p.zipCode].highRisk++;
    });
    return Object.entries(counts)
      .map(([zip, data]) => ({ zip, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [patients]);

  const maxTotal = Math.max(...zipData.map((d) => d.total));

  return (
    <div>
      <h3 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-4">
        At-risk patients by zip code
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {zipData.map(({ zip, total, highRisk }) => {
          const intensity = total / maxTotal;
          const bgColor =
            intensity > 0.7
              ? 'bg-danger-surface border-danger-border'
              : intensity > 0.4
                ? 'bg-warning-surface border-warning-border'
                : 'bg-safe-surface border-safe-border';
          return (
            <div key={zip} className={`${bgColor} border rounded-lg p-3 text-center`}>
              <div className="font-mono text-sm font-medium text-content-secondary">{zip}</div>
              <div className="font-mono text-lg font-semibold text-content-primary mt-1">{total}</div>
              <div className="text-xs text-content-tertiary mt-0.5">
                {highRisk} high risk
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-safe-surface border border-safe-border" />
          <span className="text-xs text-content-muted">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-warning-surface border border-warning-border" />
          <span className="text-xs text-content-muted">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-danger-surface border border-danger-border" />
          <span className="text-xs text-content-muted">High</span>
        </div>
      </div>
    </div>
  );
}
