import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
//
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function InvestigationsChart2() {
  const { t, currentLang } = useLocales();
  const theme = useTheme();
  const chartOptions = useChart({
    labels: [t('current_investigations'), t('late_investigations'), t('returned_investigations')],
    colors: [theme.palette.secondary.main, theme.palette.primary.main, theme.palette.warning.dark],
    legend: {
      position: 'right',
      offsetX: -20,
      offsetY: 64,
      itemMargin: {
        vertical: 8,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <>
      <Typography component="h6" variant="body1" fontWeight="fontWeightBold">
        {t('investigations_analysis')}
      </Typography>
      <Typography comonent="span" variant="caption" color="text.secondary">
        لوريم ابسوم
      </Typography>
      <Chart dir="rtl" type="pie" series={[75, 15, 10]} options={chartOptions} height={240} />
    </>
  );
}
