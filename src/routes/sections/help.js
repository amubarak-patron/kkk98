import { lazy } from 'react';


// ----------------------------------------------------------------------


const HelpPage = lazy(() => import('src/pages/general/help'))

// ----------------------------------------------------------------------

export const HelpRoute = [
  {
    path: 'help',


    children: [

      {
        path: ':id',
        element: <HelpPage />,
      },
    ]

  },

];
