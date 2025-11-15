import { api } from './api';
import type { Voiture, ApiResponse } from '../types';

 export const voitureService = {
  

  async getAll(params?: { 
      page?: number; 
      limit?: number; 
      search?: string;
    }): Promise<ApiResponse<{ voitures: Voiture[]; total: number }>> {
      return api.get('/voitures', { params });
       // <-- pas de .data
       
    }, 
   

    

 

  async getById(id: number): Promise<ApiResponse<Voiture>> {
    const response = await api.get(`/voitures/${id}`);
    return response.data;// ici c’est { voitures, total }
  }, 


// async create(data: Omit<Voiture, 'idvoiture'>) {
  //const response = await api.post('/voitures', data);
  //return response.data; // <-- axios renvoie déjà response.data
//},

async create(data: FormData) {
  const response = await api.post('/voitures', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
},


 // async update(id: number, data: Partial<Voiture>): Promise<Voiture> {
   // const response = await api.put(`/voitures/${id}`, data);
    //return response.data; // <-- un Voiture, pas ApiResponse
  //},


async update(id: number, formData: FormData): Promise<Voiture> {
  const response = await api.put(`/voitures/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
},


  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await api.delete(`/voitures/${id}`);
    return response.data;
  },
};