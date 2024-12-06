import { getFirestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import type { Patient } from '../types';

export const patientStorage = {
  async storePatients(patients: Patient[]): Promise<void> {
    const batch = patients.map(async (patient) => {
      const patientRef = doc(collection(getFirestore(), 'patients'));
      await setDoc(patientRef, {
        ...patient,
        createdAt: patient.createdAt.toISOString(),
        updatedAt: patient.updatedAt.toISOString(),
        lastVisit: patient.lastVisit?.toISOString(),
        nextAppointment: patient.nextAppointment?.toISOString(),
      });
    });

    await Promise.all(batch);
  },

  async getPatients(): Promise<Patient[]> {
    const snapshot = await getDocs(collection(getFirestore(), 'patients'));
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt),
      updatedAt: new Date(doc.data().updatedAt),
      lastVisit: doc.data().lastVisit ? new Date(doc.data().lastVisit) : undefined,
      nextAppointment: doc.data().nextAppointment ? new Date(doc.data().nextAppointment) : undefined,
    } as Patient));
  },

  async clearPatients(): Promise<void> {
    const snapshot = await getDocs(collection(getFirestore(), 'patients'));
    const deletePromises = snapshot.docs.map(doc => setDoc(doc.ref, { deleted: true }));
    await Promise.all(deletePromises);
  },

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    const q = query(collection(getFirestore(), 'patients'), where('status', '==', status));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt),
      updatedAt: new Date(doc.data().updatedAt),
      lastVisit: doc.data().lastVisit ? new Date(doc.data().lastVisit) : undefined,
      nextAppointment: doc.data().nextAppointment ? new Date(doc.data().nextAppointment) : undefined,
    } as Patient));
  }
};