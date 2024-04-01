/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
// @mui
import { Box } from '@mui/material';
// utils
import isTouchDevice from 'src/utils/is-touch-device';
// hooks
import useMousePosition from 'src/hooks/use-mouse-position';
//
import { useCursorContext } from './context/cursor-context';
import { useAccessibilityContext } from '../accessibility';

export default function Cursor() {
  if (isTouchDevice) {
    return null;
  }
  const accessibility = useAccessibilityContext();
  const { clientX, clientY } = useMousePosition();
  const { cursor } = useCursorContext();
  const [isVisible, setIsVisible] = useState(false);

  const bigCursor = accessibility.cursorMode === 'big';
  const readingCursor = accessibility.cursorMode === 'reading';

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleBigCursor = (isBig) => {
    if (isBig) {
      document.body.style.cursor = `url(/assets/big-cursor.png) 0 0, auto`;
    } else {
      // default cursor
      document.body.style.cursor = 'auto';
    }
  };

  useEffect(() => {
    handleBigCursor(bigCursor);
  }, [bigCursor]);

  if (readingCursor) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {/* We need 2 divs, each one has background overlay, between them a 200px gap */}
        <Box
          sx={{
            borderBottom: (t) => `4px solid blue`,
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: clientY - 60,
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Box
          sx={{
            borderTop: (t) => `4px solid blue`,
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: clientY + 60,
            bottom: 0,
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
      </div>
    );
  }

  return null;

  // return (
  //   <div
  //     style={{
  //       position: 'fixed',
  //       top: 0,
  //       bottom: 0,
  //       left: 0,
  //       right: 0,
  //       zIndex: 9999,
  //       pointerEvents: 'none',
  //     }}
  //   >
  //     <svg
  //       width={50}
  //       height={50}
  //       viewBox="0 0 50 50"
  //       style={{
  //         position: 'absolute',
  //         pointerEvents: 'none',
  //         left: clientX,
  //         top: clientY,
  //         transform: `translate(-50%, -50%) scale(${cursor.active ? 2.5 : 1})`,
  //         stroke: cursor.active ? 'black' : 'white',
  //         strokeWidth: 1,
  //         fill: cursor.active ? 'rgba(255,255,255,.5)' : 'black',
  //         transition: 'transform .2s ease-in-out',
  //         // TODO: extra check on clientX needed here
  //         // because mouseleave event not always firing
  //         // when slowly exiting left side of browser
  //         opacity: isVisible && clientX > 1 ? 1 : 0,
  //       }}
  //     >
  //       <circle cx="25" cy="25" r="8" />
  //     </svg>
  //   </div>
  // );
}
