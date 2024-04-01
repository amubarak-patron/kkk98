import { Helmet } from 'react-helmet-async';
// sections
import MyClinicOrdersView from 'src/sections/my-orders/view/my-clinic-orders-view';

// ----------------------------------------------------------------------

export default function MyClinicOrdersPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Clinic Applications</title>
      </Helmet>

      <MyClinicOrdersView />
    </>
  );
}
