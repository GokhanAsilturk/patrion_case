import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <MainLayout>
        <Typography>Yükleniyor...</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom>Profilim</Typography>
        <Typography><b>Ad Soyad:</b> {user.name}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Rol:</b> {user.role}</Typography>
        {user.companyId && (
          <Typography><b>Şirket ID:</b> {user.companyId}</Typography>
        )}
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }} 
          fullWidth 
          onClick={() => router.push('/change-password')}
        >
          Şifreyi Değiştir
        </Button>
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }} 
          fullWidth 
          onClick={() => router.back()}
        >
          Geri Dön
        </Button>
      </Paper>
    </MainLayout>
  );
};

export default ProfilePage;
