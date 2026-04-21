import apiClient from './apiClient';

export interface Reminder {
  id: string;
  petId: string;
  type: 'vaccine' | 'bath' | 'vet' | 'grooming' | 'other';
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const remindersService = {
  async getAllReminders(): Promise<Reminder[]> {
    const response = await apiClient.get<Reminder[]>('/reminders');
    return response.data;
  },

  async getRemindersByPetId(petId: string): Promise<Reminder[]> {
    const response = await apiClient.get<Reminder[]>(`/reminders?petId=${petId}`);
    return response.data;
  },

  async createReminder(data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder> {
    const response = await apiClient.post<Reminder>('/reminders', data);
    return response.data;
  },

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    const response = await apiClient.put<Reminder>(`/reminders/${id}`, data);
    return response.data;
  },

  async completeReminder(id: string): Promise<Reminder> {
    const response = await apiClient.patch<Reminder>(`/reminders/${id}`, { completed: true });
    return response.data;
  },

  async deleteReminder(id: string): Promise<void> {
    await apiClient.delete(`/reminders/${id}`);
  },
};
