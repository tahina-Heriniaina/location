import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import adminReducer from './slices/adminSlice.ts';
import clientReducer from './slices/clientSlice.ts';
import voitureReducer from './slices/voitureSlice.ts';
import reservationReducer from './slices/reservationSlice.ts';
import statisticsReducer from './slices/statisticsSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    client: clientReducer,
    voiture: voitureReducer,
    reservation: reservationReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;