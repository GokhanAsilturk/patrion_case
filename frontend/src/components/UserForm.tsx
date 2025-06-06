import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, MenuItem } from '@mui/material';
import { User, UserRole } from '../types/user';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => void;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData = {}, onSubmit, isEdit }) => {
  const [form, setForm] = useState<Partial<User>>({
    name: initialData.name ?? '',
    email: initialData.email ?? '',
    role: initialData.role ?? undefined,
    companyId: initialData.companyId ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Oluştur'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ad"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Rol"
          name="role"
          value={form.role ?? ''}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
          <MenuItem value={UserRole.USER}>Kullanıcı</MenuItem>
        </TextField>
        <TextField
          label="Şirket"
          name="companyId"
          value={form.companyId ?? ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {isEdit ? 'Kaydet' : 'Oluştur'}
        </Button>
      </form>
    </Paper>
  );
};

export default UserForm;
