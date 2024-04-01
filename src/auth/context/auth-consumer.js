import PropTypes from 'prop-types';
// components
import { SplashScreen } from 'src/components/loading-screen';
//
import { AuthContext } from './auth-context';
import { useSkipFirstRender } from 'src/hooks/use-skip-first-render';
import { useLocales } from 'src/locales';
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export function AuthConsumer({ children }) {

  const { initialize } = useAuthContext();
  const { currentLang } = useLocales();


  useSkipFirstRender(() => {
    initialize();
  }, [currentLang?.value])

  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}

AuthConsumer.propTypes = {
  children: PropTypes.node,
};
