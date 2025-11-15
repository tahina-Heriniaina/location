import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Client } from '../../types';
import { clientService } from '../../services/clientService';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchClients = createAsyncThunk(
  'client/fetchClients',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string }) => {
    const response = await clientService.getAll({ page, limit, search });
    return response.data;
  }
);

export const deleteClient = createAsyncThunk('client/deleteClient', async (id: number) => {
  await clientService.delete(id);
  return id;
});

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {

    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
           state.loading = false;
           console.log('Payload reçu:', action.payload);
           state.clients = action.payload?.clients || []; //  sécurité si undefined
           state.total = action.payload?.total || 0;     //  sécurité si undefined  // longueur du tableau
         })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(client => client.idclient !== action.payload);
      });
  },
});

export const { clearError, setPage } = clientSlice.actions;
export default clientSlice.reducer;