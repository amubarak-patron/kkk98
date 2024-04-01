import { useEffect, useMemo, useState } from 'react';
// locales
import { useLocales } from 'src/locales';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/designer/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();

  const { t } = useLocales();
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        // subheader: t('overview'),
        items: [
          {
            title: t('home'),
            path: paths.dashboard.root,
            icon: icon('navbar/strict-tracking'),
            guest: true,
            border: true,
          },
          {
            title: t('my_orders'),
            path: paths.dashboard.root,
            icon: icon('navbar/my-apps'),
            auth: true,
            border: true,
            'data-tour-id': 'my_orders_btn',
          },
          {
            title: t('services'),
            path: paths.dashboard.services.root,
            icon: icon('navbar/services'),
            auth: true,
            border: true,
            'data-tour-id': 'services_btn',
          },
          ...(user?.clinic?.InActive
            ? [
                {
                  title: t('my_clinic'),
                  path: '#',
                  icon: icon('navbar/clinic'),
                  auth: true,

                  children: [
                    {
                      title: t('clinic_services'),
                      path: paths.dashboard.clinic.services.root,
                      icon: icon('navbar/services'),
                      auth: true,
                    },
                    {
                      title: t('clinic_applications'),
                      path: paths.dashboard.clinic.applications,
                      icon: icon('navbar/my-apps'),
                      auth: true,
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    ],
    [t, user?.clinic?.InActive]
  );

  return data;
}
