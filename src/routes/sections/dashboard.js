import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import MyOrdersPage from 'src/pages/dashboard/my-orders/list';
import MyClinicOrdersPage from 'src/pages/dashboard/my-clinic/applications/list';
import { paths } from '../paths';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/my-orders/list'));
const SettingsPage = lazy(() => import('src/pages/dashboard/settings/settings'));
const ServicesListPage = lazy(() => import('src/pages/dashboard/services/list'));
const ServicesFormPage = lazy(() => import('src/pages/dashboard/services/form'));
const ClinicRegisterPage = lazy(() => import('src/pages/dashboard/services/clinicRegister'));
// const ClinicAppsPage = lazy(() => import('src/pages/dashboard/my-clinic/applications'));
// const ClinicServicesPage = lazy(() => import('src/pages/dashboard/my-clinic/services'));
const ClinicServicesPage = lazy(() => import('src/pages/dashboard/my-clinic/services/list'));





// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'services',
        children: [
          {
            index: true,
            element: <ServicesListPage />,
          },
          {
            path: ':id',
            element: <ServicesFormPage />,
          },
          {
            path: 'clinic-registration',
            element: <ClinicRegisterPage />,
          },
          // {
          //   path: 'clinicServices',
          //   element: <ClinicServicesPage />,
          // },

        ],
      },
      {
        path: 'my-clinic',
        children: [
          {
            index: true,
            path: '',
            element: <Navigate to={paths.dashboard.clinic.applications} replace />,
          },
          {
            path: 'services',
            children: [
              {
                index: true,
                element: <ClinicServicesPage />,
              },
              {
                path: ':id',
                element: <ServicesFormPage />,
              },
            ]
          },
          {
            path: 'applications',
            children: [
              {
                index: true,
                element: <MyClinicOrdersPage />,
              },

            ]
          },

        ],
      },
    ],
  },
];
