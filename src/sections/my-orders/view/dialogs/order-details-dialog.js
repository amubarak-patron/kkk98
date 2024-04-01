import PropTypes from 'prop-types';
// @mui
import { Box, Button, CircularProgress, Typography } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
// components
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import OrderDetailsForm from './order-details-form';
import { LoadingButton } from '@mui/lab';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import StackholderInfoCard from 'src/sections/services/view/stakeholder-info-card';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

// ----------------------------------------------------------------------

export default function OrderDetailsDialog({ guid, showStakeholders, reloadOrders }) {
  const { t } = useLocales();
  const { accessToken } = useAuthContext();
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [eFwateercomPaymentLoading, setEFwateercomPaymentLoading] = useState(false);
  const [didPayViaEfawateercom, setDidPayViaEfawateercom] = useState(false);
  const globalDialog = useGlobalDialogContext();

  const getCertificate = (id) => {
    axiosInstance
      .get(`${HOST_API}/GetAttachment/${id}`, {
        responseType: 'blob',
      })
      .then((blob) => {
        const fileURL = URL.createObjectURL(blob.data);

        // we need to download the file
        window.open(fileURL, '_blank');
      });
  };

  // const handlePayViaEfawateercom = async () => {
  //   try {
  //     setEFwateercomPaymentLoading(true);
  //     await axiosInstance.post(
  //       `${HOST_API}/UpdatePersonApplicationPayment`,
  //       {
  //         application_payment_type: ['009'].includes(applicationDetails?.StatusCode)
  //           ? '001'
  //           : '002',
  //         payment_number: applicationDetails?.payment_info[0]?.payment_number,
  //         payment_referance: 'qweasdzxca',
  //         payment_reference: 'qweasdzxca',
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setDidPayViaEfawateercom(true);
  //     reloadOrders();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setEFwateercomPaymentLoading(false);
  //   }
  // };

  useEffect(() => {
    axiosInstance
      .post(`${HOST_API}/GetUserApplication`, {
        guid: guid,
      })
      .then((response) => {
        setApplicationDetails(response.data.data);
        setApplicationLoading(false);
      });
  }, []);


  const handleCopyToClipboard = () => {
    const paymentNumber = applicationDetails?.payment_info[0]?.payment_number;

    if (paymentNumber) {
      navigator.clipboard.writeText(paymentNumber)
        .then(() => {
          // Optionally, you can provide feedback to the user upon successful copy
          console.log('Payment number copied to clipboard:', paymentNumber);
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          // Optionally, provide feedback or handle the error
        });
    }
  };


  return (
    <Box

      sx={showStakeholders ? {
        py: 3,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      } : {
        py: 3,
        px: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
      }
    >
      {applicationLoading && <CircularProgress />}
      {!applicationLoading && (
        <>
          {showStakeholders && <>
            <Grid2 p={1} container spacing={2} >
              {applicationDetails.stakeholder_info.map((stakeholder, index) => (
                <Grid2 key={index} xs={12} md={stakeholder.grid_size || 4} lg={stakeholder.grid_size || 4}>
                  <StackholderInfoCard data={stakeholder} byPassEntries />
                </Grid2>
              ))}
            </Grid2>

          </>}
          {!showStakeholders && <>
            {applicationDetails?.certificate_info?.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  getCertificate(applicationDetails?.certificate_info[0]?.certificateFile)
                }
              >
                {t('download_certificate')}
              </Button>
            )}

            <>
              {['011'].includes(applicationDetails?.StatusCode) && (
                <>
                  <Typography variant="h6" component="h1" mb={1}>
                    {t('rejection_info')}
                  </Typography>

                  <Typography p={"10px"} variant="body2" py={3}>
                    {applicationDetails?.rejection_info[0]?.RejectionReason
                      ? applicationDetails?.rejection_info[0]?.RejectionReason
                      : t('no_rejection_reason')}
                  </Typography>
                </>
              )}
            </>

            {['009', "016"].includes(applicationDetails?.StatusCode) && applicationDetails?.payment_info?.length > 0 && (
              <>
                <Typography variant="h6" component="h1" mb={1}>
                  {t('payment_info')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {t('please_pay_via_efawateercom')}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography margin="6px" variant="body2">
                    <b>{t('payment_number')}</b>:{applicationDetails?.payment_info[0]?.payment_number}
                  </Typography>
                  <Button px="2" variant='contained'
                    color='primary' size="small" onClick={handleCopyToClipboard}>{t('copy')}</Button>
                </Box>



                <Typography variant="body2">
                  <b>{t('payment_amount')}</b>: {applicationDetails?.payment_info[0]?.payment_value} {t('JOD')}
                </Typography>

                <Box my={2}>
                  {/* {didPayViaEfawateercom ? (
                  t('payment_received_successfully')
                ) : (
                  <Button
                    component="a"
                    href="//www.efawateercom.jo/Portal/Home"
                    target="_blank"
                    rel="noopener noreferrer"
                    loading={eFwateercomPaymentLoading}
                    variant="contained"
                    color="primary"
                  >
                    {t('pay_via_efawateercom')}
                  </Button>
                )} */}
                  <Button
                    component="a"
                    href="//customer.efawateercom.jo/login#/LoginPages"
                    target="_blank"
                    rel="noopener noreferrer"
                    loading={eFwateercomPaymentLoading}
                    variant="contained"
                    color="primary"
                  >
                    {t('pay_via_efawateercom')}
                  </Button>
                </Box>
              </>
            )}
            {['004'].includes(applicationDetails?.StatusCode) && (
              <>
                {applicationDetails?.additional_person_info?.length > 0 ? (
                  <OrderDetailsForm
                    applicationDetails={applicationDetails}
                    reloadOrders={reloadOrders}
                  />
                ) : (
                  <Typography variant="body2" py={3}>
                    {t('no_additional_person_info')}
                  </Typography>
                )}
              </>
            )}
          </>}
        </>
      )
      }
      <Button
        onClick={() => globalDialog.onClose()}
        variant="contained"
        color="secondary"
        width="auto"
        sx={{
          mt: 4,
        }}
      >
        {t('close')}
      </Button>
    </Box >
  );
}

OrderDetailsDialog.propTypes = {
  additional_person_info: PropTypes.array.isRequired,
};

OrderDetailsDialog.propTypes = {};
