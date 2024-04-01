import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useResponsive } from 'src/hooks/use-responsive';

function Footer() {
  const upMd = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'lg');
  return (
    <Stack
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.main",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center">
          <Grid item xs={2} container direction={lgUp ? "column" : "row"} alignItems="center">
            <Box gap={1} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
              <img
                alt=''
                src={`/assets/icons/designer/footer/patron.svg`}
                style={{
                  width: 115,
                  height: 50,
                }}
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Typography align="center" color="#fff" fontSize={12}>
                Powered by Patron Technologies
              </Typography>
            </Box>
          </Grid>
          <Grid gap={1} item xs={8} container direction="column" justify="center" alignItems="center">
            <Grid item container xs={12} direction="row" justifyContent="center" alignItems="center">
              <Grid justify="center" item xs={4}>
                <Typography align="center" color="#fff" fontSize={15}>
                  مركز الإتصال الوطني: 5008080 06
                </Typography>
              </Grid>
              <Grid align="center" item xs={4}>
                <Typography align="center" color="#fff" fontSize={15}>
                  رقم الوزارة: 5200230 06
                </Typography>
              </Grid>
              <Grid align="center" item xs={4}>
                <Typography justify="center" color="#fff" fontSize={15}>
                  الخط الساخن: 5004545 06
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography color="#fff" fontSize={15}>
                جميع الحقوق محفوظة لوزارة الصحة 2024 ©
              </Typography>
            </Grid>
            <Grid item xs={3} container direction="column" justify="center" alignItems="center">
              <Grid gap={2} item container xs={12} direction="row" justifyContent="center">
                <Grid item>
                  <a href="https://www.youtube.com/channel/UCEpqIf2nXOP2Hmi94Nfzibw" target="_blank">
                    <img
                      alt=''
                      src={`/assets/icons/designer/youtube.svg`}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </a>
                </Grid>
                <Grid item>
                  <a href="https://twitter.com/mohgovjordan?lang=ar" target="_blank">
                    <img
                      alt=''
                      src={`/assets/icons/designer/twitter.svg`}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </a>
                </Grid>
                <Grid item>
                  <a href="https://www.facebook.com/mohgovjordan/?locale=ar_AR" target="_blank">
                    <img
                      alt=''
                      src={`/assets/icons/designer/facebook.svg`}
                      style={{
                        width: 25,
                        height: 25,
                      }}
                    />
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Container>
    </Stack>
  )
}

export default Footer
