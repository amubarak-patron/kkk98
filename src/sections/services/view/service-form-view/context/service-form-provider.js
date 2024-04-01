/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState, useRef } from 'react';
//
import { ServiceFormContext } from './service-form-context';
import { useLocales } from 'src/locales';
import axiosInstance from 'src/utils/axios';
import ReviewInfo from '../review-info';
import Verification from '../verification';
import FillForm from '../fill-form';
import { useAuthContext } from 'src/auth/hooks';
import { HOST_API } from 'src/config-global';
import { GlobalDialog, useGlobalDialogContext } from 'src/components/global-dialog';
import { usePathname } from 'src/routes/hooks';
import { useSkipFirstRender } from 'src/hooks/use-skip-first-render';

// ----------------------------------------------------------------------

export function ServiceFormProvider({ children }) {
  const { t } = useLocales();
  const additionalFormRef = useRef(null);
  const token = localStorage.getItem('accessToken');
  const globalDialog = useGlobalDialogContext();
  const pagePath = usePathname();

  // ** State
  const { user } = useAuthContext();
  const [serviceId, setServiceId] = useState(null);
  const [service, setService] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [info, setInfo] = useState([]);
  const [moheCertificates, setMoheCertificates] = useState([]);
  const [stakeHolderErrors, setStakeHolderErrors] = useState([]);
  const [missingStakeHolder, setMissingStakeHolder] = useState([]);
  const [loading, setLoading] = useState({
    service: true,
    userData: true,
    submit: false,
    birthDateValidate: false,
    MOJ: false,
    MOHE: false,
  });
  const [error, setError] = useState(null);
  const [orderNumber, setOrderNumber] = useState({});
  const [otherId, setOtherId] = useState('');
  const [subSpeciality, setSubSpeciality] = useState(null)
  const [submittedMOJ, setSubmittedMOJ] = useState(false)
  const [refNumber, setRefNumber] = useState(null)
  const [verificationData, setVerficationData] = useState(null)
  const [userType, setUserType] = useState(null)
  const [chosenMoheMajors, setChosenMoheMajors] = useState([]);
  const [chosenDiplomaCertificate, setChosenDiplomaCertificate] = useState("")



  const [steps, setSteps] = useState([
    {
      label: t('review_info'),
      component: ReviewInfo,
    },
    {
      label: t('verification'),
      component: Verification,
    },
  ]);
  const [additionalPersonInfo, setAdditionalPersonInfo] = useState([]);
  const [fillFormState, setFillFormState] = useState([]);
  const [showOTP, setShowOTP] = useState(false);
  const [hasPendingOrCompletedOrders, sethasPendingOrCompletedOrders] = useState(false);

  // ** Timer Logic
  const OTP_RESEND_INTERVAL_SECONDS = 300;
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    console.log(timer, 'timer from reset');
    if (!timer) {
      setTimer(OTP_RESEND_INTERVAL_SECONDS);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      // if started
      setTimeout(() => {
        setTimer((currTimer) => currTimer - 1);
      }, 1000);
    }
  }, [timer]);

  const handleChooseSubspeciality = (code) => {
    setSubSpeciality(code);
  };

  const handleLoading = (target, value) => {
    setLoading((prev) => ({
      ...prev,
      [target]: value,
    }));
  };


  // ** Functions
  // Service Info
  const handleFetchServiceInfo = async (id) => {
    setServiceId(id);
    handleLoading('service', true);

    try {
      const response = await axiosInstance.post(`${HOST_API}/GetServiceInfo`, {
        // nationalityType_code: user?.type === 'RMS' ? '001' : nationalityType_code,
        nationalityType_code: user?.nationalityType_code,
        service_code: id,
      });
      const service = response.data.data;
      setService(response.data.data);
    } catch (error) {
      setError(error);
    } finally {
      handleLoading('service', false);
    }
  };

  // Stake Holder User Data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFetchStakeHolderUserData = async (
    id,
    newRefNumber,
    newSubSpeciality,
    changeLoading = true
  ) => {
    if (changeLoading) {
      handleLoading('userData', true);
    }
    try {
      const response = await axiosInstance.post(
        `${HOST_API}/getUserDataFromSH`,
        {
          // nationalityType_code: user?.type === 'user' ? '001' : nationalityType_code,
          nationalityType_code: user?.nationalityType_code,
          request_code: id,
          subspeciality_code: newSubSpeciality || subSpeciality,
          referenceNumber: newRefNumber || refNumber,
          ...(chosenMoheMajors.length && {
            chosen_majors: chosenMoheMajors,
          }),
          ...(chosenMoheMajors.length && chosenDiplomaCertificate && {
            chosen_diploma_cert: chosenDiplomaCertificate,
          }),
          ...(info?.stakeholders?.length && {
            stakeholders_data: info.stakeholders,
          }),
          ...(userType !== 'user' && {
            nationalNumber: otherId,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.data.has_pending_completed_orders) {
        sethasPendingOrCompletedOrders(false);
        let allInfo = response.data.data;
        // const personalInfoErrors = allInfo.error_list.filter(
        //   (error) => error.stakeholderCode === 'CSPD' || error.stakeholderCode === 'PSD'
        // );

        // allInfo.stakeholders = allInfo.stakeholders.filter(
        //   (item) => item.stakeholderCode !== 'personalInfo'
        // );

        allInfo = {
          ...allInfo,
          stakeholders: [
            // {
            //   stakeholderCode: 'personalInfo',
            //   stakeholder_GUID: '',
            //   stakeholder_Name: t('personal_information'),
            //   stakeholder_data: {
            //     full_name: allInfo?.fullName,
            //     gender: allInfo?.gender,
            //     birth_date: allInfo?.dateOfBirth,
            //     ...(allInfo?.identityExpirationDate && {
            //       id_end_date: allInfo?.identityExpirationDate,
            //     }),
            //     ...(allInfo?.passportExpirationDate && {
            //       passport_end_date: allInfo?.passportExpirationDate,
            //     }),
            //   },
            //   error: personalInfoErrors || [],
            // },
            ...allInfo.stakeholders.map((stakeholder) => {
              const errorObject = allInfo.error_list.filter(
                (error) => error.stakeholderCode === stakeholder.stakeholderCode
              );
              return { ...stakeholder, error: errorObject };
            }),
          ],
        };
        if (steps.length < 3 && allInfo?.additional_person_info?.length) {
          // We want to add fill form step in index 1
          setSteps([
            steps[0],
            {
              label: t('fill_form'),
              component: FillForm,
            },
            steps[1],
          ]);
        } else if (
          steps.length === 3 && !allInfo?.additional_person_info?.length
        ) {
          // We want to add fill form step in index 1
          setSteps([
            steps[0],
            steps[2],
          ]);
        }
        setInfo(allInfo);
        setMoheCertificates(allInfo.stakeholders.find(item => item.stakeholderCode === "MOHE")?.all_data || []);
        setStakeHolderErrors(allInfo.error_list);
        setMissingStakeHolder(allInfo.missing_stakeholders);
      } else {
        sethasPendingOrCompletedOrders(true);
        console.log(response.data.has_pending_completed_orders, 'after');
      }
    } catch (error) {
      setError(error);
      // setChosenMoheMajors([])
    } finally {
      handleLoading('userData', false);
    }
  };


  // ** Wizard
  const handleNext = useCallback(async () => {
    setAdditionalPersonInfo([])
    if (activeStep === 1 && info?.additional_person_info?.length) {
      const isValidForm = await additionalFormRef?.current?.triggerValidation();
      // Active step is fill form
      if (!isValidForm) return;
      const formState = additionalFormRef?.current?.getData();
      setFillFormState(formState)
      const fieldsValues = []
      for (let key in formState) {
        if (info.additional_person_info.find(item => item.param_GUID === key)) {
          let resultObject = {
            param_GUID: key,
            param_value: formState[key],
          };
          fieldsValues.push(resultObject);
        }
      }

      setAdditionalPersonInfo(fieldsValues);
    }

    if (activeStep === 2) {
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [info, service, activeStep, additionalFormRef]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePickMoheMajor = (major) => {
    setChosenDiplomaCertificate("")

    if (Array.isArray(major)) {
      // remove already picked majors, and pick the rest
      const newMajors = major.filter(
        (pickedMajor) => !chosenMoheMajors.some((old) => old === pickedMajor)
      );

      console.log("newMajors", newMajors)

      if (newMajors.length === 0) {
        return setChosenMoheMajors([]);
      }

      return setChosenMoheMajors((prev) => [...prev, ...newMajors]);
    }

    // Check if the major is already picked
    const isMajorPicked = chosenMoheMajors.some((chosenMajor) => chosenMajor === major);
    console.log("isMajorPicked", isMajorPicked)
    if (isMajorPicked) {
      setChosenMoheMajors((prev) => prev.filter((pickedMajor) => pickedMajor !== major));
    } else {
      // check if multiple majors are allowed
      if (service?.IsMultiMajor) {
        setChosenMoheMajors((prev) => [...prev, major]);
      } else {
        setChosenMoheMajors([major]);
      }
    }
  };

  const onSubmitFinalApi = async (verificationData) => {
    handleLoading('submit', true);
    setError(null);

    await axiosInstance
      .post(`${HOST_API}/submitServiceRequest`, {
        // nationalityType_code: user?.type === 'RMS' ? '001' : nationalityType_code,
        nationalityType_code: user?.nationalityType_code,
        request_code: serviceId,
        ...verificationData,
        additional_person_info: additionalPersonInfo,
        missing_stakeholders: missingStakeHolder,
        ...(userType !== 'user' && {
          nationalNumber: otherId,
        }),
        subspeciality_code: subSpeciality,
        referenceNumber: refNumber,
        ...(chosenMoheMajors.length && {
          chosen_majors: chosenMoheMajors,
        }),
        ...(chosenMoheMajors.length && chosenDiplomaCertificate.length && {
          chosen_diploma_cert: chosenDiplomaCertificate
        })
      })
      .then((response) => {
        console.log('response', response);
        if (response.data.data.orderNumber) {
          console.log(response.data.data.orderNumber);
          console.log('hello');
          setInfo(response.data.data);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setOrderNumber(response.data.data.orderNumber);
          setShowOTP(false);
        } else if (response.data.data === "OTP sent successfully") {
          // setInfo(verificationData);
          setShowOTP(true);
          startTimer();
        }
      })
      .catch((error) => {
        setError(error);

      })
      .finally(() => {
        handleLoading('submit', false);
      });
  };

  useSkipFirstRender(() => {
    const sendRequest = async () => {
      handleLoading('MOHE', true);
      await handleFetchStakeHolderUserData(service?.Code, null, null, false);
      handleLoading('MOHE', false);
    };
    if (info?.stakeholders?.length > 0) {
      sendRequest();
    }
  }, [chosenMoheMajors, chosenMoheMajors.length, chosenDiplomaCertificate]);

  useEffect(() => {
    if (!showOTP) {
      globalDialog.onClose();
    }
  }, [showOTP]);

  useEffect(() => {
    if (pagePath.includes('clinic')) {
      setUserType('entity');
    } else if (user?.type) {
      setUserType(user.type);
    }
  }, [user?.type, pagePath]);
  useEffect(() => { console.log("chosenDiplomaCertificate", chosenDiplomaCertificate) }, [chosenDiplomaCertificate])

  const memoizedValue = useMemo(
    () => ({
      serviceId,
      service,
      activeStep,
      info,
      stakeHolderErrors,
      loading,
      error,
      orderNumber,
      steps,
      missingStakeHolder,
      otherId,
      additionalFormRef,
      additionalPersonInfo,
      fillFormState,
      setFillFormState,
      setOtherId,
      handleFetchServiceInfo,
      handleFetchStakeHolderUserData,
      handleNext,
      handleBack,
      handleReset,
      handleLoading,
      onSubmitFinalApi,
      showOTP,
      setShowOTP,
      hasPendingOrCompletedOrders,
      moheCertificates,
      setMoheCertificates,
      timer,
      startTimer,
      subSpeciality,
      handleChooseSubspeciality,
      submittedMOJ,
      setSubmittedMOJ,
      refNumber,
      setRefNumber,
      verificationData,
      setVerficationData,
      userType,
      chosenMoheMajors,
      handlePickMoheMajor,
      chosenMoheMajors,
      setChosenMoheMajors,
      chosenDiplomaCertificate,
      setChosenDiplomaCertificate,

    }),
    [
      serviceId,
      service,
      activeStep,
      info,
      stakeHolderErrors,
      loading,
      error,
      orderNumber,
      steps,
      missingStakeHolder,
      otherId,
      additionalFormRef,
      additionalPersonInfo,
      fillFormState,
      setFillFormState,
      setOtherId,
      handleFetchServiceInfo,
      handleFetchStakeHolderUserData,
      handleNext,
      handleBack,
      handleReset,
      handleLoading,
      onSubmitFinalApi,
      showOTP,
      setShowOTP,
      hasPendingOrCompletedOrders,
      moheCertificates,
      setMoheCertificates,
      timer,
      startTimer,
      subSpeciality,
      handleChooseSubspeciality,
      submittedMOJ,
      setSubmittedMOJ,
      refNumber,
      setRefNumber,
      verificationData,
      setVerficationData,
      userType,
      handlePickMoheMajor,
      chosenMoheMajors,
      setChosenMoheMajors,
      chosenDiplomaCertificate,
      setChosenDiplomaCertificate,

    ]
  );

  return (
    <ServiceFormContext.Provider value={memoizedValue}>{children}</ServiceFormContext.Provider>
  );
}

ServiceFormProvider.propTypes = {
  children: PropTypes.node,
};
