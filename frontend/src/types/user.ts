export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  companyId?: string;
}
