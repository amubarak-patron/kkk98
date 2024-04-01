import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
import shortid from 'shortid';
//
import { GlobalPromptContext } from './global-prompt-context';

// ----------------------------------------------------------------------

export function GlobalPromptProvider({ children }) {
  // ** State
  const [prompts, setPrompts] = useState([]);

  // ** Functions
  const onOpen = useCallback(async (options) => {
    const randomId = shortid.generate();
    setPrompts((prevPrompts) => [
      ...prevPrompts,
      {
        ...options,
        id: randomId,
        onClose: () => onClose(randomId),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = useCallback((id) => {
    setPrompts((prevPrompts) => {
      const filteredPrompts = prevPrompts.filter((prompt) => prompt.id !== id);
      return filteredPrompts;
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      prompts,
      onOpen,
      onClose,
    }),
    [prompts, onOpen, onClose]
  );

  return (
    <GlobalPromptContext.Provider value={memoizedValue}>{children}</GlobalPromptContext.Provider>
  );
}

GlobalPromptProvider.propTypes = {
  children: PropTypes.node,
};
