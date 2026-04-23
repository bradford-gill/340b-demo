import { useState, useMemo } from 'react';
import type { Hospital } from '../data/hospitals';
import DPPChart from './DPPChart';
import { projectDPP, getScenarioStats, willCrossThreshold } from '../utils/calculations';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

interface ThresholdRiskProps {
  hospital: Hospital;
}

export default function ThresholdRisk({ hospital }: ThresholdRiskProps) {
  const [interventionLevel, setInterventionLevel] = useState(0);

  const projection = useMemo(
    () => projectDPP(hospital, interventionLevel),
    [hospital, interventionLevel]
  );
  const month12DPP = projection[11].custom;
  const crossesThreshold = willCrossThreshold(hospital, interventionLevel);
  const scenarios = useMemo(() => getScenarioStats(hospital), [hospital]);

  const atRisk = crossesThreshold;

  const churnRate = 0.04 * 1.3;
  const totalChurnNoIntervention = Math.round(hospital.patientsDueRedetermination * churnRate);
  const patientsNeeded = (() => {
    const threshold = 11.75;
    const projNoIntervention = projectDPP(hospital, 0);
    const dppDrop = hospital.currentDPP - projNoIntervention[11].noIntervention;
    const dppBuffer = hospital.currentDPP - threshold;
    if (dppDrop <= dppBuffer) return 0;
    const dppPerPatient = dppDrop / totalChurnNoIntervention;
    return Math.ceil((dppDrop - dppBuffer) / dppPerPatient);
  })();

  const perPatientValue = patientsNeeded > 0 ? hospital.estimated340bMargin / patientsNeeded : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-content-primary mb-1">DPP trajectory forecast</h2>
        <p className="text-sm text-content-tertiary">
          Projected disproportionate patient percentage over the next 12 months under OBBBA redetermination rules
        </p>
      </div>

      <div className="bg-app-surface border border-border-subtle rounded-xl p-6">
        <DPPChart hospital={hospital} interventionLevel={interventionLevel} height={340} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-content-secondary">Intervention level</label>
          <span className="font-mono text-sm text-content-secondary">{Math.round(interventionLevel * 100)}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(interventionLevel * 100)}
            onChange={(e) => setInterventionLevel(Number(e.target.value) / 100)}
            className="w-full"
            style={{
              background: 'linear-gradient(to right, var(--danger-solid), var(--warning-solid), var(--safe-solid))',
            }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-content-muted">No intervention</span>
            <span className="text-xs text-content-muted">Full intervention</span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl p-8 text-center transition-all duration-500 ${
          atRisk
            ? 'bg-danger-bg border border-danger-border'
            : 'bg-safe-bg border border-safe-border'
        }`}
      >
        <div className={`text-[13px] font-medium tracking-[0.02em] uppercase mb-3 transition-colors duration-500 ${atRisk ? 'text-danger-text' : 'text-safe-text'}`}>
          340B margin at risk
        </div>
        <div className={`font-mono text-5xl font-bold tracking-tight transition-colors duration-500 ${atRisk ? 'text-danger-text' : 'text-safe-text'}`}>
          {atRisk ? formatCurrency(hospital.estimated340bMargin) : '$0'}
        </div>
        <div className={`text-[13px] font-medium tracking-[0.02em] uppercase mt-3 transition-colors duration-500 ${atRisk ? 'text-danger-text' : 'text-safe-text'}`}>
          {atRisk ? 'At risk of total loss' : '340B status protected'}
        </div>
        {patientsNeeded > 0 && (
          <div className="mt-6 space-y-1">
            <div className="text-sm text-content-secondary">
              Retain <span className="font-mono font-semibold text-content-primary">{formatNumber(patientsNeeded)}</span> patients to protect 340B margin
            </div>
            <div className="text-xs font-mono text-content-muted">
              Value per patient retained: {formatCurrency(perPatientValue)}
            </div>
          </div>
        )}
        <div className="mt-4 text-sm text-content-tertiary">
          Projected DPP at month 12: <span className="font-mono font-medium text-content-secondary">{formatPercent(month12DPP, 2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {([
          { key: 'noIntervention' as const, label: 'No intervention', color: 'danger' },
          { key: 'basicOutreach' as const, label: 'Basic outreach', color: 'warning' },
          { key: 'targetedIntervention' as const, label: 'Targeted intervention', color: 'safe' },
        ] as const).map(({ key, label, color }) => {
          const s = scenarios[key];
          const statusColors: Record<string, string> = {
            LOST: 'bg-danger-surface text-danger-text',
            'AT RISK': 'bg-warning-surface text-warning-text',
            PROTECTED: 'bg-safe-surface text-safe-text',
          };
          const borderColors: Record<string, string> = {
            danger: 'border-l-danger-solid',
            warning: 'border-l-warning-solid',
            safe: 'border-l-safe-solid',
          };
          return (
            <div
              key={key}
              className={`bg-app-surface border border-border-subtle border-l-[3px] ${borderColors[color]} rounded-xl p-5`}
            >
              <div className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-4">
                {label}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-content-muted">Projected DPP</span>
                  <span className="font-mono text-sm font-medium text-content-secondary">{formatPercent(s.projectedDPP, 1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-content-muted">340B status</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColors[s.status]}`}>{s.status}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-content-muted">Patients lost</span>
                  <span className="font-mono text-sm text-content-secondary">{formatNumber(s.patientsLost)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-border-subtle">
                  <span className="text-xs text-content-muted">Revenue impact</span>
                  <span className={`font-mono text-sm font-semibold ${s.revenueImpact < 0 ? 'text-danger-text' : 'text-safe-text'}`}>
                    {s.revenueImpact < 0 ? `-${formatCurrency(Math.abs(s.revenueImpact))}` : '$0'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
