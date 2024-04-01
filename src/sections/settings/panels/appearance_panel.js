// @mui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Switch,
} from '@mui/material';
// hooks
import { useLocales } from 'src/locales';
import { useGlobalDialogContext } from 'src/components/global-dialog';
// components
import ChangeLanguageDialog from 'src/layouts/_common/change-language-dialog';
import SvgColor from 'src/components/svg-color/svg-color';
import Label from 'src/components/label/label';
import { useAccessibilityContext } from 'src/components/accessibility';

// ----------------------------------------------------------------------

export default function AppearancePanel() {
  const { t, currentLang } = useLocales();
  const globalDialog = useGlobalDialogContext();
  const accessibility = useAccessibilityContext();

  const onChangeLanguageDialogOpen = () => {
    globalDialog.onOpen({
      title: t('language'),
      content: <ChangeLanguageDialog />,
    });
  };

  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <SvgColor src="/assets/icons/designer/global.svg" color="secondary.main" />
          </ListItemIcon>
          <ListItemText primary={t('language')} />
          <Button
            onClick={onChangeLanguageDialogOpen}
            color="secondary"
            variant="contained"
            size="small"
          >
            {currentLang.label}
          </Button>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SvgColor src="/assets/icons/designer/color-swatch.svg" color="secondary.main" />
          </ListItemIcon>
          <ListItemText primary={t('color_blind_mode')} />
          <Switch onClick={accessibility.onToggleColorBlind} checked={accessibility.colorBlind} />
        </ListItem>
      </List>
    </>
  );
}
