import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Eğer yükleme durumu devam ediyorsa bekle
      if (isLoading) return;

      // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
      if (!isAuthenticated && router.pathname !== '/login') {
        await router.replace('/login');
        return;
      }

      // Rol kontrolü
      if (user && requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        await router.replace('/unauthorized');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isLoading, isAuthenticated, user, router, requiredRoles]);

  // Yükleme durumu veya kontrol sırasında loading göster
  if (isLoading || isChecking) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Kullanıcı authenticated ve gerekli role sahipse içeriği göster
  return <>{children}</>;
};

export default ProtectedRoute;