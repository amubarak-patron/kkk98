import { Helmet } from 'react-helmet-async';
// sections
import SettingsView from 'src/sections/settings/view/settings-view';

// ----------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Settings</title>
      </Helmet>

      <SettingsView />
    </>
  );
}
