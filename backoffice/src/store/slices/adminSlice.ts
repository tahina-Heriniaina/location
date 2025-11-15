import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Administrateur } from '../../types';
import { adminService } from '../../services/adminService';

interface AdminState {
  admins: Administrateur[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: null,
};

export const fetchAdmins = createAsyncThunk('admin/fetchAdmins', async () => {
  const response = await adminService.getAll();
  console.log("Réponse axios brute :", response);
  console.log("Response.data :", response.data);
  return response.data; //  Si axios.get, response.data contient le tableau
});


export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData: Omit<Administrateur, 'idadmin'>) => {
    const response = await adminService.create(adminData);
    return response.data;
  }
);

export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, data }: { id: number; data: Partial<Administrateur> }) => {
    const response = await adminService.update(id, data);
    return response.data;
  }
);

export const deleteAdmin = createAsyncThunk('admin/deleteAdmin', async (id: number) => {
  await adminService.delete(id);
  return id;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement';
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(admin => admin.idadmin === action.payload.idadmin);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(admin => admin.idadmin !== action.payload);
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;