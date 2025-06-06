import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

// Material UI tema yapılandırması
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store} children={
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider children={
          <Component {...pageProps} />
        } />
      </ThemeProvider>
    } />
  );
}

export default MyApp; 