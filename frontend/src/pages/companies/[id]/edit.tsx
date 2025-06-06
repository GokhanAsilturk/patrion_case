import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../../layouts/MainLayout';
import CompanyForm from '../../components/CompanyForm';
import { RootState, AppDispatch } from '../../redux/store';
import { getCompanies, updateCompanyAsync } from '../../redux/slices/companySlice';

const EditCompanyPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = router.query;
  const company = useSelector((state: RootState) =>
    state.companies.companies.find((c) => c.id === id)
  );

  useEffect(() => {
    if (!company) {
      dispatch(getCompanies());
    }
  }, [dispatch, company]);

  const handleEdit = async (data: any) => {
    if (typeof id === 'string') {
      await dispatch(updateCompanyAsync({ id, company: data }));
      router.push('/companies');
    }
  };

  if (!company) return null;

  return (
    <MainLayout>
      <CompanyForm initialData={company} onSubmit={handleEdit} isEdit />
    </MainLayout>
  );
};

export default EditCompanyPage;
