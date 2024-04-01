import { Box, Button, Checkbox, Divider, Radio, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useGlobalDialogContext } from 'src/components/global-dialog';
import Table from 'src/components/table/table';
import { usePathname, useRouter } from 'src/routes/hooks';
import { useNavigate } from 'react-router';
import { useLocales } from 'src/locales';
import { paths } from 'src/routes/paths';

const ChooseDiplomaDialog = ({ data }) => {
  const { t, currentLang } = useLocales();
  const navigate = useNavigate();
  const globalDialog = useGlobalDialogContext();
  const router = useRouter();
  const pathname = usePathname();
  const isMyClinicPath = pathname.includes('my-clinic');
  const [chosenDiploma, setChosenDiploma] = useState(data?.chosenDiplomaCertificate || "")



  const targetRoute = isMyClinicPath
    ? paths.dashboard.clinic.services.root
    : paths.dashboard.services.root;





  return (
    <Stack justifyContent="center" gap={1} flexWrap={1}>
      <Box sx={{ overflow: "auto", p: 2 }}>
        <Divider sx={{ my: 3 }}></Divider>
        <Box sx={{ width: "100%", }}>
          <Table
            columns={[
              {
                id: 'checkbox',

                minWidth: '80px',
                renderRow: (row) => (
                  <>
                    <Checkbox
                      checked={chosenDiploma === row.serial_number}

                      onChange={() => {
                        setChosenDiploma(row?.serial_number)
                        console.log("chosenDiploma", chosenDiploma)
                      }
                      }
                      value={row?.serial_number}
                      inputProps={{ 'aria-label': row?.serial_number }}
                    />
                  </>
                ),
              },
              {
                id: 'serial_number',
                label: t('serial_number'),
              },
              { id: 'college_name', label: t('college_name') },
              {
                id: 'spec_name', label: t('spec_name'),
              },
              {
                id: 'year_cycle', label: t('year_cycle'),
              },


            ]}
            rows={data?.info.diploma_certificates.map((certificate) => ({

              ...certificate,
              serial_number: certificate.serial_number,
              college_name: certificate.college_name,
              spec_name: certificate.spec_name,

            }))}

          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", width: "100%", }}>
            <Button
              onClick={() => {
                data?.setChosenDiplomaCertificate(chosenDiploma)
                globalDialog.onClose()
              }}
              variant="contained"
              color="primary"
              disabled={!chosenDiploma}

            >
              {t('accept')}

            </Button>
            <Button
              onClick={() => {
                data?.setChosenDiplomaCertificate("")
                data?.setChosenMoheMajors([])
                globalDialog.onClose()

              }}
              variant="contained"
              color="error"
            >
              {t('close')}
            </Button>

          </Box>
        </Box>

      </Box>

    </Stack>
  )
}

export default ChooseDiplomaDialog
