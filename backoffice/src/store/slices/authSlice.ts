import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

 {/*const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}; */}


const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("admin_user") || "null"), 
  token: localStorage.getItem("admin_token"),                     
  loading: false,
  error: null,
};







export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string }, 
    thunkAPI
  ) => {
    try {
      const response = await authService.login(email, password);
      return {
        user: response.admin,   //  backend retourne { token, admin }
        token: response.token,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Identifiants invalides"
      );
    }
  }
);




const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    //  .addCase(login.fulfilled, (state, action) => {
     //   state.loading = false;
     //   state.user = action.payload.user;
     //   state.token = action.payload.token;
     // }) 

      .addCase(login.fulfilled, (state, action) => {
       state.loading = false;
       state.user = action.payload.user;
       state.token = action.payload.token;

     // stocker le token dans localStorage
      localStorage.setItem('admin_token', action.payload.token);
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
