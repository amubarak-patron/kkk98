// i18n
import 'src/locales/i18n';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// moment
import 'moment/locale/ar';

// ----------------------------------------------------------------------

import { useEffect } from 'react';
// @mui
import { GlobalStyles } from '@mui/material';
// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// locales
import { LocalizationProvider } from 'src/locales';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context';
import { AccessibilityProvider } from './components/accessibility';
import { CursorProvider } from './components/cursor/context/cursor-provider';
import { OnboardingTour, OnboardingTourProvider } from './components/onboarding-tour';
import { GlobalDialog, GlobalDialogProvider } from './components/global-dialog';
import { GlobalDrawer, GlobalDrawerProvider } from './components/global-drawer';
import { GlobalPrompt, GlobalPromptProvider } from './components/global-prompt';
import Cursor from './components/cursor/cursor';
import { Helmet } from 'react-helmet';
import './app.scss';
import { AxiosInterceptor } from './interceptors/axios-interceptor';

// ----------------------------------------------------------------------

export default function App() {
  /* eslint-disable no-useless-escape */
  const charAt = `
  ██████╗░░█████╗░████████╗██████╗░░█████╗░███╗░░██╗
  ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗████╗░██║
  ██████╔╝███████║░░░██║░░░██████╔╝██║░░██║██╔██╗██║
  ██╔═══╝░██╔══██║░░░██║░░░██╔══██╗██║░░██║██║╚████║
  ██║░░░░░██║░░██║░░░██║░░░██║░░██║╚█████╔╝██║░╚███║
  ╚═╝░░░░░╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚═╝░░╚══╝`;

  useEffect(() => {
    console.info(`%c${charAt}`, 'background: #91E0EF; color: #02045F');
    console.info('%c 🚀 Made by Ahmad Mubarak & Ahmad Hijjawi', 'background: #02045F; color: #ffffff');
  }, [charAt]);

  useScrollToTop();

  return (
    <>
      <Helmet>
        <script
          id="menatracks-widget"
          baseurl="https://cmu.gov.jo/application_widget"
          widgetform="https://cmu.gov.jo/application_widget/Widget/WidgetSurveyViewer.aspx?Value=fEDloY/4mjBeEwKHoyJ9yTWNvfFGy/NTWZDEkOVDS7Y="
          src="https://cmu.gov.jo/application_widget/JS/WidgetJs/widget.js"
        ></script>
      </Helmet>
      <AuthProvider>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'horizontal', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'moh', // 'default' | 'patron' | 'jiacc' | 'moh' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: false,
            }}
          >
            <AccessibilityProvider
              defaultSettings={{
                rootFontSize: 100,
                colorBlind: false,
              }}
            >
              <CursorProvider>
                <ThemeProvider>
                  <GlobalStyles
                    styles={{
                      '.stickyTableCell': {
                        position: 'sticky !important',
                        boxShadow: '5px 2px 5px grey !important',
                      },
                      '.react-joyride__tooltip, .react-joyride__tooltip *': {
                        fontFamily: 'Cairo, sans-serif !important',
                      },
                      '#showModal': {
                        position: 'fixed',
                      },
                      '#custom-modal': {
                        zIndex: 5000,
                      },
                      p: {
                        margin: 0,
                        padding: 0,
                      },
                      // '#custom-modal .in': {
                      //   position: 'fixed',
                      //   top: 0,
                      //   left: 0,
                      //   right: 0,
                      //   bottom: 0,
                      //   zIndex: 10000,
                      // }
                    }}
                  />
                  <GlobalDialogProvider>
                    <GlobalPromptProvider>
                      <GlobalDrawerProvider>
                        <MotionLazy>
                          <OnboardingTourProvider>
                            <OnboardingTour />
                            <SettingsDrawer />
                            <GlobalDrawer />
                            <GlobalDialog />
                            <GlobalPrompt />
                            <ProgressBar />
                            <Cursor />
                            <AuthConsumer>
                              <AxiosInterceptor>
                                <Router />
                              </AxiosInterceptor>
                            </AuthConsumer>
                          </OnboardingTourProvider>
                        </MotionLazy>
                      </GlobalDrawerProvider>
                    </GlobalPromptProvider>
                  </GlobalDialogProvider>
                </ThemeProvider>
              </CursorProvider>
            </AccessibilityProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </AuthProvider>
    </>
  );
}
