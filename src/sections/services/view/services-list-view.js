// @mui
import { Container, Card, CardHeader, Box, Stack, TextField, alpha } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import ServiceCard from '../service-card';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { paths } from 'src/routes/paths';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify';
import { useOnboardingTourContext } from 'src/components/onboarding-tour';
import { useSessionStorage } from 'src/hooks/use-session-storage';

// components
//

// ----------------------------------------------------------------------

export default function ServicesListView() {
  const { initialize } = useAuthContext();

  const { t } = useLocales();
  const settings = useSettingsContext();
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const mdUp = useResponsive('up', 'md');
  const onBoarding = useOnboardingTourContext();
  const [onBoardingState, setOnboardingState] = useSessionStorage('onBoadring:service-list', false);


  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    // initialize()
    // user?.clinic && (user.type = "user")

    axiosInstance

      .get(`${HOST_API}/GetServicesList`)
      .then((response) => {
        if (user?.type === 'user' && !user?.clinic) {
          setServices([
            ...response.data.data,
            {
              service_Name: t('register_clinic'),
              link: paths.dashboard.services.clinicRegistration,
              service_code: 1000,
            },
          ]);
        } else {
          setServices([...response?.data.data]);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (services.length > 0 && !onBoardingState) {
      setOnboardingState(true);
      onBoarding.onStart([
        {
          target: '[data-tour-id="services_intro"]',
          content: t('guided_tour.services_intro'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="services_search"]',
          content: t('guided_tour.services_search'),
          disableBeacon: true,
        },
      ]);
    }
  }, [services.length]);

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card data-tour-id="services_intro">
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <CardHeader title={t('services')} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <TextField
              data-tour-id="services_search"
              variant="filled"
              sx={{ minHeight: '15', font: 'black', borderRadius: 1 }}
              onChange={handleSearch}
              value={search}
              placeholder={t('search_services')}
              InputProps={{
                startAdornment: (
                  <Iconify
                    icon="bi:search"
                    sx={{
                      color: '#ED706B',
                    }}
                  />
                ),
              }}
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: 2,
            px: 1,
            maxHeight: mdUp ? 'calc(100vh - 280px)' : 'calc(100vh - 224px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              display: 'block',
              width: '10px',
              height: '10px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '8px',
              backgroundColor: (t) => alpha(t.palette.primary.main, 0.8),
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          {loading ? (
            <p>جاري التحميل</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <Grid2 container spacing={2}>
              {services
                .filter((service) => {
                  if (search) {
                    return (
                      service.service_Name?.toLowerCase()?.indexOf(search?.toLowerCase()) !== -1
                    );
                  }

                  return true;
                })
                .map((service, index) => (
                  <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
                    <ServiceCard
                      {...{
                        ...service,
                        title: service.service_Name,
                        link: service.link
                          ? service.link
                          : paths.dashboard.services.form(service.service_code),
                      }}
                    />
                  </Grid2>
                ))}
              <Grid2 xs={12} sm={6} md={4} lg={3}>
                {/* <ServiceCard
                title={t("register_clinic")}
                icon={<img src="/logo/coat-of-arms.png" alt="MOH Logo" width={64} height={64} />}
                link={paths.dashboard.services.clinicRegistration}
              /> */}
              </Grid2>
            </Grid2>
          )}
        </Box>
      </Card>
    </Container>
  );
}
