import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// sections
import ClinicRegisterView from 'src/sections/services/view/clinic-register-view';

// ----------------------------------------------------------------------

export default function clinicRegisterPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Clinic Registeration</title>
      </Helmet>

      <ClinicRegisterView />
    </>
  );
}
