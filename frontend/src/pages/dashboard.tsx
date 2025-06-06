import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Box,
  Chip
} from '@mui/material';
import { 
  SensorsOutlined, 
  WarningAmber, 
  CheckCircleOutline, 
  ErrorOutline 
} from '@mui/icons-material';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  active: '#4caf50',
  inactive: '#9e9e9e',
  maintenance: '#ff9800',
  error: '#f44336',
};

// Test verileri - Gerçek uygulamada API'den alınacak
const dummyData = {
  totalSensors: 24,
  activeSensors: 19,
  inactiveSensors: 2,
  maintenanceSensors: 1,
  errorSensors: 2,
  recentAlerts: [
    { id: 1, message: 'Sıcaklık sensörü kritik seviyeyi aştı', severity: 'error', timestamp: '2023-06-25T10:30:00Z' },
    { id: 2, message: 'Nem sensörü bağlantısı koptu', severity: 'warning', timestamp: '2023-06-25T09:15:00Z' },
    { id: 3, message: 'Basınç sensörü normal değerlere döndü', severity: 'info', timestamp: '2023-06-24T18:22:00Z' },
  ],
  sensorTypes: [
    { name: 'Sıcaklık', count: 8 },
    { name: 'Nem', count: 5 },
    { name: 'Basınç', count: 4 },
    { name: 'Hareket', count: 3 },
    { name: 'Gaz', count: 2 },
    { name: 'Diğer', count: 2 },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(dummyData);

  // Gerçek uygulamada, burada API'den dashboard verileri alınacak
  useEffect(() => {
    // API'den verileri al
    // setData(apiResponseData);
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard | Sensör İzleme Platformu</title>
      </Head>
      <MainLayout>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Hoş Geldiniz, {user?.name || 'Kullanıcı'}
        </Typography>

        {/* Özet Kartları */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Toplam Sensörler
              </Typography>
              <Typography component="p" variant="h3">
                {data.totalSensors}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                <SensorsOutlined />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  tüm sensörler
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Aktif Sensörler
              </Typography>
              <Typography component="p" variant="h3">
                {data.activeSensors}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutline sx={{ color: statusColors.active }} />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  normal çalışıyor
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Bakımdaki Sensörler
              </Typography>
              <Typography component="p" variant="h3">
                {data.maintenanceSensors}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                <WarningAmber sx={{ color: statusColors.maintenance }} />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  bakımda
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Hatalı Sensörler
              </Typography>
              <Typography component="p" variant="h3">
                {data.errorSensors}
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                <ErrorOutline sx={{ color: statusColors.error }} />
                <Typography variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  müdahale gerekiyor
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Alt Bölüm */}
        <Grid container spacing={3}>
          {/* Son Uyarılar */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title="Son Uyarılar" />
              <CardContent>
                {data.recentAlerts.length > 0 ? (
                  data.recentAlerts.map((alert) => (
                    <Box 
                      key={alert.id} 
                      sx={{ 
                        p: 2, 
                        mb: 1, 
                        bgcolor: 'background.paper',
                        borderLeft: 4, 
                        borderColor: 
                          alert.severity === 'error' 
                            ? 'error.main' 
                            : alert.severity === 'warning' 
                              ? 'warning.main' 
                              : 'info.main'
                      }}
                    >
                      <Typography variant="body1">{alert.message}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {new Date(alert.timestamp).toLocaleString('tr-TR')}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">Henüz bir uyarı bulunmuyor.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sensör Tipleri */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardHeader title="Sensör Tipleri" />
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.sensorTypes.map((type) => (
                    <Chip 
                      key={type.name}
                      label={`${type.name}: ${type.count}`}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Dashboard; 