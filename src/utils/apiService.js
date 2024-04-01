import axios from './axios';

export default async function apiService({
  signal,
  url,
  baseURL,
  method = 'GET',
  payload,
  params,
  locale,
  parser,
  headers,
}) {
  let data = null;
  let error = null;
  let statusCode = -1;
  try {
    const response = await axios.request({
      signal,
      method,
      ...(method === 'GET' && { params: payload }),
      ...(method === 'POST' && { data: payload }),
      ...(method === 'DELETE' && { data: payload }),
      url,

      baseURL,
      headers: {
        Language: locale || 'en',
        ...headers,
      },
    });
    if (parser) {
      data = parser(response.data);
      statusCode = response.status;
    } else {
      data = response.data.data;
      statusCode = response.data.status;
    }
  } catch (err) {
    // console.log('error', error);
    error = err.response.data;
    statusCode = err.response.status;
  }
  return { data, error, statusCode };
}
