import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Chauffeur } from '../../types';
import { chauffeurService } from '../../services/chauffeurService';

interface ChauffeurState {
  chauffeurs: Chauffeur[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: ChauffeurState = {
  chauffeurs: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

 export const fetchChauffeurs = createAsyncThunk(
  'chauffeur/fetchChauffeurs',
  async ({ page, limit, search }: { page?: number; limit?: number; search?: string }) => {
    const response = await chauffeurService.getAll({ page, limit, search });
    return response.data;
  }
); 




{ /*export const createChauffeur = createAsyncThunk(
  'chauffeur/createChauffeur',
  async (chauffeurData: Omit<Chauffeur, 'idchauffeur'>) => {
    const chauffeur = await chauffeurService.create(chauffeurData);
    return chauffeur; // pas response.data
  }
);

export const updateChauffeur = createAsyncThunk(
  'chauffeur/updateChauffeur',
  async ({ id, data }: { id: number; data: Partial<Chauffeur> }) => {
    return await chauffeurService.update(id, data); // <- retourne un chauffeur
  }
); */}

export const createChauffeur = createAsyncThunk<Chauffeur, FormData>(
  'chauffeur/createChauffeur',
  async (formData) => {
    const chauffeur = await chauffeurService.create(formData);
    return chauffeur;
  }
);

export const updateChauffeur = createAsyncThunk<Chauffeur, { id: number; formData: FormData }>(
  'chauffeur/updateChauffeur',
  async ({ id, formData }) => {
    const chauffeur = await chauffeurService.update(id, formData);
    return chauffeur;
  }
);



export const deleteChauffeur = createAsyncThunk('chauffeur/deleteChauffeur', async (id: number) => {
  await chauffeurService.delete(id);
  return id;
});

const chauffeurSlice = createSlice({
  name: 'chauffeur',
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
      .addCase(fetchChauffeurs.pending, (state) => {
        state.loading = true;
      })
      
       .addCase(fetchChauffeurs.fulfilled, (state, action) => {
                  state.loading = false;
                  console.log('Payload reçu:', action.payload);
                  state.chauffeurs = action.payload?.chauffeurs || []; //  sécurité si undefined
                  state.total = action.payload?.total || 0;     //  sécurité si undefined  // longueur du tableau
                })


      .addCase(fetchChauffeurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      })
      .addCase(createChauffeur.fulfilled, (state, action) => {
        state.chauffeurs.unshift(action.payload);
      })
      .addCase(updateChauffeur.fulfilled, (state, action) => {
        console.log("Payload update:", action.payload);
        const index = state.chauffeurs.findIndex(chauffeur => chauffeur.idchauffeur === action.payload.idchauffeur);
        if (index !== -1) {
          state.chauffeurs[index] = action.payload;
        }
      })
      .addCase(deleteChauffeur.fulfilled, (state, action) => {
        state.chauffeurs = state.chauffeurs.filter(chauffeur => chauffeur.idchauffeur !== action.payload);
      });
  },
});

export const { clearError, setPage } = chauffeurSlice.actions;
export default chauffeurSlice.reducer;