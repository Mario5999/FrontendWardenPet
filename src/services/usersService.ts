import apiClient from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
