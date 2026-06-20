import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) return <div>Initializing...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicRoute() {
  const { isAuthenticated, isInitialized } = useAuth();
  if (!isInitialized) return <div>Initializing...</div>;
  return isAuthenticated ? <Navigate to="/tournaments" replace /> : <Outlet />;
}
