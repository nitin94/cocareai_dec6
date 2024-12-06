import { firebaseDb } from '../firebase/db';
import type { Patient } from '../../types/patient';

export const patientStorage = {
  async storePatients(patients: Patient[]): Promise<void> {
    await firebaseDb.storePatients(patients);
  },

  async getPatients(): Promise<Patient[]> {
    return firebaseDb.getPatients();
  },

  async clearPatients(): Promise<void> {
    await firebaseDb.clearPatients();
  },

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    return firebaseDb.getPatientsByStatus(status);
  }
};