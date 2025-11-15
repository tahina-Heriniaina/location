import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/slices/authSlice';
import adminReducer from './store/slices/adminSlice';
import clientReducer from './store/slices/clientSlice';
import voitureReducer from './store/slices/voitureSlice';
import reservationReducer from './store/slices/reservationSlice';
import statisticsReducer from './store/slices/statisticsSlice';
import chauffeurReducer from './store/slices/chauffeurSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    client: clientReducer,
    voiture: voitureReducer,
    chauffeur: chauffeurReducer,
    reservation: reservationReducer,
    statistics: statisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
