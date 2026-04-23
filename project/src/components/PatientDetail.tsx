import { X } from 'lucide-react';
import type { Patient } from '../data/patients';
import { formatDate, daysUntil } from '../utils/formatters';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
}

function Badge({ label, variant }: { label: string; variant: 'danger' | 'warning' | 'safe' | 'info' }) {
  const classes: Record<string, string> = {
    danger: 'bg-danger-surface text-danger-text',
    warning: 'bg-warning-surface text-warning-text',
    safe: 'bg-safe-surface text-safe-text',
    info: 'bg-info-surface text-info-text',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${classes[variant]}`}>{label}</span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-1.5">
      <span className="text-xs text-content-muted">{label}</span>
      <span className="text-[13px] text-content-secondary text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function daysColor(days: number): string {
  if (days <= 30) return 'text-danger-text';
  if (days <= 60) return 'text-warning-text';
  return 'text-safe-text';
}

export default function PatientDetail({ patient, onClose }: PatientDetailProps) {
  const riskVariant = patient.riskLevel === 'High' ? 'danger' : patient.riskLevel === 'Medium' ? 'warning' : 'safe';
  const days = daysUntil(patient.nextRedetermination);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-app-surface border-l border-border-default shadow-[-8px_0_24px_rgba(0,0,0,0.3)] z-[60] overflow-y-auto animate-slideIn">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-content-primary">{patient.name}</h3>
            <span className="font-mono text-xs text-content-muted">{patient.id}</span>
          </div>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge label={patient.riskLevel} variant={riskVariant} />
          <Badge
            label={patient.exemptionStatus}
            variant={patient.exemptionStatus === 'Exempt documented' ? 'safe' : patient.exemptionStatus === 'Likely exempt' ? 'info' : 'warning'}
          />
        </div>

        <section className="mb-6">
          <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Demographics</h4>
          <div className="bg-app-elevated rounded-lg p-4 space-y-0.5">
            <DetailRow label="Date of birth" value={formatDate(patient.dob)} />
            <DetailRow label="Medicaid ID" value={<span className="font-mono">{patient.medicaidId}</span>} />
            <DetailRow label="Zip code" value={<span className="font-mono">{patient.zipCode}</span>} />
            <DetailRow label="Language" value={patient.language} />
            <DetailRow label="Contact preference" value={patient.contactMethod} />
            <DetailRow label="Phone on file" value={patient.phoneOnFile ? 'Yes' : 'No'} />
            <DetailRow label="Address stable" value={patient.addressStable ? 'Yes' : 'No'} />
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Enrollment history</h4>
          <div className="bg-app-elevated rounded-lg p-4 space-y-0.5">
            <DetailRow label="Enrollment date" value={formatDate(patient.enrollmentDate)} />
            <DetailRow label="Last redetermination" value={formatDate(patient.lastRedetermination)} />
            <DetailRow label="Next redetermination" value={formatDate(patient.nextRedetermination)} />
            <DetailRow label="Days until deadline" value={
              <span className={`font-mono ${daysColor(days)}`}>{days}</span>
            } />
            <DetailRow label="Prior disenrollments" value={<span className="font-mono">{patient.priorDisenrollments}</span>} />
            <DetailRow label="Procedural failures" value={<span className="font-mono">{patient.priorProceduralFailures}</span>} />
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Inpatient history</h4>
          <div className="bg-app-elevated rounded-lg p-4 space-y-0.5">
            <DetailRow label="Inpatient days (12mo)" value={<span className="font-mono">{patient.inpatientDays12mo}</span>} />
            <DetailRow label="Outpatient visits (12mo)" value={<span className="font-mono">{patient.outpatientVisits12mo}</span>} />
            <DetailRow label="Admitting units" value={patient.admittingUnits.join(', ')} />
            <DetailRow label="DSH impact if lost" value={
              <span className="font-mono text-danger-text">{patient.dshImpactIfLost.toFixed(4)}%</span>
            } />
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Work requirement</h4>
          <div className="bg-app-elevated rounded-lg p-4 space-y-0.5">
            <DetailRow label="Status" value={patient.workRequirementStatus} />
            {patient.likelyExemptionCategory && (
              <DetailRow label="Exemption category" value={patient.likelyExemptionCategory} />
            )}
            <DetailRow label="Documentation" value={patient.exemptionDocumented ? 'On file' : 'Missing'} />
          </div>
        </section>

        {patient.riskFactors.length > 0 && (
          <section className="mb-6">
            <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Risk factors</h4>
            <div className="flex flex-wrap gap-2">
              {patient.riskFactors.map((f) => (
                <span key={f} className="bg-danger-bg text-danger-text text-xs px-2 py-1 rounded-md">{f}</span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Recommended actions</h4>
          <div className="bg-info-bg border border-info-border rounded-lg p-4">
            <p className="text-sm text-content-secondary leading-relaxed">{patient.suggestedAction}</p>
          </div>
        </section>

        {patient.outreachHistory.length > 0 && (
          <section>
            <h4 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-3">Outreach history</h4>
            <div className="space-y-2">
              {patient.outreachHistory.map((event, i) => (
                <div key={i} className="bg-app-elevated rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-content-muted">{formatDate(event.date)}</span>
                    <span className="text-xs text-content-tertiary ml-2">{event.method}</span>
                  </div>
                  <span className="text-xs text-content-secondary">{event.outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
