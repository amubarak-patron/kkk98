import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Button, Link, Stack, Tooltip, Typography, Tabs, Tab, Grid, Container } from '@mui/material';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from 'src/components/logo';
import { useLocales } from 'src/locales';
import { usePathname, useRouter } from 'src/routes/hooks';
import useTabs from 'src/hooks/use-tabs';
import Footer from '../footer';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image, title }) {
  const { t } = useLocales();
  const pathname = usePathname();
  const { currentLang } = useLocales();
  const clipPath =
    currentLang.direction === 'rtl'
      ? 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)'
      : 'polygon(0 0, 100% 0, 100% 100%, 10% 100%)';

  const { method } = useAuthContext();

  const theme = useTheme();

  const upMd = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');

  const isTabActive = (path) => {
    return pathname.includes(path);
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Logo
          sx={{
            width: '160px',
          }}
        />
      </Box>
    </Stack>
  );

  const renderContent = <Box>{children}</Box>;

  return (
    <>
      <Box
        component="main"
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'background.default',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: {
                xs: '90%',
                lg: 600,
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: 'common.white',
                border: (t) => `solid 1px ${t.palette.divider}`,
                borderRadius: 1.5,
                boxShadow: (t) => t.customShadows.z20,
                py: 1,
                my: 1,
              }}
            >
              {renderHead}
              {renderContent}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: {
              xs: 'none',
              md: 'flex',
            },
            position: 'relative',
            minHeight: '100vh',
            clipPath: clipPath,
            backgroundColor: 'primary.main',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '99%',
              height: '100%',
              clipPath: clipPath,
              backgroundColor: 'primary.light',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '99%',
                height: '100%',
                clipPath: clipPath,
                backgroundColor: 'primary.lighter',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '99%',
                  height: '100%',
                  clipPath: clipPath,
                }}
              >
                {/* BG */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(/assets/images/moh_building.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Overlay with primary.main color */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: (t) => alpha(t.palette.common.black, 0.6),
                  }}
                />
                {/* Text in Center */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 4,
                  }}
                >
                  <Typography variant="h3" textAlign="center" color="common.white">
                    {t('eservice_portal')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>
      <Footer />

    </>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
