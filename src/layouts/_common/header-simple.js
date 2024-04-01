import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Box, Button } from '@mui/material';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useLocales } from 'src/locales';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { AccessibilityToolbar } from 'src/components/accessibility';
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';
//
import { HEADER, NAV } from '../config-layout';
import { AccountPopover, NotificationsPopover, DateTimeOverview, LanguagePopover } from '../_common';
import NavSectionHorizontal from 'src/components/nav-section/horizontal/nav-section-horizontal';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { useSkipFirstRender } from 'src/hooks/use-skip-first-render';
import { useNavData } from '../dashboard/config-navigation';
import HelpButton from './help-button';
// ----------------------------------------------------------------------

export default function HeaderSimple({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const navData = useNavData()


  const { user, initialize } = useAuthContext();

  const { t } = useLocales();

  const isNavVertical = settings.themeLayout === 'vertical';

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;
  const { currentLang } = useLocales();

  const renderContent = (
    <>
      <Stack flexGrow={1} direction="row" alignItems="center">
        {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5, height: 60 }} />}

        {!lgUp && (
          <IconButton onClick={onOpenNav}>
            <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
          </IconButton>
        )}

        {smUp && settings.backRoute && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1, lg: 6 }}
            sx={{
              mx: 2,
            }}
          >
            <Button
              LinkComponent={RouterLink}
              href={settings.backRoute}
              variant="outlined"
              sx={{
                p: 1,
                backgroundColor: 'common.white',
              }}
              startIcon={
                (currentLang.value !== "ar") ? (

                  <SvgColor
                    sx={{
                      color: 'secondary.main',
                      transform: 'scale(-1, 1)'

                    }}
                    src="/assets/icons/designer/back.svg"
                  />
                ) : (<SvgColor
                  sx={{
                    color: 'secondary.main',
                  }}
                  src="/assets/icons/designer/back.svg"
                />)
              }
            >
              {t('back')}
            </Button>
          </Stack>
        )}

        {user && <AccountPopover />}
      </Stack>
      {lgUp &&

        (<Stack flexGrow={1} direction="row" alignItems="center" justifyContent="center">
          <NavSectionHorizontal
            data={navData}
            config={{
              currentRole: user?.role || 'admin',
            }}
          />
        </Stack>)
      }

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1, lg: 6 }}
      >
        <HelpButton />
        <LanguagePopover />


        {/* <NotificationsPopover /> */}

        {/* <ContactsPopover /> */}

        {/* <SettingsButton /> */}

        {/* <Searchbar /> */}

        {smUp && <DateTimeOverview />}
      </Stack>
    </>
  );


  return (
    <AppBar
      // position="absolute"
      sx={{
        height: HEADER.H_MOBILE,
        paddingBottom: 12,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...((isNavVertical || isNavMini) && {
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'common.white',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <AccessibilityToolbar />

      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

HeaderSimple.propTypes = {
  onOpenNav: PropTypes.func,
};
