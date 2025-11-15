import { api } from './api';
import type { Administrateur, ApiResponse } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ admin: Administrateur; token: string }> {

   // const response = await api.post('/auth/login', { email, password });
    const response = await api.post('/auth/login', { emailadmin: email, codeacces: password });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<Administrateur>> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};