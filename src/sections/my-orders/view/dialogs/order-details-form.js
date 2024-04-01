import PropTypes from 'prop-types';
// @mui
import { Box, Typography } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
// components
import { useState } from 'react';
import axios from 'axios';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import createFormFieldsFromResponse from 'src/utils/create-form-fields-from-response';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function OrderDetailsForm({ applicationDetails, reloadOrders }) {
  const { t } = useLocales();
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form
  const form = getForm(
    createFormFieldsFromResponse(applicationDetails?.additional_person_info, 118, 12)
  );
  console.log(form)

  const defaultValues = {
    ...form.defaultValues,
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const additional_person_info = Object.entries(data).map(([param_GUID, param_value]) => ({
        param_GUID,
        param_value,
      }));
      await axios.post(
        `${HOST_API}/UpdatePersonApplication`,
        {
          GUID: applicationDetails?.GUID,
          additional_person_info: additional_person_info,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setSubmitted(true);
      reloadOrders();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} width="100%">
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {t('Additional_info_form')}
      </Typography>

      {submitted ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">{t('order_sent_successfully')}</Typography>
        </Box>
      ) : (
        <DynamicForm
          {...form}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          validationMode="onChange"
          submitButtonProps={{
            width: '100%',
            loading: loading,
          }}
        />
      )}
    </Box>
  );
}

OrderDetailsForm.propTypes = {
  additional_person_info: PropTypes.array.isRequired,
};

OrderDetailsForm.propTypes = {};
