import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SensorList from '../components/SensorList';
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../types/user';

const SensorsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.USER]}>
      <MainLayout>
        <SensorList />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SensorsPage;
