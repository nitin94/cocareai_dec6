import { differenceInDays } from 'date-fns';
import type { Patient } from '../../../types/patient';
import { RetentionStage } from '../../../types/demo';

export function calculatePatientStage(patient: Patient): RetentionStage {
  if (!patient.lastVisit) {
    return RetentionStage.PRE_FIRST_VISIT;
  }

  const daysSinceLastVisit = differenceInDays(new Date(), patient.lastVisit);

  if (daysSinceLastVisit <= 30) {
    return RetentionStage.DURING_TREATMENT;
  }

  if (daysSinceLastVisit <= 90) {
    return RetentionStage.AFTER_FIRST_VISIT;
  }

  return RetentionStage.POST_TREATMENT;
}

export function calculateRetentionRate(patients: Patient[]): number {
  const activePatients = patients.filter(p => p.status === 'active').length;
  return patients.length > 0 ? (activePatients / patients.length) * 100 : 0;
}