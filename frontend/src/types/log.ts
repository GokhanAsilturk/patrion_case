export interface Log {
  id: string;
  date: string;
  user: string;
  type: 'error' | 'warning' | 'info';
  message: string;
}

export interface LogState {
  logs: Log[];
  loading: boolean;
  error: string | null;
}
