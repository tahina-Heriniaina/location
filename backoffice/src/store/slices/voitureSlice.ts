import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Voiture } from '../../types';
import { voitureService } from '../../services/voitureService';

interface VoitureState {
  voitures: Voiture[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: VoitureState = {
  voitures: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

 export const fetchVoitures = createAsyncThunk(
  'voiture/fetchVoitures',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string }) => {
    const response = await voitureService.getAll({ page, limit, search });
    return response.data;
  }
); 




 { /*export const createVoiture = createAsyncThunk(
  'voiture/createVoiture',
  async (voitureData: Omit<Voiture, 'idvoiture'>) => {
    const voiture = await voitureService.create(voitureData);
    return voiture; // pas response.data
  }
);

export const updateVoiture = createAsyncThunk(
  'voiture/updateVoiture',
  async ({ id, data }: { id: number; data: Partial<Voiture> }) => {
    return await voitureService.update(id, data); // <- retourne un Voiture
  }
); */}


export const createVoiture = createAsyncThunk<Voiture, FormData>(
  'voiture/createVoiture',
  async (formData) => {
    const voiture = await voitureService.create(formData);
    return voiture;
  }
);

export const updateVoiture = createAsyncThunk<Voiture, { id: number; formData: FormData }>(
  'voiture/updateVoiture',
  async ({ id, formData }) => {
    const voiture = await voitureService.update(id, formData);
    return voiture;
  }
);






export const deleteVoiture = createAsyncThunk('voiture/deleteVoiture', async (id: number) => {
  await voitureService.delete(id);
  return id;
});

const voitureSlice = createSlice({
  name: 'voiture',
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
      .addCase(fetchVoitures.pending, (state) => {
        state.loading = true;
      })
      
       .addCase(fetchVoitures.fulfilled, (state, action) => {
                  state.loading = false;
                  console.log('Payload reçu:', action.payload);
                  state.voitures = action.payload?.voitures || []; //  sécurité si undefined
                  state.total = action.payload?.total || 0;     //  sécurité si undefined  // longueur du tableau
                })


      .addCase(fetchVoitures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      })
      .addCase(createVoiture.fulfilled, (state, action) => {
        state.voitures.unshift(action.payload);
      })
      .addCase(updateVoiture.fulfilled, (state, action) => {
        console.log("Payload update:", action.payload);
        const index = state.voitures.findIndex(voiture => voiture.idvoiture === action.payload.idvoiture);
        if (index !== -1) {
          state.voitures[index] = action.payload;
        }
      })
      .addCase(deleteVoiture.fulfilled, (state, action) => {
        state.voitures = state.voitures.filter(voiture => voiture.idvoiture !== action.payload);
      });
  },
});

export const { clearError, setPage } = voitureSlice.actions;
export default voitureSlice.reducer;