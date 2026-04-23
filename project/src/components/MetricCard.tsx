interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: { direction: 'up' | 'down' | 'flat'; value: string; positive?: boolean };
  status?: 'danger' | 'warning' | 'safe' | 'info';
}

export default function MetricCard({ label, value, subtitle, trend, status }: MetricCardProps) {
  const borderClass = status
    ? {
        danger: 'border-l-[3px] border-l-danger-solid',
        warning: 'border-l-[3px] border-l-warning-solid',
        safe: 'border-l-[3px] border-l-safe-solid',
        info: 'border-l-[3px] border-l-info-solid',
      }[status]
    : '';

  const trendColor = trend
    ? trend.positive
      ? 'text-safe-text'
      : 'text-danger-text'
    : '';

  const trendArrow = trend
    ? trend.direction === 'up'
      ? '\u25B2'
      : trend.direction === 'down'
        ? '\u25BC'
        : '\u2014'
    : '';

  return (
    <div
      className={`bg-app-surface border border-border-subtle rounded-xl p-5 min-w-[200px] ${borderClass}`}
    >
      <div className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">
        {label}
      </div>
      <div className="font-mono text-[28px] font-semibold leading-tight tracking-tight text-content-primary">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-content-tertiary mt-1">{subtitle}</div>
      )}
      {trend && (
        <div className={`text-xs mt-2 text-right ${trendColor}`}>
          {trendArrow} {trend.value}
        </div>
      )}
    </div>
  );
}
