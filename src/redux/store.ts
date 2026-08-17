import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';


export const store= configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/register/fulfilled',
          'auth/login/fulfilled',
          'auth/checkAuth/fulfilled',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;