import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getLogs } from '../redux/slices/logSlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const LogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, loading, error } = useSelector((state: RootState) => state.logs);

  useEffect(() => {
    dispatch(getLogs());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Log Listesi</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tarih</TableCell>
            <TableCell>Kullanıcı</TableCell>
            <TableCell>Tip</TableCell>
            <TableCell>Mesaj</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.user ?? '-'}</TableCell>
              <TableCell>{log.type}</TableCell>
              <TableCell>{log.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default LogList;
