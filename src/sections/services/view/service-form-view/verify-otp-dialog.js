import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useLocales } from 'src/locales';
import { useServiceFormContext } from './context';

function VerifyOTPDialog({ defaultValues, onSubmit, extraButtons }) {
  const { t } = useLocales();
  const { onSubmitFinalApi, showOTP, setShowOTP, error, startTime, timer, loading } = useServiceFormContext();

  const otp = getForm([
    {
      label: 'otp',
      type: 'otp',
      typeValue: 'string',
      fieldVariable: 'otp',
      placeholder: 'otp',
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
      ],
      validations: [
        { type: 'required', message: 'required' },
      ],
    },
  ]);
  useEffect(() => { console.log("error", error) }, [error])
  return (
    <Box sx={{
      mx: 'auto',
      maxWidth: '500px',
      p: 2,
      backgroundColor: '#fff',
      borderRadius: '5px',
      borderWidth: '1px',
      borderColor: '#000',
      borderStyle: 'solid',
    }}>
      {error && (<Typography
        component="label"
        htmlFor="additionalValue"
        variant="body2"
        fontWeight="fontWeightBold"
        align='center'
        style={{ display: 'block', color: 'red' }}
      >
        {(error.message)}

      </Typography>)
      }
      <DynamicForm
        {...otp}
        onSubmit={onSubmit}
        defaultValues={defaultValues}

        // hasFalseInfoAlert={error}
        validationMode="onChange"
        submitButtonProps={{
          alignment: 'left',
          hidden: false,
          width: 150,
          disabled: timer === 0,
          loading: loading.submit

        }}

        extraButtons={<>
          {extraButtons}
          <Button
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

  )
}

export default VerifyOTPDialog
