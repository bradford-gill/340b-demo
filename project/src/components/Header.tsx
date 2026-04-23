import { Shield, ChevronDown } from 'lucide-react';
import { hospitals, type Hospital } from '../data/hospitals';
import { daysUntilOBBBA, formatNumber } from '../utils/formatters';

interface HeaderProps {
  selectedHospital: Hospital;
  onSelectHospital: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'threshold', label: 'Threshold risk' },
  { id: 'patients', label: 'Patient priority' },
  { id: 'command', label: 'Command center' },
];

export default function Header({ selectedHospital, onSelectHospital, activeTab, onTabChange }: HeaderProps) {
  const countdown = daysUntilOBBBA();
  const urgencyClass = countdown < 180 ? 'text-danger-text' : countdown < 365 ? 'text-warning-text' : 'text-safe-text';

  return (
    <header className="sticky top-0 z-50 bg-app-bg border-b border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-info-solid" />
            <span className="text-lg font-semibold text-content-primary tracking-tight">340B Guardian</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <select
                value={selectedHospital.id}
                onChange={(e) => onSelectHospital(e.target.value)}
                className="appearance-none bg-app-input border border-border-default rounded-lg px-4 py-2 pr-10 text-sm text-content-secondary cursor-pointer focus:outline-none focus:border-border-focus"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id} className="bg-app-surface">
                    {h.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary pointer-events-none" />
            </div>

            <div className="bg-app-elevated rounded-lg px-4 py-2 flex items-center gap-3">
              <span className={`font-mono text-xl font-semibold ${urgencyClass}`}>{countdown}</span>
              <div className="text-xs text-content-quaternary max-w-[180px] leading-tight">
                days until OBBBA redetermination takes effect
              </div>
            </div>

            <div className="text-xs text-content-muted max-w-[200px] leading-tight">
              {formatNumber(selectedHospital.patientsDueRedetermination)} patients at this hospital will need to redetermine eligibility
            </div>
          </div>
        </div>

        <nav className="flex h-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 text-sm font-medium transition-colors duration-150 border-b-2 ${
                activeTab === tab.id
                  ? 'text-content-primary border-info-solid'
                  : 'text-content-muted border-transparent hover:text-content-tertiary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
