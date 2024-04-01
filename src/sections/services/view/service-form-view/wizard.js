// @mui
import {
  Container,
  Card,
  CardHeader,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  AlertTitle,
  Stack,
  TextField,
} from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
import { useEffect, useRef, useState } from 'react';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { useBackRoute } from 'src/hooks/use-back-route';
import { useServiceFormContext } from './context';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { useParams, usePathname, useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import InputLabel from 'src/components/input-label/input-label';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import axiosInstance from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import ChooseSubSpeciality from './choose-subspeciality';
import { LoadingButton } from '@mui/lab';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useOnboardingTourContext } from 'src/components/onboarding-tour';


export default function ServiceFormWizard() {
  const { t, currentLang } = useLocales();
  const navigate = useNavigate();
  const onBoarding = useOnboardingTourContext()

  const settings = useSettingsContext();
  const { id } = useParams();
  const { state: locationState } = useLocation();
  const personNid = locationState?.personNid;
  const { user } = useAuthContext();
  const [nationalNumber, setNationalNumber] = useState('');
  const [dob, setDob] = useState('');
  const [rmsError, setRmsError] = useState('');
  const {
    handleFetchServiceInfo,
    handleFetchStakeHolderUserData,
    service,
    steps,
    loading,
    activeStep,
    handleNext,
    handleBack,
    orderNumber,
    stakeHolderErrors,
    otherId,
    setOtherId,
    info,
    hasPendingOrCompletedOrders,
    subSpeciality,
    handleLoading,
    userType,
    chosenMoheMajors,
  } = useServiceFormContext();
  const mustChooseSubSpeciality = service.subspeciality?.length > 0 && !subSpeciality;
  const router = useRouter();
  const pathname = usePathname();
  const isMyClinicPath = pathname.includes('my-clinic');
  const targetRoute = isMyClinicPath
    ? paths.dashboard.clinic.services.root
    : paths.dashboard.services.root;
  useBackRoute(targetRoute, true);

  const validateCitizenBirthdate = async (data) => {
    handleLoading('birthDateValidate', true);
    const response = await axiosInstance.post(`${HOST_API}/validateCitizenBirthdate`, {
      // NationalNumber: user.type === "rms" ? data.natNo_personId : data.personal_id,
      // Birthdate: moment(data.birth_date).locale('en').format('YYYY-MM-DD'),
      NationalNumber: nationalNumber,
      Birthdate: moment(dob).locale('en').format('YYYY-MM-DD'),
    });
    handleLoading('birthDateValidate', false);

    const isValid = response.data?.data?.isValid;
    // if dob is not 23 april 1993, show error
    if (!isValid) {
      setRmsError(t('entered_information_is_not_correct'));
      return;
    }

    setRmsError('');
    setOtherId(nationalNumber);
  };


  useEffect(() => {
    if (info > 0) {
      onBoarding.onStart([
        {
          target: '[data-tour-id="review_info"]',
          content: t('guided_tour.review_info'),
          disableBeacon: true,
        },
        {
          target: '[data-tour-id="wizard_next_btn"]',
          content: t('guided_tour.wizard_next_btn'),
          disableBeacon: true,
        },
      ]);
    }
  }, [info]);

  useEffect(() => {
    handleFetchServiceInfo(id);
  }, []);

  useEffect(() => {
    if (userType === 'user' || (userType !== 'user' && otherId)) {
      handleFetchStakeHolderUserData(id);
    }
  }, [userType, otherId, id]);

  useEffect(() => {
    if (personNid) {
      setOtherId(personNid);
    }
  }, [personNid]);

  if (
    loading.service ||
    (loading.userData && userType === 'user') ||
    (loading.userData && userType !== 'user' && otherId)
  )
    return <LoadingScreen />;
  // const certifyPerson = getForm([
  //   {
  //     label: user.type === "rms" ? ('natNo_personId') : "personal_id",
  //     fieldVariable: user.type === "rms" ? ('natNo_personId') : "personal_id",
  //     type: 'input',
  //     inputType: 'numeric-text',
  //     typeValue: 'string',
  //     value: '',
  //     placeholder: user.type === "rms" ? ('natNo_personId') : "personal_id",
  //     gridOptions: [
  //       {
  //         breakpoint: 'xs',
  //         size: 6,
  //       },
  //     ],
  //     validations: [
  //       {
  //         type: 'required',
  //         message: 'required',
  //       },
  //       {
  //         type: 'minLength',
  //         value: 10,
  //         message: 'Wrong_national_id',
  //       },

  //     ],
  //   },
  //   {
  //     label: 'birth_date',
  //     type: 'date',
  //     inputType: 'date',
  //     typeValue: 'string',
  //     fieldVariable: 'birth_date',
  //     placeholder: 'birth_date',
  //     gridOptions: [
  //       {
  //         breakpoint: 'xs',
  //         size: 6,
  //       },

  //     ],
  //     validations: [
  //       { type: 'required', message: 'required' },
  //     ],
  //   },
  // ]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          height: 2,
          pb: 5,
        }}
      >
        <CardHeader
          title={`${service.Name}${subSpeciality
            ? ` (${service.subspeciality.find((item) => item.value === subSpeciality)['name']})`
            : ''
            } ${info.isRenewal ? ` - ${t('renewal')}` : ''}`}
        />
      </Box>

      {!hasPendingOrCompletedOrders ? (
        <Card>
          {mustChooseSubSpeciality && <ChooseSubSpeciality />}

          {!mustChooseSubSpeciality && userType !== 'user' && !otherId && (
            <Stack direction="column" justifyContent="center" alignItems="center">
              <Stack direction="column" gap={1}>
                {rmsError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 1,
                    }}
                  >
                    <AlertTitle>{rmsError}</AlertTitle>
                  </Alert>
                )}
                <Stack direction="column">
                  <TextField
                    onChange={(e) => {
                      setNationalNumber(e.target.value);
                    }}
                    label={userType === 'RMS' ? t('natNo_personId') : t('personal_id')}
                  />
                </Stack>
                <Stack direction="column">
                  <DatePicker
                    maxDate={new Date()}
                    format={'dd/MM/yyyy'}
                    onChange={(value) => setDob(value)}
                    label={t('date_of_birth')}
                  />
                </Stack>
              </Stack>
              <LoadingButton
                variant="contained"
                onClick={validateCitizenBirthdate}
                loading={loading.birthDateValidate}
                sx={{ mt: 1 }}
              >
                {t('next')}
              </LoadingButton>
              {/* {rmsError && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 1,
                  }}
                >
                  <AlertTitle>{rmsError}</AlertTitle>
                </Alert>
              )} */}
              {/* <DynamicForm
                {...certifyPerson}
                // defaultValues={defaultValues}
                onSubmit={validateCitizenBirthdate}
                submitButtonProps={{
                  label: t('login'),
                  alignment: 'center',
                  width: '100%',
                }}
              /> */}
            </Stack>
          )}

          {!mustChooseSubSpeciality &&
            ((userType !== 'user' && otherId) || userType === 'user') && (
              <>
                <Stepper activeStep={activeStep} orientation="horizontal">
                  {steps.map((step, index) => {
                    return (
                      <Step key={index}>
                        <StepLabel>
                          <Typography variant="body1" fontWeight="fontWeightBold">
                            {step.label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {steps.map((step, index) => {
                  const StepComponent = step.component;

                  if (!step || index !== activeStep) return null;

                  return (
                    <Box mt={2} key={index}>
                      <StepComponent />
                      {index < steps.length - 1 && (
                        <Box sx={{ mb: 2 }}>
                          <div>
                            <Button
                              disabled={index === 0}
                              onClick={handleBack}
                              variant="contained"
                              color="primary"
                              sx={{ mt: 1, mr: 1, display: index === 0 && 'none' }}
                            >
                              {t('back')}
                            </Button>
                            <Button
                              onClick={() => {
                                navigate(targetRoute);
                              }}
                              variant="contained"
                              color="primary"
                              sx={{ mt: 1, mr: 1, display: index !== 0 && 'none' }}
                            >
                              {t('back')}
                            </Button>
                            <LoadingButton
                              variant="contained"
                              color="primary"
                              onClick={handleNext}
                              sx={{ mt: 1, mr: 1 }}
                              loading={loading.submit}
                              disabled={
                                // info?.stakeholders?.filter(sh => sh.stakeholder_data.length === 0)?.length > 0
                                // ||
                                info?.stakeholders?.filter((sh) => sh.is_down)?.length > 0 ||
                                stakeHolderErrors.length > 0 ||
                                info.length < 3 ||
                                loading.info || loading['MOHE'] || loading['MOJ']
                              }
                            >
                              {index === steps.length - 1 ? t('send') : t('next')}
                            </LoadingButton>


                          </div>
                        </Box>
                      )}
                    </Box>
                  );
                })}

                {activeStep === steps.length && (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="success">
                      <AlertTitle>{t('order_sent_successfully')}</AlertTitle>
                      <Typography component="p">
                        {t('order_sent_successfully_description')}
                      </Typography>
                      <Typography variant="body1">
                        {orderNumber}
                        {/* {orderNumber && orderNumber.split(':')[1]?.trim()} */}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        LinkComponent={RouterLink}
                        to={paths.dashboard.root}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {t('my_orders')}
                      </Button>
                    </Alert>
                  </Box>
                )}
              </>
            )}
        </Card>
      ) : (
        <Alert severity="warning">
          <AlertTitle>{t('moh_can_not_apply')}</AlertTitle>

          <Button
            variant="contained"
            size="small"
            LinkComponent={RouterLink}
            to={paths.dashboard.services.root}
            sx={{ mt: 1, mr: 1 }}
          >
            {t('browse_services')}
          </Button>
        </Alert>
      )}
    </Container>
  );
}
