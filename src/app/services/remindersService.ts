import apiClient from './apiClient';

export interface Reminder {
  id: string;
  pet_id: string;
  petId: string;
  type: 'vaccine' | 'bath' | 'vet' | 'grooming' | 'other';
  title: string;
  description?: string;
  date: string;
  completed: boolean;
}

export const remindersService = {
  async getAllReminders(): Promise<Reminder[]> {
    const response = await apiClient.get<any[]>('/reminders');
    return response.data.map((r: any) => ({
      ...r,
      petId: r.pet_id
    }));
  },

  async getRemindersByPetId(petId: string): Promise<Reminder[]> {
    const response = await apiClient.get<any[]>(`/reminders?petId=${petId}`);
    return response.data.map((r: any) => ({
      ...r,
      petId: r.pet_id
    }));
  },

  async createReminder(data: { pet_id: string; type: string; title: string; description?: string; date: string }): Promise<Reminder> {
    const response = await apiClient.post<any>('/reminders', data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async updateReminder(id: string, data: any): Promise<Reminder> {
    const response = await apiClient.put<any>(`/reminders/${id}`, data);
    return {
      ...response.data,
      petId: response.data.pet_id
    };
  },

  async deleteReminder(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  },
};
