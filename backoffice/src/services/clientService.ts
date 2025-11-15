import { api } from './api';
import type { Client, ApiResponse } from '../types';

export const clientService = {
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
  }): Promise<ApiResponse<{ clients: Client[]; total: number }>> {
    return api.get('/clients', { params }); // <-- pas de .data
  },

  async getById(id: number): Promise<ApiResponse<Client>> {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};