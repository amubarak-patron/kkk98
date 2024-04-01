/* eslint-disable consistent-return */
import { useCallback, useMemo, useRef, useState } from 'react';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from 'src/locales';
import apiService from 'src/utils/apiService';

function getUrl(relative) {
  // eslint-disable-next-line
  const urlExpression =
    'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)';
  const regex = new RegExp(urlExpression);

  if (relative.match(regex)) {
    return relative;
  }

  let mainURL = HOST_API;
  if (mainURL === undefined) return '';
  if (mainURL.charAt(mainURL.length - 1) !== '/') mainURL += '/';

  if (relative.length > 0 && relative.charAt(0) === '/')
    relative = relative.substring(1, relative.length);

  return mainURL + relative;
}

export function useApiService(path, method, initialLoadingState = true, resultParser) {
  // ** State
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [statusCode, setStatusCode] = useState('');
  const [loading, setLoading] = useState(initialLoadingState);

  // ** Vars
  const controllerRef = useRef(new AbortController());

  // ** Hooks
  const { currentLang: locale } = useLocales();
  const { accessToken, authenticated, user, forceLogout } = useAuthContext();

  // ** Functions
  const cancel = useMemo(() => {
    return controllerRef.current.abort;
  }, []);

  const fetchData = useCallback(
    async (args) => {
      const {
        path: pathOverride,
        payload,
        resultParser: customParser,
        onSuccess,
        onError,
        onDone,
        headers,
        method: methodOverride,
      } = args || {};
      const parser = customParser || resultParser;

      // if (loading) return;

      setLoading(true);

      const staticURL = getUrl(pathOverride || path);
      try {
        const { data, error, statusCode } = await apiService({
          signal: controllerRef.current.signal,
          method: methodOverride || method || 'GET',
          url: staticURL,
          payload,
          locale,
          parser,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...headers,
          },
        });

        if (authenticated && error && error.message === 'Unauthenticated.') {
          return forceLogout();
        }

        setStatusCode(statusCode);

        if (error) {
          if (onError) await onError(error);
          setError(error);
        } else {
          if (onSuccess) await onSuccess(data);
          setResult(data);
          setError(null);
        }
      } catch (err) {
        setResult({});
        setError(err);
      } finally {
        if (onDone) await onDone();
      }

      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, locale, authenticated]
  );

  return {
    result,
    error,
    loading,
    statusCode,
    fetchData,
    cancel,
  };
}
