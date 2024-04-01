import { useCallback, useState, useMemo } from 'react';

// ----------------------------------------------------------------------

export function useSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = useCallback((step) => skipped.has(step), [skipped]);

  const onNextStep = useCallback(() => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  }, [activeStep, isStepSkipped, skipped]);

  const onPrevStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const onSkipStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }, [activeStep]);

  const onResetSteps = useCallback(() => {
    setActiveStep(0);
  }, []);

  return {
    activeStep,
    isStepSkipped,
    onNextStep,
    onPrevStep,
    onSkipStep,
    onResetSteps,
  };
}
