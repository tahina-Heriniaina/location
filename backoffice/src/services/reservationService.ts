import { api } from './api';
import type { Reservation, ApiResponse } from '../types';

export const reservationService = {
 

  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    statut?: string;
    categorie?: string;
}): Promise<{ reservations: Reservation[]; total: number }> {
    const response = await api.get('/reservations', { params });
    return response.data; // ici response est défini
},

  

  async getById(id: number): Promise<ApiResponse<Reservation>> {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  async updateStatus(id: number, statut: string): Promise<ApiResponse<Reservation>> {
    const response = await api.patch(`/reservations/${id}/status`, { statut });
    return response.data;
  },
};