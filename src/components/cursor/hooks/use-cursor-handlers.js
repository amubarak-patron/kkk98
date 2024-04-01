import { useContext, useCallback } from 'react';
import { useCursorContext } from '../context/cursor-context';
import isTouchDevice from 'src/utils/is-touch-device';

const useCursorHandlers = (options = {}) => {
  if (isTouchDevice) {
    return options;
  }
  const { setCursor } = useCursorContext();
  const toggleCursor = () => {
    setCursor(({ active }) => ({ active: !active }));
  };
  const onMouseEnter = useCallback((event) => {
    if (options.onMouseEnter) {
      options.onMouseEnter(event);
    }
    toggleCursor();
  });
  const onMouseLeave = useCallback((event) => {
    if (options.onMouseLeave) {
      options.onMouseLeave(event);
    }
    toggleCursor();
  });
  return { onMouseEnter, onMouseLeave };
};
