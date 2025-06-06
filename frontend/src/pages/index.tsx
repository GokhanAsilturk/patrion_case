import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Yükleme durumu tamamlandıysa
    if (!isLoading) {
      // Kimlik doğrulaması yapılmışsa dashboard'a, yapılmamışsa login sayfasına yönlendir
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Yükleme durumunda yükleme ekranı göster
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Sensör İzleme Platformu Yükleniyor...
      </Typography>
    </Box>
  );
} 