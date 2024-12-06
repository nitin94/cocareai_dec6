import { firebaseDb } from '../firebase/db';
import { PatientVisit, RetentionMetrics } from '../../types/retention';
import { calculateClinicRetentionMetrics } from '../../utils/retentionCalculator';

class RetentionService {
  async trackVisit(visit: Omit<PatientVisit, 'id'>): Promise<void> {
    await firebaseDb.storeVisit({
      ...visit,
      id: crypto.randomUUID()
    });
  }

  async getPatientVisits(patientId: string): Promise<PatientVisit[]> {
    return firebaseDb.getVisitsByPatient(patientId);
  }

  async getClinicMetrics(): Promise<RetentionMetrics> {
    const [patients, visits] = await Promise.all([
      firebaseDb.getPatients(),
      firebaseDb.getAllVisits()
    ]);

    return calculateClinicRetentionMetrics(patients, visits);
  }
}

export const retentionService = new RetentionService();