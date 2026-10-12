import { Preloader } from '@ui';
import { RootState, useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const userDataSelector = (state: RootState) => state.user;
  const { user, isAuthChecked } = useSelector(userDataSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // после входа возвращаем туда, откуда пользователя отправили логиниться
    return <Navigate to={location.state?.from ?? '/'} replace />;
  }

  return children;
};
