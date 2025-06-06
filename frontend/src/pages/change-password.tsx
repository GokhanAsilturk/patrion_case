import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Alert } from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import authApi from '../api/authApi';

const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor!');
      setIsLoading(false);
      return;
    }

    try {
      await authApi.changePassword({
        currentPassword: oldPassword,
        newPassword: newPassword
      });
      
      setSuccess('Şifre başarıyla değiştirildi!');
      // Form'u temizle
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Şifre değiştirme işlemi başarısız oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" gutterBottom>Şifre Değiştir</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Mevcut Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <TextField
            label="Yeni Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <TextField
            label="Yeni Şifre (Tekrar)"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </Button>
        </form>
      </Paper>
    </MainLayout>
  );
};

export default ChangePasswordPage;
