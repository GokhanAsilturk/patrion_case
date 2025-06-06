import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { LogState } from '../../types/log';
import { UserRole } from '../../types/user';
import api from '../../api/axios';

export const getLogs = createAsyncThunk(
  'logs/getLogs',
  async (_, { getState }) => {
    const state = getState() as { auth: { user: { role: UserRole } } };
    const isAdmin = state.auth.user?.role === UserRole.ADMIN;
    const response = await api.get(isAdmin ? '/logs' : '/logs/user');
    return response.data;
  }
);

const initialState: LogState = {
  logs: [],
  loading: false,
  error: null,
};

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu';
      });
  },
});

export default logSlice.reducer;