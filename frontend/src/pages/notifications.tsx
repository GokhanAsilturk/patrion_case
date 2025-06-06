import React from 'react';
import MainLayout from '../layouts/MainLayout';
import NotificationList from '../components/NotificationList';
import ToastNotification from '../components/ToastNotification';

const NotificationsPage: React.FC = () => {
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('');
  const [toastSeverity, setToastSeverity] = React.useState<'success' | 'info' | 'warning' | 'error'>('info');  // Toast bildirimi göstermek için kullanılan fonksiyon
  const showToast = (msg: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setToastMsg(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  return (
    <MainLayout>
      <NotificationList onNotificationClick={showToast} />
      <ToastNotification open={toastOpen} message={toastMsg} severity={toastSeverity} onClose={() => setToastOpen(false)} />
    </MainLayout>
  );
};

export default NotificationsPage;
