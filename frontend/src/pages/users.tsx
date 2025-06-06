import React from 'react';
import MainLayout from '../layouts/MainLayout';
import UserList from '../components/UserList';

const UsersPage: React.FC = () => {
  return (
    <MainLayout>
      <UserList />
    </MainLayout>
  );
};

export default UsersPage;
