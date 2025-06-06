import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SensorList from '../components/SensorList';

const SensorsPage: React.FC = () => {
  return (
    <MainLayout>
      <SensorList />
    </MainLayout>
  );
};

export default SensorsPage;
