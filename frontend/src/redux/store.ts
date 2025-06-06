import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import sensorReducer from './slices/sensorSlice';
import companyReducer from './slices/companySlice';
import logReducer from './slices/logSlice';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {    auth: authReducer,
    sensors: sensorReducer,
    companies: companyReducer,
    logs: logReducer,
    notifications: notificationReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;