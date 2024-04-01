import { Helmet } from 'react-helmet-async';
// sections
import ServicesListView from 'src/sections/services/view/services-list-view';

// ----------------------------------------------------------------------

export default function ServicesListPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Services</title>
      </Helmet>

      <ServicesListView />
    </>
  );
}
