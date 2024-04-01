import { useCallback } from 'react';
import { useApiService } from './use-api-service';

export function useApiPost({ path, options = {}, method = 'POST' } = {}) {
  const { resultParser, initialLoadingState = false } = options;

  // ** Hooks
  const { result, error, loading, statusCode, fetchData, cancel } = useApiService(
    path,
    method,
    initialLoadingState,
    resultParser
  );

  // ** Functions
  const post = useCallback(
    async (args) => {
      fetchData(args);
    },
    [fetchData]
  );

  return { result, error, loading, statusCode, post, cancel };
}
