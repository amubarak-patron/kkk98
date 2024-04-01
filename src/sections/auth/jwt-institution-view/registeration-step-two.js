import { Alert, AlertTitle, Box, Button, Dialog, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
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
import VerifyOTPDialog from 'src/sections/_common/verify-otp-dialog';
import Timer from 'src/sections/services/view/service-form-view/timer';
import { useGlobalDialogContext } from 'src/components/global-dialog';



export default function RegisterationStepTwo({ regData, setRegData }) {
  const router = useRouter();
  const { registerInstitute } = useAuthContext();
  const [timer, setTimer] = useState(0)
  const [stepTwoData, setStepTwoData] = useState(regData)


  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendOTPCounter, setResendOTPCounter] = useState(0)
  const [showOTP, setShowOTP] = useState(false)
  const OTP_RESEND_INTERVAL_SECONDS = 300;
  const [success, setSuccess] = useState(false)
  const [wrongOtp, setWrongOtp] = useState(false)
  const globalDialog = useGlobalDialogContext();


  const startTimer = () => {
    if (!timer) {
      setTimer(OTP_RESEND_INTERVAL_SECONDS)
    }
    console.log(timer, "timer from reset");

  }
  useEffect(() => {
    console.log(stepTwoData)
  }, [stepTwoData])
  const stepTwoForm = getForm([
    {
      disabled: true,
      label: 'inst_type',
      fieldVariable: 'EntityCategory',
      type: "select",
      typeValue: 'string',
      value: '001',
      options: [
        {
          label: "individual_institution",
          value: "001"
        },
        {
          label: "companies",
          value: "002"
        },
        {
          label: "societies",
          value: "003"
        }
      ],
      placeholder: 'inst_type',
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
      ],
    },
    {
      disabled: true,
      label: 'health_inst_type',
      fieldVariable: 'EntityType',
      type: "select",
      typeValue: 'string',
      value: "",
      options: [
        {
          label: "pharmacy",
          value: "Pharmacy"
        },
        {
          label: "dental_facility",
          value: "Dental"
        },
        {
          label: "other",
          value: "Other "
        }
      ],
      placeholder: 'health_inst_type',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        }, {
          breakpoint: 'md',
          size: 6,
        },
      ],
      validations: [
        {
          type: 'required',
          message: 'required',
        },
      ],
    },
    {
      disabled: true,
      label: 'inst_national_id',
      fieldVariable: 'nationalNo',
      type: 'input',
      inputType: 'numeric-text',
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
        }
      ],
    },
    {
      disabled: true,
      label: 'inst_registration_number',
      fieldVariable: 'regNo',
      type: 'input',
      inputType: 'numeric-text',
      typeValue: 'string',
      value: '',
      placeholder: 'inst_registration_number',
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
      visibilityRules: [
        {
          field: "EntityCategory",
          operator: "!==",
          value: "003",
        },
      ],
      validations: [
        {
          type: 'required',
          message: 'required',
        },
      ],
    },
    {
      disabled: true,
      label: 'inst_rep_national_id',
      fieldVariable: 'LiaisonOfficerNationalNo',
      type: 'input',
      inputType: 'numeric-text',
      typeValue: 'string',
      value: '',
      placeholder: 'inst_rep_national_id',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'xs',
          size: 6
        }
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
      disabled: true,
      label: "inst_rep_birth_date",
      type: 'date',
      inputType: 'date',
      typeValue: 'string',
      fieldVariable: 'Birthdate',
      placeholder: "inst_rep_birth_date",
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'xs',
          size: 6
        }
      ],
      validations: [
        { type: 'required', message: 'required' },
        {
          type: 'max',
          value: "today"
        }
      ],

    },
    ////////////
    {
      disabled: true,
      label: 'inst_name',
      fieldVariable: 'Name',
      type: "input",
      typeValue: 'string',
      disabled: true,
      placeholder: 'inst_name',
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
      ],
    },
    {
      disabled: true,
      label: 'rep_name',
      fieldVariable: 'ResponsiblePerson',
      type: "input",
      typeValue: 'string',
      placeholder: 'rep_name',
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
      ],
    },
    {
      label: 'letter_file',
      fieldVariable: 'LetterAttach',
      placeholder: 'letter_file',
      type: 'upload',
      typeValue: 'array',
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

      ],
      maxFileSize: '2048',
      allowedExtensions: [
        "png",
        "jpg",
        "bmp",
        "heif",
        "jpeg",
        "pdf",
      ],
      responseFileNameKey: 'attachment.attachmentID',
    },
    {
      label: 'inst_phone_number',
      type: "phonefield",
      typeValue: 'string',
      fieldVariable: 'Phone',
      placeholder: 'inst_phone_number',
      defaultCountry: 'jo',
      hideDialCodePicker: true,
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
        { type: 'required', message: 'required' },
        { type: 'phone', message: 'Jordanian_number_validation_962' },

      ],
    },
    {
      label: 'inst_email',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'Email',
      placeholder: 'inst_email',
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
        { type: 'required', message: 'required' },
        { type: 'email', message: 'invalid_email' },
      ],
    },
    {
      label: 'inst_rep_phone_number',
      type: "phonefield",
      typeValue: 'string',
      fieldVariable: 'LiaisonOfficerPhone',
      placeholder: 'inst_rep_phone_number',
      defaultCountry: 'jo',
      hideDialCodePicker: true,
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
        { type: 'required', message: 'required' },
        { type: 'phone', message: 'Jordanian_number_validation_962' },

      ],
    },
    {
      label: 'inst_rep_email',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'LiaisonOfficerEmail',
      placeholder: 'inst_rep_email',
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
        { type: 'required', message: 'required' },
        { type: 'email', message: 'invalid_email' },
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

        { type: 'matchField', field: 'Password', message: 'passwords_must_match', },

      ],
    },

  ]);
  const defaultValues = {
    ...stepTwoForm.defaultValues,
    ...stepTwoData
  };

  const handleSubmit = async (regData) => {
    const { LiaisonOfficerPhone, LiaisonOfficerEmail,
      Phone,
      Email
    } = { ...regData }
    setStepTwoData(regData)

    const payload = {
      Email: regData.Email,
      nationalNo: regData.nationalNo,
      Password: regData.Password,
      Name: regData.Name,
      Phone: regData.Phone,
      Email: regData.Email,
      EntityType: regData.EntityType,
      EntityCategory: regData.EntityCategory,
      LiaisonOfficerNationalNo: regData.LiaisonOfficerNationalNo,
      LiaisonOfficerPhone: regData.LiaisonOfficerPhone,
      LiaisonOfficerEmail: regData.LiaisonOfficerEmail,
      LetterAttach: regData.LetterAttach,
      otp: ""

    }

    setRegData(payload)
    axiosInstance.post(`${HOST_API}/EntityRegister`, { ...payload })
      .then((response) => {
        // Success Message
      })
      .catch((error) => {
        setError(error)
        setShowOTP(true)
        startTimer()
      })
      .finally(() => setLoading(false));
    console.log(payload, "data")


  }


  const resendOTP = () => {
    setResendOTPCounter(prev => prev + 1)
    handleSubmit(regData)
    setWrongOtp(false)


  }

  useEffect(() => {
    if (timer > 0) { // if started
      setTimeout(() => {
        setTimer(currTimer => currTimer - 1)
      }, 1000);
    }
  }, [timer])

  const verifyOTP = async (data) => {
    console.log(data, "from otp")
    console.log(regData, "from otp")
    axiosInstance.post(`${HOST_API}/EntityRegister`, {
      ...regData,
      otp: data.otp,
    })
      .then((response) => {
        setSuccess(true)
        console.log("sent")
      }


      )
      .catch((error) => {
        setError(error)
        setWrongOtp(true)

      })
      .finally(() => setLoading(false));
  }
  const VERIFY_OTP_FORM_FIELDS = [
    {
      type: "otp",
      fieldVariable: "otp",
      label: "otp_to_LiaisonOfficerNumber",
      // tip: "otp",
      gridOptions: [
        {
          breakpoint: "xs",
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
  ];
  const otpForm = getForm(VERIFY_OTP_FORM_FIELDS);

  useEffect(() => {
    console.log(regData, "from useEffect");
  }, [regData]);
  return (
    <>
      {!success && !showOTP && (

        <>
          <DynamicForm
            {...stepTwoForm}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            loading={loading}
            submitButtonProps={{
              alignment: 'center',
              width: "100%",
              disabled: timer > 0
            }}
          />
          {timer > 0 && <Box sx={{
            textAlign: "center",
            pt: 2
          }}>
            <Typography component="p" textAlign="center" mb={2}>
              {timer <= 60 && t("you_can_have_new_otp_in_seconds", {
                seconds: timer,
              })}
              {timer > 60 && t("you_can_have_new_otp_in_minutes_seconds", {
                minutes: Math.floor(timer / 60).toString(),
                seconds: (timer % 60 < 10 ? '0' : '') + (timer % 60).toString()
              })}
            </Typography>



          </Box >}

        </>
      )}

      {!success && showOTP && (
        <>

          <Box
            sx={{
              py: 2,
              px: 3,
            }}
          >
            <DynamicForm
              {...otpForm}
              // defaultValues={defaultValues}
              validationMode="onChange"
              onSubmit={verifyOTP}
              submitButtonProps={{
                alignment: "center",
                width: "300px",
                disabled: timer === 0,

              }}
              extraButtons={<>
                <Button
                  // sx={{
                  //   minWidth: "300px",
                  // }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setShowOTP(false);
                  }}
                >
                  {t("back")}
                </Button>

              </>}
            />

          </Box>
          {wrongOtp &&
            <Box sx={{
              textAlign: "center",
              pt: 2,
              color: 'red'


            }}>
              {t('Wrong_OTP')}
            </Box>}
          <Box sx={{
            textAlign: "center",
            pt: 2,

          }}>
            {(showOTP && timer === 0) &&


              <>
                < Button sx={{
                  margin: 1,
                  backgroundColor: 'primary.main',
                  color: 'common.white',
                }} variant='contained' onClick={resendOTP}>
                  {t("resend")}
                </Button>


              </>

            }
          </Box >



          {timer > 0 && <Box sx={{
            textAlign: "center",
            pt: 2
          }}>
            <Typography component="p" textAlign="center" mb={2}>
              {timer <= 60 && t("you_can_have_new_otp_in_seconds", {
                seconds: timer,
              })}
              {timer > 60 && t("you_can_have_new_otp_in_minutes_seconds", {
                minutes: Math.floor(timer / 60).toString(),
                seconds: (timer % 60).toString()
              })}
            </Typography>




          </Box >}

        </>



      )}

      {success && (

        <Box
          sx={{
            py: 2,
            px: 3,
          }}
        >
          <Alert severity="success">
            <AlertTitle>{t('inst_registration')}</AlertTitle>


            {t('entity_req_submitted')}
          </Alert>
          <Box
            sx={{
              display: "flex",
              justifyContent: 'center',
            }}>
            <Button
              sx={{
                minWidth: "300px",
                mt: 3,
                align: "center",


              }}
              variant="contained"
              color="primary"
              onClick={globalDialog.onClose}
            >
              {t("close")}
            </Button>
          </Box>


        </Box >
      )
      }

    </>



  )
}



