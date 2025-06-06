import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/user';
import { fetchUsers, createUser, updateUser } from '../../api/userApi';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk('users/getUsers', async () => {
  return await fetchUsers();
});

export const createUserAsync = createAsyncThunk('users/createUser', async (user: Partial<User>) => {
  return await createUser(user);
});

export const updateUserAsync = createAsyncThunk('users/updateUser', async ({ id, user }: { id: string, user: Partial<User> }) => {
  return await updateUser(id, user);
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Kullanıcılar alınamadı';
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Kullanıcı oluşturulamadı';
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Kullanıcı güncellenemedi';
      });
  },
});

export default userSlice.reducer;
