import { auth } from '../config/firebase';
import { patientStorage } from './storage/patientStorage';
import type { Patient } from '../types/patient';

const CLINIKO_API_BASE = 'https://api.cliniko.com/v1';

class ClinikoService {
  private apiKey: string = '';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    try {
      const response = await fetch(`${CLINIKO_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Patient Retention Tracker',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Cliniko');
      }

      return response.json();
    } catch (error) {
      console.error('Cliniko API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.request('/practitioners?per_page=1');
      return true;
    } catch {
      return false;
    }
  }

  async syncPatients(progressCallback?: (progress: number) => void): Promise<void> {
    let page = 1;
    let totalPages = 1;
    const perPage = 50;

    await patientStorage.clearPatients();

    try {
      do {
        const response = await this.request<{
          patients: any[];
          total_entries: number;
          total_pages: number;
        }>(`/patients?page=${page}&per_page=${perPage}`);

        totalPages = response.total_pages || 1;

        if (progressCallback) {
          progressCallback((page / totalPages) * 100);
        }

        const mappedPatients = this.mapClinikoPatients(response.patients);
        await this.storePatients(mappedPatients);

        page++;
      } while (page <= totalPages);
    } catch (error) {
      console.error('Patient Sync Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to sync patients: ${error.message}`);
      }
      throw new Error('Failed to sync patients: Unknown error');
    }
  }

  private mapClinikoPatients(clinikoPatients: any[]): Patient[] {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    return clinikoPatients.map(cp => ({
      id: cp.id.toString(),
      firstName: cp.first_name || 'N/A',
      lastName: cp.last_name || 'N/A',
      email: cp.email || 'N/A',
      phone: cp.phone || 'N/A',
      lastVisit: cp.appointments?.last ? new Date(cp.appointments.last.ends_at) : undefined,
      nextAppointment: cp.appointments?.next ? new Date(cp.appointments.next.starts_at) : undefined,
      status: cp.archived ? 'archived' : 'active',
      clinicId: userId,
      createdAt: new Date(cp.created_at),
      updatedAt: new Date(cp.updated_at)
    }));
  }

  private async storePatients(patients: Patient[]): Promise<void> {
    await patientStorage.storePatients(patients);
  }

  async getPatients(): Promise<Patient[]> {
    return patientStorage.getPatients();
  }

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    return patientStorage.getPatientsByStatus(status);
  }
}

export const clinikoService = new ClinikoService();