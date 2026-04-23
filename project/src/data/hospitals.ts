export interface Hospital {
  id: string;
  name: string;
  beds: number;
  location: string;
  currentDPP: number;
  medicareSsiFraction: number;
  medicaidFraction: number;
  totalMedicareDays: number;
  totalPatientDays: number;
  medicaidDays: number;
  annual340bPurchases: number;
  estimated340bMargin: number;
  acaExpansionPatients: number;
  patientsDueRedetermination: number;
  status: 'at-risk' | 'below' | 'comfortable';
  statusLabel: string;
}

export const hospitals: Hospital[] = [
  {
    id: 'mercy-general',
    name: 'Mercy General Medical Center',
    beds: 247,
    location: 'Urban',
    currentDPP: 12.14,
    medicareSsiFraction: 5.42,
    medicaidFraction: 6.72,
    totalMedicareDays: 38400,
    totalPatientDays: 89200,
    medicaidDays: 5994,
    annual340bPurchases: 52000000,
    estimated340bMargin: 34200000,
    acaExpansionPatients: 2847,
    patientsDueRedetermination: 1847,
    status: 'at-risk',
    statusLabel: 'At risk',
  },
  {
    id: 'valley-community',
    name: 'Valley Community Hospital',
    beds: 142,
    location: 'Suburban',
    currentDPP: 11.41,
    medicareSsiFraction: 4.89,
    medicaidFraction: 6.52,
    totalMedicareDays: 22100,
    totalPatientDays: 51800,
    medicaidDays: 3377,
    annual340bPurchases: 28000000,
    estimated340bMargin: 18700000,
    acaExpansionPatients: 1420,
    patientsDueRedetermination: 923,
    status: 'below',
    statusLabel: 'Below threshold',
  },
  {
    id: 'regional-health',
    name: 'Regional Health System',
    beds: 412,
    location: 'Urban',
    currentDPP: 14.82,
    medicareSsiFraction: 6.91,
    medicaidFraction: 7.91,
    totalMedicareDays: 64200,
    totalPatientDays: 148600,
    medicaidDays: 11754,
    annual340bPurchases: 98000000,
    estimated340bMargin: 67400000,
    acaExpansionPatients: 4210,
    patientsDueRedetermination: 2737,
    status: 'comfortable',
    statusLabel: 'Comfortable',
  },
];
