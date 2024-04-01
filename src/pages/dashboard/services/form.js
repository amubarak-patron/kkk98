import { Helmet } from 'react-helmet-async';
// sections
import ServiceFormView from 'src/sections/services/view/service-form-view';

// ----------------------------------------------------------------------

export default function ServicesFormPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Services</title>
      </Helmet>

      <ServiceFormView />
    </>
  );
}
