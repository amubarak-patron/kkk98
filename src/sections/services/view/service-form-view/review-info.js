import { Box, Button, Checkbox, CircularProgress, Divider, FormLabel, Radio, Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocales } from 'src/locales';
import StackholderInfoCard from '../stakeholder-info-card';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/utils/axios';
import { useServiceFormContext } from './context';
import TextMaxLine from 'src/components/text-max-line';
import MoheCard from './mohe-card';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import VlCertificate from 'src/pages/general/vl-certificate';
import Table from 'src/components/table/table';
import EmptyContent from 'src/components/empty-content/empty-content';
import { usePathname, useRouter } from 'src/routes/hooks';
import { useBackRoute } from 'src/hooks/use-back-route';
import ChooseDiplomaDialog from '../choose-diploma-dialog';

export default function ReviewInfo() {
  const { t, currentLang } = useLocales();
  const navigate = useNavigate();
  const serviceFormContext = useServiceFormContext();
  const globalDialog = useGlobalDialogContext();
  const router = useRouter();
  const pathname = usePathname();
  const isMyClinicPath = pathname.includes('my-clinic');

  const targetRoute = isMyClinicPath
    ? paths.dashboard.clinic.services.root
    : paths.dashboard.services.root;
  useBackRoute(targetRoute, true);





  useEffect(() => {
    if (
      serviceFormContext?.info?.certificates_to_cancel?.length > 0 &&
      !serviceFormContext.submittedMOJ
    ) {
      globalDialog.onOpen({
        dismissable: false,
        title: t('warning'),
        content: (
          <Box p={2}>
            {t('cancel_certificates_warning')}
            <Box component="ul">
              {serviceFormContext.info.certificates_to_cancel.map((vocation) => (
                <Box component="li">
                  {vocation.title} - {vocation.app_number}
                </Box>
              ))}
            </Box>

            <Stack direction="row" justifyContent="center" gap={1} flexWrap={1}>
              <Button
                onClick={() => {
                  globalDialog.onClose();
                  navigate(paths.dashboard.services.root);
                }}
                variant="contained"
                color="primary"
                fullWidth
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={() => globalDialog.onClose()}
                variant="contained"
                color="error"
                fullWidth
              >
                {t('accept')}
              </Button>
            </Stack>
          </Box>
        ),
      });
    }

    if (
      serviceFormContext?.info?.orders_to_cancel?.length > 0 &&
      !serviceFormContext.submittedMOJ
    ) {
      globalDialog.onOpen({
        dismissable: false,
        title: t('warning'),
        content: (
          <Box p={2}>
            {t('cancel_orders_warning')}
            <Box component="ul">
              {serviceFormContext.info.orders_to_cancel.map((vocation) => (
                <Box component="li">
                  {vocation.title} - {vocation.app_number}
                </Box>
              ))}
            </Box>

            <Stack direction="row" justifyContent="center" gap={1} flexWrap={1}>
              <Button
                onClick={() => {
                  globalDialog.onClose();
                  navigate(paths.dashboard.services.root);
                }}
                variant="contained"
                color="primary"
                fullWidth
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={() => globalDialog.onClose()}
                variant="contained"
                color="error"
                fullWidth
              >
                {t('accept')}
              </Button>
            </Stack>
          </Box>
        ),
      });
    }
  }, [
    serviceFormContext?.info?.certificates_to_cancel?.length,
    serviceFormContext?.info?.orders_to_cancel?.length,
  ]);


  useEffect(() => {

    if (serviceFormContext?.info?.diploma_certificates?.length > 0) {
      globalDialog.onOpen({
        dismissable: false,
        title: t('pick_certificate'),
        dialogProps: {
          maxWidth: 'md',

        },
        content: (
          <ChooseDiplomaDialog data={serviceFormContext} />
        ),
      });
    }
  }, [
    serviceFormContext?.info?.diploma_certificates?.length
  ])

  return (
    <div data-tour-id='review_info'>
      <Box>
        <Typography component="p" variant="caption" sx={{ color: "#BE9A42", fontSize: 15, pb: 1, }} className='fadeInOut'>
          {t("error_warning")}
        </Typography>

      </Box>
      <Box
        sx={{
          backgroundColor: 'background.default',
          p: 1.5,
          borderRadius: 1,

        }}
      >

        {/* Info From Stakeholders */}
        <Grid2 container spacing={2}>

          {serviceFormContext?.info?.stakeholders?.map((stakeholder, index) => (
            <Grid2
              key={index}
              xs={12}
              md={stakeholder.grid_size || 4}
              lg={stakeholder.grid_size || 4}
            >
              <StackholderInfoCard data={stakeholder} serviceFormContext={serviceFormContext} />
            </Grid2>
          ))}
        </Grid2>
      </Box >
    </div>
  );
}
