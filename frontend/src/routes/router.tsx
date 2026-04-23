import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TopBar from '../components/TopBar';
import LoginPage from '../components/LoginPage';

const BerryMap = lazy(() => import('../components/BerryMap'));

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});

const authenticatedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <TopBar />
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Outlet />
      </Box>
    </Box>
  ),
});

const mapRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/',
  component: () => (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      }
    >
      <BerryMap />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedLayout.addChildren([mapRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
      }}
    >
      <CircularProgress />
    </Box>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
