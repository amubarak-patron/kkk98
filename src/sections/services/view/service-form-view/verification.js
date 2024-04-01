import { Box, Button, Typography } from '@mui/material';
import { React, useCallback, useEffect, useRef, useState } from 'react';
import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useServiceFormContext } from './context';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import Timer from './timer';
import VerifyOTPDialog from './verify-otp-dialog';
import { LoadingButton } from '@mui/lab';

const OTP_RESEND_INTERVAL_SECONDS = 300; // عدد الدقائق * 60 ثانية

export default function Verification() {
  const { user } = useAuthContext();
  const { onSubmitFinalApi, showOTP, setShowOTP, error, timer, loading, handleBack } = useServiceFormContext();
  const globalDialog = useGlobalDialogContext();
  const dynamicFormRef = useRef();
  const [resendOTPCounter, setResendOTPCounter] = useState(0)

  const { t } = useLocales();
  // Form
  const form = getForm([
    {
      label: 'phone_number',
      type: "phonefield",
      typeValue: 'string',
      fieldVariable: 'phone',
      placeholder: 'phone_number',
      defaultCountry: 'jo',
      hideDialCodePicker: true,
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
      validations: [
        { type: 'required', message: 'required' },
        { type: 'phone', message: 'Jordanian_number_validation_962' },

      ],
    },
    {
      label: 'email',
      type: 'input',
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'email',
      placeholder: 'email',
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
      validations: [
        { type: 'required', message: 'required' },
        { type: 'email', message: 'invalid_email' },
      ],
    },
    {

      type: "checkbox",
      typeValue: 'boolean',
      value: false,
      label: t('moh_recognition'),
      fieldVariable: "checked",
      validations: [
        { type: 'required', message: 'required' },

      ],
      visibilityRules: [],
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 9,
        },
        {
          breakpoint: 'md',
          size: 9,
        },
      ],


    }
  ]);

  const defaultValues = {
    ...form.defaultValues,
    email: user?.email,
    phone: '+962' + (user?.phone.startsWith('0') ? user?.phone.slice(1) : user?.phone),
  };


  const onSubmit = (data) => {
    console.log("data", data)
    data.phone = data.phone.replace('+962', '0');
    user.phone = data.phone
    user.email = data.email
    const formData = {
      phone: data.phone.replace('+962', '0'),
      email: data.email,
      otp: data.otp
    };
    console.log("data", formData)
    onSubmitFinalApi(formData);
  };



  const resendOTP = () => {
    setResendOTPCounter(prev => prev + 1)

  }

  useEffect(() => {
    if (resendOTPCounter > 0 && dynamicFormRef.current) {
      let data = dynamicFormRef?.current?.getData();
      data.phone = data.phone.replace('+962', '0');
      user.phone = data.phone
      data.otp = ""
      onSubmitFinalApi(data);
    }
  }, [resendOTPCounter])



  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        p: 3,
        borderRadius: 1,
      }}
    >
      {showOTP &&
        <VerifyOTPDialog defaultValues={defaultValues} onSubmit={onSubmit}
          extraButtons={
            <>
              {/* resend using onSubmit, but make otp val empty */}
              {(showOTP && timer === 0) && <LoadingButton variant='contained' onClick={resendOTP}
                loading={loading.submit}
              >
                {t("resend")}
              </LoadingButton>}
            </>
          }
        />
      }

      <DynamicForm
        {...form}
        ref={
          dynamicFormRef
        }
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        validationMode="onChange"
        submitButtonProps={{
          alignment: 'left',
          width: 200,
          disabled: timer > 0 || {
            field: "checked",
            value: false
          },
          loading: loading.submit,
        }}
        extraButtons={<>
          <Button
            // sx={{
            //   minWidth: "300px",
            // }}
            variant="contained"
            color="primary"
            onClick={
              handleBack
            }
          >
            {t("back")}
          </Button>

        </>}
        invisible={showOTP}

      />

      {timer > 0 && <Timer />}



    </Box>
  );
}
