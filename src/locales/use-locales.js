import { useTranslation } from 'react-i18next';
import { useCallback, useEffect } from 'react';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { allLangs, defaultLang } from './config-lang';
import moment from 'moment';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

export default function useLocales() {
  const { i18n, t } = useTranslation();

  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');


  const langStorage = localStorageGetItem('i18nextLng');

  const currentLang = allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  const onChangeLang = useCallback(
    (newlang) => {
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
      moment.locale(newlang)
    },
    [i18n, settings]
  );

  useEffect(() => {
    const bkhdmtkomEl = document.getElementById('showModal')
    if (bkhdmtkomEl) {
      if (currentLang.value === 'ar') {
        bkhdmtkomEl.style.right = 'unset'
        bkhdmtkomEl.style.left = "5%"
        bkhdmtkomEl.style.position = "fixed"
        bkhdmtkomEl.style.width = !lgUp ? "150px" : "200px"
      } else {
        bkhdmtkomEl.style.left = 'unset'
        bkhdmtkomEl.style.right = '5%'
        bkhdmtkomEl.style.position = "fixed"
        bkhdmtkomEl.style.width = !lgUp ? "150px" : "200px"

      }

    }
  }, [currentLang])

  return {
    allLangs,
    t,
    currentLang,
    onChangeLang,
  };
}
