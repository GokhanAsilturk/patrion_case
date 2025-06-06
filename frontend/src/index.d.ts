import { ReactNode } from 'react';

// Head bileşeni için type tanımlaması
declare module 'next/head' {
  export interface HeadProps {
    children: ReactNode;
  }

  export default function Head(props: HeadProps): JSX.Element;
}

// ProtectedRoute bileşeni için tip tanımlaması
declare module 'ProtectedRoute' {
  export interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: ('admin' | 'user')[];
  }
  
  export default function ProtectedRoute(props: ProtectedRouteProps): JSX.Element;
}

// MainLayout bileşeni için tip tanımlaması
declare module 'MainLayout' {
  export interface MainLayoutProps {
    children: ReactNode;
  }
  
  export default function MainLayout(props: MainLayoutProps): JSX.Element;
} 