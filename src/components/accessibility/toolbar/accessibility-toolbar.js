import { useCallback } from 'react';
import { debounce } from 'lodash';
// @mui
import { Box, Container, IconButton, Stack, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
// hooks
import { useAccessibilityContext } from '../context';
import { useLocales } from 'src/locales';

export default function AccessibilityToolbar() {
  const { t } = useLocales();
  const {
    onReset,
    onDecreaseRootFontSize,
    onIncreaseRootFontSize,
    colorBlind,
    onToggleColorBlind,
    cursorMode,
    onChangeCursorMode,
  } = useAccessibilityContext();

  const bigCursor = cursorMode === 'big';
  const readingCursor = cursorMode === 'reading';

  const onToggleBigCursor = useCallback(() => {
    if (cursorMode === 'big') {
      onChangeCursorMode('auto');
    } else {
      onChangeCursorMode('big');
    }
  }, [cursorMode, onChangeCursorMode]);

  const onToggleReadingCursor = useCallback(() => {
    if (cursorMode === 'reading') {
      onChangeCursorMode('auto');
    } else {
      onChangeCursorMode('reading');
    }
  }, [cursorMode, onChangeCursorMode]);

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        color: 'common.white',
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" spacing={1}>
          <Stack data-tour-id="accessiblity_toolbar" direction="row">
            {/* font size increase/decrease */}
            <Stack direction="row" spacing={0}>
              <IconButton
                size="small"
                onClick={debounce(onDecreaseRootFontSize, 100)}
                sx={{
                  color: (t) => t.palette.common.white,
                }}
              >
                <Tooltip title={t('decrease_font_size')} placement="top">
                  <Iconify icon="mdi:format-font-size-decrease" width={12} />
                </Tooltip>
              </IconButton>
              <IconButton
                size="small"
                onClick={debounce(onIncreaseRootFontSize, 100)}
                sx={{
                  color: (t) => t.palette.common.white,
                }}
              >
                <Tooltip title={t('increase_font_size')} placement="top">
                  <Iconify icon="mdi:format-font-size-increase" width={15} />
                </Tooltip>
              </IconButton>
            </Stack>
            {/* color blind */}
            <IconButton
              size="small"
              onClick={debounce(onToggleColorBlind, 100)}
              sx={{
                color: (t) => t.palette.common.white,
              }}
            >
              <Tooltip title={t('color_blind_mode')} placement="top">
                <Iconify icon={colorBlind ? 'mdi:eye' : 'mdi:eye-off'} width={15} />
              </Tooltip>
            </IconButton>

            {/* big cursor */}
            <IconButton
              size="small"
              onClick={debounce(onToggleBigCursor, 100)}
              sx={{
                color: (t) => t.palette.common.white,
              }}
            >
              <Tooltip
                title={t(bigCursor ? 'big_cursor_mode' : 'big_cursor_mode_off')}
                placement="top"
              >
                <Iconify icon={bigCursor ? 'mdi:mouse' : 'mdi:mouse-off'} width={15} />
              </Tooltip>
            </IconButton>

            {/* reading cursor */}
            <IconButton
              size="small"
              onClick={debounce(onToggleReadingCursor, 100)}
              sx={{
                color: (t) => t.palette.common.white,
              }}
            >
              <Tooltip
                title={t(readingCursor ? 'reading_cursor_mode' : 'reading_cursor_mode_off')}
                placement="top"
              >
                <Iconify
                  icon={readingCursor ? 'ph:cursor-click' : 'ph:cursor-click-fill'}
                  width={15}
                />
              </Tooltip>
            </IconButton>

            {/* reset */}
            <IconButton
              size="small"
              onClick={debounce(onReset, 100)}
              sx={{
                color: (t) => t.palette.common.white,
              }}
            >
              <Tooltip title={t('reset_defaults')} placement="top">
                <Iconify icon="mdi:restart" width={15} />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}