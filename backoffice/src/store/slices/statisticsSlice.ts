import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Statistics } from '../../types';
import { statisticsService } from '../../services/statisticsService';

interface StatisticsState {
  data: Statistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}) => {
    const apiResponse = await statisticsService.getStatistics(startDate, endDate);
    return apiResponse; 
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      });
  },
});

export const { clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;