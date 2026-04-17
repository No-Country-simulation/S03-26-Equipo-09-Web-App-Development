import { createRouter, Outlet, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DashboardPage } from '../pages/Dashboard';
import { ContactosPage } from '../pages/ContactosPage';
import { PipelinePage } from '../pages/PipelinePage';
import { SeguimientosPage } from '../pages/SeguimientosPage';
import { InboxPage } from '../pages/InboxPage';
import { PlantillasPage } from '../pages/PlantillasPage';
import MiInbox from '../pages/MiInbox';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';

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

/**
 * Layout del dashboard con guard de autenticación.
 * TODO_INTEGRATION: Cuando el backend tenga JWT real, este guard ya está preparado.
 */
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: DashboardLayout,
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    // También revisa localStorage para compatibilidad con la implementación anterior
    const legacyToken = localStorage.getItem('authToken');
    if (!isAuthenticated && !legacyToken) {
      throw redirect({ to: '/login' });
    }
  },
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const contactosRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/contactos',
  component: ContactosPage,
});

const pipelineRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/pipeline',
  component: PipelinePage,
});

const seguimientosRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/seguimientos',
  component: SeguimientosPage,
});

const inboxRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/inbox',
  component: InboxPage,
});

const miInboxRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/mi-inbox',
  component: MiInbox,
});

const plantillasRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/dashboard/plantillas',
  component: PlantillasPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    contactosRoute,
    pipelineRoute,
    seguimientosRoute,
    inboxRoute,
    miInboxRoute,
    plantillasRoute,
  ]),
]);

export const router = createRouter({ routeTree });