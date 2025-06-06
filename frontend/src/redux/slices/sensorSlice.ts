import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SensorState } from '../../types/sensor';
import { UserRole } from '../../types/user';
import api from '../../api/axios';

const initialState: SensorState = {
  sensors: [],
  loading: false,
  error: null,
};

export const getSensors = createAsyncThunk(
  'sensors/getSensors',
  async (_, { getState }) => {
    const state = getState() as { auth: { user: { role: UserRole; companyId?: string } } };
    const { role, companyId } = state.auth.user;
    
    // Admin tüm sensörleri görebilir, user sadece kendi şirketinin sensörlerini görebilir
    const endpoint = role === UserRole.ADMIN 
      ? '/sensors'
      : `/companies/${companyId}/sensors`;
    
    const response = await api.get(endpoint);
    return response.data;
  }
);

const sensorSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSensors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSensors.fulfilled, (state, action) => {
        state.loading = false;
        state.sensors = action.payload;
      })
      .addCase(getSensors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu';
      });
  },
});

export default sensorSlice.reducer;