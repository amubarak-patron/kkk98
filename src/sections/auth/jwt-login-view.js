import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN, PASSWORD_RESET } from 'src/config-global';
// hooks
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import useTabs from 'src/hooks/use-tabs';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import ChangeLanguageDialog from 'src/layouts/_common/change-language-dialog';
import SvgColor from 'src/components/svg-color';
import { useGlobalPromptContext } from 'src/components/global-prompt';
import SanadLoginButton from './sanad-login-button';
import JwtIndividualLoginView from './jwt-individual-login-view';
import JwtInstitutionView from './jwt-institution-view/jwt-institution-view';
import JwtRMSLoginView from './jwt-rms-login-view';


// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { t, currentLang } = useLocales();

  const { login, rmsLogin, loginWithSanad } = useAuthContext();

  const router = useRouter();
  const loginTabs = useTabs(['persons', 'establishments', 'royal_medical_services']);

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get('returnTo');
  const globalDialog = useGlobalDialogContext();
  const globalPrompt = useGlobalPromptContext();

  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t('language'),
      content: <ChangeLanguageDialog />,
    });
  };



  useEffect(() => {
    if (loginTabs.currentTab === 1) {

    }
  }, [loginTabs.currentTab]);

  return (
    <>
      <ListItem
        sx={{
          display: 'inline-flex',
          width: 'fit-content',
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.2}>
          <SvgColor src="/assets/icons/designer/global.svg" color="secondary.main" />
          <ListItemText primary={t('language')} />
        </Stack>
        <Button
          onClick={onChangeLanguageDialogOpen}
          color="secondary"
          variant="contained"
          size="small"
        >{currentLang.label}</Button>
      </ListItem>

      <Tabs
        value={loginTabs.currentTab}
        onChange={loginTabs.changeTab}
        sx={{
          paddingX: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tab label={t('persons')} />
        <Tab label={t('establishments')} />
        <Tab label={t('royal_medical_services')} />
      </Tabs>

      <Box
        sx={{
          p: 2,
          minHeight: 450,
          maxHeight: 450,
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'common.white',
          "&::-webkit-scrollbar": {
            display: "block",
            width: "10px",
            height: "10px",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "8px",
            backgroundColor: t => alpha(t.palette.primary.main, 0.8),
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "primary.light",
          },
        }}
      >
        {loginTabs.currentTab === 0 && <JwtIndividualLoginView />}
        {loginTabs.currentTab === 1 && <JwtInstitutionView />}
        {loginTabs.currentTab === 2 && <JwtRMSLoginView />}
      </Box>
    </>
  );
}
