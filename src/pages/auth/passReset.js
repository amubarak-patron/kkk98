import { Helmet } from 'react-helmet-async';
// sections
import { JwtPasswordResetView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function PasswordResetPage() {
  return (
    <>
      <Helmet>
        <title>Password Reset</title>
      </Helmet>

      <JwtPasswordResetView />
    </>
  );
}
