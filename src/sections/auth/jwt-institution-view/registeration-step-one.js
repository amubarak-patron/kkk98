import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import SanadLoginButton from '../sanad-login-button';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import { useAuthContext } from 'src/auth/hooks';
import useTabs from 'src/hooks/use-tabs';
import { useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN, PASSWORD_RESET, HOST_API } from 'src/config-global';
import { t } from 'i18next';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { set } from 'lodash';
import axiosInstance from 'src/utils/axios';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import moment from 'moment';
import { useLocales } from 'src/locales';
import { stringify } from 'stylis';
import { LoadingScreen } from 'src/components/loading-screen';



export default function RegisterationStepOne({ setStep, setRegData }) {
  const router = useRouter();
  const { t, currentLang } = useLocales()

  const globalDialog = useGlobalDialogContext();
  // const { registerInstitute } = useAuthContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [entityCategories, setEntityCategories] = useState([])
  const [stepOneForm, setStepOneForm] = useState(null)

  useEffect(() => {

    axiosInstance.get(`${HOST_API}/GetEntityCategories`)

      .then((response) => {
        setEntityCategories(response.data.data)
        const form = getForm([
          {
            label: 'inst_type',
            fieldVariable: 'EntityCategory',
            type: "select",
            typeValue: 'string',
            value: '',
            options: response.data.data?.map(entity => ({
              label: entity.entityCategory_Name,
              value: entity.entityCategory_Code,
            })),
            placeholder: 'inst_type',
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              },
              {
                breakpoint: 'md',
                size: 6,
              },
            ],
            validations: [
              {
                type: 'required',
                message: 'required',
              },
            ],
          },
          {
            label: 'health_inst_type',
            fieldVariable: 'EntityType',
            type: "select",
            typeValue: 'string',
            value: "",
            options: [
              {
                label: "pharmacy",
                value: "Pharmacy"
              },
              {
                label: "dental_facility",
                value: "Dental"
              },
              {
                label: "other",
                value: "Other "
              }
            ],
            placeholder: 'health_inst_type',
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              }, {
                breakpoint: 'md',
                size: 6,
              },
            ],
            validations: [
              {
                type: 'required',
                message: 'required',
              },
            ],
          },
          {
            label: 'inst_national_id',
            fieldVariable: 'nationalNo',
            type: 'input',
            inputType: 'numeric-text',
            value: '',
            placeholder: 'national_id',
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              },
              {
                breakpoint: 'md',
                size: 6,
              },
            ],
            validations: [
              {
                type: 'required',
                message: 'required',
              }
            ],
          },
          {
            label: 'inst_registration_number',
            fieldVariable: 'regNo',
            type: 'input',
            inputType: 'numeric-text',
            typeValue: 'string',
            value: '',
            placeholder: 'inst_registration_number',
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              },
              {
                breakpoint: 'md',
                size: 6,
              },
            ],
            visibilityRules: [
              {
                field: "EntityCategory",
                operator: "!==",
                value: "003",
              },
            ],
            validations: [
              {
                type: 'required',
                message: 'required',
              },
            ],
          },
          {
            label: 'inst_rep_national_id',
            fieldVariable: 'LiaisonOfficerNationalNo',
            type: 'input',
            inputType: 'numeric-text',
            typeValue: 'string',
            value: '',
            placeholder: 'inst_rep_national_id',
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              },
              {
                breakpoint: 'xs',
                size: 6
              }
            ],
            validations: [
              {
                type: 'required',
                message: 'required',
              },
              {
                type: 'minLength',
                value: 10,
                message: 'Wrong_national_id',
              },
              {
                type: 'maxLength',
                value: 11,
                message: 'Wrong_national_id',
              },
            ],
          },
          {
            label: "inst_rep_birth_date",
            type: 'date',
            inputType: 'date',
            typeValue: 'string',
            fieldVariable: 'Birthdate',
            placeholder: "inst_rep_birth_date",
            gridOptions: [
              {
                breakpoint: 'xs',
                size: 12,
              },
              {
                breakpoint: 'xs',
                size: 6
              }
            ],
            validations: [
              { type: 'required', message: 'required' },
              {
                type: 'max',
                value: "today"
              }
            ],

          },
        ]);

        setStepOneForm(form)

      }


      )
      .catch((error) => setError(error))
      .finally(() => setLoading(false));


  }, [])
  useEffect(() => { console.log(entityCategories, "entities") }, [entityCategories])

  const defaultValues = useMemo(() => ({
    ...stepOneForm?.defaultValues,
  }), [
    stepOneForm?.defaultValues
  ]);

  const handleSubmit = async (data) => {
    const companyCheckEndpoints = {
      '001': `getIndividualRegistry`,
      '002': `getCompanyInfo`,
      '003': `getCharityInfo`
    }

    setLoading(true)

    try {
      const companyInfoResponse = await axiosInstance.post(`${HOST_API}/${companyCheckEndpoints[data.EntityCategory]}`, {
        nationalNo: data.nationalNo,
        regNo: data.regNo
      })

      const representativeInfoResponse = await axiosInstance.post(`${HOST_API}/getCitizenInfo`, {
        NationalNumber: data.LiaisonOfficerNationalNo,
        Birthdate: moment(data.Birthdate).locale('en').format('YYYY/MM/DD'),
      })

      // Go to step 2 with the data if everything is good
      setRegData({
        EntityCategory: data.EntityCategory,
        EntityType: data.EntityType,
        nationalNo: data.nationalNo,
        regNo: data.regNo,
        LiaisonOfficerNationalNo: data.LiaisonOfficerNationalNo,
        Birthdate: data.Birthdate,
        Name: companyInfoResponse?.data?.data?.COMPANAME,
        ResponsiblePerson: representativeInfoResponse?.data?.data?.fullName
      })

      setStep(prev => prev + 1)
    } catch (error) {
      // we need to show a nice error message
      globalDialog.onOpen({
        title: t('warning'),
        content: (
          <Box p={2}>
            <Typography variant="body1" component="p" color="error.main" fontWeight="bold" textAlign="center">
              {t("wrong_data")}
            </Typography>
            <Button
              onClick={() => globalDialog.onClose()}
              variant="contained"
              color="secondary"
              fullWidth
              sx={{
                mt: 4,
              }}
            >
              {t('close')}
            </Button>
          </Box>
        ),
      });

    } finally {
      setLoading(false)
    }


  }

  if (!stepOneForm) return <LoadingScreen />
  return (
    <DynamicForm
      {...stepOneForm}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitButtonProps={{
        label: t('next'),
        alignment: 'center',
        width: '100%',
        loading,
      }}
    />
  )
}



