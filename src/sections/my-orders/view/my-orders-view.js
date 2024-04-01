import { format } from 'date-fns';
import {
  Container,
  Card,
  CardHeader,
  Box,
  Typography,
  Stack,
  TablePagination,
  Button,
  Tabs,
  Tab,
  Divider,
  TextField,
  FormHelperText,
} from '@mui/material';
import { useParams, useRouter } from 'src/routes/hooks';
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import { useGlobalDialogContext } from 'src/components/global-dialog';
import Table from 'src/components/table';
import SvgColor from 'src/components/svg-color/svg-color';
import { paths } from 'src/routes/paths';
import {
  StyledActionButton,
  StyledActionIconButton,
} from 'src/components/custom-styled-components';
import Label from 'src/components/label/label';
import OrderDetailsDialog from './dialogs/order-details-dialog';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LoadingScreen } from 'src/components/loading-screen';
import axiosInstance from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { useAuthContext } from 'src/auth/hooks';
import { HOST_API } from 'src/config-global';
import DynamicForm, { getForm } from 'src/components/dynamic-form';
import moment from 'moment';
import { useNavigate } from 'react-router';
import EmptyContent from 'src/components/empty-content';
import { TabsList } from '@mui/base';
import ReviewInfo from 'src/sections/services/view/service-form-view/review-info';
import { useServiceFormContext } from 'src/sections/services/view/service-form-view/context';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { useResponsive } from 'src/hooks/use-responsive';

const APPLICATION_STATUSES = [
  {
    label: 'applications',
    value: [
      '001',
      '002',
      '003',
      '004',
      '007',
      '008',
      '009',
      '011',
      '015',
      '016',
      '017',
      '018',
      '019',
    ],
  },
  {
    label: 'vocations',
    value: ['010', '020'],
  },
];

const MyOrdersView = () => {
  const filtersFormRef = useRef();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const router = useRouter();
  const navigate = useNavigate();
  const [appDetails, setAppDetails] = useState();
  const { t } = useLocales();
  const globalDialog = useGlobalDialogContext();
  const [loadingDownloadId, setLoadingDownloadId] = useState(null);
  const [filters, setFilters] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [appNumber, setAppNumber] = useState("")
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isValidFromDate, setIsValidFromDate] = useState()
  const [isValidToDate, setIsValidToDate] = useState()
  const [filterNationalNumber, setFilterNationalNumber] = useState('')



  // useEffect(() => {
  //   console.log("isValidFromDate", isValidFromDate)
  //   console.log("isValidToDate", isValidToDate)
  // }, [isValidFromDate, isValidToDate])

  const columns = [
    {
      id: 'order_number',
      label: t('order_number'),
      renderRow: (row, column) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          role="button"
          onClick={() => onDetailsClick(row.guid, true)}
          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
        >
          {row[column.id]}
        </a>
      ),
    },
    ...(user?.type !== 'user'
      ? [
        { id: 'national_number', label: t('national_id') },
        { id: 'full_name', label: t('full_name') },
      ]
      : []),
    { id: 'service_name', label: t('service_name') },
    {
      id: 'submission_date',
      label: t('submission_date'),
      renderRow: (row) => <>{moment(row['submission_date']).format('YYYY/MM/DD')}</>,
    },
    {
      id: 'order_status',
      label: t('order_status'),
      renderRow: (row, column) => (
        <Label variant="ghost" sx={{}}>
          {row[column.id]}
        </Label>
      ),
    },
    {
      type: 'actions',
      label: t('action'),
      align: 'center',
    },
  ];
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const [currentApplicationStatus, setCurrentApplicationStatus] = useState(0);

  const handleGetOrders = useCallback(
    async (page, newRows, filters) => {
      setLoading(true);
      axiosInstance
        .post(`${HOST_API}/getUserApplications`, {
          // nationalityType_code: user?.type === 'RMS' ? '001' : nationalityType_code,
          nationalityType_code: user?.nationalityType_code,
          service_code: params.id,
          pageSize: newRows || rowsPerPage,
          page: page || currentPage,
          statusCode: APPLICATION_STATUSES[currentApplicationStatus].value?.map((code) => code),
          ...(filters?.national_number && {
            filterNationalNumber: filters.national_number,
          }),
          ...(filters?.order_number && {
            application_code: filters.order_number,
          }),
          ...(filters?.from && {
            from_date: moment(filters.from).locale('en').format('YYYY-MM-DD'),
          }),
          ...(filters?.to && {
            to_date: moment(filters.to).locale('en').format('YYYY-MM-DD'),
          }),
        })
        .then((response) => {
          let customResponse = response?.data?.data;
          customResponse.items = customResponse.items.map((app) => ({
            ...app,
            order_number: app.appNo,
            national_number: app.nationalNumber,
            full_name:
              app.firstName + ' ' + app.fatherName + ' ' + app.grandFather + ' ' + app.family,
            service_name: app.requestName,
            // submission_date: format(app.ApplicationDate, 'dd/MM/yyyy'),
            submission_date: app.applicationDate,
            order_status: app.status,
            statusCode: app.statusCode,
            guid: app.guid,
            requestCode: app.requestCode,
          }));

          setData(customResponse);
        })
        .catch((error) => {
          console.log('asdasd', error);
          setError(error);
        })
        .finally(() => setLoading(false));
    },
    [currentPage, rowsPerPage, currentApplicationStatus]
  );

  const onDetailsClick = async (guid, showStakeholders) => {
    globalDialog.onOpen({
      content: (
        <OrderDetailsDialog
          guid={guid}
          showStakeholders={showStakeholders}
          reloadOrders={handleGetOrders}
        />
      ),
      dialogProps: {
        maxWidth: showStakeholders ? 'md' : 'sm',
        sx: {
          content: {
            // minHeight: '75vh',
            minWidth: '100hv',
          },
        },
      },
    });
  };

  const onDownloadCertificateClick = async (guid) => {
    try {
      setLoadingDownloadId(guid);

      const response = await axiosInstance.post(`${HOST_API}/GetUserApplication`, {
        guid: guid,
      });

      const responseDetails = response.data.data;

      const certificateFile = responseDetails?.certificate_info[0]?.CertificateFile;
      const fileResponse = await axiosInstance.get(`${HOST_API}/GetAttachment/${certificateFile}`, {
        responseType: 'blob',
      });

      const blob = fileResponse.data;
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });


      // Open a new window with the base64 data
      const newWindow = window.open();
      newWindow.document.write(
        `<embed src = "data:application/pdf;base64,${base64
          .toString()
          .split('base64,')
          .pop()}" width=100% height=100% />`
      );
      // Reset loading state
      setLoadingDownloadId(null);
    } catch (error) {
      setLoadingDownloadId(null);
    }
  };

  const onChangeRowsPerPage = (rows) => {
    setRowsPerPage(rows);
    // handleSearch(filters, 1, rows)
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
    // handleSearch(filters, page)
  };

  useEffect(() => {
    handleGetOrders(1, rowsPerPage || 10, filters);
    console.log("filters", filters);
  }, [filters, currentApplicationStatus]);

  useEffect(() => {
    const validateFromDate = () => {
      console.log(fromDate);
      const currentDate = new Date();

      if (fromDate) {
        if (isNaN(fromDate.getTime()) || fromDate > currentDate || toDate && fromDate > toDate) {
          console.log("invalid FromDate")

          setIsValidFromDate(false);
        }

        else {
          setIsValidFromDate(true);
        }
      } else (setIsValidFromDate(true)
      )
    };

    const validateToDate = () => {
      const currentDate = new Date();
      if (toDate) {
        if (isNaN(toDate.getTime()) || toDate > currentDate || fromDate && fromDate > toDate) {
          console.log("invalid FromDate")
          setIsValidToDate(false);
        } else (setIsValidToDate(true))

      } else (setIsValidToDate(true))

    };

    validateFromDate();
    validateToDate();
  }, [fromDate, toDate]);

  const clearFilters = () => {
    setToDate()
    setFromDate()
    setAppNumber("")
    setFilterNationalNumber("")

  }

  const onSubmit = () => {
    console.log("onSubmit")
    setFilters({
      order_number: appNumber,
      from: fromDate,
      to: toDate,
      national_number: filterNationalNumber
    });
  };

  // const form = getForm([
  //   ...(user?.type !== 'user'
  //     ? [
  //       {
  //         // label: t("order_number"),
  //         type: 'input',
  //         inputType: 'text',
  //         typeValue: 'string',
  //         fieldVariable: 'national_number',
  //         placeholder: t('national_id'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 3,
  //           },
  //         ],
  //         validations: [],
  //       },
  //       {
  //         // label: t("order_number"),
  //         type: 'input',
  //         inputType: 'text',
  //         typeValue: 'string',
  //         fieldVariable: 'order_number',
  //         placeholder: t('order_number'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 3,
  //           },
  //         ],
  //         validations: [],
  //       },
  //       {
  //         // label: t("from"),
  //         type: 'date',
  //         inputType: 'date',
  //         typeValue: 'string',
  //         fieldVariable: 'from',
  //         placeholder: t('from'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 3,
  //           },
  //         ],
  //         validations: [
  //           {
  //             type: 'max',
  //             value: 'field=to',
  //             message: "hello"

  //           },
  //           {
  //             type: 'max',
  //             value: 'today',
  //           },
  //         ],
  //       },
  //       {
  //         // label: t("to"),
  //         type: 'date',
  //         inputType: 'date',
  //         typeValue: 'string',
  //         fieldVariable: 'to',
  //         placeholder: t('to'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 3,
  //           },
  //         ],
  //         validations: [
  //           {
  //             type: 'min',
  //             value: 'field=from',
  //           },

  //         ],
  //       },
  //     ]
  //     : [
  //       {
  //         // label: t("order_number"),
  //         type: 'input',
  //         inputType: 'text',
  //         typeValue: 'string',
  //         fieldVariable: 'order_number',
  //         placeholder: t('order_number'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 4,
  //           },
  //         ],
  //         validations: [],
  //       },
  //       {
  //         // label: t("from"),
  //         type: 'date',
  //         inputType: 'date',
  //         typeValue: 'string',
  //         fieldVariable: 'from',
  //         placeholder: t('from'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 4,
  //           },
  //         ],
  //         validations: [
  //           // {
  //           //   type: 'max',
  //           //   value: 'field=to',
  //           // },
  //           {
  //             type: 'max',
  //             value: 'today',
  //             message: "hello"
  //           },
  //         ],
  //       },
  //       {
  //         // label: t("to"),
  //         type: 'date',
  //         inputType: 'date',
  //         typeValue: 'string',
  //         fieldVariable: 'to',
  //         placeholder: t('to'),
  //         gridOptions: [
  //           {
  //             breakpoint: 'xs',
  //             size: 12,
  //           },
  //           {
  //             breakpoint: 'md',
  //             size: 4,
  //           },
  //         ],
  //         validations: [
  //           {
  //             type: 'min',
  //             value: 'field=from',
  //           },
  //           {
  //             type: 'max',
  //             value: 'yesterday',
  //           },
  //         ],
  //       },
  //     ]),
  // ]);
  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          {/* <CardHeader title={t('my_orders')} /> */}
          <Stack direction="row" spacing={1}>
            {/* Options */}
          </Stack>
        </Box>
        <Box
          data-tour-id="orders_filters"
          sx={{
            display: 'flex',
            flexDirection: lgUp && mdUp ? 'row' : 'column',
            alignItems: 'flex-start',
            justifyContent: '',
            gap: 1,
            pt: 1,
            mb: 2.5,
          }}
        >


          <>
            {user?.type !== 'user' &&
              < TextField
                placeholder={t('national_id')}
                onChange={(event) => setFilterNationalNumber(event.target.value)}
                type="number"
                value={filterNationalNumber}
              ></TextField>}
            <TextField
              placeholder={t('order_number')}
              onChange={(event) => setAppNumber(event.target.value)}
              value={appNumber}
            ></TextField>


            <DatePicker
              views={["year", "month", "day"]}
              format={"yyyy/MM/dd"}
              // minDate={new Date()}
              maxDate={toDate ? toDate : new Date()}
              value={fromDate ? fromDate : null}
              onChange={(fromDate) => {
                setFromDate(fromDate)
              }}
              fullWidth
              slotProps={{
                textField: {
                  placeholder: t("from"),
                  helperText: !isValidFromDate ? t("invalid_dates") : null

                }
              }}

            />

            <DatePicker

              views={["year", "month", "day"]}
              format={"yyyy/MM/dd"}
              minDate={fromDate}
              maxDate={new Date()}
              value={toDate ? toDate : null}
              onChange={(toDate) => {
                setToDate(toDate)
              }}
              fullWidth
              slotProps={{
                textField: {
                  placeholder: t("to"),
                  helperText: !isValidToDate ? t("invalid_dates") : null
                }
              }}
            />
          </>
          <Box
            sx={{
              ...(smUp && mdUp && {
                justifyContent: 'center',
                display: "flex",
                flexDirection: "row",
                // width: "100%",
                gap: 4
              }),
              display: "flex",
              flexDirection: "row",
              gap: 1

            }}
          >

            <Button onClick={() => onSubmit()} disabled={!isValidToDate || !isValidFromDate} variant="contained" color="primary" >
              {t('search')}
            </Button>
            <Button onClick={() => clearFilters()} variant="contained" color="primary" >
              {t('remove')}
            </Button>
          </Box>

          {/* <DynamicForm
            ref={filtersFormRef}
            {...form}
            submitButtonProps={{
              hidden: true,
            }}

          />
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {t('search')}
          </Button>
          <Button variant="contained" color="primary" >
            {t('reset')}
          </Button> */}
        </Box>

        <Tabs
          data-tour-id="switch_orders_certificates"
          value={currentApplicationStatus}
          onChange={(e, index) => setCurrentApplicationStatus(index)}
          textColor="#151716"
          // indicatorColor="#FFFFFF"

          sx={{
            '& button ': { backgroundColor: '#C8C4C3', borderRadius: 2 },
            '& button:hover ': { backgroundColor: '#AAA7A6' },
            // "& button:active ": { backgroundColor: "#c7c9c9" },
            '& button.Mui-selected ': { backgroundColor: '#186E40' },

            '& .MuiButtonBase-root': {
              flex: 1,
              maxWidth: '100%',
              // borderBottom: '1px solid black',

              // backgroundColor: "grey"
            },
            '& .MuiTabs-indicator': {
              backgroundColor: (t) => t.palette.secondary.main,
            },
          }}
          TabIndicatorProps={{
            hidden: true,
          }}
        >
          {APPLICATION_STATUSES.map((item, index) => (
            <Tab
              key={index}
              label={
                <span
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  }}
                >
                  {t(item.label)}
                </span>
              }
              text
            />
          ))}
        </Tabs>

        <Box sx={{ overflow: 'auto' }}>
          <Divider sx={{ my: 3 }}></Divider>

          <Box sx={{ width: '100%', display: 'table', tableLayout: 'fixed' }}>
            <Table
              columns={columns}
              loading={loading}
              rows={loading ? [] : data.items}
              pagination={
                data?.items
                  ? {
                    onChangePage: (e, page) => {
                      onPageChange(page + 1);
                      handleGetOrders(page + 1);
                    },
                    onChangeRowsPerPage: (e) => {
                      onChangeRowsPerPage(e.target.value);
                      handleGetOrders(1, e.target.value);
                    },
                    rowsPerPage,
                    page: currentPage - 1,
                    total: data?.totalRecords,
                  }
                  : false
              }
              renderActions={(row) => (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <>
                    {row.statusCode === '010' && (
                      <LoadingButton
                        onClick={() => onDownloadCertificateClick(row.guid)}
                        variant="outlined"
                        color="secondary"
                        size="small"
                        loading={loadingDownloadId === row.guid}
                      >
                        {t('download_certificate')}
                      </LoadingButton>
                    )}
                    {/* "011" اسباب رفض الطلب */}
                    {/* "004" معلومات اضافية */}
                    {/* "009" + "016" طلب دفع */}
                    {['004', '009', '011', '016'].includes(row.statusCode) && (
                      <StyledActionButton
                        onClick={() => onDetailsClick(row.guid)}
                        variant="outlined"
                        color="secondary"
                        size="small"
                      >
                        {['004'].includes(row.statusCode) && t('details')}
                        {['011', '012'].includes(row.statusCode) && t('rejection_details')}
                        {['009', '016'].includes(row.statusCode) && t('payment_details')}
                      </StyledActionButton>
                    )}

                    {row.statusCode === '020' && !row.renewAppNo && (
                      <StyledActionButton
                        onClick={() => {
                          navigate(paths.dashboard.services.form(row.requestCode), {
                            state: {
                              personNid:
                                ['entity', 'RMS'].includes(user?.type) && row.national_number,
                            },
                          });
                        }}
                        variant="outlined"
                        color="secondary"
                        size="small"
                      >
                        {t('renew')}
                      </StyledActionButton>
                    )}
                  </>
                </Box>
              )}
            />
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default MyOrdersView;
