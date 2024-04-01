import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback, useState } from 'react';
// hooks
//
import { CursorContext } from './cursor-context';

// ----------------------------------------------------------------------

export function CursorProvider({ children, defaultSettings }) {
  const [cursor, setCursor] = useState({ active: false });

  const memoizedValue = useMemo(
    () => ({
      cursor,
      setCursor,
    }),
    [cursor, setCursor]
  );

  return <CursorContext.Provider value={memoizedValue}>{children}</CursorContext.Provider>;
}

CursorProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
