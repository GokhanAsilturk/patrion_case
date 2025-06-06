import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import authApi, { LoginCredentials, UserResponse } from '../api/authApi';
import socketService from '../services/socketService';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Token kontrolü ve kullanıcı bilgilerini alma
  const initAuth = async (token?: string | null) => {
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      socketService.init(token);
    } catch (err) {
      console.error('Auth initialization error:', err);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Token değişikliklerini izle
  useEffect(() => {
    const token = localStorage.getItem('token');
    initAuth(token);

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      initAuth(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      
      // Token ve kullanıcı bilgilerini state'e kaydet
      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Socket bağlantısını başlat
        socketService.init(response.token);
        
        setIsLoading(false);
        
        // En son yönlendirme yap
        await router.replace('/dashboard');
      } else {
        throw new Error('Sunucudan geçersiz yanıt alındı');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Giriş başarısız oldu. Lütfen tekrar deneyin.';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      socketService.disconnect();
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      await router.push('/login');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, isAuthenticated, isLoading, error] // login, logout, ve clearError bağımlılık listesinden çıkarıldı
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};