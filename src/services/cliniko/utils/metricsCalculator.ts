import { Patient } from '../../../types/patient';
import { RetentionMetrics, RetentionStage } from '../../../types/demo';
import { differenceInDays } from 'date-fns';

function calculatePatientStage(patient: Patient): RetentionStage {
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

export function calculateRetentionMetrics(patients: Patient[]): RetentionMetrics {
  const stages = patients.map(patient => ({
    patient,
    stage: calculatePatientStage(patient)
  }));

  const dropOffsByStage = {
    [RetentionStage.PRE_FIRST_VISIT]: stages.filter(
      p => p.stage === RetentionStage.PRE_FIRST_VISIT && p.patient.status === 'archived'
    ).length,
    [RetentionStage.AFTER_FIRST_VISIT]: stages.filter(
      p => p.stage === RetentionStage.AFTER_FIRST_VISIT && p.patient.status === 'archived'
    ).length,
    [RetentionStage.DURING_TREATMENT]: stages.filter(
      p => p.stage === RetentionStage.DURING_TREATMENT && p.patient.status === 'archived'
    ).length,
    [RetentionStage.POST_TREATMENT]: stages.filter(
      p => p.stage === RetentionStage.POST_TREATMENT
    ).length
  };

  const activePatients = patients.filter(p => p.status === 'active').length;
  const totalPatients = patients.length;

  return {
    overallRetentionRate: totalPatients > 0 ? (activePatients / totalPatients) * 100 : 0,
    preFirstVisitRate: totalPatients > 0 ? ((activePatients - dropOffsByStage.PRE_FIRST_VISIT) / totalPatients) * 100 : 0,
    afterFirstVisitRate: totalPatients > 0 ? ((activePatients - dropOffsByStage.AFTER_FIRST_VISIT) / totalPatients) * 100 : 0,
    duringTreatmentRate: totalPatients > 0 ? ((activePatients - dropOffsByStage.DURING_TREATMENT) / totalPatients) * 100 : 0,
    monthlyRevenueLoss: 
      dropOffsByStage.PRE_FIRST_VISIT * 150 + 
      dropOffsByStage.AFTER_FIRST_VISIT * 200 + 
      dropOffsByStage.DURING_TREATMENT * 300,
    dropOffsByStage
  };
}