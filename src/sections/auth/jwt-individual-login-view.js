import { Alert, Box, Divider, Stack } from '@mui/material';
import React, { useState } from 'react'
import SanadLoginButton from './sanad-login-button';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useAuthContext } from 'src/auth/hooks';
import useTabs from 'src/hooks/use-tabs';
import { useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN, PASSWORD_RESET } from 'src/config-global';
import { t } from 'i18next';
import { LoadingScreen } from 'src/components/loading-screen';



export default function JwtIndividualLoginView() {
  const loginTabs = useTabs(['persons', 'establishments', 'royal_medical_services']);
  const router = useRouter();

  const { login, rmsLogin, loginWithSanad } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);


  const form = getForm([
    {
      label: 'national_id',
      fieldVariable: 'national_id',
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
          value: 11,
          message: 'Wrong_national_id',
        },

      ],
    },
    {
      label: 'password',
      fieldVariable: 'password',
      placeholder: 'password',
      type: 'input',
      inputType: 'password',
      typeValue: 'string',
      value: 'password123!',
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
    ...form.defaultValues,
  };

  const handleSubmit = async (data) => {
    const { national_id, password } = data;

    // Create the payload object with both fields
    const payload = {
      NationalNo: national_id,
      Password: password,
    };
    let loginFnc = login;

    if (loginTabs.currentTab === 2) {
      loginFnc = rmsLogin;
    }

    try {
      setLoading(true);
      await loginFnc?.(payload, () => {
        router.push(PATH_AFTER_LOGIN);
        setLoading(false);
      });
    } catch (error) {
      console.error(error.message);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <Box height="auto" >
      <Stack spacing={2.5} alignContent="center">
        {/* {!!errorMsg && <Alert severity="error">{t("Wrong_Credentials")}</Alert>} */}

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {/* {process.env.REACT_APP_ENVIRONMENT === 'development' &&

            <DynamicForm
              {...form}
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitButtonProps={{
                label: t('login'),
                alignment: 'center',
                width: '100%',
                loading,
              }}
            />
          } */}
          <DynamicForm
            {...form}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitButtonProps={{
              label: t('login'),
              alignment: 'center',
              width: '100%',
              loading,
            }}
          />
          {/* {process.env.REACT_APP_ENVIRONMENT !== 'development' &&
            <img
              src="/assets/images/sanad.png"
              alt="SANAD Logo"
            // height="auto"

            />} */}

        </Stack>
        {/* <Typography variant="body2" color="inherit">
        <RouterLink to={paths.auth.jwt.forgotPassword}>{t('forgot_password')}</RouterLink>
      </Typography> */}
      </Stack>
      {/* <Divider sx={{ my: 2 }}>{t('or')}</Divider> */}
      <Stack
        alignItems="center"
        gap={2}
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          mt: 2,
        }}
      >

        <SanadLoginButton />
        {/* <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to={paths.auth.jwt.register}
            >
              {t('register')}
            </Button> */}
      </Stack>
    </Box>
  )
}



