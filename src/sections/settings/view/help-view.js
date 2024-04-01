import { Autocomplete, Avatar, Box, Card, Container, FormControl, FormHelperText, Grid, MenuItem, NativeSelect, Select, Stack, TextField, Typography, Item } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Iconify from 'src/components/iconify/iconify';
import { useLocales } from 'src/locales';
import axiosInstance from 'src/utils/axios';
import { HOST_API } from 'src/config-global';
import InputLabel from 'src/components/input-label/input-label';
import Header from 'src/layouts/dashboard/header';
import { useResponsive } from 'src/hooks/use-responsive';
import Router from 'src/routes/sections';
import { useRouter } from 'src/routes/hooks';
import { column } from 'stylis';
import { Link } from 'react-router-dom';
import Footer from 'src/layouts/footer';



export default function HelpView(id) {
  const [options, setOptions] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()
  const { t } = useLocales();
  const [pickedService, setPickedService] = useState()
  const serviceCode = window.location.pathname.split('/').pop();
  const router = useRouter()

  useEffect(() => {
    axiosInstance
      .get(`${HOST_API}/GetServicesList`)
      .then((response) => {
        setOptions(response.data.data.map((service) => ({
          label: service.service_Name,
          value: service.service_code
        })));

      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    console.log("pick", pickedService)
    if (pickedService) {
      router.push(`/help/${pickedService}`)
    }

  }, [pickedService])


  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');

  return (

    <>
      <Header />

      <Stack sx={{ flexGrow: 1 }}>
        <Box mt="97px" width="100%" height={75} bgcolor="primary.main" fullWidth>
          <Typography px={2} fontWeight={50} variant="h2" component="h2" color="#BE9A42">مزاوله مهنه طب الامتياز</Typography>
        </Box>
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} backgroundColor="#fff">

          <Grid container gap={0.5}>

            {!lgUp && <Grid item xs={12}  >

              <Autocomplete
                fullWidth
                noOptionsText={t("no_data")}
                getOptionLabel={option => option.label}
                getOptionValue={option => option.value}
                onChange={(event, newValue) => setPickedService(newValue?.value)}
                disablePortal
                id="combo-box-demo"
                options={options}
                renderInput={(params) => <TextField {...params} label={t("search_services")} />}
                value={pickedService}
              />
            </Grid>}

            <Grid p={3} item xs={lgUp ? 8 : 12}>
              <Card gap={4}>
                <Stack p={2} display="flex" gap={3} >
                  <Typography fontWeight={100} p={2} color="primary" variant="h3" component="h3">خطوات تقديم طلب مزاوله مهنه طب الامتياز</Typography>
                  <iframe p={3} width="560" height="315" src="https://www.youtube.com/embed/qOPwy0VUd1w?si=tW7sewTSK5-UHov8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  <Box p={1}>
                    <Stack display="flex-column" spacing={3}>
                      <Stack display='flex-row' direction={"row"} spacing={1} >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#fff',
                            color: '#BE9A42',
                            fontSize: 24,
                            border: 1,
                            borderColor: " #005844"
                          }}
                        >
                          1
                        </Avatar>
                        <Typography sx={{ fontSize: 25, color: "#BE9A42" }} >خطوه 1</Typography>
                      </Stack>
                      <img
                        src="/assets/images/help/001/image_1_001.png"
                        alt="MoH Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box p={1}>
                    <Stack display="flex-column" spacing={2}>
                      <Stack display='flex-row' direction={"row"} spacing={1} >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#fff',
                            color: '#BE9A42',
                            fontSize: 24,
                            border: 1,
                            borderColor: " #005844"
                          }}
                        >
                          2
                        </Avatar>
                        <Typography sx={{ fontSize: 25, color: "#BE9A42" }} >خطوه 2</Typography>
                      </Stack>
                      <img
                        src="/assets/images/help/001/image_2_001.png"
                        alt="MoH Logo"
                        style={{
                          width: "90%",
                          height: "100%",
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box p={1}>
                    <Stack display="flex-column" spacing={2}>
                      <Stack display='flex-row' direction={"row"} spacing={1}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#fff',
                            color: '#BE9A42',
                            fontSize: 24,
                            border: 1,
                            borderColor: " #005844"
                          }}
                        >
                          3
                        </Avatar>
                        <Typography sx={{ fontSize: 25, color: "#BE9A42" }} >خطوه 3</Typography>
                      </Stack>
                      <img
                        src="/assets/images/help/001/image_3_001.png"
                        alt="MoH Logo"
                        style={{
                          width: "90%",
                          height: "100%",
                        }}
                      />
                    </Stack></Box>







                </Stack>
              </Card>
            </Grid>
            {lgUp && <Grid py={3} item xs={3}  >
              <Stack gap={3} display={"flex-column"} >

                <Autocomplete
                  fullWidth
                  noOptionsText={t("no_data")}
                  getOptionLabel={option => option.label}
                  getOptionValue={option => option.value}
                  onChange={(event, newValue) => setPickedService(newValue?.value)}
                  disablePortal
                  id="combo-box-demo"
                  options={options}
                  renderInput={(params) => <TextField {...params} label={t("search_services")} />}
                  value={pickedService}
                />
                <Stack gap={2} display={"flex-column"}>
                  <Link to="/dashboard/services" variant="body2">
                    Link 1 to desired destination                  </Link>
                  <Link to="/dashboard/services" variant="body2">
                    Link 2 to desired destination                  </Link>
                  <Link to="/dashboard/services" variant="body2">
                    Link 3 to desired destination                  </Link>

                </Stack>



              </Stack>

            </Grid>}


            {!lgUp &&

              <Grid item xs={12}>

                <Stack gap={2} display={"flex-row"} direction={"row"}>
                  <Link to="/dashboard/services" variant="body2">
                    Link 1 to desired destination                  </Link>
                  <Link to="/dashboard/services" variant="body2">
                    Link 2 to desired destination                  </Link>
                  <Link to="/dashboard/services" variant="body2">
                    Link 3 to desired destination                  </Link>

                </Stack>
              </Grid>

            }

          </Grid>

        </Card>


      </Stack >
      <Footer />

    </>


  )
}
