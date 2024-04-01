import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useAuthContext } from 'src/auth/hooks';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import { useLocales } from 'src/locales';
import { useServiceFormContext } from './context';


function Timer({ }) {
  const { t } = useLocales();

  const { timer, startTimer } = useServiceFormContext();

  return (
    <Box sx={{
      textAlign: "center",
      pt: 2
    }}>
      <Typography component="p" textAlign="center" mb={2}>
        {timer <= 60 && t("you_can_have_new_otp_in_seconds", {
          seconds: timer,
        })}
        {timer > 60 && t("you_can_have_new_otp_in_minutes_seconds", {
          minutes: Math.floor(timer / 60).toString(),
          seconds: (timer % 60 < 10 ? '0' : '') + (timer % 60).toString() // Add leading zero if needed
        })}
      </Typography>


    </Box >
  )
}

export default Timer
