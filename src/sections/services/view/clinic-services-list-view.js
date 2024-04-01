// @mui
import { Container, Card, CardHeader, Box, Stack, TextField, alpha } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import ServiceCard from '../service-card';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { paths } from 'src/routes/paths';
import { useEffect, useState } from 'react'; // Import useEffect and useState
import axios from 'axios';
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';

// components
//

// ----------------------------------------------------------------------

export default function ServicesListView() {
  const { t } = useLocales();
  const settings = useSettingsContext();
  const [search, setSearch] = useState("")
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext()
  const mdUp = useResponsive('up', 'md');

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }


  useEffect(() => {

    axiosInstance
      .get(`${HOST_API}/GetServicesList`, { params: { isClinic: 1 } })
      .then((response) => {

        setServices([...response?.data.data])
        user.type = "entity"



      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false)
      })

  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>


      <Card >
        <Stack direction="row" justifyContent="space-between" spacing={2}>


          <CardHeader title={t('services/myClinic')} />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <TextField
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
        </Stack >
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
                .filter(
                  service => {
                    if (search) {
                      return service.service_Name?.toLowerCase()?.indexOf(search?.toLowerCase()) !== -1
                    }

                    return true
                  }
                )
                .map((service, index) => (
                  <Grid2 key={index} xs={12} sm={6} md={4} lg={3}>
                    <ServiceCard
                      {...{
                        ...service,
                        title: service.service_Name,
                        icon: (
                          <img src="/logo/coat-of-arms.png" alt="MOH Logo" width={64} height={64} />
                        ),
                        link: service.link ? service.link : paths.dashboard.clinic.services.form(service.service_code),
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