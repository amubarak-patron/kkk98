import axios from 'axios';
// config
import { HOST_API, HOST_API_TOKEN } from 'src/config-global';
import { localStorageGetItem } from './storage-available';

// ----------------------------------------------------------------------
// const language = localStorage.getItem("i18nextLng");

const axiosInstance = axios.create({
  // headers: {
  //   'Accept-language': language,
  //   'lang': language
  // },
});

// Interceptors
// Can be migrated to seperate folder and put here
// axiosInstance.interceptors.use for each interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const language = localStorage.getItem('i18nextLng');

    config.headers['Accept-language'] = language;
    config.headers['lang'] = language;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  // (error) => {
  //   const customError = new Error(error.response.data.responseMessage);
  //   return Promise.reject(customError);
  // }
  (error) => {
    const customError = new Error(error.response.data.error);
    return Promise.reject(customError);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

// export const fetcher = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args];

//   const res = await axiosInstance.get(url, { ...config });

//   return res.data;
// };

// ----------------------------------------------------------------------

// export const endpoints = {
//   chat: '/api/chat',
//   kanban: '/api/kanban',
//   calendar: '/api/calendar',
//   auth: {
//     me: '/api/Auth/me',
//     login: 'JordanianUserLogin',
//     register: 'JordanianUserRegister',
//   },
//   mail: {
//     list: '/api/mail/list',
//     details: '/api/mail/details',
//     labels: '/api/mail/labels',
//   },
//   post: {
//     list: '/api/post/list',
//     details: '/api/post/details',
//     latest: '/api/post/latest',
//     search: '/api/post/search',
//   },
//   product: {
//     list: '/api/product/list',
//     details: '/api/product/details',
//     search: '/api/product/search',
//   },

// };
