import apiClient from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');

    // Transformar snake_case → camelCase
    return response.data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      lastLogin: u.last_login
    }));
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      createdAt: response.data.created_at,
      lastLogin: response.data.last_login
    };
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, data);

    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      createdAt: response.data.created_at,
      lastLogin: response.data.last_login
    };
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
