import { ClinikoApiClient } from '../utils/cliniko-client';
import { patientStorage } from '../utils/storage';
import { calculateRetentionMetrics } from '../utils/metrics';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import type { Patient, RetentionMetrics, ValidatedRequest } from '../types';

export class ClinikoService {
  private api: ClinikoApiClient | null = null;

  setApiKey(key: string) {
    this.api = new ClinikoApiClient(key);
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.api) {
      return false;
    }
    
    try {
      return await this.api.validateApiKey();
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  async syncPatients(progressCallback?: (progress: number) => void): Promise<void> {
    if (!this.api) {
      throw new Error('API key not set');
    }

    await patientStorage.clearPatients();

    try {
      const patients = await this.api.getPatients();
      const mappedPatients = this.mapClinikoPatients(patients);
      await patientStorage.storePatients(mappedPatients);
      
      if (progressCallback) {
        progressCallback(100);
      }
    } catch (error) {
      console.error('Patient sync failed:', error);
      throw new Error('Failed to sync patients');
    }
  }

  private mapClinikoPatients(clinikoPatients: any[]): Patient[] {
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
      clinicId: 'default',
      createdAt: new Date(cp.created_at),
      updatedAt: new Date(cp.updated_at)
    }));
  }

  async getPatients(): Promise<Patient[]> {
    return patientStorage.getPatients();
  }

  async getPatientsByStatus(status: Patient['status']): Promise<Patient[]> {
    return patientStorage.getPatientsByStatus(status);
  }

  async getRetentionMetrics(): Promise<RetentionMetrics> {
    const patients = await this.getPatients();
    return calculateRetentionMetrics(patients);
  }
}

const clinikoService = new ClinikoService();

export async function handleClinikoRequest(request: ValidatedRequest) {
  try {
    clinikoService.setApiKey(request.apiKey);

    if (request.path.includes('/validate')) {
      const isValid = await clinikoService.validateApiKey();
      return createSuccessResponse({ valid: isValid });
    }

    if (request.path.includes('/patients')) {
      const patients = await clinikoService.getPatients();
      return createSuccessResponse({ patients });
    }

    return createErrorResponse(404, 'Endpoint not found');
  } catch (error) {
    console.error('Request failed:', error);
    return createErrorResponse(500, 'Failed to process request');
  }
}