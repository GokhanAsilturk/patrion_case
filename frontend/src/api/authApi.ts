import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId?: string;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // API yanıtından token'ı kontrol et
    if (!response.data?.token) {
      throw new Error('Token alınamadı');
    }
    
    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  },
  
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get('/users/profile');
    return response.data.data.user;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post('/users/change-password', data);
  }
};

export default authApi;