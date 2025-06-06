import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import UserForm from '../../components/UserForm';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { createUserAsync } from '../../redux/slices/userSlice';
import { AppDispatch } from '../../redux/store';

const CreateUserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleCreate = async (data: any) => {
    await dispatch(createUserAsync(data));
    router.push('/users');
  };

  return (
    <MainLayout>
      <UserForm onSubmit={handleCreate} />
    </MainLayout>
  );
};

export default CreateUserPage;
