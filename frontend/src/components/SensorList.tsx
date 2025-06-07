import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getSensors } from '../redux/slices/sensorSlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button, Box, Alert } from '@mui/material';
import { Sensor } from '../types/sensor';
import { useRouter } from 'next/router';

const SensorList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sensors, loading, error } = useSelector((state: RootState) => state.sensors);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getSensors())
        .unwrap()
        .catch((error) => {
          if (error === 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.') {
            router.push('/unauthorized');
          }
        });
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [dispatch, isAuthenticated, user, router]);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <Paper sx={{ p: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.
        </Alert>
        <Box display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoginRedirect}
          >
            Giriş Yap
          </Button>
        </Box>
      </Paper>
    );
  }

  if (loading) return <CircularProgress />;
  if (error) return (
    <Paper sx={{ p: 2 }}>
      <Alert severity="error">{error}</Alert>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => dispatch(getSensors())}
        >
          Yeniden Dene
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Sensör Listesi</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ad</TableCell>
            <TableCell>Tip</TableCell>
            <TableCell>Şirket</TableCell>
            <TableCell>Durum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sensors.map((sensor: Sensor) => (
            <TableRow key={sensor.id}>
              <TableCell>{sensor.name}</TableCell>
              <TableCell>{sensor.type}</TableCell>
              <TableCell>{sensor.companyName ?? '-'}</TableCell>
              <TableCell>{sensor.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default SensorList;
