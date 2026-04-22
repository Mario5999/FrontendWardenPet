import apiClient from './apiClient';

export interface Routine {
  id: string;
  pet_id: string;
  petId: string;
  type: 'food' | 'walk' | 'play' | 'medication' | 'other';
  time: string;
  description: string;
}

export const routinesService = {
  async getAllRoutines(): Promise<Routine[]> {
    const response = await apiClient.get<any[]>('/routines');
    return response.data.map((r: any) => ({
      ...r,
      petId: r.pet_id
    }));
  },

  async getRoutinesByPetId(petId: string): Promise<Routine[]> {
    const response = await apiClient.get<any[]>(`/routines?petId=${petId}`);
    return response.data.map((r: any) => ({
      ...r,
      petId: r.pet_id
    }));
  },

  async createRoutine(data: { pet_id: string; type: string; time: string; description: string }): Promise<Routine> {
    const response = await apiClient.post<any>('/routines', data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async updateRoutine(id: string, data: any): Promise<Routine> {
    const response = await apiClient.put<any>(`/routines/${id}`, data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async deleteRoutine(id: string): Promise<void> {
    await apiClient.delete(`/routines/${id}`);
  },
};
