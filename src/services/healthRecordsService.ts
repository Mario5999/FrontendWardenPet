import apiClient from './apiClient';

export interface HealthRecord {
  id: string;
  petId: string;
  date: string;
  symptoms: string;
  notes?: string;
  temperature?: number;
  createdAt: string;
  updatedAt: string;
}

export const healthRecordsService = {
  async getAllHealthRecords(): Promise<HealthRecord[]> {
    const response = await apiClient.get<HealthRecord[]>('/health-records');
    return response.data;
  },

  async getHealthRecordsByPetId(petId: string): Promise<HealthRecord[]> {
    const response = await apiClient.get<HealthRecord[]>(`/health-records?petId=${petId}`);
    return response.data;
  },

  async createHealthRecord(data: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthRecord> {
    const response = await apiClient.post<HealthRecord>('/health-records', data);
    return response.data;
  },

  async updateHealthRecord(id: string, data: Partial<HealthRecord>): Promise<HealthRecord> {
    const response = await apiClient.put<HealthRecord>(`/health-records/${id}`, data);
    return response.data;
  },

  async deleteHealthRecord(id: string): Promise<void> {
    await apiClient.delete(`/health-records/${id}`);
  },
};
