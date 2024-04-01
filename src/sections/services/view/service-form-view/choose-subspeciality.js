import React, { useState } from 'react'
import { useServiceFormContext } from './context';
import { useLocales } from 'src/locales';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { Box, Button, List, ListItem, ListItemButton, Stack, TextField, Typography } from '@mui/material';
import InputLabel from 'src/components/input-label/input-label';

function ChooseSubSpeciality() {
  const { t, currentLang } = useLocales();
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const {
    handleFetchServiceInfo,
    service,
    steps,
    activeStep,
    handleNext,
    handleBack,
    orderNumber,
    stakeHolderErrors,
    otherId,
    setOtherId,
    info,
    hasPendingOrCompletedOrders,
    subSpeciality,
    handleChooseSubspeciality,
    handleFetchStakeHolderUserData
  } = useServiceFormContext();
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }
  // const subSpecialityForm = getForm([
  //   {
  //     label: t("select_subspeciality"),
  //     type: "select",
  //     typeValue: 'string',
  //     fieldVariable: 'subspeciality',
  //     placeholder: t("select_subspeciality"),
  //     options: service?.subspeciality?.map((item => ({
  //       label: currentLang.value === "en" ? item.name : item.name_en,
  //       value: item.value
  //     }))) || [],
  //     gridOptions: [
  //       {
  //         breakpoint: 'xs',
  //         size: 12,
  //       },
  //       {
  //         breakpoint: 'md',
  //         size: 12,
  //       },
  //     ],
  //     validations: [
  //       { type: 'required', message: 'required' }
  //     ],
  //   }
  // ]);

  return (
    <Box sx={{
      maxWidth: {
        md: '50%'
      },
      mx: {
        md: 'auto'
      }
    }}>
      {/* <DynamicForm
        {...subSpecialityForm}
        onSubmit={(data) => {
          handleChooseSubspeciality(data.subspeciality)
          handleFetchStakeHolderUserData(service.Code, null, data.subspeciality)
        }}
        submitButtonProps={{
          label: t("next"),
          width: '100%'
        }}
      /> */}

      <Stack direction="column" gap={2}>
        {/* Email and Phone input fields */}
        <Stack direction="row" spacing={1}>
          {/* Options */}
          <Stack direction="row" spacing={1}>
            <TextField onChange={handleSearch} value={search} placeholder={t("search_sub-speciality")} />
          </Stack>
        </Stack>

        <Stack direction="column">
          <InputLabel label={t('select_subspeciality')} />
          <Box sx={{
            maxHeight: 300,
            overflowY: 'auto'
          }}>
            <List>

              {
                (service?.subspeciality?.filter(
                  subSpeciality => {
                    if (search) {
                      return subSpeciality.name.toLowerCase()?.indexOf(search?.toLowerCase()) !== -1
                    }
                    return true
                  }

                ).map((item => ({
                  label: item.name,
                  value: item.value
                }))) || []).map((item, index) => (
                  <>
                    <ListItem disablePadding sx={{
                      ...(item.value === selected && {
                        backgroundColor: t => t.palette.primary.main,
                        color: "#FFF  "
                      })
                    }}>
                      <ListItemButton onClick={() => setSelected(item.value)}>
                        <Typography variant="body1" component="p">{item.label}</Typography>
                      </ListItemButton>
                    </ListItem>
                  </>
                ))
              }
            </List>

          </Box>
        </Stack>

        <Stack direction="column">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleChooseSubspeciality(selected)
              handleFetchStakeHolderUserData(service.Code, null, selected)
            }}>
            {t("next")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChooseSubSpeciality
