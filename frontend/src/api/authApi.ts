import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    company_id?: number;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

const authApi = {  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    
    // Backend'den gelen response yapısı: { status, message, data: { token, user } }
    const { data } = response.data;
    
    // Token ve user bilgilerini kontrol et
    if (!data?.token || !data?.user) {
      throw new Error('Token alınamadı');
    }
    
    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', data.token);
    
    // Frontend'in beklediği yapıya dönüştür
    return {
      token: data.token,
      user: data.user
    };
  },
  
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get('/users/profile');
    return response.data.data.user;
  },
    logout: async (): Promise<void> => {
    // Backend'de logout endpoint'i olmadığı için sadece token'ı siliyoruz
    localStorage.removeItem('token');
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.post('/users/change-password', data);
  }
};

export default authApi;