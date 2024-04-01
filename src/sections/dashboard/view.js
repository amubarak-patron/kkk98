// @mui
import { alpha, styled } from '@mui/material/styles';
import { Card, Stack, Box, Container, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
// components
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import SvgColor from 'src/components/svg-color/svg-color';
import InvestigationsChart1 from './charts/investigations-chart-1';
import InvestigationsChart2 from './charts/investigations-chart-2';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.white,
}));

const StyledCountCard = styled(StyledCard)(({ theme }) => ({
  flex: 1,
  flexShrink: 0,
  minWidth: '140',
  maxWidth: '140',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  '& .svg-color': {
    width: 30,
    height: 30,
  },
}));

export default function DashboardView() {
  const settings = useSettingsContext();
  const { t } = useLocales();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* Counter */}
      <Stack direction="row" gap={4} flexWrap="wrap">
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="secondary.main" src="/assets/icons/designer/investigation.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('current_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="error.main" src="/assets/icons/designer/flag.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('very_urgent_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="warning.main" src="/assets/icons/designer/flag.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('urgent_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="success.main" src="/assets/icons/designer/flag.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('normal_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="secondary.main" src="/assets/icons/designer/completed.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('completed_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
        <StyledCountCard>
          <Stack direction="column" gap={1}>
            <SvgColor color="warning.dark" src="/assets/icons/designer/undo.svg" />
            <Typography component="div" textAlign="start" variant="caption" color="text.secondary">
              {t('returned_investigations')}
            </Typography>
          </Stack>
          <Typography component="div" textAlign="start" variant="h4">
            200
          </Typography>
        </StyledCountCard>
      </Stack>

      <Grid2 container spacing={2} mt={2}>
        <Grid2 xs={12} md={7}>
          <StyledCard>
            <InvestigationsChart1 />
          </StyledCard>
        </Grid2>
        <Grid2 xs={12} md={5}>
          <StyledCard>
            <InvestigationsChart2 />
          </StyledCard>
        </Grid2>
      </Grid2>
    </Container>
  );
}
