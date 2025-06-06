import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getSensors } from '../../redux/slices/sensorSlice';
import MainLayout from '../../layouts/MainLayout';
import { Typography, Paper } from '@mui/material';
import SensorChart from '../../components/SensorChart';

const SensorDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const sensor = useSelector((state: RootState) =>
    state.sensors.sensors.find((s: { id: string }) => s.id === id)
  );

  useEffect(() => {
    if (!sensor) {
      dispatch(getSensors());
    }
  }, [dispatch, sensor]);

  const dummyChartData = {
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'],
    datasets: [
      {
        label: 'Sıcaklık (°C)',
        data: [22, 23, 24, 23, 22, 21],
        fill: false,
        borderColor: '#1976d2',
        tension: 0.1,
      },
    ],
  };

  if (!sensor) {
    return (
      <MainLayout>
        <Typography>Sensör bulunamadı.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Sensör Detayı</Typography>        <Typography><b>Ad:</b> {sensor.name}</Typography>
        <Typography><b>Tip:</b> {sensor.type}</Typography>
        <Typography><b>Şirket:</b> {sensor.companyName ?? '-'}</Typography>
        <Typography><b>Durum:</b> {sensor.status}</Typography>
        <SensorChart data={dummyChartData} title="Son 30 Dakika Sıcaklık Değeri" />
        {/* Analitik paneli ve diğer detaylar burada gösterilebilir */}
      </Paper>
    </MainLayout>
  );
};

export default SensorDetailPage;
