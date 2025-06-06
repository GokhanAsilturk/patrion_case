import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../../layouts/MainLayout';
import UserForm from '../../components/UserForm';
import { RootState, AppDispatch } from '../../redux/store';
import { getUsers, updateUserAsync } from '../../redux/slices/userSlice';

const EditUserPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = router.query;
  const user = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === id)
  );

  useEffect(() => {
    if (!user) {
      dispatch(getUsers());
    }
  }, [dispatch, user]);

  const handleEdit = async (data: any) => {
    if (typeof id === 'string') {
      await dispatch(updateUserAsync({ id, user: data }));
      router.push('/users');
    }
  };

  if (!user) return null;

  return (
    <MainLayout>
      <UserForm initialData={user} onSubmit={handleEdit} isEdit />
    </MainLayout>
  );
};

export default EditUserPage;
