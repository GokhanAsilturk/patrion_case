export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}
