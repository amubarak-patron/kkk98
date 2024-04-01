import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useOnboardingTourContext } from 'src/components/onboarding-tour';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { useSessionStorage } from 'src/hooks/use-session-storage';
import { useLocales } from 'src/locales';
// sections
import MyOrdersView from 'src/sections/my-orders/view/my-orders-view';

// ----------------------------------------------------------------------

export default function MyOrdersPage() {
  const { t } = useLocales();
  const onBoarding = useOnboardingTourContext();
  const [onBoardingState, setOnboardingState] = useSessionStorage('onBoadring:my-orders', false);

  useEffect(() => {
    if (!onBoardingState) {
      setOnboardingState(true);
      onBoarding.onStart([
        {
          target: '[data-tour-id="accessiblity_toolbar"]',
          content: t('guided_tour.accessiblity_options'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="user_option_menu"]',
          content: t('guided_tour.user_option_menu'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="my_orders_btn"]',
          content: t('guided_tour.my_orders_btn'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="services_btn"]',
          content: t('guided_tour.services_btn'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="orders_filters"]',
          content: t('guided_tour.orders_filters'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="switch_orders_certificates"]',
          content: t('guided_tour.switch_orders_certificates'),
          disableBeacon: true,
        },
      ]);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: My Applications</title>
      </Helmet>

      <MyOrdersView />
    </>
  );
}
