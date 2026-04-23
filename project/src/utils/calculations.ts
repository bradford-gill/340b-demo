import type { Hospital } from '../data/hospitals';

export interface ProjectionPoint {
  month: number;
  label: string;
  noIntervention: number;
  basicOutreach: number;
  targetedIntervention: number;
  custom: number;
}

const BASE_PROCEDURAL_CHURN_RATE = 0.04;
const WORK_REQUIREMENT_IMPACT = 0.3;
const AVG_DAYS_PER_PATIENT = 4;

export function projectDPP(
  hospital: Hospital,
  interventionLevel: number
): ProjectionPoint[] {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const churnRate = BASE_PROCEDURAL_CHURN_RATE * (1 + WORK_REQUIREMENT_IMPACT);
  const atRiskPatients = hospital.patientsDueRedetermination;

  const points: ProjectionPoint[] = [];

  let cumLostNone = 0;
  let cumLostBasic = 0;
  let cumLostTargeted = 0;
  let cumLostCustom = 0;

  for (let m = 0; m < 12; m++) {
    const monthlyAtRisk = atRiskPatients / 12;

    cumLostNone += monthlyAtRisk * churnRate * 1.0;
    cumLostBasic += monthlyAtRisk * churnRate * 0.6;
    cumLostTargeted += monthlyAtRisk * churnRate * 0.22;
    cumLostCustom += monthlyAtRisk * churnRate * (1 - interventionLevel);

    const daysLostNone = cumLostNone * AVG_DAYS_PER_PATIENT;
    const daysLostBasic = cumLostBasic * AVG_DAYS_PER_PATIENT;
    const daysLostTargeted = cumLostTargeted * AVG_DAYS_PER_PATIENT;
    const daysLostCustom = cumLostCustom * AVG_DAYS_PER_PATIENT;

    const calcDPP = (daysLost: number) => {
      const newMedicaidDays = Math.max(0, hospital.medicaidDays - daysLost);
      const medicaidFraction = (newMedicaidDays / hospital.totalPatientDays) * 100;
      return hospital.medicareSsiFraction + medicaidFraction;
    };

    points.push({
      month: m + 1,
      label: months[m],
      noIntervention: Number(calcDPP(daysLostNone).toFixed(2)),
      basicOutreach: Number(calcDPP(daysLostBasic).toFixed(2)),
      targetedIntervention: Number(calcDPP(daysLostTargeted).toFixed(2)),
      custom: Number(calcDPP(daysLostCustom).toFixed(2)),
    });
  }

  return points;
}

export function getMonth12DPP(hospital: Hospital, interventionLevel: number): number {
  const points = projectDPP(hospital, interventionLevel);
  return points[11].custom;
}

export function getPatientsNeededToRetain(hospital: Hospital): number {
  const threshold = 11.75;
  const currentMedicaidFraction = hospital.medicaidFraction;
  const targetMedicaidFraction = threshold - hospital.medicareSsiFraction;

  if (targetMedicaidFraction <= 0) return 0;

  const medicaidDaysNeeded = (targetMedicaidFraction / 100) * hospital.totalPatientDays;
  const daysSurplus = hospital.medicaidDays - medicaidDaysNeeded;

  if (daysSurplus <= 0) return 0;

  const churnRate = BASE_PROCEDURAL_CHURN_RATE * (1 + WORK_REQUIREMENT_IMPACT);
  const totalChurnPatients = (hospital.patientsDueRedetermination * churnRate * 12) / 12 * 12;
  const daysAtRisk = totalChurnPatients * AVG_DAYS_PER_PATIENT;

  if (daysAtRisk <= daysSurplus) return 0;

  const excessDaysLoss = daysAtRisk - daysSurplus;
  return Math.ceil(excessDaysLoss / AVG_DAYS_PER_PATIENT);
}

export function getScenarioStats(hospital: Hospital) {
  const points = projectDPP(hospital, 0);
  const pointsBasic = projectDPP(hospital, 0.4);
  const pointsTargeted = projectDPP(hospital, 0.8);

  const threshold = 11.75;
  const churnRate = BASE_PROCEDURAL_CHURN_RATE * (1 + WORK_REQUIREMENT_IMPACT);
  const totalAtRisk = hospital.patientsDueRedetermination;

  const noInterventionLost = Math.round(totalAtRisk * churnRate * 12 / 12 * 12);
  const basicLost = Math.round(noInterventionLost * 0.6);
  const targetedLost = Math.round(noInterventionLost * 0.22);

  return {
    noIntervention: {
      projectedDPP: points[11].noIntervention,
      status: points[11].noIntervention >= threshold ? 'AT RISK' : 'LOST',
      patientsLost: noInterventionLost,
      revenueImpact: points[11].noIntervention < threshold ? -hospital.estimated340bMargin : 0,
    },
    basicOutreach: {
      projectedDPP: pointsBasic[11].basicOutreach,
      status: pointsBasic[11].basicOutreach >= threshold ? 'PROTECTED' : pointsBasic[11].basicOutreach >= threshold - 0.2 ? 'AT RISK' : 'LOST',
      patientsLost: basicLost,
      revenueImpact: pointsBasic[11].basicOutreach < threshold ? -hospital.estimated340bMargin : 0,
    },
    targetedIntervention: {
      projectedDPP: pointsTargeted[11].targetedIntervention,
      status: pointsTargeted[11].targetedIntervention >= threshold ? 'PROTECTED' : 'AT RISK',
      patientsLost: targetedLost,
      revenueImpact: pointsTargeted[11].targetedIntervention < threshold ? -hospital.estimated340bMargin : 0,
    },
  };
}

export function willCrossThreshold(hospital: Hospital, interventionLevel: number): boolean {
  const points = projectDPP(hospital, interventionLevel);
  return points.some(p => p.custom < 11.75);
}
