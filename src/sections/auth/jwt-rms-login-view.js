import { Alert, Box, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import SanadLoginButton from './sanad-login-button';
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
import { LoadingScreen } from 'src/components/loading-screen';



export default function JwtRMSLoginView() {
  const router = useRouter();

  const { rmsLogin } = useAuthContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  let loginFnc = rmsLogin;

  const loginForm = getForm([
    {
      label: 'national_id',
      fieldVariable: 'NationalNo',
      type: 'input',
      inputType: 'numeric-text',
      typeValue: 'string',
      value: '',
      placeholder: 'national_id',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
      ],
      validations: [
        {
          type: 'required',
          message: 'required',
        },
        {
          type: 'minLength',
          value: 10,
          message: 'Wrong_national_id',
        },
        {
          type: 'maxLength',
          value: 12,
          message: 'Wrong_national_id',
        },

      ],
    },
    {
      label: 'password',
      fieldVariable: 'Password',
      placeholder: 'password',
      type: 'input',
      inputType: 'password',
      typeValue: 'string',
      value: '',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
      ],
      validations: [
        {
          type: 'required',
          message: 'required',
        },
        {
          type: 'pattern',
          value: /^(?=(.*\d))(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]/,
          message: 'Password_schema_error',
        },
        {
          type: 'minLength',
          value: 8,
          message: 'Password_length_error_short',
        },
        {
          type: 'maxLength',
          value: 32,
          message: 'Password_length_error_long',
        },
      ],
    },
  ]);

  const defaultValues = {
    ...loginForm.defaultValues,
  };


  const handleLogin = async (payload) => {
    try {
      setLoading(true);
      await loginFnc?.(payload, () => {
        router.push(PATH_AFTER_LOGIN);
        setLoading(false);
      });
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };



  return (
    <Box >
      <Stack spacing={2.5}>
        {!!error && <Alert severity="error">{t("Wrong_Credentials")}</Alert>}

        <Stack spacing={2.5}>
          <DynamicForm
            {...loginForm}
            defaultValues={defaultValues}
            onSubmit={handleLogin}
            submitButtonProps={{
              label: t('login'),
              alignment: 'center',
              width: '100%',
              loading,
            }}
          />
        </Stack>
      </Stack>
    </Box>

  )
}



