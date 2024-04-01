import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import SanadLoginButton from '../sanad-login-button';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useAuthContext } from 'src/auth/hooks';
import useTabs from 'src/hooks/use-tabs';
import { useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN, PASSWORD_RESET, HOST_API } from 'src/config-global';
import { t } from 'i18next';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { set } from 'lodash';
import axiosInstance from 'src/utils/axios';
import LoginView from './login-view';
import RegisterationView from './registeration-view';

import { useGlobalDialogContext } from 'src/components/global-dialog';


export default function JwtInstitutionView() {
  const router = useRouter();

  const { login, rmsLogin, loginWithSanad } = useAuthContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const globalDialog = useGlobalDialogContext();


  const handleOpenRegisterDialog = () => {
    globalDialog.onOpen({
      title: t('inst_registration'),
      content: (
        <Box p={2}>
          <RegisterationView />
        </Box>
      ),
      dialogProps: {
        maxWidth: 'md'
      }
    });
  }

  return (
    <Box    >
      <Stack spacing={2.5}>
        <Box>
          <LoginView />
          <Box>
            <Divider variant="body2" color="inherit" align="center" sx={{
              my: 2
            }}>
              {t("or")}
            </Divider>

            <Button variant="contained" onClick={handleOpenRegisterDialog} fullWidth>
              {t('inst_registration')}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}



