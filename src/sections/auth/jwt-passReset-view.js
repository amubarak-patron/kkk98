import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Alert, Box, Button, Stack, AlertTitle } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useLocales } from 'src/locales';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import InputLabel from 'src/components/input-label/input-label';
import axiosInstance from 'src/utils/axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function JwtPasswordResetView() {
  const { t } = useLocales();
  const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const [otpError, setOtpError] = useState();

  const ChangePasswordSchema = Yup.object().shape({
    national_id: Yup.string()
      .required(t('validation_required'))
      .min(10, t('Wrong_national_id'))
      .max(11, t('Wrong_national_id')),
    password: updatedData
      ? Yup.string()
        .required(t('validation_required'))
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, t('Password_schema_error'))
      : Yup.string(),
    confirm_password: updatedData
      ? Yup.string()
        .required(t('validation_required'))
        .oneOf([Yup.ref('password'), null], t('passwords_must_match'))
      : Yup.string(),
    otp: updatedData ? Yup.string().required(t('validation_required')) : Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  let payload = {};

  const handleOnSubmit = async (data) => {
    setError(null);
    setOtpError(null);
    // Construct payload based on the existence of updatedData
    if (!updatedData) {
      payload = {
        nationalNo: data.national_id,
        Password: data.password,
        confirmPassword: data.confirm_password,
        OTP: null,
      };
    } else {
      payload = {
        nationalNo: data.national_id,
        Password: data.password,
        confirmPassword: data.confirm_password,
        OTP: data.otp,
      };
    }

    axiosInstance
      .post(`${HOST_API}/ForgetPassword`, { ...payload })
      .then((response) => {
        setLoading(false);
        setUpdatedData(payload);
        if (payload.OTP) {
          setMessage(response.data.responseMessage);
          setOtpError(null);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        if (payload.OTP) {
          setOtpError(true);
        }
      });
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'common.white',
      }}
    >
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
        {!message && !updatedData ? (
          <Stack direction="column" gap={2}>
            <Stack direction="column">
              <InputLabel label={t('national_id')} />
              <RHFTextField name="national_id" placeholder={t('national_id')} type="number" />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                mt: 4,
                backgroundColor: '#186E55',
                '&:hover': {
                  backgroundColor: '#135245',
                },
              }}
            >
              {t('change_password')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to={paths.auth.jwt.login}
              fullWidth
              sx={{ mt: 2 }}
            >
              {t('back')}
            </Button>
          </Stack>
        ) : !message ? (
          <Stack direction="column">
            <Stack direction="column" gap={2}>
              <Stack direction="column">
                <InputLabel label={t('new_password')} />
                <RHFTextField name="password" placeholder={t('new_password')} type="password" />
              </Stack>
              <Stack direction="column">
                <InputLabel label={t('confirm_new_password')} />
                <RHFTextField
                  name="confirm_password"
                  placeholder={t('confirm_new_password')}
                  type="password"
                />
              </Stack>
              <Stack direction="column">
                <InputLabel label={t('otp')} />
                <RHFTextField name="otp" placeholder={t('otp')} />
              </Stack>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isSubmitting}
              fullWidth
              sx={{
                mt: 4,
              }}
            >
              {t('send')}
            </Button>
          </Stack>
        ) : (
          <>
            <Alert severity="success">
              <AlertTitle>{t('data_updated_successfully')}</AlertTitle>
            </Alert>
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to={paths.auth.jwt.login}
              fullWidth
              sx={{ mt: 2 }}
            >
              {t('login')}
            </Button>
          </>
        )}
      </FormProvider>
    </Box>
  );
}
