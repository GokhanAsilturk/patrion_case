import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getUsers } from '../redux/slices/userSlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Kullanıcı Listesi</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ad</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Şirket</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.companyId ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default UserList;
