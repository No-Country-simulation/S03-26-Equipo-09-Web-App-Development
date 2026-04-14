import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DashboardPage } from '../pages/Dashboard';
import { ContactosPage } from '../pages/Contactos';
import { MetricasPage } from '../pages/Metricas';
import InboxPage from '../pages/Inbox';
import MiInboxPage from '../pages/MiInbox';
import Vendedores from '../pages/Vendedores';
import Plantillas from '../features/plantillas/pages/Plantillas';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: DashboardLayout,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const contactosRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/contactos',
  component: ContactosPage,
});

const metricasRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/metricas',
  component: MetricasPage,
});

const inboxRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/inbox',
  component: InboxPage,
});

const miInboxRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/mi-inbox',
  component: MiInboxPage,
});

const vendedoresRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/vendedores',
  component: Vendedores,
});

const plantillasRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/plantillas',
  component: Plantillas,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    contactosRoute,
    metricasRoute,
    inboxRoute,
    miInboxRoute,
    vendedoresRoute,
    plantillasRoute,
  ]),
]);

export const router = createRouter({ routeTree });

// Registro para seguridad de tipos
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
