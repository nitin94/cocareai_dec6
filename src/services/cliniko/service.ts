import { ClinikoApi } from './api';
import { patientStorage } from '../storage/patientStorage';
import { calculateRetentionMetrics } from './utils/metricsCalculator';
import { logger } from './utils/logger';
import { ClinikoApiError } from './utils/errorHandler';
import type { ClinikoPatient } from './types';
import type { Patient } from '../../types/patient';
import type { RetentionMetrics } from '../../types/demo';
import { auth } from '../../config/firebase';
import { demoDataService } from '../demoData';

export class ClinikoService {
  private api: ClinikoApi | null = null;
  private isDemo = true;

  setApiKey(key: string) {
    logger.info('Setting API key...');
    this.api = new ClinikoApi(key);
    this.isDemo = false;
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.api) {
      return false;
    }
    
    try {
      return await this.api.validateApiKey();
    } catch (error) {
      logger.error('API key validation failed:', error);
      return false;
    }
  }

  async syncPatients(progressCallback?: (progress: number) => void): Promise<void> {
    if (!this.api) {
      throw new ClinikoApiError('API key not set', 401);
    }

    logger.info('Starting patient sync...');

    await patientStorage.clearPatients();

    try {
      const patients = await this.api.getPatients();
      const mappedPatients = this.mapClinikoPatients(patients);
      await this.storePatients(mappedPatients);
      
      if (progressCallback) {
        progressCallback(100);
      }

      logger.info('Patient sync completed successfully');
    } catch (error) {
      logger.error('Patient sync failed:', error);
      throw new ClinikoApiError('Failed to sync patients');
    }
  }

  private mapClinikoPatients(clinikoPatients: ClinikoPatient[]): Patient[] {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new ClinikoApiError('User not authenticated', 401);
    }

    return clinikoPatients.map(cp => ({
      id: cp.id.toString(),
      firstName: cp.first_name || 'N/A',
      lastName: cp.last_name || 'N/A',
      email: cp.email || 'N/A',
      phone: cp.phone || 'N/A',
      dateOfBirth: cp.date_of_birth || 'N/A',
      lastVisit: cp.last_visit ? new Date(cp.last_visit.appointment_end) : undefined,
      nextAppointment: cp.next_appointment ? new Date(cp.next_appointment.appointment_start) : undefined,
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
    return this.isDemo ? [] : patientStorage.getPatients();
  }

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    return this.isDemo ? [] : patientStorage.getPatientsByStatus(status);
  }

  async getRetentionMetrics(): Promise<RetentionMetrics> {
    if (this.isDemo) {
      return demoDataService.getMetrics();
    }
    const patients = await this.getPatients();
    return calculateRetentionMetrics(patients);
  }
}

export const clinikoService = new ClinikoService();