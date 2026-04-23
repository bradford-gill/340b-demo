import { useState, useMemo } from 'react';
import type { Hospital } from '../data/hospitals';
import { patients } from '../data/patients';
import type { Patient } from '../data/patients';
import MetricCard from './MetricCard';
import HeatMap from './HeatMap';
import PatientTable from './PatientTable';
import PatientDetail from './PatientDetail';
import { formatNumber, formatPercent } from '../utils/formatters';

interface PatientPriorityProps {
  hospital: Hospital;
}

export default function PatientPriority({ hospital }: PatientPriorityProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const hospitalPatients = useMemo(() => {
    if (hospital.id === 'mercy-general') return patients;
    const scale = hospital.id === 'valley-community' ? 0.5 : 1.5;
    return patients.slice(0, Math.floor(patients.length * scale));
  }, [hospital]);

  const highRisk = hospitalPatients.filter((p) => p.riskLevel === 'High').length;
  const likelyExempt = hospitalPatients.filter((p) => p.exemptionStatus === 'Likely exempt').length;
  const totalDshImpact = hospitalPatients.reduce((sum, p) => sum + Math.abs(p.dshImpactIfLost), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-content-primary mb-1">Patient priority queue</h2>
        <p className="text-sm text-content-tertiary">
          Patients ranked by DSH impact — retain the highest-impact patients first to protect 340B qualification
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Approaching redetermination"
          value={formatNumber(hospitalPatients.length)}
          subtitle="total patients"
        />
        <MetricCard
          label="High-risk patients"
          value={formatNumber(highRisk)}
          subtitle="likely to churn procedurally"
          status="danger"
        />
        <MetricCard
          label="Likely exempt (undocumented)"
          value={formatNumber(likelyExempt)}
          subtitle="easy wins — file exemption docs"
          status="info"
        />
        <MetricCard
          label="Est. DSH impact if unaddressed"
          value={`-${formatPercent(totalDshImpact * 100, 1)}`}
          subtitle="DPP decline"
          status="warning"
        />
      </div>

      <div className="bg-app-surface border border-border-subtle rounded-xl p-6">
        <HeatMap patients={hospitalPatients} />
      </div>

      <PatientTable
        patients={hospitalPatients}
        onSelectPatient={setSelectedPatient}
        selectedPatientId={selectedPatient?.id ?? null}
      />

      {selectedPatient && (
        <PatientDetail patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}
