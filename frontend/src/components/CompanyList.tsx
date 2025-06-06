import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getCompanies } from '../redux/slices/companySlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const CompanyList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, loading, error } = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Şirket Listesi</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ad</TableCell>
            <TableCell>Adres</TableCell>
            <TableCell>Telefon</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.address || '-'}</TableCell>
              <TableCell>{company.phone || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CompanyList;
