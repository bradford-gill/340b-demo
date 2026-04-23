import type { Hospital } from '../data/hospitals';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { getScenarioStats } from '../utils/calculations';

interface RevenueComparisonProps {
  hospital: Hospital;
}

export default function RevenueComparison({ hospital }: RevenueComparisonProps) {
  const scenarios = getScenarioStats(hospital);

  const medicaidRevenueLost = hospital.estimated340bMargin * 0.11;
  const selfPayIncrease = hospital.estimated340bMargin * 0.06;
  const medicaidRevenueLostWith = medicaidRevenueLost * 0.24;
  const selfPayIncreaseWith = selfPayIncrease * 0.19;

  const withoutTotal = (scenarios.noIntervention.revenueImpact || -hospital.estimated340bMargin) - medicaidRevenueLost - selfPayIncrease;
  const withTotal = -medicaidRevenueLostWith - selfPayIncreaseWith;
  const savings = Math.abs(withoutTotal - withTotal);

  const rows = [
    {
      label: 'Projected DPP (12 months)',
      without: formatPercent(scenarios.noIntervention.projectedDPP, 1),
      with: formatPercent(scenarios.targetedIntervention.projectedDPP, 1),
    },
    {
      label: '340B qualification',
      without: scenarios.noIntervention.status,
      with: scenarios.targetedIntervention.status,
      withoutClass: 'text-danger-text font-semibold',
      withClass: 'text-safe-text font-semibold',
    },
    {
      label: '340B margin impact',
      without: `-${formatCurrency(hospital.estimated340bMargin)}`,
      with: '$0',
      withoutClass: 'text-danger-text',
      withClass: 'text-safe-text',
    },
    {
      label: 'Medicaid revenue lost to churn',
      without: `-${formatCurrency(medicaidRevenueLost)}`,
      with: `-${formatCurrency(medicaidRevenueLostWith)}`,
    },
    {
      label: 'Self-pay bad debt increase',
      without: `+${formatCurrency(selfPayIncrease)}`,
      with: `+${formatCurrency(selfPayIncreaseWith)}`,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-danger-bg border border-danger-border rounded-xl p-6">
          <div className="text-[13px] font-medium tracking-[0.02em] uppercase text-danger-text mb-6">
            Without intervention
          </div>
          {rows.map((row, i) => (
            <div key={i} className="flex justify-between items-baseline py-2.5 border-b border-border-subtle last:border-b-0">
              <span className="text-sm text-content-tertiary">{row.label}</span>
              <span className={`font-mono text-sm ${row.withoutClass || 'text-content-secondary'}`}>{row.without}</span>
            </div>
          ))}
          <div className="border-t-2 border-danger-border pt-4 mt-4 flex justify-between items-baseline">
            <span className="text-sm font-medium text-content-secondary">Net financial impact</span>
            <span className="font-mono text-xl font-bold text-danger-text">{formatCurrency(withoutTotal)}</span>
          </div>
        </div>

        <div className="bg-safe-bg border border-safe-border rounded-xl p-6">
          <div className="text-[13px] font-medium tracking-[0.02em] uppercase text-safe-text mb-6">
            With intervention
          </div>
          {rows.map((row, i) => (
            <div key={i} className="flex justify-between items-baseline py-2.5 border-b border-border-subtle last:border-b-0">
              <span className="text-sm text-content-tertiary">{row.label}</span>
              <span className={`font-mono text-sm ${row.withClass || 'text-content-secondary'}`}>{row.with}</span>
            </div>
          ))}
          <div className="border-t-2 border-safe-border pt-4 mt-4 flex justify-between items-baseline">
            <span className="text-sm font-medium text-content-secondary">Net financial impact</span>
            <span className="font-mono text-xl font-bold text-safe-text">{formatCurrency(withTotal)}</span>
          </div>
        </div>
      </div>

      <div className="text-center py-6">
        <div className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-2">
          Potential savings
        </div>
        <div className="font-mono text-5xl font-bold text-safe-text">
          {formatCurrency(savings)}
        </div>
      </div>
    </div>
  );
}
