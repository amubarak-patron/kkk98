import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState } from 'react';
//
import { AccessibilityContext } from './accessibility-context';

// ----------------------------------------------------------------------

const MIN_FONT_SIZE_PERCENT = 62.5;
const MAX_FONT_SIZE_PERCENT = 150;

export function AccessibilityProvider({ children, defaultSettings }) {
  const [rootFontSize, setRootFontSize] = useState(defaultSettings.rootFontSize);
  const [colorBlind, setColorBlind] = useState(defaultSettings.colorBlind);
  const [cursorMode, setCursorMode] = useState(defaultSettings.cursorMode);

  // Toggle Color Blind
  const onToggleColorBlind = useCallback(() => {
    setColorBlind((prev) => !prev);
  }, []);

  // Root Font Size
  // change between MIN_FONT_SIZE_PERCENT and MAX_FONT_SIZE_PERCENT
  const onDecreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev - 12.5;
      return next < MIN_FONT_SIZE_PERCENT ? MIN_FONT_SIZE_PERCENT : next;
    });
  }, []);

  const onIncreaseRootFontSize = useCallback(() => {
    setRootFontSize((prev) => {
      const next = prev + 12.5;
      return next > MAX_FONT_SIZE_PERCENT ? MAX_FONT_SIZE_PERCENT : next;
    });
  }, []);

  // Cursor Mode
  const onChangeCursorMode = useCallback((mode) => {
    // 'auto' | 'big' | 'reading'
    setCursorMode(mode);
  }, []);

  // Reset
  const onReset = useCallback(() => {
    setRootFontSize(defaultSettings.rootFontSize || 100);
    setColorBlind(defaultSettings.colorBlind || false);
    setCursorMode(defaultSettings.cursorMode || 'auto');
  }, [defaultSettings]);

  useEffect(() => {
    document.querySelector('html').style.fontSize = `${rootFontSize}%`;
  }, [rootFontSize]);

  useEffect(() => {
    // Update * filter grayscale
    document.querySelector('*').style.filter = colorBlind ? 'grayscale(100%)' : '';
  }, [colorBlind]);

  // Here we return used values and methods, in order to use them in other components
  const memoizedValue = useMemo(
    () => ({
      // Reset
      onReset,
      // Font Size
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      // Color Blind
      colorBlind,
      onToggleColorBlind,
      // Cursor Mode
      cursorMode,
      onChangeCursorMode,
    }),
    [
      onReset,
      rootFontSize,
      onDecreaseRootFontSize,
      onIncreaseRootFontSize,
      colorBlind,
      onToggleColorBlind,
      cursorMode,
      onChangeCursorMode,
    ]
  );

  return (
    <AccessibilityContext.Provider value={memoizedValue}>{children}</AccessibilityContext.Provider>
  );
}

AccessibilityProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
