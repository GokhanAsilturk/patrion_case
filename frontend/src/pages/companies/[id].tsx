import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getCompanies } from '../../redux/slices/companySlice';
import MainLayout from '../../layouts/MainLayout';
import { Typography, Paper } from '@mui/material';

const CompanyDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const company = useSelector((state: RootState) =>
    state.companies.companies.find((c) => c.id === id)
  );

  useEffect(() => {
    if (!company) {
      dispatch(getCompanies());
    }
  }, [dispatch, company]);

  if (!company) {
    return (
      <MainLayout>
        <Typography>Şirket bulunamadı.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Şirket Detayı</Typography>
        <Typography><b>Ad:</b> {company.name}</Typography>
        <Typography><b>Adres:</b> {company.address ?? '-'}</Typography>
        <Typography><b>Telefon:</b> {company.phone ?? '-'}</Typography>
        {/* Şirket sensörleri ve diğer detaylar burada gösterilebilir */}
      </Paper>
    </MainLayout>
  );
};

export default CompanyDetailPage;
