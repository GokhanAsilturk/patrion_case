import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastNotificationProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ open, message, severity = 'info', onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
