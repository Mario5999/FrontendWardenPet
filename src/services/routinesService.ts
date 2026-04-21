import apiClient from './apiClient';

export interface Routine {
  id: string;
  petId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  lastCompleted?: string;
  createdAt: string;
  updatedAt: string;
}

export const routinesService = {
  async getAllRoutines(): Promise<Routine[]> {
    const response = await apiClient.get<Routine[]>('/routines');
    return response.data;
  },

  async getRoutinesByPetId(petId: string): Promise<Routine[]> {
    const response = await apiClient.get<Routine[]>(`/routines?petId=${petId}`);
    return response.data;
  },

  async createRoutine(data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Routine> {
    const response = await apiClient.post<Routine>('/routines', data);
    return response.data;
  },

  async updateRoutine(id: string, data: Partial<Routine>): Promise<Routine> {
    const response = await apiClient.put<Routine>(`/routines/${id}`, data);
    return response.data;
  },

  async deleteRoutine(id: string): Promise<void> {
    await apiClient.delete(`/routines/${id}`);
  },
};
