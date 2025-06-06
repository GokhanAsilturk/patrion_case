import axiosInstance from './axios';
import { User } from '../types/user';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post('/users', user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

// Diğer kullanıcı API fonksiyonları (delete) ileride eklenebilir.
