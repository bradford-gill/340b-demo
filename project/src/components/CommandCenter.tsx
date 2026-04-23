import { useMemo } from 'react';
import type { Hospital } from '../data/hospitals';
import { patients } from '../data/patients';
import MetricCard from './MetricCard';
import DPPChart from './DPPChart';
import PipelineChart from './PipelineChart';
import RevenueComparison from './RevenueComparison';
import ROICalculator from './ROICalculator';
import { formatCurrency, formatPercent, formatNumber, daysUntil } from '../utils/formatters';
import { projectDPP } from '../utils/calculations';

interface CommandCenterProps {
  hospital: Hospital;
}

export default function CommandCenter({ hospital }: CommandCenterProps) {
  const projection = useMemo(() => projectDPP(hospital, 0), [hospital]);
  const thresholdDistance = hospital.currentDPP - 11.75;
  const patientsAbove = Math.round(thresholdDistance / (hospital.currentDPP / hospital.patientsDueRedetermination) * 10);

  const hospitalPatients = useMemo(() => {
    if (hospital.id === 'mercy-general') return patients;
    const scale = hospital.id === 'valley-community' ? 0.5 : 1.5;
    return patients.slice(0, Math.floor(patients.length * scale));
  }, [hospital]);

  const due60 = hospitalPatients.filter((p) => daysUntil(p.nextRedetermination) <= 60).length;
  const exemptDocumented = hospitalPatients.filter((p) => p.exemptionStatus === 'Exempt documented').length;
  const totalExemptOrLikely = hospitalPatients.filter((p) => p.exemptionStatus === 'Exempt documented' || p.exemptionStatus === 'Likely exempt').length;
  const complianceRate = totalExemptOrLikely > 0 ? Math.round((exemptDocumented / totalExemptOrLikely) * 100) : 0;

  const trendDirection = projection[2].noIntervention < hospital.currentDPP ? 'down' as const : 'up' as const;
  const riskRating = thresholdDistance < 0 ? 'danger' : thresholdDistance < 0.5 ? 'warning' : 'safe';
  const riskLabel = riskRating === 'danger' ? 'Critical' : riskRating === 'warning' ? 'Elevated' : 'Stable';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-content-primary mb-1">Command center</h2>
        <p className="text-sm text-content-tertiary">
          Real-time operational dashboard — monitoring 340B qualification and intervention progress
        </p>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          label="Current DPP"
          value={formatPercent(hospital.currentDPP, 2)}
          trend={{ direction: trendDirection, value: `${trendDirection === 'down' ? '-' : '+'}0.12%`, positive: trendDirection === 'up' }}
          status={riskRating}
        />
        <MetricCard
          label="Threshold distance"
          value={`${thresholdDistance >= 0 ? '+' : ''}${formatPercent(thresholdDistance, 2)}`}
          subtitle={`~${Math.abs(patientsAbove)} patients ${thresholdDistance >= 0 ? 'above' : 'below'}`}
          status={thresholdDistance < 0 ? 'danger' : thresholdDistance < 0.5 ? 'warning' : 'safe'}
        />
        <MetricCard
          label="340B margin (annual)"
          value={formatCurrency(hospital.estimated340bMargin)}
        />
        <MetricCard
          label="Due for recert (60 days)"
          value={formatNumber(due60)}
          subtitle="patients"
          status={due60 > 200 ? 'warning' : 'info'}
        />
        <MetricCard
          label="Work req. compliance"
          value={`${complianceRate}%`}
          subtitle="of exempt patients documented"
          status={complianceRate < 50 ? 'warning' : 'safe'}
        />
        <MetricCard
          label="System risk score"
          value={riskLabel}
          status={riskRating}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-app-surface border border-border-subtle rounded-xl p-6">
          <h3 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-4">
            DPP trend (current trajectory)
          </h3>
          <DPPChart hospital={hospital} interventionLevel={0} height={220} showScenarioLines={false} />
        </div>
        <PipelineChart hospital={hospital} />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-content-primary mb-4">Revenue impact analysis</h3>
        <RevenueComparison hospital={hospital} />
      </div>

      <ROICalculator hospital={hospital} />

      <div className="flex justify-center pb-8">
        <button
          onClick={() => window.print()}
          className="bg-info-solid hover:bg-info-border text-content-primary font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Generate client report
        </button>
      </div>
    </div>
  );
}
