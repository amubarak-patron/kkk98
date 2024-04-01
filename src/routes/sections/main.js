import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/404'));
const VLCertificate = lazy(() => import('src/pages/general/vl-certificate'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <>
        <CompactLayout>
          <Outlet />
        </CompactLayout>
        {/* <Outlet /> */}
      </>
    ),
    children: [
      { path: '404', element: <Page404 /> },
      { path: 'vl-certificate', element: <VLCertificate /> },

    ],

  },

];
