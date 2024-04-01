import { useCallback, useEffect } from 'react';
import { useApiService } from './use-api-service';

export function useApiGet({ path, options = {} }) {
  const { resultParser, startImmediately = true, initialLoadingState = true } = options;

  // ** Hooks
  const { result, error, loading, statusCode, fetchData, cancel } = useApiService(
    path,
    options?.method || 'GET',
    initialLoadingState,
    resultParser
  );

  // ** Functions
  const refetch = useCallback(
    async (args) => {
      fetchData({
        ...options,
        ...args,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchData]
  );

  // ** Side Effects
  useEffect(() => {
    if (startImmediately) {
      fetchData(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, startImmediately]);

  return { result, error, loading, statusCode, refetch, cancel };
}
