import apiClient from './apiClient';

export interface HealthRecord {
  id: string;
  pet_id: string;
  petId: string;
  date: string;
  symptoms: string;
  notes?: string;
  temperature?: number;
}

export const healthRecordsService = {
  async getAllHealthRecords(): Promise<HealthRecord[]> {
    const response = await apiClient.get<any[]>('/health-records');
    return response.data.map((h: any) => ({
      ...h,
      petId: h.pet_id
    }));
  },

  async getHealthRecordsByPetId(petId: string): Promise<HealthRecord[]> {
    const response = await apiClient.get<any[]>(`/health-records?petId=${petId}`);
    return response.data.map((h: any) => ({
      ...h,
      petId: h.pet_id
    }));
  },

  async createHealthRecord(data: { pet_id: string; date: string; symptoms: string; notes?: string; temperature?: number }): Promise<HealthRecord> {
    const response = await apiClient.post<any>('/health-records', data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async updateHealthRecord(id: string, data: any): Promise<HealthRecord> {
    const response = await apiClient.put<any>(`/health-records/${id}`, data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async deleteHealthRecord(id: string): Promise<void> {
    await apiClient.delete(`/health-records/${id}`);
  },
};
