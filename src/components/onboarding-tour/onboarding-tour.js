import Joyride from 'react-joyride';
// @mui
import { useTheme } from '@mui/material/styles';
// locales
import { useLocales } from 'src/locales';
//
import { useOnboardingTourContext } from './context';

export default function OnboardingTour() {
  // ** Hooks
  const { t } = useLocales();
  const theme = useTheme();
  const { isStarted, stepIndex, steps, onStart, onNext, onPrev, onReset, onStop } =
    useOnboardingTourContext();

  if (!isStarted) return null;
  return (
    <>
      <Joyride
        continuous
        disableOverlayClose
        disableCloseOnEsc
        // disableOverlay
        scrollToFirstStep
        hideCloseButton
        showProgress
        spotlightClicks={false}
        showSkipButton
        run={isStarted}
        stepIndex={stepIndex}
        steps={steps}
        scrollOffset={50}
        locale={{
          back: t('back'),
          close: t('close'),
          last: t('last'),
          next: t('next'),
          skip: t('skip'),
        }}
        styles={{
          options: {
            arrowColor: theme.palette.background.paper,
            backgroundColor: theme.palette.background.paper,
            primaryColor: theme.palette.secondary.main,
            textColor: '#000',
            zIndex: 10000,
          },
          tooltipContent: {
            padding: 0,
            paddingBottom: 12,
          },
          tooltipFooter: {
            padding: 0,
            margin: 0,
            marginTop: 12,
          },
        }}
        callback={async (data) => {
          const { action, index, status, type, step } = data;
          console.log('data', data);
          if (status === 'finished' || status === 'skipped' || type === 'tour:end') {
            onStop();
          } else if (type === 'step:after') {
            if (action === 'next') {
              if (step?.nextFnc && typeof step.nextFnc === 'function') {
                await step.nextFnc();
              }
              onNext();
            } else if (action === 'prev') {
              onPrev();
            } else if (action === 'close') {
              onStop();
            }
          }
        }}
      />
    </>
  );
}

OnboardingTour.defaultProps = {};

OnboardingTour.propTypes = {};
