import { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';

export default function useHiddenNav() {
  const settings = useSettingsContext();

  useEffect(() => {
    settings.onHideNav();

    return () => {
      settings.onShowNav();
    };
  }, [settings]);
}
