import { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';

export default function useDisabledPageSpacing() {
  const settings = useSettingsContext();

  useEffect(() => {
    settings.onDisablePageSpacing();

    return () => {
      settings.onEnablePageSpacing();
    };
  }, [settings]);
}
