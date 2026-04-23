import { useState, useMemo } from 'react';
import type { Patient } from '../data/patients';
import { daysUntil } from '../utils/formatters';

function exportCallList(patients: Patient[]) {
  const headers = ['Rank', 'Name', 'Medicaid ID', 'Recert Deadline', 'Days Left', 'Risk Level', 'Exemption Status', 'DSH Impact', 'Recommended Action'];
  const rows = patients.map((p) => [
    p.priorityRank,
    p.name,
    p.medicaidId,
    p.nextRedetermination,
    daysUntil(p.nextRedetermination),
    p.riskLevel,
    p.exemptionStatus,
    `${p.dshImpactIfLost.toFixed(4)}%`,
    `"${p.suggestedAction}"`,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `340b-priority-call-list-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatientId: string | null;
}

type SortKey = 'priorityRank' | 'name' | 'nextRedetermination' | 'daysUntilDeadline' | 'inpatientDays12mo' | 'riskScore' | 'dshImpactIfLost';
type SortDir = 'asc' | 'desc';

interface Filters {
  riskLevel: string;
  exemptionStatus: string;
  deadline: string;
  search: string;
}

const riskColors: Record<string, string> = {
  High: 'bg-danger-surface text-danger-text',
  Medium: 'bg-warning-surface text-warning-text',
  Low: 'bg-safe-surface text-safe-text',
};

const exemptionColors: Record<string, string> = {
  'Likely exempt': 'bg-info-surface text-info-text',
  'Exempt documented': 'bg-safe-surface text-safe-text',
  'Not exempt': 'bg-warning-surface text-warning-text',
  Unknown: 'bg-app-elevated text-content-tertiary',
};

function daysColor(days: number): string {
  if (days <= 30) return 'text-danger-text';
  if (days <= 60) return 'text-warning-text';
  return 'text-content-secondary';
}

export default function PatientTable({ patients, onSelectPatient, selectedPatientId }: PatientTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('priorityRank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filters, setFilters] = useState<Filters>({
    riskLevel: 'All',
    exemptionStatus: 'All',
    deadline: 'All',
    search: '',
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...patients];

    if (filters.riskLevel !== 'All') {
      result = result.filter((p) => p.riskLevel === filters.riskLevel);
    }
    if (filters.exemptionStatus !== 'All') {
      result = result.filter((p) => p.exemptionStatus === filters.exemptionStatus);
    }
    if (filters.deadline !== 'All') {
      const days = filters.deadline === 'Next 30 days' ? 30 : filters.deadline === 'Next 60 days' ? 60 : 90;
      result = result.filter((p) => daysUntil(p.nextRedetermination) <= days);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.medicaidId.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortKey) {
        case 'name': aVal = a.name; bVal = b.name; break;
        case 'nextRedetermination': aVal = a.nextRedetermination; bVal = b.nextRedetermination; break;
        case 'daysUntilDeadline': aVal = daysUntil(a.nextRedetermination); bVal = daysUntil(b.nextRedetermination); break;
        case 'inpatientDays12mo': aVal = a.inpatientDays12mo; bVal = b.inpatientDays12mo; break;
        case 'riskScore': aVal = a.riskScore; bVal = b.riskScore; break;
        case 'dshImpactIfLost': aVal = a.dshImpactIfLost; bVal = b.dshImpactIfLost; break;
        default: aVal = a.priorityRank; bVal = b.priorityRank;
      }

      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [patients, filters, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="text-content-faint ml-1">{'\u21D5'}</span>;
    return <span className="text-info-text ml-1">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  };

  return (
    <div>
      <div className="bg-app-surface border border-border-subtle rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap">
        <select
          value={filters.riskLevel}
          onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
          className="bg-app-input border border-border-default rounded-lg px-3 py-2 text-[13px] text-content-secondary focus:outline-none focus:border-border-focus"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={filters.exemptionStatus}
          onChange={(e) => setFilters({ ...filters, exemptionStatus: e.target.value })}
          className="bg-app-input border border-border-default rounded-lg px-3 py-2 text-[13px] text-content-secondary focus:outline-none focus:border-border-focus"
        >
          <option>All</option>
          <option>Likely exempt</option>
          <option>Exempt documented</option>
          <option>Not exempt</option>
          <option>Unknown</option>
        </select>
        <select
          value={filters.deadline}
          onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}
          className="bg-app-input border border-border-default rounded-lg px-3 py-2 text-[13px] text-content-secondary focus:outline-none focus:border-border-focus"
        >
          <option>All</option>
          <option>Next 30 days</option>
          <option>Next 60 days</option>
          <option>Next 90 days</option>
        </select>
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-app-input border border-border-default rounded-lg px-3 py-2 text-[13px] text-content-secondary placeholder-content-muted focus:outline-none focus:border-border-focus"
          />
        </div>
        <div className="text-xs text-content-muted">
          {filtered.length} of {patients.length} patients
        </div>
        <button
          onClick={() => exportCallList(filtered)}
          className="ml-auto shrink-0 bg-info-solid hover:opacity-90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-opacity"
        >
          Export call list
        </button>
      </div>

      <div className="bg-app-surface border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-app-elevated border-b border-border-default">
                {[
                  { key: 'priorityRank' as SortKey, label: 'Rank', w: 'w-16' },
                  { key: 'name' as SortKey, label: 'Patient', w: 'w-44' },
                  { key: 'nextRedetermination' as SortKey, label: 'Recert deadline', w: 'w-32' },
                  { key: 'daysUntilDeadline' as SortKey, label: 'Days left', w: 'w-24' },
                  { key: 'inpatientDays12mo' as SortKey, label: 'IP days', w: 'w-20' },
                  { key: 'riskScore' as SortKey, label: 'DSH impact', w: 'w-24' },
                ].map(({ key, label, w }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`${w} px-3 py-3 text-left text-[11px] font-medium tracking-[0.05em] uppercase text-content-quaternary cursor-pointer select-none hover:text-content-secondary`}
                  >
                    {label}<SortIcon column={key} />
                  </th>
                ))}
                <th className="w-24 px-3 py-3 text-left text-[11px] font-medium tracking-[0.05em] uppercase text-content-quaternary">Risk</th>
                <th className="w-32 px-3 py-3 text-left text-[11px] font-medium tracking-[0.05em] uppercase text-content-quaternary">Exemption</th>
                <th className="w-48 px-3 py-3 text-left text-[11px] font-medium tracking-[0.05em] uppercase text-content-quaternary">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const days = daysUntil(p.nextRedetermination);
                const isSelected = p.id === selectedPatientId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPatient(p)}
                    className={`border-b border-border-subtle cursor-pointer transition-colors duration-100 ${
                      isSelected ? 'bg-info-bg border-l-[3px] border-l-info-solid' : 'hover:bg-app-elevated'
                    }`}
                  >
                    <td className="px-3 py-2.5 font-mono text-[13px] text-content-tertiary">{p.priorityRank}</td>
                    <td className="px-3 py-2.5">
                      <div className="text-[13px] text-content-secondary truncate max-w-[160px]">{p.name}</div>
                      <div className="font-mono text-[11px] text-content-muted">{p.medicaidId}</div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-content-secondary">{p.nextRedetermination}</td>
                    <td className={`px-3 py-2.5 font-mono text-[13px] text-right ${daysColor(days)}`}>
                      {days}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-right text-content-secondary">{p.inpatientDays12mo}</td>
                    <td className="px-3 py-2.5 font-mono text-[13px] text-right text-danger-text">{p.dshImpactIfLost.toFixed(4)}%</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${riskColors[p.riskLevel]}`}>{p.riskLevel}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${exemptionColors[p.exemptionStatus]}`}>
                        {p.exemptionStatus === 'Exempt documented' ? 'Documented' : p.exemptionStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-content-tertiary truncate max-w-[180px]">{p.suggestedAction}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
