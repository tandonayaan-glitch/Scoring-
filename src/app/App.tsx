import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Providers } from './providers';
import { ProtectedRoute, PublicRoute } from './router';

const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const TournamentListPage = lazy(() => import('@/pages/TournamentListPage').then((m) => ({ default: m.TournamentListPage })));

function PageLoader() {
  return <div className="flex h-screen items-center justify-center bg-slate-900">Loading...</div>;
}

const router = createBrowserRouter([
  { element: <PublicRoute />, children: [{ path: '/login', element: <LoginPage /> }] },
  { element: <ProtectedRoute />, children: [{ path: '/tournaments', element: <TournamentListPage /> }] },
  { path: '/', element: <Navigate to="/tournaments" replace /> },
]);

export function App() {
  return (
    <Providers>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}
