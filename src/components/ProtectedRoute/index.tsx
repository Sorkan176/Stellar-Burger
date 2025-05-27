import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { getCookie } from '../../utils/cookie';

interface ProtectedRouteProps {
  element: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  const isAuthenticated = !!getCookie('accessToken');

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
