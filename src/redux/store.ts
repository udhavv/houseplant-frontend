import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import plantSlice from './slices/plantSlice';
import shopSlice from './slices/shopSlice';

export const store= configureStore({
  reducer: {
    auth: authSlice,
    plant: plantSlice,
    shop: shopSlice,
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