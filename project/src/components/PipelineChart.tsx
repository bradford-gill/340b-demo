import type { Hospital } from '../data/hospitals';

interface PipelineChartProps {
  hospital: Hospital;
}

export default function PipelineChart({ hospital }: PipelineChartProps) {
  const total = hospital.patientsDueRedetermination;

  const segments = [
    { label: 'Auto-renewed (ex parte)', count: Math.round(total * 0.23), color: 'bg-safe-solid' },
    { label: 'Outreach in progress', count: Math.round(total * 0.17), color: 'bg-info-solid' },
    { label: 'Awaiting patient response', count: Math.round(total * 0.16), color: 'bg-warning-solid' },
    { label: 'Exemption docs pending', count: Math.round(total * 0.10), color: 'bg-warning-solid/60' },
    { label: 'Not yet contacted', count: Math.round(total * 0.34), color: 'bg-danger-solid' },
  ];

  return (
    <div className="bg-app-surface border border-border-subtle rounded-xl p-6">
      <h3 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-4">
        Redetermination pipeline
      </h3>
      <div className="text-sm text-content-tertiary mb-4">
        Total patients due (next 90 days): <span className="font-mono text-content-secondary font-medium">{total.toLocaleString()}</span>
      </div>

      <div className="flex h-8 rounded-lg overflow-hidden mb-4">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all`}
            style={{ width: `${(seg.count / total) * 100}%` }}
            title={`${seg.label}: ${seg.count}`}
          />
        ))}
      </div>

      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${seg.color}`} />
              <span className="text-sm text-content-tertiary">{seg.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-content-secondary">{seg.count.toLocaleString()}</span>
              <span className="font-mono text-xs text-content-muted w-10 text-right">
                {Math.round((seg.count / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
