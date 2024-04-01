import { Box, Stack, } from '@mui/material';
import React, { useEffect, useState } from 'react'
import RegisterationStepOne from './registeration-step-one';
import RegisterationStepTwo from './registeration-step-two';

export default function RegistrationView() {
  const [step, setStep] = useState(0);
  const [regData, setRegData] = useState(null);

  return (

    <Box>
      {step === 0 && <RegisterationStepOne step={step} setStep={setStep} setRegData={setRegData} />}
      {step === 1 && <RegisterationStepTwo setStep={setStep} setRegData={setRegData} regData={regData} />}
    </Box>
  )
}



