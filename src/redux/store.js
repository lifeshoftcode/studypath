import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pensumReducer from './slices/pensumSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pensum: pensumReducer,
    ai: aiReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Opciones para evitar advertencias de serialización con fechas
        // Nota: En producción, es mejor convertir todos los timestamps a formato serializable
        // en lugar de ignorarlos en estas configuraciones.
        ignoredActions: [
          'pensum/create/fulfilled',
          'pensum/getUserPensums/fulfilled',
          'pensum/getPensumById/fulfilled',
          'pensum/searchPublic/fulfilled'
        ],
        ignoredPaths: [
          'pensum.currentPensum.createdAt',
          'pensum.currentPensum.updatedAt',
          'pensum.userPensums',
          'pensum.publicPensums'
        ],
      },
    }),
});

export default store;