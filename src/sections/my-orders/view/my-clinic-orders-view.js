import { format } from 'date-fns';
import { Container, Card, CardHeader, Box, Typography, Stack, TablePagination, Button, Tabs, Tab, Divider } from '@mui/material';
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
import { use } from 'i18next';

const APPLICATION_STATUSES = [
  {
    label: 'applications',
    value: ['001', '002', '003', '004', '007', '008', '009', '011', '015', '016', '017', '018', '019']
  },
  {
    label: 'vocations',
    value: ['010', '020']
  }
]


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
  const [currentPage, setCurrentPage] = useState(1)
  const { initialize } = useAuthContext();


  const columns = [
    { id: 'order_number', label: t('order_number') },


    { id: 'national_number', label: t('national_id') },
    { id: 'full_name', label: t('full_name') },


    { id: 'service_name', label: t('service_name') },
    {
      id: 'submission_date', label: t('submission_date'),
      renderRow: (row) => (
        <>
          {moment(row['submission_date']).format('YYYY/MM/DD')}
        </>
      )
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
  const [currentApplicationStatus, setCurrentApplicationStatus] = useState(0)

  const handleGetOrders = useCallback(async (page, newRows, filters) => {
    console.log(currentApplicationStatus, "tap")
    setLoading(true);
    axiosInstance
      .post(`${HOST_API}/getUserApplications`, {
        // nationalityType_code: user?.type === 'RMS' ? '001' : nationalityType_code,
        isClinic: 1,
        nationalityType_code: user?.nationalityType_code,
        service_code: params.id,
        pageSize: newRows || rowsPerPage,
        page: page || currentPage,
        statusCode: APPLICATION_STATUSES[currentApplicationStatus].value?.map((code) => code),
        ...(
          filters?.national_number && {
            filterNationalNumber: filters.national_number,
          }
        ),
        ...(
          filters?.order_number && {
            application_code: filters.order_number,
          }
        ),
        ...(
          filters?.from && {
            from_date: moment(filters.from).locale('en').format('YYYY-MM-DD'),
          }
        ),
        ...(
          filters?.to && {
            to_date: moment(filters.to).locale('en').format('YYYY-MM-DD'),
          }
        ),
      })
      .then((response) => {
        let customResponse = response?.data?.data;
        customResponse.items = customResponse.items.map((app) => ({
          ...app,
          order_number: app.appNo,
          national_number: app.nationalNumber,
          full_name: app.firstName + ' ' + app.fatherName + ' ' + app.grandFather + ' ' + app.family,
          service_name: app.requestName,
          // submission_date: format(app.ApplicationDate, 'dd/MM/yyyy'),
          submission_date: app.applicationDate,
          order_status: app.status,
          statusCode: app.statusCode,
          guid: app.guid,
          requestCode: app.requestCode,
        }))


        setData(customResponse)
      }
      )
      .catch((error) => {
        console.log('asdasd', error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [currentPage, rowsPerPage, currentApplicationStatus]);

  const onDetailsClick = async (guid) => {

    globalDialog.onOpen({
      content: <OrderDetailsDialog guid={guid} reloadOrders={handleGetOrders} />,
      dialogProps: {
        sx: {
          content: {
            p: 0,
            // minHeight: '75vh',
            minWidth: '100hv',
          },
        },
      },
    });
  };

  const onDownloadCertificateClick = (guid) => {
    setLoadingDownloadId(guid);
    axiosInstance
      .post(`${HOST_API}/GetUserApplication`, {
        guid: guid,
      })
      .then((response) => {
        const responseDetails = response.data.data;
        axiosInstance
          .get(
            `${HOST_API}/GetAttachment/${responseDetails?.certificate_info[0]?.CertificateFile}`,
            {
              responseType: 'blob',
            }
          )
          .then((blob) => {
            setLoadingDownloadId(null);
            const fileURL = URL.createObjectURL(blob.data);

            // we need to download the file
            window.open(fileURL, '_blank');
          });
      });
  };



  const onChangeRowsPerPage = (rows) => {
    setRowsPerPage(rows)
    // handleSearch(filters, 1, rows)
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
    // handleSearch(filters, page)
  }


  useEffect(() => {
    handleGetOrders(1, rowsPerPage || 10, filters);
  }, [filters, currentApplicationStatus]);

  // useEffect(() => {
  //   handleGetOrders(1, rowsPerPage, filters);
  // }, [filters, currentApplicationStatus]);

  const form = getForm([

    {
      // label: t("order_number"),
      type: "input",
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'national_number',
      placeholder: t("national_id"),
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 3,
        },
      ],
      validations: [],
    },

    {
      // label: t("order_number"),
      type: "input",
      inputType: 'text',
      typeValue: 'string',
      fieldVariable: 'order_number',
      placeholder: t("order_number"),
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 3,
        },
      ],
      validations: [],
    },
    {
      // label: t("from"),
      type: 'date',
      inputType: 'date',
      typeValue: 'string',
      fieldVariable: 'from',
      placeholder: t("from"),
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 3,
        },
      ],
      validations: [
        {
          type: 'max',
          value: "field=to"
        }
      ],
    },
    {
      // label: t("to"),
      type: 'date',
      inputType: 'date',
      typeValue: 'string',
      fieldVariable: 'to',
      placeholder: t("to"),
      gridOptions: [
        {
          breakpoint: 'xs',
          size: 12,
        },
        {
          breakpoint: 'md',
          size: 3,
        },
      ],
      validations: [
        {
          type: 'min',
          value: "field=from"
        },
        {
          type: 'max',
          value: "yesterday"
        }
      ],

    }
  ]);

  const onSubmit = () => {
    const filterFormData = filtersFormRef.current.getData();
    setFilters({
      ...filterFormData,
    })
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Card >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pb: 2
          }}
        >
          <CardHeader title={`${t('clinic_applications')}/${t("my_clinic")}`} />
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: '',
          gap: 1,
          pb: 2
        }}>
          <DynamicForm
            ref={filtersFormRef}
            {...form}
            submitButtonProps={{
              hidden: true
            }}
          />
          <Button

            variant='contained'
            color='primary'
            onClick={onSubmit}
          >
            {t("search")}
          </Button>
        </Box>

        <Tabs
          value={currentApplicationStatus}

          onChange={(e, index) => setCurrentApplicationStatus(index)}
          textColor="#151716"
          // indicatorColor="#FFFFFF"

          sx={{
            "& button ": { backgroundColor: "#C8C4C3", borderRadius: 2 },
            "& button:hover ": { backgroundColor: "#AAA7A6" },
            // "& button:active ": { backgroundColor: "#c7c9c9" },
            "& button.Mui-selected ": { backgroundColor: "#186E40" },


            '& .MuiButtonBase-root': {
              flex: 1,
              maxWidth: '100%',
              // borderBottom: '1px solid black',


              // backgroundColor: "grey"
            },
            '& .MuiTabs-indicator': {
              backgroundColor: t => t.palette.secondary.main,




            }
          }}
          TabIndicatorProps={{
            hidden: true,
          }}

        >
          {
            APPLICATION_STATUSES.map((item, index) => (
              <Tab key={index} label={<span style={{
                color: "#FFFFFF",
                fontWeight: 'bold',
                fontSize: '18px'
              }}>{t(item.label)}</span>} text />

            ))
          }
        </Tabs>
        <Box sx={{ overflow: "auto" }}>
          <Divider sx={{ my: 3 }}></Divider>

          <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>

            <Table
              columns={columns}
              loading={loading}
              rows={loading ? [] : data.items}
              pagination={data?.items ? {
                onChangePage: (e, page) => {
                  onPageChange(page + 1)
                  handleGetOrders(page + 1)
                },
                onChangeRowsPerPage: (e) => {
                  onChangeRowsPerPage(e.target.value)
                  handleGetOrders(1, e.target.value)
                },
                rowsPerPage,
                page: currentPage - 1,
                total: data?.totalRecords
              } : false}

              emptyText={
                <>
                  <EmptyContent
                    hideImg
                    title={t("no_data")}
                    sx={{
                      py: 1,
                    }}
                  />
                  {currentApplicationStatus !== 1 &&
                    <Button
                      variant='contained'
                      color='primary'
                      size="small"
                      onClick={() => router.push(paths.dashboard.clinic.services.root)}>
                      {t("browse_services")}
                    </Button>
                  }
                </>
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

                    {row.statusCode === "020" && !row.renewAppNo && (
                      <StyledActionButton
                        onClick={() => {
                          navigate(paths.dashboard.services.form(row.requestCode), {
                            state: {
                              personNid: ["entity", "RMS"].includes(user?.type) && row.national_number
                            }
                          })
                        }}
                        variant="outlined"
                        color="secondary"
                        size="small"
                      >
                        {t("renew")}
                      </StyledActionButton>
                    )}
                  </>
                </Box>
              )}
            />
          </Box>
        </Box>
      </Card>
    </Container >
  );
};

export default MyOrdersView;
