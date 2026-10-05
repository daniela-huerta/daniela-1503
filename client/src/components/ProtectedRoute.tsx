import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../features/auth/useAuth';

export function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}