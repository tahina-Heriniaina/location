import { api } from './api';
import type { Chauffeur, ApiResponse } from '../types';

 export const chauffeurService = {
  

  async getAll(params?: { 
      page?: number; 
      limit?: number; 
      search?: string;
    }): Promise<ApiResponse<{ chauffeurs: Chauffeur[]; total: number }>> {
      return api.get('/chauffeurs', { params });
       // <-- pas de .data
    }, 

    

 

  async getById(id: number): Promise<ApiResponse<Chauffeur>> {
    const response = await api.get(`/chauffeurs/${id}`);
    return response.data;// ici c’est { chauffeurs, total }
  }, 


// async create(data: Omit<Chauffeur, 'idchauffeur'>) {
 // const response = await api.post('/chauffeurs', data);
 // return response.data; // <-- axios renvoie déjà response.data
//},


async create(data: FormData) {
  const response = await api.post('/chauffeurs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
},


 // async update(id: number, data: Partial<Chauffeur>): Promise<Chauffeur> {
   // const response = await api.put(`/chauffeurs/${id}`, data);
   // return response.data; // <-- un Voiture, pas ApiResponse
  //},

  async update(id: number, formData: FormData): Promise<Chauffeur> {
    const response = await api.put(`/chauffeurs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/chauffeurs/${id}`);
    return response.data;
  },
};