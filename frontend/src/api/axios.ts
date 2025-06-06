import axios from 'axios';

// Axios instance with defaults
const api = axios.create({
  baseURL: '/api',  // Next.js'in proxy ayarlarıyla yönlendirilecek
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message))
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Backend'den gelen hata mesajını al
    let errorMessage = 'Bir hata oluştu';
    
    if (error.response?.data) {
      // Backend'den gelen hata mesajını kontrol et
      if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    // 401 hatası durumunda token'ı sil ve login sayfasına yönlendir
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      
      // Eğer zaten login sayfasında değilsek yönlendir
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Hata mesajını döndür
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;