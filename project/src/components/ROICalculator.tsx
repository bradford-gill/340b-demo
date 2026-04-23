import { useState } from 'react';
import type { Hospital } from '../data/hospitals';
import { formatCurrency } from '../utils/formatters';

interface ROICalculatorProps {
  hospital: Hospital;
}

export default function ROICalculator({ hospital }: ROICalculatorProps) {
  const [costPerAttempt, setCostPerAttempt] = useState(45);
  const [attemptsPerPatient, setAttemptsPerPatient] = useState(2.3);

  const totalPatients = hospital.patientsDueRedetermination;
  const totalCost = costPerAttempt * attemptsPerPatient * totalPatients;
  const marginProtected = hospital.estimated340bMargin;
  const roi = Math.round(marginProtected / totalCost);

  return (
    <div className="bg-app-surface border border-border-subtle rounded-xl p-6">
      <h3 className="text-[13px] font-medium tracking-[0.02em] uppercase text-content-tertiary mb-6">
        Outreach ROI calculator
      </h3>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-xs text-content-muted block mb-2">Cost per outreach attempt</label>
          <div className="flex items-center gap-2">
            <span className="text-content-tertiary">$</span>
            <input
              type="number"
              value={costPerAttempt}
              onChange={(e) => setCostPerAttempt(Number(e.target.value) || 0)}
              className="bg-app-input border border-border-default rounded-lg px-3 py-2 font-mono text-sm text-content-secondary w-24 focus:outline-none focus:border-border-focus"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-content-muted block mb-2">Average attempts per patient</label>
          <input
            type="number"
            step="0.1"
            value={attemptsPerPatient}
            onChange={(e) => setAttemptsPerPatient(Number(e.target.value) || 0)}
            className="bg-app-input border border-border-default rounded-lg px-3 py-2 font-mono text-sm text-content-secondary w-24 focus:outline-none focus:border-border-focus"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-app-elevated rounded-lg p-4 text-center">
          <div className="text-xs text-content-muted mb-1">Total outreach cost</div>
          <div className="font-mono text-lg font-semibold text-content-secondary">{formatCurrency(totalCost)}</div>
        </div>
        <div className="bg-app-elevated rounded-lg p-4 text-center">
          <div className="text-xs text-content-muted mb-1">340B margin protected</div>
          <div className="font-mono text-lg font-semibold text-safe-text">{formatCurrency(marginProtected)}</div>
        </div>
        <div className="bg-app-elevated rounded-lg p-4 text-center">
          <div className="text-xs text-content-muted mb-1">Return on investment</div>
          <div className="font-mono text-2xl font-bold text-safe-text">{roi}:1</div>
        </div>
      </div>
    </div>
  );
}
