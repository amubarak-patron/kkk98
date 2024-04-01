import React, { useState, useEffect } from 'react';
// @mui
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormLabel, Radio, Stack, Typography } from '@mui/material';
import TextMaxLine from 'src/components/text-max-line';
import { useLocales } from 'src/locales';
import axiosInstance from 'src/utils/axios';
import { useServiceFormContext } from './service-form-view/context';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Table from 'src/components/table/table';

// ----------------------------------------------------------------------
export default function StackholderInfoCard({ data, serviceFormContext, byPassEntries }) {
  // const { serviceId, handleFetchStakeHolderUserData, subSpeciality,
  //   submittedMOJ,
  //   setSubmittedMOJ, loading,
  //   handleLoading,
  //   refNumber,
  //   setRefNumber,
  //   service,
  //   moheCertificates,
  //   stakeHolderErrors,
  //   chosenMoheMajors,
  //   handlePickMoheMajor,
  // } = useServiceFormContext();
  const { t } = useLocales();
  const isMOJ = data?.stakeholderCode === 'MOJ';
  const smUp = useResponsive('up', 'sm');
  const lgUp = useResponsive('up', 'lg');
  const [columns, setColumns] = useState([]);
  const refNumberSubmit = async () => {
    if (serviceFormContext?.refNumber) {
      serviceFormContext?.handleLoading('MOJ', true);
      await serviceFormContext?.handleFetchStakeHolderUserData(
        serviceFormContext?.serviceId,
        serviceFormContext?.refNumber,
        serviceFormContext?.subSpeciality,
        false
      );
      serviceFormContext?.setSubmittedMOJ(true);
      serviceFormContext?.handleLoading('MOJ', false);
    }
  };


  useEffect(() => {
    if (data?.table_headers?.length > 0 && columns.length === 0) {
      const newColumns = data.table_headers.map((header) => ({
        id: header.key,
        label: header.label,
        minWidth: '150px',
      }));

      setColumns(newColumns);
    }
  }, [data?.table_headers]);

  if (serviceFormContext?.loading?.userData && data.stakeholderCode !== 'MOJ') return null;
  return (
    <Box
      sx={{
        position: 'relative',
        border: 1,
        borderColor: 'grey.400',
        backgroundColor: 'common.white',
        transition: (t) => t.transitions.create('all'),
        // minHeight: 300,
        // maxHeight: 300,
        height: '100%',
        width: '100%',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'primary.main',
          p: 1,
          maxWidth: '100%',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
      >
        <TextMaxLine
          line={2}
          variant="body1"
          fontWeight="bold"
          component="h3"
          color="primary.contrastText"
          align="center"
        >
          {data?.stakeholder_Name}
        </TextMaxLine>
      </Box>

      <Box
        sx={{
          p: 1.5,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {serviceFormContext?.loading[data.stakeholderCode] && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.5)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <CircularProgress />
          </div>
        )}


        {data?.error && !data?.is_down && data.stakeholderCode === "MOHE" &&
          data.error.map((error) => (
            <Typography
              key={error?.errorMessage}
              component="p"
              variant="caption"
              sx={{ color: 'error.main', fontSize: data.stakeholderCode === "MOHE" ? (15) : 12.5 }}

            >
              *{error?.errorMessage}
            </Typography>
          ))}
        {data?.render_as === 'table' && (
          <Table
            columns={[
              ...(data.stakeholderCode === 'MOHE' && serviceFormContext?.moheCertificates.length > 0
                ? [
                  {
                    id: 'Checkbox',
                    label: serviceFormContext?.service?.IsMultiMajor && (
                      <Stack direction="row" alignItems="center">
                        <Checkbox
                          inputProps={{
                            id: "select_all_majors"
                          }}
                          color="primary"
                          // indeterminate={
                          //   serviceFormContext?.chosenMoheMajors.length > 0 &&
                          //   serviceFormContext?.chosenMoheMajors.length <
                          //   serviceFormContext?.moheCertificates.length
                          // }
                          checked={
                            serviceFormContext?.chosenMoheMajors.length ===
                            serviceFormContext?.moheCertificates.length
                          }
                          onChange={() =>
                            serviceFormContext?.chosenMoheMajors.length ===
                              serviceFormContext?.moheCertificates.length
                              ? serviceFormContext?.handlePickMoheMajor(
                                serviceFormContext?.chosenMoheMajors
                              )
                              : serviceFormContext?.handlePickMoheMajor(
                                serviceFormContext?.moheCertificates.map((c) => c.MajorDegree)
                              )
                          }
                        />
                        <FormLabel htmlFor='select_all_majors' sx={{
                          fontSize: '12px',
                        }}>
                          {t("select_all")}
                        </FormLabel>
                      </Stack>
                    ),
                    minWidth: '80px',
                    renderRow: (row) => (
                      <>
                        {serviceFormContext?.service?.IsMultiMajor ? (
                          <Checkbox
                            color="primary"
                            // indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={serviceFormContext?.chosenMoheMajors.includes(
                              row.MajorDegree
                            )}
                            onChange={() =>
                              serviceFormContext?.handlePickMoheMajor(row.MajorDegree)
                            }
                          />
                        ) : (
                          <Checkbox
                            checked={serviceFormContext?.chosenMoheMajors.includes(
                              row.MajorDegree
                            )}
                            onChange={() => {
                              serviceFormContext?.handlePickMoheMajor(row.MajorDegree)
                            }
                            }

                            value={row.MajorDegree}
                            inputProps={{ 'aria-label': row.MajorDegree }}
                          />
                        )}
                      </>
                    ),
                  },
                ]
                : []),
              ...columns,
            ]}
            rows={data.all_data}
            emptyText={
              data.stakeholderCode === 'MOH' ? (
                <Typography
                  component="p"
                  variant="body1"
                  textAlign="center"
                  sx={{ color: 'error.main' }}
                >
                  {t('required_vocations_doesnt_exist')}
                </Typography>
              ) : (
                t('no_data')
              )
            }
          />
        )}

        {data?.render_as === 'bullet-points' && (
          <>
            {data.all_data.length > 0 ? (
              <Box
                component="ul"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                }}
              >
                {data.all_data.map((item, index) => (
                  <li key={index}>
                    <Typography component="span" variant="body2" fontWeight="fontWeightBold">
                      - {item[data.bullet_points_key]}
                    </Typography>
                  </li>
                ))}
              </Box>
            ) : (
              <Typography
                component="p"
                variant="body1"
                textAlign="center"
                sx={{ py: 3, color: 'error.main' }}
              >
                {t('required_vocations_doesnt_exist')}
              </Typography>
            )}
          </>
        )}

        {data?.render_as === 'key-value' && (
          <>
            {Object.entries(data?.stakeholder_data || {}).length === 0 ? (
              <Box>
                {!data?.is_down && (
                  <Typography
                    component="p"
                    variant="body1"
                    textAlign="center"
                    sx={{ color: 'error.main' }}
                  >
                    {t('infromation_unavailable')}
                  </Typography>
                )}

                {/* <Typography component="p" variant="caption" sx={{ color: 'error.main' }}>
                {t('error_warning', { stakeholderName: data.stakeholder_Name })}
              </Typography> */}
              </Box>
            ) : (
              <Box>
                <Box
                  component="ul"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                  }}
                >
                  {Object.entries(data?.stakeholder_data || {}).map(([key, value], index) => (
                    <li key={key}>
                      {(data.stakeholderCode !== 'MOJ' || byPassEntries) && (
                        <Typography component="span" variant="body2" fontWeight="fontWeightBold">
                          - {t(value.param_name)}:{' '}
                        </Typography>
                      )}

                      {(data.stakeholderCode !== 'MOJ' || byPassEntries) && (
                        <Typography component="span" variant="body2" fontWeight="fontWeightNormal">
                          <>
                            {['0', '1'].includes(value.param_value) ? (
                              <>
                                {value.param_value === '1' ? (
                                  <Typography
                                    style={{ color: 'green' }}
                                    component="span"
                                    variant="caption"
                                  >
                                    {t('available')}
                                  </Typography>
                                ) : (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ color: 'error.main' }}
                                  >
                                    {t('unavailable')}
                                  </Typography>
                                )}
                              </>
                            ) : value.param_value ? (
                              value.param_value
                            ) : (
                              <Typography component="span" variant="caption">
                                {t('unavailable')}
                              </Typography>
                            )}
                          </>
                        </Typography>
                      )}
                    </li>
                  ))}

                  {isMOJ && !byPassEntries && (
                    <>
                      {serviceFormContext?.submittedMOJ && (
                        <>
                          <Box>
                            {data?.stakeholder_data?.find((item) => item.code === 'is_available')
                              ?.param_value === '1' ? (
                              <Typography
                                component="label"
                                htmlFor="additionalValue"
                                variant="body2"
                                fontWeight="fontWeightBold"
                                style={{ color: 'green' }}
                              >
                                {t('correct_refrence_number')}
                              </Typography>
                            ) : (
                              <>
                                <Typography
                                  component="label"
                                  htmlFor="additionalValue"
                                  variant="body2"
                                  fontWeight="fontWeightBold"
                                  style={{ color: 'red' }}
                                >
                                  {t('wrong_verfication_number')}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </>
                      )}

                      {data?.stakeholder_data?.find((item) => item.code === 'is_available')
                        ?.param_value === '0' && (
                          <Box
                            sx={{
                              py: 2,
                            }}
                          >
                            <Typography
                              component="label"
                              htmlFor="additionalValue"
                              variant="body2"
                              fontWeight="fontWeightBold"
                            >
                              {t('Validation_number')}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: '8px',
                                flexWrap: 'wrap',
                                gap: 0.5,
                                flexDirection: {
                                  xs: 'column',
                                  md: 'row',
                                },
                              }}
                            >
                              <input
                                type="number"
                                id="additionalValue"
                                value={serviceFormContext?.refNumber}
                                onChange={(e) => serviceFormContext?.setRefNumber(e.target.value)}
                              />
                              <Button
                                onClick={refNumberSubmit}
                                variant="contained"
                                size="small"
                                loading={serviceFormContext?.loading.MOJ}
                                sx={{ marginLeft: '8px', padding: '8px 12px', fontSize: '0.8rem' }}
                              >
                                {t('verify')}
                              </Button>
                            </Box>
                          </Box>
                        )}
                    </>
                  )}
                </Box>


              </Box>
            )}
          </>
        )}


        {data?.is_down && (
          <Typography component="p" variant="body1" textAlign=" center" sx={{ color: 'error.main' }}>
            {t('service_unavailable')}
          </Typography>
        )}

      </Box>

      <Box sx={{ p: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
        <Box>
          {data?.error && !data?.is_down && data.stakeholderCode !== "MOHE" &&
            data.error.map((error) => (
              <Typography
                key={error?.errorMessage}
                component="p"
                variant="caption"
                sx={{ color: 'error.main', }}

              >
                *{error?.errorMessage}
              </Typography>
            ))}
        </Box>
      </Box>
    </Box >
  );
}

StackholderInfoCard.propTypes = {};
