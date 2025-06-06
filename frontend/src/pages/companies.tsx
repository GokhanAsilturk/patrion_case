import React from 'react';
import MainLayout from '../layouts/MainLayout';
import CompanyList from '../components/CompanyList';

const CompaniesPage: React.FC = () => {
  return (
    <MainLayout>
      <CompanyList />
    </MainLayout>
  );
};

export default CompaniesPage;
