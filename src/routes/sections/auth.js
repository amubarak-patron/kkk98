import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const SanadLoginPage = lazy(() => import('src/pages/auth/sanad-login'));
const JwtLoginPage = lazy(() => import('src/pages/auth/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/register'));
const JwtOTPPage = lazy(() => import('src/pages/auth/otp'));
const JwtPasswordResetPage = lazy(() => import('src/pages/auth/passReset'));




// ----------------------------------------------------------------------

const authJwt = {
  path: '',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'sanad-login',
      element: (
        <AuthClassicLayout>
          <SanadLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout>
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'OTP',
      element: (
        <AuthClassicLayout>
          <JwtOTPPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'reset_password',
      element: (
        <AuthClassicLayout>
          <JwtPasswordResetPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
