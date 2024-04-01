import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales } from 'src/locales';
import { paths } from 'src/routes/paths';
import axiosInstance from 'src/utils/axios';

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { t } = useLocales();

  useEffect(() => {
    const resInterceptor = (response) => {
      return response;
    };

    const errInterceptor = (error) => {
      if (error.status === 401) {
        logout();
        navigate(paths.auth.jwt.login);
        alert(t('session_expired'));
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(resInterceptor, errInterceptor);

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [navigate]);

  return children;
};

export { AxiosInterceptor };
