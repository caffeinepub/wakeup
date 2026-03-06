import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CandidateDashboardPage from "./pages/CandidateDashboardPage";
import CandidateRegistrationPage from "./pages/CandidateRegistrationPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import EmployerRegistrationPage from "./pages/EmployerRegistrationPage";
import JobPostingFormPage from "./pages/JobPostingFormPage";
import LandingPage from "./pages/LandingPage";
import PharmSearchPage from "./pages/PharmSearchPage";
import PublicJobListingsPage from "./pages/PublicJobListingsPage";

// Stable named wrapper so TanStack Router doesn't remount on every render
function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function JobNewPage() {
  return <JobPostingFormPage mode="create" />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const candidateRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/register",
  component: CandidateRegistrationPage,
});

const candidateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/dashboard",
  component: CandidateDashboardPage,
});

const employerRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employer/register",
  component: EmployerRegistrationPage,
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employer/dashboard",
  component: EmployerDashboardPage,
});

const jobNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employer/jobs/new",
  component: JobNewPage,
});

const jobEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employer/jobs/$id/edit",
  component: JobPostingFormPage,
});

const pharmSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employer/pharmsearch",
  component: PharmSearchPage,
});

const jobListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jobs",
  component: PublicJobListingsPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
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
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
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
