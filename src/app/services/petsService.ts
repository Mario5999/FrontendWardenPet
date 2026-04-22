import apiClient from './apiClient';

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  age: number;
  breed?: string;
  weight?: number;
  image?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const petsService = {
  async getAllPets(): Promise<Pet[]> {
    const response = await apiClient.get<Pet[]>('/pets');
    return response.data;
  },

  async getPetById(id: string): Promise<Pet> {
    const response = await apiClient.get<Pet>(`/pets/${id}`);
    return response.data;
  },

  async createPet(data: Omit<Pet, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
    const response = await apiClient.post<Pet>('/pets', data);
    return response.data;
  },

  async updatePet(id: string, data: Partial<Pet>): Promise<Pet> {
    const response = await apiClient.put<Pet>(`/pets/${id}`, data);
    return response.data;
  },

  async deletePet(id: string): Promise<void> {
    await apiClient.delete(`/pets/${id}`);
  },
};
