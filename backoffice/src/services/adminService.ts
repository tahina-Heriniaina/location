import { api } from './api';
import type { Administrateur, ApiResponse } from '../types';

export const adminService = {
  async getAll(): Promise<ApiResponse<Administrateur[]>> {
  return api.get('/administrateurs'); //  retirer le .data
},


   // async getAll(params?: { 
    //  page?: number; 
   //   limit?: number; 
   //   search?: string;
  //  }): Promise<ApiResponse<{ Administrateur: Administrateur[]; total: number }>> {
  //    return api.get('/clients', { params }); // <-- pas de .data
  //  },   

 async getById(id: number): Promise<ApiResponse<Administrateur>> {
  return api.get(`/administrateurs/${id}`); //  retire .data
},

  async create(data: Omit<Administrateur, 'idadmin'>): Promise<ApiResponse<Administrateur>> {
    return  api.post('/administrateurs', data);
    
  },

  async update(id: number, data: Partial<Administrateur>): Promise<ApiResponse<Administrateur>> {
    return  api.put(`/administrateurs/${id}`, data);
    
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return  api.delete(`/administrateurs/${id}`);
    
  },
};