import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';



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
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { HOST_API, PATH_AFTER_LOGIN, PATH_AFTER_REGISTER } from 'src/config-global';
// hooks
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Logo from 'src/components/logo/logo';
import DynamicForm from 'src/components/dynamic-form/dynamic-form';
import { getForm } from 'src/components/dynamic-form';
import { register } from 'src/utils/api';
import shortid from 'shortid';
import { useRequest } from 'alova';
import React, { useContext } from 'react';
import { AuthContext } from 'src/auth/context/auth-context';
import axiosInstance from 'src/utils/axios';
import SvgColor from 'src/components/svg-color';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import ChangeLanguageDialog from 'src/layouts/_common/change-language-dialog';




// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { t, currentLang } = useLocales();
  const auth = useContext(AuthContext);


  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');
  const globalDialog = useGlobalDialogContext();

  const [loading, setLoading] = useState('');
  const { send } = useRequest(register, {
    immediate: false,

  });
  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t('language'),
      content: <ChangeLanguageDialog />,
    });
  };



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
        {
          breakpoint: 'md',
          size: 6,
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
      type: 'select',
      fieldVariable: 'verification_type',

      label: 'verification_type',
      // tip: 'verification_type',
      placeholder: 'verification_type',
      isAffectedByOtherFields: false,
      affectingFields: [],
      optionsSourceType: 'manual',
      optionsSourceApi: '',
      optionsSourceApiToken: '',
      optionsSourceApiValueKey: '',
      optionsSourceApiLabelKey: '',
      options: [
        {
          label: 'id_number',
          value: '1',
        },
        {
          label: 'civil_number',
          value: '2',
        },
      ],
      fields: [],
      row: true,
      multiline: null,
      rows: '',
      value: '1',
      validations: [
        {
          type: 'required',
          dependent_field: '',
          value: '',
          message: 'required',
        },
      ],
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 6,
        },
      ],
      visibilityRules: [],
    },
    {
      type: 'input',
      inputType: 'text',
      fieldVariable: 'id_number',
      label: 'id_number',
      // tip: 'id_number',
      placeholder: 'id_number',
      isAffectedByOtherFields: false,
      affectingFields: [],
      optionsSourceType: null,
      optionsSourceApi: '',
      optionsSourceApiToken: '',
      optionsSourceApiValueKey: '',
      optionsSourceApiLabelKey: '',
      options: [],
      fields: [],
      multiline: false,
      rows: '',
      value: '',
      visibilityRules: [
        {
          field: 'verification_type',
          operator: '===',
          value: '1',
        },
      ],
      validations: [
        {
          type: 'required',
          dependent_field: '',
          value: '',
          message: 'required',
        },
      ],
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 6,
        },
      ],
    },
    {
      type: 'input',
      inputType: 'text-two-steps',
      inputSteps: 2,
      fieldVariable: 'civil_number',
      label: 'civil_number',
      // tip: 'civil_number',
      placeholder: 'civil_number',
      isAffectedByOtherFields: false,
      affectingFields: [],
      optionsSourceType: null,
      optionsSourceApi: '',
      optionsSourceApiToken: '',
      optionsSourceApiValueKey: '',
      optionsSourceApiLabelKey: '',
      options: [],
      fields: [],
      multiline: false,
      rows: '',
      value: '',
      visibilityRules: [
        {
          field: 'verification_type',
          operator: '===',
          value: '2',
        },
      ],
      validations: [
        {
          type: 'required',
          dependent_field: '',
          value: '',
          message: 'required',
        },
      ],
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
      ],
    },
    {
      type: 'input',
      fieldVariable: 'phone_number',
      label: 'phone_number',
      // tip: 'phone_number',
      placeholder: 'phone_number',
      optionsSourceType: null,
      optionsSourceApi: '',
      optionsSourceApiToken: '',
      optionsSourceApiValueKey: '',
      optionsSourceApiLabelKey: '',
      options: [],
      fields: [],
      multiline: 'false',
      rows: '4',
      value: '',
      validations: [
        {
          type: 'required',
          dependent_field: '',
          value: '',
          message: 'required',
        },
        {
          type: 'phone',
          dependent_field: '',
          value: '',
          message: 'invalid_phone',
        },

      ],
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 6,
        },
      ],
    },
    {
      type: 'input',
      inputType: 'text',
      fieldVariable: 'email',
      label: 'email',
      // tip: 'email',
      placeholder: 'email',
      isAffectedByOtherFields: false,
      affectingFields: [],
      optionsSourceType: null,
      optionsSourceApi: '',
      optionsSourceApiToken: '',
      optionsSourceApiValueKey: '',
      optionsSourceApiLabelKey: '',
      options: [],
      fields: [],
      multiline: null,
      rows: '',
      value: '',
      validations: [
        {
          type: 'required',
          dependent_field: '',
          value: '',
          message: 'required',
        },
        {
          type: 'email',
          dependent_field: '',
          value: '',
          message: 'invalid_email',
        },
      ],
      gridOptions: [
        { breakpoint: 'xs', size: 12 },
        { breakpoint: 'md', size: 6 },
      ],
      visibilityRules: [],
    },
    {
      label: 'password',
      fieldVariable: 'password',
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
        {
          breakpoint: 'md',
          size: 6,
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
    {
      label: 'confirm_password',
      fieldVariable: 'confirm_password',
      placeholder: 'confirm_password',
      type: 'input',
      inputType: 'password',
      typeValue: 'string',
      value: '',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 6,
        },
      ],
      validations: [
        {
          type: 'required',
          message: 'required',
        },
        {
          type: 'confirmPassword',
          message: 'passwords_must_match',
        },
      ],
    },
  ]);

  const defaultValues = {
    ...form.defaultValues,
  };

  const handleSubmit = (data) => {
    setLoading(true);
    const {
      national_id,
      verification_type,
      id_number,
      civil_number,
      phone_number,
      email,
      password,
      confirm_password,
    } = data;

    const payload = {
      NationalNo: national_id,
      CardNO: id_number,
      CIV_NO: civil_number,
      Email: email,
      Phone: phone_number,
      Password: password,
      confirmPassword: confirm_password,
      RegisterChannel_Code: '001',
      OTP: ""
    };




    axiosInstance
      .post(`${HOST_API}/JordanianUserRegister`, payload)
      .then((response) => {
        router.push(PATH_AFTER_REGISTER)
        localStorage.setItem('registrationData', JSON.stringify(payload));
        setLoading(false)

      })
      .catch((error) => {
        console.error('Request error:', error);
        setErrorMsg(error.message);
        setLoading(false)

      });
  }





  const renderForm = (
    <Stack spacing={2.5}>
      <DynamicForm
        {...form}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitButtonProps={{
          label: t('register'),
          alignment: 'center',
          width: '100%',
          loading
        }}

      />
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

    </Stack>
  );

  return (
    <>
      <ListItem
        sx={{
          display: 'inline-flex',
          width: 'fit-content',
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.5}>
          <SvgColor src="/assets/icons/designer/global.svg" color="secondary.main" />
          <ListItemText primary={t('language')} />
        </Stack>
        <Button
          onClick={onChangeLanguageDialogOpen}
          color="secondary"
          variant="contained"
          size="small"
        >
          {currentLang.label}
        </Button>
      </ListItem>
      <Box sx={{}}>

        <Typography variant="h5" textAlign="center">
          {t('register')}
        </Typography>

        <Box
          sx={{
            p: 2,
            backgroundColor: 'common.white',
          }}
        >

          {renderForm}

          <Divider sx={{ my: 2 }}>{t('or')}</Divider>
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
            <Button
              fullWidth
              variant="contained"
              component={RouterLink}
              to={paths.auth.register}
              startIcon={<img src="/logo/sanad-logo.png" style={{ width: 60 }} />}
            >
              {t('login_with_sanad')}
            </Button>
            <Button fullWidth variant="outlined" component={RouterLink} to={paths.auth.jwt.login}>
              {t('login')}
            </Button>

          </Stack>

        </Box>

      </Box>
    </>
  );
}
