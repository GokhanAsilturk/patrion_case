import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Form doğrulama şeması
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi zorunludur'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre zorunludur'),
});

const LoginPage = () => {
  const { login, error, isLoading, clearError, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  // Error state değişikliklerini izle ve alert'i göster
  React.useEffect(() => {
    if (error) {
      setShowAlert(true);
    }
  }, [error]);

  // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);
  // Form gönderimi
  const handleSubmit = async (values: { email: string; password: string }) => {
    setShowAlert(false);
    try {
      await login(values);
      // Login başarılı olduğunda AuthContext bizi yönlendirecek
    } catch (err) {
      console.error('Login error:', err);
      setShowAlert(true);
      // Hata zaten AuthContext tarafından yönetiliyor
    }
  };

  // Form yönetimi
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Head>
        <title>Giriş Yap | Sensör İzleme Platformu</title>
      </Head>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            <Typography component="h1" variant="h5" mb={3}>
              Sensör İzleme Platformu
            </Typography>
            <Typography component="h2" variant="h6" mb={3}>
              Giriş Yap
            </Typography>            {error && showAlert && (
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%', mb: 2 }}
                onClose={() => {
                  clearError();
                  setShowAlert(false);
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {error}
                </Typography>
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                sx={{ mt: 2 }}
                required
                fullWidth
                id="email"
                label="E-posta Adresi"
                name="email"
                autoComplete="email"
                autoFocus
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={isLoading}
              />
              <TextField
                sx={{ mt: 2 }}
                required
                fullWidth
                name="password"
                label="Şifre"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Giriş Yap'}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button variant="text" size="small">
                    Şifremi Unuttum
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;