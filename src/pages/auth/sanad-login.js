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

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { t, currentLang } = useLocales();

  const { login, rmsLogin, loginWithSanad } = useAuthContext();

  const router = useRouter();
  const loginTabs = useTabs(['persons', 'establishments', 'royal_medical_services']);

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const sanadState = searchParams.get('state');
  const sanadCode = searchParams.get('code');
  const globalDialog = useGlobalDialogContext();
  const globalPrompt = useGlobalPromptContext();

  useEffect(() => {
    if (sanadState && sanadCode) {
      loginWithSanad({
        sanadState,
        sanadCode,
      }).then((res) => {
        // if (res) {
        //   router.push(PATH_AFTER_LOGIN);
        // }
      });
    }
  }, [sanadState, sanadCode]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <CircularProgress size={72} sx={{}} />
    </Box>
  );
}
