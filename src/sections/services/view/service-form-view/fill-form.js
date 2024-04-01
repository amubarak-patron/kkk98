import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useLocales } from 'src/locales';
import createFormFieldsFromResponse from 'src/utils/create-form-fields-from-response';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useServiceFormContext } from './context';
import { useSkipFirstRender } from 'src/hooks/use-skip-first-render';

const FillForm = () => {
  const { t } = useLocales();
  const { info, additionalFormRef, additionalPersonInfo, fillFormState } = useServiceFormContext();

  // Form
  const form = getForm(createFormFieldsFromResponse(info?.additional_person_info, 118, 4));
  const defaultValues = {
    ...form.defaultValues,
    ...fillFormState
  };


  useEffect(() => {
    // actual data
    console.log("fillFormState", fillFormState)
  }, [fillFormState])

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        p: 3,
        borderRadius: 1,
      }}
    >
      <DynamicForm
        {...form}
        ref={additionalFormRef}
        defaultValues={defaultValues}
        validationMode="onChange"
        submitButtonProps={{
          hidden: true,
        }}
      />
    </Box>
  );
};

export default FillForm;
