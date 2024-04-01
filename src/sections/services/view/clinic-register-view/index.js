import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useSettingsContext } from 'src/components/settings';
import { HOST_API } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import axiosInstance from 'src/utils/axios';
import { paths } from 'src/routes/paths';

export default function ClinicRegisterView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { initialize } = useAuthContext();
  const router = useRouter();

  const form = getForm([
    {
      label: 'clinic_name',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'Name',
      placeholder: 'clinic_name',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      validations: [{ type: 'required', message: 'required' }],
    },
    {
      label: 'letter_number',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'LetterNo',
      placeholder: 'letter_number',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      validations: [{ type: 'required', message: 'required' }],
    },
    {
      label: 'letter_date',
      type: 'date',
      inputType: 'date',
      typeValue: 'string',
      fieldVariable: 'LetterDate',
      placeholder: 'letter_date',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      validations: [{ type: 'required', message: 'required' }, {
        type: 'max',
        value: "today"

      }],
    },
    {
      label: 'letter_file',
      fieldVariable: 'LetterAttach',
      placeholder: 'letter_file',
      type: 'upload',
      typeValue: 'array',
      value: [],
      // multiple: true,

      uploadStrategy: 'tempId',
      destinationApi: `${HOST_API}/UploadAttachment`,
      destinationApiToken: '',
      destinationExtraArgs: {
        Location: 77,
      },
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      maxFileSize: '2048',
      allowedExtensions: ['png', 'jpg', 'bmp', 'heif', 'jpeg', 'pdf'],
      validations: [{ type: 'min', value: 1, message: 'required' }],

      responseFileNameKey: 'attachment.attachmentID',
    },
    {
      disabled: true,
      label: 'phone_number',
      type: 'phonefield',
      typeValue: 'string',
      fieldVariable: 'Phone',
      placeholder: 'phone_number',
      defaultCountry: 'jo',
      hideDialCodePicker: true,
      value: user?.phoneNumber,
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      validations: [{ type: 'required', message: 'required' }],
    },
    {
      disabled: true,
      label: 'email',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'Email',
      placeholder: 'email',
      value: user?.email,
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 4,
        },
      ],
      validations: [{ type: 'required', message: 'required' }],
    },
  ]);
  console.log(user);
  const defaultValues = {
    ...form.defaultValues,
    Email: user?.email,
    Phone: '+962' + (user?.phone.startsWith('0') ? user?.phone.slice(1) : user?.phone),
    NationalNo: user?.nationalNo,
  };
  const handleSubmit = async (data) => {
    setLoading(true);
    setSubmitted(true);
    axiosInstance
      .post(`${HOST_API}/AddClinic`, {
        ...data,
        LetterAttach: data.LetterAttach[0],
        LetterDate: moment(data.LetterDate).locale('en').format('YYYY-MM-DD'),
      })
      .then(async (response) => {
        // setSuccess(true)
        // await promise settimout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setSuccess(true);

        initialize();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {
        <Card>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              pb: 3,
            }}
          >
            {t('clinic_registration')}
          </Typography>

          {!loading && !success && submitted && (
            <Box
              sx={{
                py: 2,
              }}
            >
              <Alert severity="error">{t('entity_reg_fail')}</Alert>
            </Box>
          )}

          {loading && <CircularProgress />}

          {success && (
            <Box
              sx={{
                py: 2,
              }}
            >
              <Alert severity="success">
                {t('entity_req_submitted')}
                <Box
                  sx={{
                    margin: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => router.push(paths.dashboard.services.root)}
                  >
                    {t('browse_services')}
                  </Button>
                </Box>
              </Alert>
            </Box>
          )}

          {!success && !submitted && (
            <Box>
              <DynamicForm
                {...form}
                onSubmit={handleSubmit}
                defaultValues={defaultValues}
                validationMode="onChange"
                submitButtonProps={{
                  alignment: 'left',
                  width: 200,
                }}
                loading={loading}
              />
            </Box>
          )}
        </Card>
      }
    </Container>
  );
}
