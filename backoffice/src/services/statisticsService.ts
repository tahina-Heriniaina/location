import { api } from './api';
import type { Statistics } from '../types';

export const statisticsService = {
  async getStatistics(startDate?: string, endDate?: string): Promise<Statistics> {
    const params = { startDate, endDate };
    const response = await api.get<Statistics>('/statistics', { params });
    return response.data; // data contient directement totalClients, totalVoitures...
  },
};