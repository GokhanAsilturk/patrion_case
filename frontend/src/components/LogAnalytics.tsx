import React from 'react';
import { Paper, Typography } from '@mui/material';

const LogAnalytics: React.FC = () => {
  // Dummy analytics data
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Log Analitikleri</Typography>
      <Typography>Toplam Log: 120</Typography>
      <Typography>Hata Logları: 8</Typography>
      <Typography>Uyarı Logları: 15</Typography>
      <Typography>Bilgi Logları: 97</Typography>
    </Paper>
  );
};

export default LogAnalytics;
