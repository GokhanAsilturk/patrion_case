import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from '../../types/notification';
import { UserRole } from '../../types/user';
import api from '../../api/axios';

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null
};

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { user: { role: UserRole; companyId?: string } | null } };
      
      // Kullanıcı null kontrolü
      if (!state.auth.user) {
        return rejectWithValue('Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      const { role, companyId } = state.auth.user;
      
      // Admin tüm bildirimleri görebilir, user sadece kendi şirketine ait bildirimleri görebilir
      const endpoint = role === UserRole.ADMIN 
        ? '/notifications'
        : `/companies/${companyId}/notifications`;
        
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Bildirimler alınamadı.');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Bir hata oluştu';
      });
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;