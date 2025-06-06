import React, { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { Company } from '../types/company';

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  isEdit?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ initialData = {}, onSubmit, isEdit }) => {
  const [form, setForm] = useState<Partial<Company>>({
    name: initialData.name || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
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
        {isEdit ? 'Şirketi Düzenle' : 'Yeni Şirket Oluştur'}
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
          label="Adres"
          name="address"
          value={form.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telefon"
          name="phone"
          value={form.phone}
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

export default CompanyForm;
