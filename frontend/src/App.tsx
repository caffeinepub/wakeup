import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CandidateRegistrationPage from './pages/CandidateRegistrationPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';
import EmployerRegistrationPage from './pages/EmployerRegistrationPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import JobPostingFormPage from './pages/JobPostingFormPage';
import PharmSearchPage from './pages/PharmSearchPage';
import PublicJobListingsPage from './pages/PublicJobListingsPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const candidateRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidate/register',
  component: CandidateRegistrationPage,
});

const candidateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidate/dashboard',
  component: CandidateDashboardPage,
});

const employerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/register',
  component: EmployerRegistrationPage,
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/dashboard',
  component: EmployerDashboardPage,
});

const jobNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/new',
  component: () => <JobPostingFormPage mode="create" />,
});

const jobEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/$id/edit',
  component: JobPostingFormPage,
});

const pharmSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/pharmsearch',
  component: PharmSearchPage,
});

const jobListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: PublicJobListingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  candidateRegisterRoute,
  candidateDashboardRoute,
  employerRegisterRoute,
  employerDashboardRoute,
  jobNewRoute,
  jobEditRoute,
  pharmSearchRoute,
  jobListingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
