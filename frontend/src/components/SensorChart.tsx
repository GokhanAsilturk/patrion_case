import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorChart: React.FC<{ data: any; title?: string }> = ({ data, title }) => {
  // data: { labels: [...], datasets: [...] }
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>{title ?? 'Zaman Serisi Grafiği'}</Typography>
      <Line data={data} />
    </Paper>
  );
};

export default SensorChart;
