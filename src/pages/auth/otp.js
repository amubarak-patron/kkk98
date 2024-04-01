import { Helmet } from 'react-helmet-async';
// sections
import { JwtOTPView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function OTPPage() {
  return (
    <>
      <Helmet>
        <title>OTP</title>
      </Helmet>

      <JwtOTPView />
    </>
  );
}