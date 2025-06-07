import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getCompanies } from '../redux/slices/companySlice';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';

const CompanyList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, loading, error } = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    try {
      console.log('Şirket verilerini getirme işlemi başlatılıyor...');
      dispatch(getCompanies())
        .then((result) => {
          console.log('Şirket verisi başarıyla alındı:', result);
        })
        .catch((error) => {
          console.error('Şirket verisi alınırken hata oluştu:', error);
        });
    } catch (error) {
      console.error('Dispatch sırasında hata:', error);
    }
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  // Dizi kontrolü ekleyelim
  const companiesList = Array.isArray(companies) ? companies : [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Şirket Listesi</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ad</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>Açıklama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companiesList.length > 0 ? (
            companiesList.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.status ?? '-'}</TableCell>
                <TableCell>{company.description ?? '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">Şirket bulunamadı</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CompanyList;
