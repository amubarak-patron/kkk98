import { Box, Checkbox, CircularProgress, Radio, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import TextMaxLine from 'src/components/text-max-line';
import { useLocales } from 'src/locales';
import { useServiceFormContext } from './context';
import Table from 'src/components/table/table';
import { pink } from '@mui/material/colors';
import { useSkipFirstRender } from 'src/hooks/use-skip-first-render';

export default function MoheCard() {
  const { t } = useLocales();
  const {
    service,
    moheCertificates,
    stakeHolderErrors,
    chosenMoheMajors,
    handlePickMoheMajor,
    handleFetchStakeHolderUserData,
    loading,
    handleLoading,
  } = useServiceFormContext();
  console.log("hello")
  const columns = [
    ...(moheCertificates.length > 1
      ? [
        {
          id: 'Checkbox',
          label: service?.IsMultiMajor && (
            <Checkbox
              color="primary"
              // indeterminate={
              //   chosenMoheMajors.length === moheCertificates.length
              // }
              checked={chosenMoheMajors.length === moheCertificates.length}
              onChange={() =>
                chosenMoheMajors.length === moheCertificates.length
                  ? handlePickMoheMajor(chosenMoheMajors)
                  : handlePickMoheMajor(moheCertificates.map((c) => c.MajorDegree))
              }
              inputProps={{
                'aria-label': t('select_all'),
              }}
            />

          ),
          minWidth: '80px',
          renderRow: (row) => (
            <>
              {service?.IsMultiMajor ? (
                <Checkbox
                  color="primary"
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={chosenMoheMajors.includes(row.MajorDegree)}
                  onChange={() => handlePickMoheMajor(row.MajorDegree)}
                />
              ) : (
                <Radio
                  checked={chosenMoheMajors.includes(row.MajorDegree)}
                  onChange={() => handlePickMoheMajor(row.MajorDegree)}
                  value={row.MajorDegree}
                  inputProps={{ 'aria-label': row.MajorDegree }}
                />
              )}
            </>
          ),
        },
      ]
      : []),
    {
      id: 'Major',
      label: t('major_or_decision'),
      minWidth: '150px',
      renderRow: (row) => (
        <>
          <b>{row.Major}</b>
          {row.Decision && (
            <>
              <br /> {row.Decision}
            </>
          )}
        </>
      ),
    },
    {
      id: 'Degree',
      label: t('degree'),
      minWidth: '150px',
    },
    {
      id: 'CerCountryDesc',
      label: t('graduation_country'),
      minWidth: '150px',
    },
    {
      id: 'InstituteName',
      label: t('InstituteName'),
      minWidth: '150px',
    },
    {
      id: 'RegisterationYear',
      label: t('registeration_year'),
      minWidth: '150px',
    },
    {
      id: 'GraduationYear',
      label: t('graduation_year'),
      minWidth: '150px',
    },
  ];



  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.400',
        backgroundColor: 'common.white',
        transition: (t) => t.transitions.create('all'),
        // minHeight: 300,
        // maxHeight: 300,
        height: '100%',
        width: '100%',
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
          {t('mohe')}
        </TextMaxLine>
      </Box>

      <Box p={2}>
        <Box
          py={1}
          sx={{
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {loading.mohe && (
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
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}
