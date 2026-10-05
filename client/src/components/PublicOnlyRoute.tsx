import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../features/auth/useAuth';

export function PublicOnlyRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}