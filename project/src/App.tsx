import { useState, useMemo } from 'react';
import { hospitals } from './data/hospitals';
import Header from './components/Header';
import ThresholdRisk from './components/ThresholdRisk';
import PatientPriority from './components/PatientPriority';
import CommandCenter from './components/CommandCenter';

export default function App() {
  const [hospitalId, setHospitalId] = useState(hospitals[0].id);
  const [activeTab, setActiveTab] = useState('threshold');

  const hospital = useMemo(
    () => hospitals.find((h) => h.id === hospitalId) ?? hospitals[0],
    [hospitalId]
  );

  return (
    <div className="min-h-screen bg-app-bg">
      <Header
        selectedHospital={hospital}
        onSelectHospital={setHospitalId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {activeTab === 'threshold' && <ThresholdRisk hospital={hospital} />}
        {activeTab === 'patients' && <PatientPriority hospital={hospital} />}
        {activeTab === 'command' && <CommandCenter hospital={hospital} />}
      </main>
    </div>
  );
}
