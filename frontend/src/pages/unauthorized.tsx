import React from 'react';
import { Container, Paper, Typography, Button, Box, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };
  
  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Yetkisiz Erişim | Sensör Yönetim Sistemi</title>
      </Head>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Yetkisiz Erişim
            </Typography>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Bu sayfayı görüntülemek için yetkiniz bulunmamaktadır veya oturumunuzun süresi dolmuş olabilir.
            </Alert>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleLoginRedirect}
            >
              Giriş Yap
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={handleHomeRedirect}
            >
              Ana Sayfaya Dön
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default UnauthorizedPage;
