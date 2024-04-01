import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
//
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function InvestigationsChart1() {
  const theme = useTheme();
  const { t, currentLang } = useLocales();
  const chartOptions = useChart({
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: '60%',
      },
    },
    stroke: {
      show: false,
    },
    yaxis: {
      opposite: currentLang.direction === 'rtl',
      axisBorder: {
        show: true,
        offsetX: 20,
        offsetY: 0,
      },
    },
    legend: { show: false },
    xaxis: {
      categories: [
        t('returned_investigations'),
        t('late_investigations'),
        t('normal_investigations'),
        t('urgent_investigations'),
        t('very_urgent_investigations'),
      ],
    },
    colors: [
      theme.palette.warning.dark,
      theme.palette.primary.dark,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
  });

  return (
    <>
      <Typography component="h6" variant="h6" fontWeight="fontWeightBold">
        {t('investigations_list')}
      </Typography>
      <Chart
        dir="rtl"
        type="bar"
        series={[
          {
            name: 'Net Profit',
            data: [10, 20, 40, 50, 5],
          },
        ]}
        options={chartOptions}
        height={240}
      />
    </>
  );
}
