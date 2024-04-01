import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Button, Switch } from '@mui/material';
// routes
import { useRouter } from 'src/routes/hooks';
// hooks
import { useLocales } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import { useAccessibilityContext } from 'src/components/accessibility';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import SvgColor from 'src/components/svg-color/svg-color';
import Label from 'src/components/label/label';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import TextMaxLine from 'src/components/text-max-line';
import ChangeLanguageDialog from './change-language-dialog';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
  '& .svg-color': {
    width: 20,
    flexShrink: 0,
    color: theme.palette.secondary.main,
  },
}));

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const accessibility = useAccessibilityContext();

  const { t, currentLang } = useLocales();

  const { user } = useAuthContext();

  const { logout } = useAuthContext();

  const globalDialog = useGlobalDialogContext();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (path) => {
    popover.onClose();
    if (path) {
      router.push(path);
    }
  };

  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t('language'),
      content: <ChangeLanguageDialog />,
    });
  };
  useEffect(() => {
  }, []);

  const renderAvatarUsername = user && (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        textAlign: 'left',
      }}
    >
      {/* <Avatar
        src={user?.photoURL}
        alt={user?.displayName}
        sx={{
          width: 48,
          height: 48,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
          borderRadius: 1.5,
        }}
      /> */}
      <Box>
        <TextMaxLine variant="body2" fontWeight="fontWeightBold" line={2}>
          {user?.fullName}
        </TextMaxLine>
        {user?.desc && <Typography component="p" variant="caption" color="GrayText" sx={{
          p: 0,
          m: 0
        }}>{user.desc}</Typography>}
      </Box>
    </Box>
  );

  return (
    <div data-tour-id='user_option_menu'>

      <Button component={m.button} onClick={popover.onOpen}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            textAlign: 'left',
          }}
        >
          {renderAvatarUsername}
          <Iconify icon="eva:arrow-ios-downward-fill" width={20} height={20} />
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        hiddenArrow
        sx={{ width: 200, p: 0, backgroundColor: 'common.white' }}
      >
        {/* <Box sx={{ p: 2, pb: 1.5 }}>{renderAvatarUsername}</Box> */}

        <Divider />

        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          {/* <StyledMenuItem onClick={() => handleClickItem(paths.dashboard.settings)}>
            <SvgColor src="/assets/icons/designer/account.svg" />
            {t('my_account')}
          </StyledMenuItem> */}
          {/* <StyledMenuItem>
            <SvgColor src="/assets/icons/designer/shield.svg" />
            {t('support')}
          </StyledMenuItem> */}
          <StyledMenuItem onClick={() => handleClickItem(paths.dashboard.settings)}>
            <SvgColor src="/assets/icons/designer/settings.svg" />
            {t('settings')}
          </StyledMenuItem>
        </Stack>

        <Divider />

        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          <StyledMenuItem
            onClick={onChangeLanguageDialogOpen}
            sx={{
              justifyContent: 'space-between',
            }}
          >
            {<Stack direction="row" gap={1}>
              <SvgColor src="/assets/icons/designer/global.svg" />
              {t('language')}
            </Stack>}

            <Label color="secondary">{currentLang.label}</Label>
          </StyledMenuItem>
          <StyledMenuItem onClick={accessibility.onToggleColorBlind}>
            <Stack direction="row" gap={1}>
              <SvgColor src="/assets/icons/designer/color-swatch.svg" />
              {t('color_blind_mode')}
            </Stack>
            <Switch checked={accessibility.colorBlind} />
          </StyledMenuItem>
        </Stack>
        <Divider />
        <Stack
          direction="column"
          sx={{
            p: 1,
          }}
        >
          <StyledMenuItem onClick={handleLogout}>
            <SvgColor src="/assets/icons/designer/logout.svg" />
            {t('logout')}
          </StyledMenuItem>
        </Stack>
      </CustomPopover>
    </div>
  );
}
