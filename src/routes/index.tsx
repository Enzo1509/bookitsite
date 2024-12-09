import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProfessionalLayout from '@/layouts/ProfessionalLayout';
import HomePage from '@/pages/HomePage';
import CategoryLayout from '@/layouts/CategoryLayout';
import BusinessListPage from '@/pages/BusinessListPage';
import BusinessPage from '@/pages/BusinessPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminBusinessesPage from '@/pages/admin/AdminBusinessesPage';
import AdminBusinessEditPage from '@/pages/admin/AdminBusinessEditPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminUserEditPage from '@/pages/admin/AdminUserEditPage';
import ProfessionalLoginPage from '@/pages/professional/ProfessionalLoginPage';
import ProfessionalDashboardPage from '@/pages/professional/ProfessionalDashboardPage';
import ProfessionalBusinessPage from '@/pages/professional/ProfessionalBusinessPage';
import ProfessionalBookingsPage from '@/pages/professional/ProfessionalBookingsPage';
import { useAuthStore } from '@/store/authStore';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'professional' }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : requiredRole === 'professional' ? '/pro/login' : '/'} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favoris',
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':category',
        element: <CategoryLayout />,
        children: [
          { index: true, element: <BusinessListPage /> },
          { path: ':businessId', element: <BusinessPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'businesses',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminBusinessesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'businesses/:businessId',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminBusinessEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/:userId',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminUserEditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/pro',
    element: <ProfessionalLayout />,
    children: [
      { path: 'login', element: <ProfessionalLoginPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredRole="professional">
            <ProfessionalDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'business',
        element: (
          <ProtectedRoute requiredRole="professional">
            <ProfessionalBusinessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings',
        element: (
          <ProtectedRoute requiredRole="professional">
            <ProfessionalBookingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);