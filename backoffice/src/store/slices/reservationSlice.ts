import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Reservation } from '../../types';
import { reservationService } from '../../services/reservationService.ts';
import { api } from '../../services/api.ts';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}





const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchReservations = createAsyncThunk(
  'reservation/fetchReservations',
  async ({ page, limit, search, statut, categorie }: { 
    page?: number; 
    limit?: number; 
    search?: string;
    statut?: string;
    categorie?: string;
    mode?: 'ACTIVE' | 'ARCHIVE';
  }) => {
    const response = await reservationService.getAll({ page, limit, search, statut, categorie });
    return response;
  }
);

// Interface pour updateReservationStatus
interface UpdateReservationPayload {
  id: number;
  statut: string;
  clientId?: number; // optionnel pour créer historique
}




//  Thunk pour mettre à jour le statut
export const updateReservationStatus = createAsyncThunk(
  'reservation/updateReservationStatus',
  async ({ id, statut, clientId }: UpdateReservationPayload) => {
    const res = await api.put(`/reservations/${id}/status`, { statut, clientId });
    return res.data; // retourne la réservation mise à jour
  }
);


const reservationSlice = createSlice({
  name: 'reservation',
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
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
      })
      
      
      .addCase(fetchReservations.fulfilled, (state, action) => {
                 state.loading = false;
                 console.log('Payload reçu:', action.payload);
                 state.reservations = action.payload?.reservations || []; //  sécurité si undefined
                 state.total = action.payload?.total || 0;     //  sécurité si undefined  // longueur du tableau
               })



      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
         const index = state.reservations.findIndex(
         r => r.idreservation === action.payload.idreservation
         );
        if (index !== -1) {
        state.reservations[index] = action.payload;
         }
      });
  },
});

export const { clearError, setPage } = reservationSlice.actions;
export default reservationSlice.reducer;