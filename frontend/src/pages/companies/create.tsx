import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import CompanyForm from '../../components/CompanyForm';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { createCompanyAsync } from '../../redux/slices/companySlice';
import { AppDispatch } from '../../redux/store';

const CreateCompanyPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleCreate = async (data: any) => {
    await dispatch(createCompanyAsync(data));
    router.push('/companies');
  };

  return (
    <MainLayout>
      <CompanyForm onSubmit={handleCreate} />
    </MainLayout>
  );
};

export default CreateCompanyPage;
