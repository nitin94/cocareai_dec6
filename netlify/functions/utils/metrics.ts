import type { Patient } from '../types';
import type { RetentionMetrics } from '../types';

export function calculateRetentionMetrics(patients: Patient[]): RetentionMetrics {
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;

  return {
    overallRetentionRate: totalPatients > 0 ? (activePatients / totalPatients) * 100 : 0,
    preFirstVisitRate: 0,
    afterFirstVisitRate: 0,
    duringTreatmentRate: 0,
    monthlyRevenueLoss: 0,
    dropOffsByStage: {
      PRE_FIRST_VISIT: 0,
      AFTER_FIRST_VISIT: 0,
      DURING_TREATMENT: 0,
      POST_TREATMENT: 0
    }
  };
}