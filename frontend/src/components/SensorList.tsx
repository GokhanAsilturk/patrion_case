import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getSensors } from '../redux/slices/sensorSlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { Sensor } from '../types/sensor';

const SensorList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sensors, loading, error } = useSelector((state: RootState) => state.sensors);

  useEffect(() => {
    dispatch(getSensors());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

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
