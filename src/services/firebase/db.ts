import { getFirestore, collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import type { Patient } from '../../types/patient';
import type { PatientVisit } from '../../types/retention';

const db = getFirestore();

export const firebaseDb = {
  async storePatients(patients: Patient[]): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const batch = patients.map(async (patient) => {
      const patientRef = doc(collection(db, `users/${userId}/patients`));
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
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const patientsRef = collection(db, `users/${userId}/patients`);
    const snapshot = await getDocs(patientsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        lastVisit: data.lastVisit ? new Date(data.lastVisit) : undefined,
        nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : undefined,
      } as Patient;
    });
  },

  async clearPatients(): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const patientsRef = collection(db, `users/${userId}/patients`);
    const snapshot = await getDocs(patientsRef);
    
    const deletePromises = snapshot.docs.map(doc => 
      setDoc(doc.ref, { deleted: true })
    );

    await Promise.all(deletePromises);
  },

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const patientsRef = collection(db, `users/${userId}/patients`);
    const q = query(patientsRef, where('status', '==', status));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        lastVisit: data.lastVisit ? new Date(data.lastVisit) : undefined,
        nextAppointment: data.nextAppointment ? new Date(data.nextAppointment) : undefined,
      } as Patient;
    });
  },

  async storeVisit(visit: PatientVisit): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const visitRef = doc(collection(db, `users/${userId}/visits`));
    await setDoc(visitRef, {
      ...visit,
      visitDate: visit.visitDate.toISOString(),
    });
  },

  async getVisitsByPatient(patientId: string): Promise<PatientVisit[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const visitsRef = collection(db, `users/${userId}/visits`);
    const q = query(visitsRef, where('patientId', '==', patientId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      visitDate: new Date(doc.data().visitDate),
    })) as PatientVisit[];
  },

  async getAllVisits(): Promise<PatientVisit[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const visitsRef = collection(db, `users/${userId}/visits`);
    const snapshot = await getDocs(visitsRef);

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      visitDate: new Date(doc.data().visitDate),
    })) as PatientVisit[];
  }
};