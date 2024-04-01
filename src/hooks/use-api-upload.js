import { useCallback } from 'react';
import { useApiService } from './use-api-service';

export function useApiUpload({ path, options = {} }) {
  const { resultParser, initialLoadingState = false } = options;

  // ** Hooks
  const { result, error, loading, statusCode, fetchData, cancel } = useApiService(
    path,
    'POST',
    initialLoadingState,
    resultParser
  );

  // ** Functions
  const upload = useCallback(
    async (args) => {
      fetchData({
        ...args,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    [fetchData]
  );

  return { result, error, loading, statusCode, upload, cancel };
}
