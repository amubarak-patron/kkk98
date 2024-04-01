import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { useContext } from 'react';


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
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_REGISTER } from 'src/config-global';
// hooks
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Logo from 'src/components/logo/logo';
import useTabs from 'src/hooks/use-tabs';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { AuthContext } from 'src/auth/context/auth-context';
import { useRequest } from 'alova';

// ----------------------------------------------------------------------

export default function JwtOTPView() {
  const { t } = useLocales();

  // const { register } = useAuthContext();
  const savedData = localStorage.getItem('registrationData');
  const registrationData = JSON.parse(savedData);
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false)
  const returnTo = searchParams.get('returnTo');
  const { register } = useAuthContext();


  const form = getForm([
    {
      label: 'otp',
      fieldVariable: 'otp',
      type: 'input',
      inputType: 'numeric-text',
      typeValue: 'string',
      value: "",
      placeholder: 'otp',
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
      ],
    },

  ]);


  const defaultValues = {
    ...form.defaultValues,
  };



  const handleSubmit = (async (otp) => {
    if (registrationData) {
      registrationData.OTP = otp.otp;
      const payload =
        registrationData


    }

    try {
      setLoading(true);
      await register?.(registrationData, () => {
        router.push("/");
        localStorage.removeItem("registrationData")
        setLoading(false)
      });
    } catch (error) {
      setLoading(false)

      setErrorMsg(error.message);

    }

  }
  )

  const renderForm = (
    <Stack spacing={2.5}>

      <DynamicForm
        {...form}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitButtonProps={{
          label: t('send'),
          alignment: 'center',
          width: '100%',
          loading
        }}
      />

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}
    </Stack>
  );

  return (
    <Box sx={{}}>
      <Typography variant="h5" textAlign="center">
        {t('otpMessage')}
      </Typography>

      <Box
        sx={{
          p: 2,
          backgroundColor: 'common.white',
        }}
      >
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        {renderForm}
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

        </Stack>
      </Box>
    </Box>
  );
}
