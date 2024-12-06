import { PatientVisit, RetentionStatus, RetentionMetrics } from '../types/retention';
import { Patient } from '../types/patient';

const RISK_THRESHOLD_DAYS = 90; // Consider patient at risk if no visit in 90 days
const CHURN_THRESHOLD_DAYS = 180; // Consider patient churned if no visit in 180 days

export function calculateDaysSinceDate(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function determineRetentionStage(lastVisitDate: Date, nextAppointmentDate?: Date): RetentionStatus['retentionStage'] {
  const daysSinceLastVisit = calculateDaysSinceDate(lastVisitDate);
  
  if (nextAppointmentDate && nextAppointmentDate > new Date()) {
    return 'engaged';
  }
  
  if (daysSinceLastVisit > CHURN_THRESHOLD_DAYS) {
    return 'churned';
  }
  
  if (daysSinceLastVisit > RISK_THRESHOLD_DAYS) {
    return 'at_risk';
  }
  
  return 'engaged';
}

export function calculatePatientRetentionStatus(
  patient: Patient,
  visits: PatientVisit[]
): RetentionStatus {
  const sortedVisits = [...visits]
    .filter(v => v.status === 'completed')
    .sort((a, b) => b.visitDate.getTime() - a.visitDate.getTime());

  const lastVisit = sortedVisits[0];
  const lastVisitDate = lastVisit?.visitDate || patient.createdAt;
  
  return {
    lastVisitDate,
    nextAppointmentDate: patient.nextAppointment,
    visitCount: sortedVisits.length,
    retentionStage: determineRetentionStage(lastVisitDate, patient.nextAppointment),
    daysFromLastVisit: calculateDaysSinceDate(lastVisitDate)
  };
}

export function calculateClinicRetentionMetrics(
  patients: Patient[],
  visits: PatientVisit[]
): RetentionMetrics {
  const patientRetention = patients.map(patient => {
    const patientVisits = visits.filter(v => v.patientId === patient.id);
    return calculatePatientRetentionStatus(patient, patientVisits);
  });

  const totalPatients = patients.length;
  const activePatients = patientRetention.filter(r => r.retentionStage === 'engaged').length;
  const atRiskPatients = patientRetention.filter(r => r.retentionStage === 'at_risk').length;
  const churnedPatients = patientRetention.filter(r => r.retentionStage === 'churned').length;

  const totalVisits = visits.filter(v => v.status === 'completed').length;
  const averageVisits = totalPatients > 0 ? totalVisits / totalPatients : 0;

  // Calculate average days between visits
  const visitIntervals = visits
    .filter(v => v.status === 'completed')
    .sort((a, b) => a.visitDate.getTime() - b.visitDate.getTime())
    .reduce((acc, _, index, arr) => {
      if (index === 0) return acc;
      const daysDiff = calculateDaysSinceDate(arr[index - 1].visitDate);
      return [...acc, daysDiff];
    }, [] as number[]);

  const averageDaysBetweenVisits = visitIntervals.length > 0
    ? visitIntervals.reduce((sum, days) => sum + days, 0) / visitIntervals.length
    : 0;

  return {
    totalPatients,
    activePatients,
    atRiskPatients,
    churnedPatients,
    retentionRate: (activePatients / totalPatients) * 100,
    averageVisitsPerPatient: averageVisits,
    averageDaysBetweenVisits
  };
}