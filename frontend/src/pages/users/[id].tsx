import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import MainLayout from '../../layouts/MainLayout';
import { Typography, Paper } from '@mui/material';

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const user = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === id)
  );

  if (!user) {
    return (
      <MainLayout>
        <Typography>Kullanıcı bulunamadı.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Kullanıcı Profili</Typography>
        <Typography><b>Ad:</b> {user.name}</Typography>        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Rol:</b> {user.role}</Typography>
        <Typography><b>Şirket:</b> {user.companyId || '-'}</Typography>
      </Paper>
    </MainLayout>
  );
};

export default UserProfilePage;
