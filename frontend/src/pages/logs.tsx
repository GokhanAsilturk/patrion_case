import React from 'react';
import MainLayout from '../layouts/MainLayout';
import LogList from '../components/LogList';
import LogAnalytics from '../components/LogAnalytics';

const LogsPage: React.FC = () => {
  return (
    <MainLayout>
      <LogList />
      <LogAnalytics />
    </MainLayout>
  );
};

export default LogsPage;
