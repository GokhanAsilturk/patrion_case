import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getNotifications } from '../redux/slices/notificationSlice';
import { CircularProgress, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

interface NotificationListProps {
  onNotificationClick?: (msg: string, severity: 'success' | 'info' | 'warning' | 'error') => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onNotificationClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Bildirimler</Typography>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <ListItemText
              primary={notification.title}
              secondary={notification.message}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationList;
